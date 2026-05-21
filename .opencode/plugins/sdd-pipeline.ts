import type { Plugin } from "@opencode-ai/plugin"
import { readFileSync, writeFileSync, existsSync, mkdirSync, appendFileSync } from "fs"
import { join } from "path"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SddState {
  pipeline_phase: string
  active_spec: string | null
  current_task: string | null
  completed_tasks: string[]
  pending_tasks: string[]
  agent_type: string
}

interface MessageEvent {
  message?: { content?: string }
  parts?: unknown[]
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const INTENT_PATTERNS: Record<string, string[]> = {
  "/spec": [
    "nueva feature", "requisito", "idea", "necesito", "quiero crear",
    "new feature", "requirement", "spec", "especificacion", "especifica",
  ],
  "/plan": [
    "planifica", "divide", "tasks", "plan", "divide en tareas",
    "divide en", "desglosa", "breakdown",
  ],
  "/build": [
    "implementa", "codifica", "construye", "implement", "build", "code",
    "escribe el codigo", "escribe codigo",
  ],
  "/test": [
    "test", "prueba", "pruebas", "testing",
  ],
  "/review": [
    "revisa", "review", "codigo", "code review", "revisar codigo",
  ],
  "/ship": [
    "ship", "deploy", "lanza", "lanzamiento", "deployment", "publicar",
  ],
  "/code-simplify": [
    "simplifica", "refactor", "limpia", "simplify", "simplificar",
  ],
}

const DESTRUCTIVE_PATTERNS = ["rm -rf", "git push --force", "DROP TABLE", "DROP DATABASE"]

const SPEC_SECTIONS = ["objective", "commands", "structure", "code style", "testing", "boundaries"]

// ---------------------------------------------------------------------------
// Plugin
// ---------------------------------------------------------------------------

export const SddPipelinePlugin: Plugin = async (ctx) => {
  const { directory } = ctx

  // ── Paths ────────────────────────────────────────────────────────────────
  const projectDir = directory || process.cwd()
  const pluginsDir = join(projectDir, ".opencode", "plugins")
  const metaSkillPath = join(projectDir, "skills", "using-agent-skills", "SKILL.md")
  const statePath = join(pluginsDir, ".sdd-state.json")
  const auditLogPath = join(pluginsDir, ".sdd-audit.log")

  // ── Load meta-skill (cached once at startup) ─────────────────────────────
  let metaSkillContent = ""
  try {
    metaSkillContent = readFileSync(metaSkillPath, "utf-8")
  } catch {
    console.error("[sdd-pipeline] Meta-skill not found:", metaSkillPath)
  }

  // ── Load persisted SDD state ─────────────────────────────────────────────
  const defaultState: SddState = {
    pipeline_phase: "idle",
    active_spec: null,
    current_task: null,
    completed_tasks: [],
    pending_tasks: [],
    agent_type: "unknown",
  }

  const sddState: SddState = { ...defaultState }
  try {
    if (existsSync(statePath)) {
      const saved = JSON.parse(readFileSync(statePath, "utf-8"))
      Object.assign(sddState, saved)
    }
  } catch {
    // Corrupted state — use defaults
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  const saveState = () => {
    try {
      if (!existsSync(pluginsDir)) mkdirSync(pluginsDir, { recursive: true })
      writeFileSync(statePath, JSON.stringify(sddState, null, 2))
    } catch {
      // Ignore write errors
    }
  }

  const audit = (source: string, detail: string) => {
    try {
      const timestamp = new Date().toISOString()
      appendFileSync(auditLogPath, `[${timestamp}] [${source}] ${detail}\n`)
    } catch {
      // Ignore logging errors
    }
  }

  // ── Build injected context strings ───────────────────────────────────────

  const buildSddContext = (): string => {
    return [
      "## SDD Pipeline State",
      `- Phase: ${sddState.pipeline_phase}`,
      `- Active spec: ${sddState.active_spec ?? "none"}`,
      `- Current task: ${sddState.current_task ?? "none"}`,
      `- Agent type: ${sddState.agent_type}`,
      `- Completed: ${sddState.completed_tasks.join(", ") || "none"}`,
      `- Pending: ${sddState.pending_tasks.join(", ") || "none"}`,
      "",
      "---",
      "",
      "### Role rules",
      `You are operating as the **${sddState.agent_type}** agent.`,
      "- **Analysis agents**: read, plan, review. NEVER write code.",
      "- **Implement agents**: build, test. NEVER modify specs.",
    ].join("\n")
  }

  const buildMetaSkillContext = (): string => {
    if (!metaSkillContent) return ""
    return [
      "## Skill Orchestration — using-agent-skills",
      "Always consult this flowchart before starting a task:",
      "",
      metaSkillContent,
    ].join("\n")
  }

  // ── Hooks ────────────────────────────────────────────────────────────────

  return {

    /**
     * Fires before each LLM call to build the system prompt.
     * Injects the meta-skill flowchart and SDD pipeline state so the agent
     * always has the orchestration guides available from the FIRST message.
     */
    "experimental.chat.system.transform": async (
      _input: unknown,
      output: unknown,
    ) => {
      try {
        const out = output as { system: string[] }
        // Inject at the beginning so it appears early in the system prompt
        out.system.unshift(buildMetaSkillContext())
        out.system.unshift(buildSddContext())
        audit("system.transform", "Injected meta-skill + SDD state into system prompt")
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error("[sdd-pipeline] Error in system.transform:", msg)
      }
    },

    /**
     * Fires when a new message is received.
     * Detects user intent and suggests the matching SDD slash command.
     */
    "chat.message": async (
      _input: unknown,
      output: unknown,
    ) => {
      try {
        const out = output as MessageEvent
        const content = out?.message?.content ?? ""
        if (!content) return

        const lower = content.toLowerCase()
        for (const [command, keywords] of Object.entries(INTENT_PATTERNS)) {
          if (keywords.some((kw) => lower.includes(kw))) {
            console.log(
              `[sdd-pipeline] Intent detected: "${command}" — type ${command} to proceed`,
            )
            audit("chat.message", `intent=${command}`)
            break
          }
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error("[sdd-pipeline] Error in chat.message:", msg)
      }
    },

    /**
     * Fires before a tool executes.
     * Blocks destructive commands and enforces analysis/implement role separation.
     */
    "tool.execute.before": async (
      input: unknown,
      output: unknown,
    ) => {
      const inp = input as { tool?: string } | undefined
      const out = output as { args?: Record<string, unknown> } | undefined

      try {
        const tool = inp?.tool ?? ""
        const args = out?.args ?? {}

        // --- Always block destructive commands ---
        if (tool === "Bash" || tool === "bash") {
          const cmd = (args.command as string) ?? ""
          for (const pattern of DESTRUCTIVE_PATTERNS) {
            if (cmd.includes(pattern)) {
              audit("tool.before", `BLOCKED ${tool}: destructive command`)
              throw new Error(
                "[sdd-pipeline] Destructive command blocked. Use safe alternatives.",
              )
            }
          }
        }

        // --- Block analysis agents from writing code ---
        if (sddState.agent_type === "analysis") {
          if (tool === "Edit" || tool === "Write") {
            audit("tool.before", `BLOCKED ${tool}: analysis agent writing code`)
            throw new Error(
              "[sdd-pipeline] Analysis agent cannot write code. Switch to BUILD mode with /build.",
            )
          }
        }

        // --- Block build agents from modifying specs ---
        if (sddState.agent_type === "implement") {
          const filePath = ((args.filePath ?? args.file) as string) ?? ""
          if (filePath.includes("SPEC.md") || filePath.includes("specs/")) {
            audit("tool.before", `BLOCKED ${tool}: build agent modifying specs`)
            throw new Error(
              "[sdd-pipeline] Build agent cannot modify specs. Use /spec to request changes.",
            )
          }
        }
      } catch (err: unknown) {
        // Re-throw our own blocking errors; log everything else
        if (err instanceof Error && err.message.includes("sdd-pipeline")) throw err
        const msg = err instanceof Error ? err.message : String(err)
        console.error("[sdd-pipeline] Error in tool.before:", msg)
      }
    },

    /**
     * Fires after a tool returns a result.
     * Lightweight audit logging.
     */
    "tool.execute.after": async (
      input: unknown,
    ) => {
      try {
        const inp = input as { tool?: string } | undefined
        audit("tool.after", `${inp?.tool ?? "unknown"} completed`)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error("[sdd-pipeline] Error in tool.after:", msg)
      }
    },

    /**
     * Fires during context compaction.
     * Re-injects the meta-skill so it survives compaction, and
     * persists the SDD pipeline state.
     */
    "experimental.session.compacting": async (
      _input: unknown,
      output: unknown,
    ) => {
      try {
        const out = output as { context?: string[] }

        out.context?.push(buildSddContext())
        if (metaSkillContent) {
          out.context?.push(buildMetaSkillContext())
        }

        // Persist state on compaction (replaces the missing session.ended hook)
        saveState()
        audit("session.compacting", "Injected meta-skill + SDD state + persisted state")
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error("[sdd-pipeline] Error in session.compacting:", msg)
      }
    },
  }
}

export default SddPipelinePlugin
