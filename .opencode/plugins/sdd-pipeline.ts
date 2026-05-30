import type { Plugin } from "@opencode-ai/plugin"
import { readFileSync, writeFileSync, existsSync, appendFileSync } from "fs"
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

/** Typed error for SDD pipeline blocking — avoids string prefix coupling. */
class SddError extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = "SddError"
  }
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
// Valid Subagent Names (for task() validation)
// ---------------------------------------------------------------------------

// All 102 agents: 96 subagents + 6 primary agents
// Used to validate task() calls — rejects invented subagent names
const VALID_SUBAGENTS: readonly string[] = [
  // Primary agents
  "huitzilopochtli", "quetzalcoatl", "moctezuma", "tlaloc", "mictlantecuhtli", "tezcatlipoca",
  // Backend & APIs
  "backend-developer", "typescript-pro", "python-pro", "golang-pro", "rust-engineer",
  "java-architect", "csharp-developer", "fastapi-developer", "graphql-architect",
  "spring-boot-engineer", "django-developer", "laravel-specialist", "php-pro",
  "nextjs-developer", "elixir-expert", "ruby-pro", "kotlin-specialist",
  "websocket-engineer", "microservices-architect", "cpp-pro", "javascript-pro",
  "fullstack-developer",
  // Frontend & Mobile
  "angular-architect", "flutter-expert", "frontend-developer", "mobile-app-developer",
  "mobile-developer", "react-specialist", "swift-expert", "vue-expert",
  // Database & Data
  "database-optimizer", "postgres-pro", "sql-pro", "data-analyst", "data-engineer",
  "data-scientist", "data-researcher", "database-administrator",
  // DevOps & Infra
  "docker-expert", "kubernetes-specialist", "terraform-engineer", "devops-engineer",
  "build-engineer", "sre-engineer", "cloud-architect", "platform-engineer",
  "network-engineer", "azure-infra-engineer", "deployment-engineer",
  // Security
  "security-auditor", "dependency-manager", "legal-advisor",
  // Testing & QA
  "test-engineer", "code-reviewer", "accessibility-tester", "chaos-engineer",
  "refactorer", "error-detective", "error-coordinator",
  // Debugging
  "debugger",
  // AI / ML
  "ai-engineer", "llm-architect", "mlops-engineer", "machine-learning-engineer",
  "nlp-engineer", "prompt-engineer",
  // DX & Tooling
  "cli-developer", "tooling-engineer", "mcp-developer", "dx-optimizer", "context-manager",
  // Processes
  "git-workflow-manager", "incident-responder", "project-manager", "scrum-master",
  "legacy-modernizer",
  // Specialized Domains
  "fintech-engineer", "payment-integration", "blockchain-developer", "game-developer",
  "iot-engineer", "embedded-systems",
  // Documentation & Research
  "docs-writer", "research-analyst", "knowledge-synthesizer",
  "scientific-literature-researcher", "search-specialist",
  // Product & Business
  "business-analyst", "product-manager", "competitive-analyst", "content-marketer",
  "market-researcher", "sales-engineer", "seo-specialist", "trend-analyst", "ux-researcher",
]

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

// Agent types that must NEVER generate file content in the session.
// These agents lack write/edit/patch permissions — any content they generate
// is wasted tokens that clutters the conversation and cannot be used.
const READ_ONLY_AGENTS = new Set([
  "quetzalcoatl", "tezcatlipoca", "huitzilopochtli",
])

const ANTI_CONTENT_GENERATION = `
## CRITICAL: No file content in session

NEVER output code, markdown, JSON, or config in chat — wastes tokens for read-only agents. Say WHAT and WHERE, then delegate or notify.
Your value is ANALYSIS, RECOMMENDATIONS, and DECISIONS — not file content.
`

// ---------------------------------------------------------------------------
// Plugin
// ---------------------------------------------------------------------------

export const SddPipelinePlugin: Plugin = async (ctx) => {
  const { directory } = ctx

  // ── Paths ────────────────────────────────────────────────────────────────
  const projectDir = directory || process.cwd()
  const pluginsDir = join(projectDir, ".opencode", "plugins")
  const auditLogPath = join(pluginsDir, ".sdd-audit.log")

  // ── In-memory SDD state (no persistence — detected fresh each session) ──
  const sddState: SddState = {
    pipeline_phase: "idle",
    active_spec: null,
    current_task: null,
    completed_tasks: [],
    pending_tasks: [],
    agent_type: "unknown",
    last_intent: null,
  }

  // ── Audit log helpers ────────────────────────────────────────────────────

  // [P1] In-memory line count — avoids re-reading the file on every append.
  //      Reset to 0 if file doesn't exist; set on init; tracked in audit().
  let auditLineCount = 0

  /**
   * [R1] Single source of truth for audit log rotation.
   * Reads the file, counts lines, and truncates to half if >= MAX_AUDIT_LINES.
   * Updates the in-memory line count.
   */
  const maybeRotateAuditLog = () => {
    if (!existsSync(auditLogPath)) {
      auditLineCount = 0
      return
    }
    const content = readFileSync(auditLogPath, "utf-8")
    const lines = content.split("\n")
    auditLineCount = lines.length
    if (auditLineCount >= MAX_AUDIT_LINES) {
      const keep = lines.slice(-(MAX_AUDIT_LINES / 2))
      writeFileSync(auditLogPath, keep.join("\n") + "\n")
      auditLineCount = keep.length
      console.debug("[sdd-pipeline] Audit log truncated on init")
    }
  }

  // Init: rotate if needed and seed line count
  try {
    maybeRotateAuditLog()
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.debug("[sdd-pipeline] Could not truncate audit log:", msg)
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  const audit = (source: string, detail: string) => {
    try {
      const timestamp = new Date().toISOString()
      const entry = `[${timestamp}] [${source}] ${detail}\n`

      // [P1] Rotate only when in-memory count reaches threshold
      if (auditLineCount >= MAX_AUDIT_LINES) {
        maybeRotateAuditLog()
      }

      appendFileSync(auditLogPath, entry)
      auditLineCount++
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
    // Inject anti-content-generation rule for read-only agents
    if (READ_ONLY_AGENTS.has(sddState.agent_type)) {
      lines.push(ANTI_CONTENT_GENERATION)
    }
    return lines.join("\n")
  }

  // ── Command → SDD phase mapping ──────────────────────────────────────────

  const commandToPhase = (command: string): string => {
    const map: Record<string, string> = {
      "/spec": "define",
      "/design": "define",
      "/plan": "plan",
      "/build": "build",
      "/test": "verify",
      "/review": "review",
      "/ship": "ship",
      "/code-simplify": "review",
    }
    return map[command] ?? "idle"
  }

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
          audit("system.transform", `Agent detected: ${detected}`)
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
              audit("chat.message", `Agent switched via mention: ${agentType}`)
            }
            break
          }
        }

        // --- Detect slash commands that load specific agents ---
        // Commands override EVERYTHING — they represent explicit user intent.
        // Always set the agent, even if it's the same (ensures state is persisted
        // on the first command after session start when agent is "unknown").
        for (const [command, agentType] of Object.entries(COMMAND_AGENT_MAP)) {
          if (lower.startsWith(command)) {
            const prev = sddState.agent_type
            sddState.agent_type = agentType
            sddState.pipeline_phase = commandToPhase(command)
            if (prev !== agentType) {
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

        // --- Always block destructive commands ---
        if (tool === "Bash" || tool === "bash") {
          const cmd = (args.command as string) ?? ""
          for (const pattern of DESTRUCTIVE_PATTERNS) {
            if (pattern.test(cmd)) {
              audit("tool.before", `BLOCKED ${tool}: destructive command`)
              throw new SddError("Destructive command blocked. Use safe alternatives.")
            }
          }
        }

        // --- Task() Subagent Name Validation ---
        // [C2] Use .toLowerCase() to handle any case variant ("task", "Task", "TASK")
        if (tool.toLowerCase() === "task") {
          // Extract subagent name from args (check common keys)
          const subagentName = (args.agent as string)
            ?? (args.name as string)
            ?? (args.type as string)
            ?? (args.subagent as string)
            ?? ""

          if (subagentName && !VALID_SUBAGENTS.includes(subagentName)) {
            audit("tool.before", `BLOCKED task: unknown subagent "${subagentName}"`)
            throw new SddError(`Unknown subagent: ${subagentName}. Use a valid agent name from the catalog.`)
          }
        }

      } catch (err: unknown) {
        // [R2] Re-throw our own SddError instances; log everything else
        if (err instanceof SddError) throw err
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
     * Re-injects SDD state into the compacted context.
     */
    "experimental.session.compacting": async (
      _input: unknown,
      output: unknown,
    ) => {
      try {
        const out = output as { context?: string[] }

        out.context?.push(buildSddContext())

        audit("session.compacting", "Injected SDD state")
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error("[sdd-pipeline] Error in session.compacting:", msg)
      }
    },
  }
}

export default SddPipelinePlugin
