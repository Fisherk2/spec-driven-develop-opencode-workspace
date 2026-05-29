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
  last_intent: string | null
}

interface MessageEvent {
  message?: { content?: string }
  parts?: unknown[]
}

// Agent mention patterns — detect agent switches from user messages
const AGENT_MENTION_PATTERNS: Record<string, RegExp[]> = {
  huitzilopochtli: [/@huitzilopochtli\b/i, /agente\s+huitzilopochtli/i],
  quetzalcoatl:    [/@quetzalcoatl\b/i, /agente\s+quetzalcoatl/i],
  moctezuma:       [/@moctezuma\b/i, /agente\s+moctezuma/i],
  tlaloc:          [/@tlaloc\b/i, /agente\s+tlaloc/i],
  mictlantecuhtli: [/@mictlantecuhtli\b/i, /agente\s+mictlantecuhtli/i],
  tezcatlipoca:    [/@tezcatlipoca\b/i, /agente\s+tezcatlipoca/i],
}

// Map slash commands to their primary agent
const COMMAND_AGENT_MAP: Record<string, string> = {
  "/spec": "quetzalcoatl",
  "/design": "quetzalcoatl",
  "/plan": "moctezuma",
  "/build": "tlaloc",
  "/test": "mictlantecuhtli",
  "/review": "tezcatlipoca",
  "/ship": "mictlantecuhtli",
  "/code-simplify": "tlaloc",
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const INTENT_PATTERNS: Record<string, string[]> = {
  "/spec": [
    "nueva feature", "requisito", "idea", "necesito", "quiero crear",
    "new feature", "requirement", "spec", "especificacion", "especifica",
    "create", "define", "write spec", "specification",
    "what should", "proposal", "need a feature",
  ],
  "/design": [
    "design", "diseña", "diseñar", "ui", "ux", "interface", "interfaz",
    "mockup", "wireframe", "layout", "component design", "design system",
    "user experience", "user interface", "visual", "frontend design",
  ],
  "/plan": [
    "planifica", "divide", "tasks", "plan", "divide en tareas",
    "divide en", "desglosa", "breakdown",
    "task breakdown", "planning", "organize", "steps", "milestones",
    "task list", "todos", "to-do", "story points", "estimate",
  ],
  "/build": [
    "implementa", "codifica", "construye", "implement", "build", "code",
    "escribe el codigo", "escribe codigo",
    "write code", "create file", "add functionality", "make", "generate",
    "develop", "produce", "set up", "scaffold", "boilerplate",
    "create function", "create class", "create module", "create component",
  ],
  "/test": [
    "test", "prueba", "pruebas", "testing",
    "unit test", "integration test", "e2e", "specs", "coverage",
    "assert", "mock", "stub", "tdd", "red-green",
  ],
  "/review": [
    "revisa", "review", "codigo", "code review", "revisar codigo",
    "code quality", "audit", "inspect", "check code", "verify code",
    "static analysis", "lint", "clean code", "best practices",
  ],
  "/ship": [
    "ship", "deploy", "lanza", "lanzamiento", "deployment", "publicar",
    "release", "publish", "launch", "go live", "rollout",
    "staging", "production", "ci/cd", "pipeline", "deliver",
  ],
  "/code-simplify": [
    "simplifica", "refactor", "limpia", "simplify", "simplificar",
    "simplify code", "clean up", "refactor code", "improve code",
    "technical debt", "complex", "duplicate", "extract method",
    "reduce complexity", "make it simpler", "cleanup",
  ],
}

// Case-insensitive regex patterns for destructive commands
// NOTE: Use \s (single backslash) in regex literals — \\s matches literal backslash+letter
const DESTRUCTIVE_PATTERNS: RegExp[] = [
  /rm\s+-rf/i,
  /git\s+push\s+--force/i,
  /drop\s+table/i,
  /drop\s+database/i,
]

// ---------------------------------------------------------------------------
// Agent Identity Patterns (high-confidence — checked FIRST)
// ---------------------------------------------------------------------------

const AGENT_IDENTITY_PATTERNS: Record<string, RegExp[]> = {
  huitzilopochtli: [/You are \*\*Huitzilopochtli\*\*/],
  quetzalcoatl:    [/You are \*\*Quetzalcoatl\*\*/],
  moctezuma:       [/You are \*\*Moctezuma\*\*/],
  tlaloc:          [/You are \*\*Tlaloc\*\*/],
  mictlantecuhtli: [/You are \*\*Mictlantecuhtli\*\*/],
  tezcatlipoca:    [/You are \*\*Tezcatlipoca\*\*/],
}

// ---------------------------------------------------------------------------
// Agent Detection Patterns
// ---------------------------------------------------------------------------

const AGENT_DETECT_PATTERNS: Record<string, RegExp[]> = {
  huitzilopochtli: [
    /HUITZILOPOCHTLI/,
    /Supreme Orchestrator/,
    /LEFT-HANDED HUMMINGBIRD/,
    /NEVER writes a single line/,
  ],
  quetzalcoatl: [
    /QUETZALCOATL/,
    /Visionary Sage/,
    /FEATHERED SERPENT/,
    /CONCEIVE the architectural vision/,
  ],
  moctezuma: [
    /MOCTEZUMA/,
    /Strategic Commander/,
    /STRATEGIST AND COMMANDER/,
    /DECOMPOSE the vision/,
  ],
  tlaloc: [
    /TLALOC/,
    /Rain God Builder/,
    /rain that nourishes/,
    /MATERIALIZE code/,
  ],
  mictlantecuhtli: [
    /MICTLANTECUHTLI/,
    /Lord of the Underworld/,
    /JUDGE AND GUARDIAN/,
    /VALIDATE that code/,
  ],
  tezcatlipoca: [
    /TEZCATLIPOCA/,
    /Smoking Mirror/,
    /SMOKING MIRROR/,
    /OBSERVE and CRITICIZE/,
  ],
}

// ---------------------------------------------------------------------------
// Tool Permissions Matrix
// ---------------------------------------------------------------------------

const TOOL_PERMISSIONS: Record<string, Record<string, "allow" | "deny" | "ask">> = {
  // Unknown agents: deny all write operations (conservative default)
  unknown: {
    write: "deny",
    edit: "deny",
    patch: "deny",
    bash: "allow",
    task: "deny",
    skill: "allow",
  },
  huitzilopochtli: {
    write: "deny",
    edit: "deny",
    patch: "deny",
    bash: "allow",
    task: "allow",
    skill: "allow",
  },
  quetzalcoatl: {
    write: "deny",
    edit: "deny",
    patch: "deny",
    bash: "allow",
    task: "allow",
    skill: "allow",
  },
  moctezuma: {
    write: "allow",
    edit: "allow",
    patch: "allow",
    bash: "allow",
    task: "deny",
    skill: "allow",
  },
  tlaloc: {
    write: "allow",
    edit: "allow",
    patch: "allow",
    bash: "allow",
    task: "ask",
    skill: "allow",
  },
  mictlantecuhtli: {
    write: "allow",
    edit: "allow",
    patch: "allow",
    bash: "allow",
    task: "allow",
    skill: "allow",
  },
  tezcatlipoca: {
    write: "deny",
    edit: "deny",
    patch: "deny",
    bash: "allow",
    task: "deny",
    skill: "allow",
  },
}

// ---------------------------------------------------------------------------
// Bash Write Rules (deny for read-only agents)
// ---------------------------------------------------------------------------

// Glob patterns for bash command deny rules
// Only block destructive operations — safe read-only commands are allowed
const AGENT_BASH_DENY_RULES: Record<string, string[]> = {
  quetzalcoatl: [
    "> *", ">> *",                    // File redirection (write)
    "touch *", "mkdir *",            // Create files/dirs
    "cp *", "mv *",                  // Copy/move files
    "rm -r*", "rm --recursi*",       // Recursive delete (dangerous)
    "chmod *", "chown *", "ln *",    // Permission/link changes
  ],
  tezcatlipoca: [
    "> *", ">> *",
    "touch *", "mkdir *",
    "cp *", "mv *",
    "rm -r*", "rm --recursi*",
    "chmod *", "chown *", "ln *",
  ],
  huitzilopochtli: [
    "> *", ">> *",
    "touch *", "mkdir *",
    "cp *", "mv *",
    "rm -r*", "rm --recursi*",
    "chmod *", "chown *", "ln *",
  ],
}

// ---------------------------------------------------------------------------
// Intent → Command mapping (for visible suggestions in system prompt)
// ---------------------------------------------------------------------------

// Maps keywords to their suggested command (reverse of INTENT_PATTERNS structure)
const INTENT_SUGGESTION_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(INTENT_PATTERNS).flatMap(([cmd, keywords]) =>
    keywords.map((kw) => [kw, cmd])
  ),
)

// ---------------------------------------------------------------------------
// SDD Phase Suggestions (advisory, not enforced)
// ---------------------------------------------------------------------------

const PHASE_SUGGESTIONS: Record<string, Record<string, string>> = {
  idle: {},
  define: {
    moctezuma: 'Consider /spec or /design first to define requirements.',
    tlaloc: 'Consider /spec first to define requirements.',
    mictlantecuhtli: 'Consider /spec first to define requirements.',
    tezcatlipoca: 'Consider /spec first to define requirements.',
  },
  plan: {
    quetzalcoatl: 'Consider /spec or /design first to define requirements.',
    tlaloc: 'Consider /plan first to break work into tasks.',
    mictlantecuhtli: 'Consider /plan first to break work into tasks.',
    tezcatlipoca: 'Consider /plan first to break work into tasks.',
  },
  build: {
    huitzilopochtli: 'Consider delegating implementation to tlaloc via /build.',
    quetzalcoatl: 'Consider /spec or /design first, then /plan.',
    moctezuma: 'Consider /plan first, then /build.',
    mictlantecuhtli: 'Consider /build first to implement code.',
    tezcatlipoca: 'Consider /build first to implement code.',
  },
  verify: {
    huitzilopochtli: 'Consider /build first to implement code.',
    quetzalcoatl: 'Consider /spec → /plan → /build before testing.',
    moctezuma: 'Consider /build first, then /test.',
    tlaloc: 'Consider /test to verify your implementation.',
    tezcatlipoca: 'Consider /test to verify code quality.',
  },
  review: {
    huitzilopochtli: 'Consider /test first to verify code quality.',
    quetzalcoatl: 'Consider /spec → /plan → /build → /test before review.',
    moctezuma: 'Consider /test first, then /review.',
    tlaloc: 'Consider /test first, then /review.',
    mictlantecuhtli: 'Consider /review to audit code quality.',
  },
  ship: {
    huitzilopochtli: 'Consider /test and /review before shipping.',
    quetzalcoatl: 'Consider full SDD cycle before shipping.',
    moctezuma: 'Consider /test and /review before shipping.',
    tlaloc: 'Consider /test and /review before shipping.',
    // tezcatlipoca: read-only agent, cannot ship — no suggestion
  },
}

// ---------------------------------------------------------------------------
// Agent Role Rules
// ---------------------------------------------------------------------------

const AGENT_ROLE_RULES: Record<string, string[]> = {
  huitzilopochtli: [
    "### Role Rules",
    "You are **Huitzilopochtli** — Supreme Orchestrator.",
    "- **ONLY** analyze intent and delegate to subagents.",
    "- You DO NOT write code. You DO NOT write documentation.",
    "- You invoke subagents via `task()` to execute work.",
    "- Your value is in orchestration and delegation decisions.",
  ],
  quetzalcoatl: [
    "### Role Rules",
    "You are **Quetzalcoatl** — Visionary Architect.",
    "- **PLAN and DESIGN** specifications, architectures, diagrams.",
    "- You DO NOT write code — NEVER.",
    "- Delegate documentation to subagents (docs-writer, etc.).",
    "- Your value is in architectural vision and direction.",
  ],
  moctezuma: [
    "### Role Rules",
    "You are **Moctezuma** — Strategic Commander.",
    "- **DECOMPOSE** visions into executable tasks and plans.",
    "- You write plans and task breakdowns.",
    "- You DO NOT write code — NEVER.",
    "- You DO NOT delegate — write all plans directly.",
  ],
  tlaloc: [
    "### Role Rules",
    "You are **Tlaloc** — Rain God Builder.",
    "- **IMPLEMENT** code, tests, infrastructure.",
    "- You write code and technical documentation.",
    "- Delegate to specialized subagents when needed.",
    "- Your value is in materializing specifications into working code.",
  ],
  mictlantecuhtli: [
    "### Role Rules",
    "You are **Mictlantecuhtli** — Underworld Judge.",
    "- **VALIDATE** code quality, run tests, prepare deployment.",
    "- You write tests and validation reports.",
    "- Delegate to review/audit subagents for deep analysis.",
    "- Your value is in ensuring code meets quality standards.",
  ],
  tezcatlipoca: [
    "### Role Rules",
    "You are **Tezcatlipoca** — Smoking Mirror Critic.",
    "- **OBSERVE and CRITICIZE** code — NEVER write.",
    "- You DO NOT write code. You DO NOT write documentation.",
    "- You DO NOT invoke subagents.",
    "- Your value is in perception and critique, not action.",
  ],
}

const MAX_AUDIT_LINES = 500

// ---------------------------------------------------------------------------
// Plugin
// ---------------------------------------------------------------------------

export const SddPipelinePlugin: Plugin = async (ctx) => {
  const { directory } = ctx

  // ── Paths ────────────────────────────────────────────────────────────────
  const projectDir = directory || process.cwd()
  const pluginsDir = join(projectDir, ".opencode", "plugins")
  const statePath = join(pluginsDir, ".sdd-state.json")
  const auditLogPath = join(pluginsDir, ".sdd-audit.log")

  // ── Load persisted SDD state ─────────────────────────────────────────────
  const defaultState: SddState = {
    pipeline_phase: "idle",
    active_spec: null,
    current_task: null,
    completed_tasks: [],
    pending_tasks: [],
    agent_type: "unknown",
    last_intent: null,
  }

  const sddState: SddState = { ...defaultState }
  try {
    if (existsSync(statePath)) {
      const saved = JSON.parse(readFileSync(statePath, "utf-8"))
      Object.assign(sddState, saved)
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.debug("[sdd-pipeline] Corrupted state file, using defaults:", msg)
  }

  // ── Truncate audit log on init if exceeds threshold ──────────────────────
  try {
    if (existsSync(auditLogPath)) {
      const content = readFileSync(auditLogPath, "utf-8")
      const lines = content.split("\n")
      if (lines.length >= MAX_AUDIT_LINES) {
        writeFileSync(auditLogPath, lines.slice(-(MAX_AUDIT_LINES / 2)).join("\n") + "\n")
        console.debug("[sdd-pipeline] Audit log truncated on init")
      }
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.debug("[sdd-pipeline] Could not truncate audit log:", msg)
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  const saveState = () => {
    try {
      if (!existsSync(pluginsDir)) mkdirSync(pluginsDir, { recursive: true })
      writeFileSync(statePath, JSON.stringify(sddState, null, 2))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.debug("[sdd-pipeline] Could not save state:", msg)
    }
  }

  const audit = (source: string, detail: string) => {
    try {
      const timestamp = new Date().toISOString()
      const entry = `[${timestamp}] [${source}] ${detail}\n`

      // Rotate if file exceeds max lines (keeps most recent half)
      if (existsSync(auditLogPath)) {
        const content = readFileSync(auditLogPath, "utf-8")
        const lines = content.split("\n")
        if (lines.length >= MAX_AUDIT_LINES) {
          writeFileSync(auditLogPath, lines.slice(-(MAX_AUDIT_LINES / 2)).join("\n") + "\n")
        }
      }

      appendFileSync(auditLogPath, entry)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.debug("[sdd-pipeline] Could not write audit log:", msg)
    }
  }

  // ── Agent detection ────────────────────────────────────────────────────

  const detectAgentType = (systemParts: string[]): string => {
    // Phase 1: High-confidence identity check ("You are **AgentName**")
    for (const part of systemParts) {
      for (const [agentType, patterns] of Object.entries(AGENT_IDENTITY_PATTERNS)) {
        if (patterns.some((p) => p.test(part))) {
          return agentType
        }
      }
    }

    // Phase 2: Fallback to general patterns (keyword-based)
    for (const part of systemParts) {
      for (const [agentType, patterns] of Object.entries(AGENT_DETECT_PATTERNS)) {
        if (patterns.some((p) => p.test(part))) {
          return agentType
        }
      }
    }
    return "unknown"
  }

  // ── Build role rules per agent type ────────────────────────────────────

  const buildRoleRules = (): string[] => {
    return AGENT_ROLE_RULES[sddState.agent_type] ?? [
      "### Role Rules",
      `Operating as: **${sddState.agent_type}**.`,
      "Follow your agent-specific permissions and restrictions.",
    ]
  }

  // ── Build injected context strings ───────────────────────────────────────

  const buildSddContext = (): string => {
    const lines = [
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
      ...buildRoleRules(),
    ]
    return lines.join("\n")
  }

  // ── Bash command matching ────────────────────────────────────────────────

  const matchBashCommand = (cmd: string, pattern: string): boolean => {
    // Simple glob-like matching
    const regex = new RegExp(
      "^" +
      pattern
        .replace(/[.+^${}()|[\]\\]/g, "\\$&")
        .replace(/\*/g, ".*")
        .replace(/\s+/g, "\\s+") +
      "$"
    )
    return regex.test(cmd.trim())
  }

  // ── Error factory ──────────────────────────────────────────────────────

  const blockError = (msg: string): Error => new Error(`[sdd-pipeline] ${msg}`)

  // ── Hooks ────────────────────────────────────────────────────────────────

  return {

    /**
     * Fires before each LLM call to build the system prompt.
     * Injects SDD pipeline state so the agent
     * always has the orchestration guides available from the FIRST message.
     */
    "experimental.chat.system.transform": async (
      _input: unknown,
      output: unknown,
    ) => {
      try {
        const out = output as { system: string[] }

        // Detect which agent persona is active from system prompt parts
        // Only update if agent is "unknown" (initial state) — chat.message has priority
        const detected = detectAgentType(out.system)
        if (detected !== sddState.agent_type && sddState.agent_type === "unknown") {
          sddState.agent_type = detected
          saveState()
          audit("system.transform", `Agent detected and persisted: ${detected}`)
        }

        // Inject SDD state at the beginning so it appears early in the system prompt
        const sddContext = buildSddContext()
        
        // Add phase suggestion if agent is used outside typical phase
        const suggestion = PHASE_SUGGESTIONS[sddState.pipeline_phase]?.[sddState.agent_type]
        const suggestionLine = suggestion ? `
> **Suggestion:** ${suggestion}` : ''
        
        // Add intent suggestion if detected in last user message (visible to model)
        let intentLine = ''
        if (sddState.last_intent) {
          intentLine = `\n> **Intent detected:** User wants to \`${sddState.last_intent}\`. Suggest they use the command.`
          sddState.last_intent = null // Consume intent after injecting
        }
        
        out.system.unshift(sddContext + suggestionLine + intentLine)
        audit("system.transform", `Injected SDD state (agent: ${sddState.agent_type}, phase: ${sddState.pipeline_phase})`)
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

        // --- Detect agent mentions (e.g., "@tlaloc", "agente tezcatlipoca") ---
        for (const [agentType, patterns] of Object.entries(AGENT_MENTION_PATTERNS)) {
          if (patterns.some((p) => p.test(content))) {
            if (sddState.agent_type !== agentType) {
              sddState.agent_type = agentType
              saveState()
              audit("chat.message", `Agent switched via mention: ${agentType}`)
            }
            break
          }
        }

        // --- Detect slash commands that load specific agents ---
        // Commands override mentions — they represent explicit user intent
        for (const [command, agentType] of Object.entries(COMMAND_AGENT_MAP)) {
          if (lower.startsWith(command)) {
            if (sddState.agent_type !== agentType) {
              sddState.agent_type = agentType
              saveState()
              audit("chat.message", `Agent switched via command ${command}: ${agentType}`)
            }
            break
          }
        }

        // --- Detect SDD intent keywords ---
        // Store intent so system.transform can inject a visible suggestion
        for (const [command, keywords] of Object.entries(INTENT_PATTERNS)) {
          if (keywords.some((kw) => lower.includes(kw))) {
            sddState.last_intent = command
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
     * Enforces tool permissions, bash write rules, and SDD phase enforcement.
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
        const agentType = sddState.agent_type

        // --- Always block destructive commands ---
        if (tool === "Bash" || tool === "bash") {
          const cmd = (args.command as string) ?? ""
          for (const pattern of DESTRUCTIVE_PATTERNS) {
            if (pattern.test(cmd)) {
              audit("tool.before", `BLOCKED ${tool}: destructive command`)
              throw blockError("Destructive command blocked. Use safe alternatives.")
            }
          }
        }

        // --- Tool Permissions Matrix ---
        const agentPermissions = TOOL_PERMISSIONS[agentType]
        if (agentPermissions) {
          const toolLower = tool.toLowerCase()
          const permission = agentPermissions[toolLower]

          if (permission === "deny") {
            audit("tool.before", `BLOCKED ${tool}: ${agentType} not allowed`)
            throw blockError(`Agent ${agentType} cannot use ${tool}.`)
          }
        }

        // --- Bash Write Rules per Agent ---
        if (tool === "Bash" || tool === "bash") {
          const cmd = (args.command as string) ?? ""
          const bashDenyRules = AGENT_BASH_DENY_RULES[agentType] ?? []

          for (const pattern of bashDenyRules) {
            if (matchBashCommand(cmd, pattern)) {
              audit("tool.before", `BLOCKED bash: write command for ${agentType}`)
              throw blockError(`Agent ${agentType} cannot execute write commands in bash.`)
            }
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
     * Persists the SDD pipeline state.
     */
    "experimental.session.compacting": async (
      _input: unknown,
      output: unknown,
    ) => {
      try {
        const out = output as { context?: string[] }

        out.context?.push(buildSddContext())

        // Persist state on compaction (replaces the missing session.ended hook)
        saveState()
        audit("session.compacting", "Injected SDD state + persisted state")
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error("[sdd-pipeline] Error in session.compacting:", msg)
      }
    },
  }
}

export default SddPipelinePlugin
