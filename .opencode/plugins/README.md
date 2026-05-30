# SDD Pipeline Plugin

OpenCode plugin that hooks into the lifecycle of the actual SDK API `@opencode-ai/plugin`.

## Implemented Hooks

| Event (actual API) | Purpose |
|---|---|
| `experimental.chat.system.transform` | Detects active agent + injects SDD state + role rules + intent suggestions in system prompt |
| `chat.message` | Detects agent mentions, slash commands, and user intent. Commands have priority over mentions |
| `tool.execute.before` | Blocks destructive commands + per-agent permissions (write/edit/patch/bash/task) + SDD phase enforcement |
| `tool.execute.after` | Tool auditing with automatic rotation |
| `experimental.session.compacting` | Re-injects SDD state + role rules + persists pipeline state |

## Actual SDK API vs blog post

Based on `@opencode-ai/plugin/dist/index.d.ts` (v1.14.41):

| Blog post / Plan | Actual API | Status |
|---|---|---|
| `session.created` | ❌ Does not exist | We use `experimental.chat.system.transform` |
| `message.created` | `chat.message` | ✅ Corrected |
| `tool.call` | `tool.execute.before` | ✅ Corrected |
| `tool.result` | `tool.execute.after` | ✅ Corrected |
| `experimental.session.compacting` | `experimental.session.compacting` | ✅ Same |
| `file.written` | ❌ Does not exist | Removed |
| `error` | ❌ Does not exist | Removed |
| `session.ended` | ❌ Does not exist | Persistence in `session.compacting` |
| `command.executed` | `command.execute.before` | Removed (pre-execution only) |

## Runtime Files

- `.opencode/plugins/.sdd-state.json` — persisted pipeline state (phase, tasks, agent type, last intent)
- `.opencode/plugins/.sdd-audit.log` — audit trace with automatic rotation (>500 lines → truncates to 250)

Both ignored by git.

## Destructive Command Blocking

The plugin blocks destructive commands for ALL agents (including those that can write):

```typescript
DESTRUCTIVE_PATTERNS = [
  /rm\s+-r[f]?/i,           // rm -rf, rm -r
  /rm\s+--recursi/i,         // rm --recursive
  /git\s+push\s+--force/i,   // git push --force
  /git\s+push\s+-f/i,        // git push -f
  /DROP\s+TABLE/i,           // DROP TABLE
  /DELETE\s+FROM/i,          // DELETE FROM
]
```

This is the only enforcement the plugin applies. All other permissions (write, edit, task, bash write rules) are managed by OpenCode via the agent file YAML frontmatter.

### Subagent Name Validation

The plugin validates that subagent names in `task()` exist in the catalog (**102 agents**: 96 subagents + 6 primary). If the LLM invents a name, it receives an error:

```
Unknown subagent: python-wizard. Use a valid agent name from the catalog.
```

The `VALID_SUBAGENTS` array contains all valid agent names organized by domain:

| Domain | Count | Agents |
|--------|:-----:|--------|
| Primary | 6 | huitzilopochtli, quetzalcoatl, moctezuma, tlaloc, mictlantecuhtli, tezcatlipoca |
| Backend & APIs | 22 | backend-developer, typescript-pro, python-pro, golang-pro, rust-engineer, java-architect, csharp-developer, fastapi-developer, graphql-architect, spring-boot-engineer, django-developer, laravel-specialist, php-pro, nextjs-developer, elixir-expert, ruby-pro, kotlin-specialist, websocket-engineer, microservices-architect, cpp-pro, javascript-pro, fullstack-developer |
| Frontend & Mobile | 8 | angular-architect, flutter-expert, frontend-developer, mobile-app-developer, mobile-developer, react-specialist, swift-expert, vue-expert |
| Database & Data | 8 | database-optimizer, postgres-pro, sql-pro, data-analyst, data-engineer, data-scientist, data-researcher, database-administrator |
| DevOps & Infra | 11 | docker-expert, kubernetes-specialist, terraform-engineer, devops-engineer, build-engineer, sre-engineer, cloud-architect, platform-engineer, network-engineer, azure-infra-engineer, deployment-engineer |
| Security | 3 | security-auditor, dependency-manager, legal-advisor |
| Testing & QA | 7 | test-engineer, code-reviewer, accessibility-tester, chaos-engineer, refactorer, error-detective, error-coordinator |
| Debugging | 1 | debugger |
| AI / ML | 6 | ai-engineer, llm-architect, mlops-engineer, machine-learning-engineer, nlp-engineer, prompt-engineer |
| DX & Tooling | 5 | cli-developer, tooling-engineer, mcp-developer, dx-optimizer, context-manager |
| Processes | 5 | git-workflow-manager, incident-responder, project-manager, scrum-master, legacy-modernizer |
| Specialized Domains | 6 | fintech-engineer, payment-integration, blockchain-developer, game-developer, iot-engineer, embedded-systems |
| Documentation & Research | 5 | docs-writer, research-analyst, knowledge-synthesizer, scientific-literature-researcher, search-specialist |
| Product & Business | 9 | business-analyst, product-manager, competitive-analyst, content-marketer, market-researcher, sales-engineer, seo-specialist, trend-analyst, ux-researcher |

Validation checks `args.agent`, `args.name`, `args.type`, or `args.subagent` for the name.

## SDD Phase Enforcement

Only valid agents per SDD phase can operate. If an invalid agent attempts to use tools, it receives an error.

| Phase | Valid agents |
|------|----------------|
| idle | huitzilopochtli, quetzalcoatl, moctezuma |
| define | quetzalcoatl |
| plan | moctezuma |
| build | tlaloc |
| verify | mictlantecuhtli |
| review | tezcatlipoca |
| ship | mictlantecuhtli |

## Phase Suggestions

When an agent is used outside its typical phase, the plugin suggests using the correct command. Example:

```
> **Suggestion:** Consider /build first to implement code.
```

Suggestions are **advisory only** — they never block the agent.

## Intent Detection

`chat.message` detects user intent in free-text messages:

| Pattern | Intent |
|--------|--------|
| "create a rest api", "build a cli" | build |
| "write tests", "add unit tests" | test |
| "review this code", "check quality" | review |
| "create a spec", "define requirements" | spec |
| "plan this feature" | plan |

When an intent is detected, it is stored in `sddState.last_intent` and injected as a visible suggestion in the system prompt:

```
> **Intent detected:** User wants to `build`. Suggest they use the command.
```

The intent is consumed after injection (transient, not persisted between sessions).

### Priority: Commands over mentions

Slash commands (`/build`, `/review`) have priority over mentions (`@tlaloc`). If the user writes `@tlaloc /review`, tezcatlipoca is activated (by the command), not tlaloc (by the mention).

## How it works

1. **On session start**: `experimental.chat.system.transform` detects which primary agent is active (6 agents), persists it in `.sdd-state.json`, and injects the SDD state + role rules + intent suggestions in the system prompt. Detection uses three mechanisms (see Agent Detection Architecture).
2. **Each message**: `chat.message` detects agent mentions, slash commands, and intent. Commands have priority over mentions. When it detects a mention or command, it updates the active agent and persists the change.
3. **Before each tool**: `tool.execute.before` blocks destructive commands and validates subagent names.
4. **After each tool**: `tool.execute.after` logs to the audit log.
5. **On compaction**: `experimental.session.compacting` re-injects the SDD state + role rules and persists the pipeline state.

> The meta-skill (`using-agent-skills`) is **not** injected automatically to save tokens (~4,000 per call). OpenCode exposes it as an available skill; agents load it on demand with the `skill` tool.

## Agent Detection Architecture

Agent detection uses **three mechanisms**:

### 1. Identity Patterns (high confidence — system prompt)
Patterns that match in the active agent's prompt:
```
"You are **Tlaloc**" → detects tlaloc
"You are **Huitzilopochtli**" → detects huitzilopochtli
```

### 2. Agent Mention Patterns (user messages)
Detection of mentions in user messages:
```
@tlaloc, agente tezcatlipoca → updates active agent
```

### 3. Command-Agent Map (slash commands)
Mapping of slash commands to their primary agent:
```
/build → tlaloc
/review → tezcatlipoca
/spec → quetzalcoatl
```

**Complete flow:**
1. `system.transform` detects agent from system prompt (identity → keywords)
2. `chat.message` detects mentions and commands in user messages (commands > mentions)
3. Persisted state in `.sdd-state.json` is updated in both hooks

## Subagent Delegation

Primary agents can delegate to subagents via `task()`. Each subagent operates in an isolated subcontext with its **own permissions**, not the parent's.

| Primary agent | Can delegate? | Typical subagents |
|----------------|:---:|---|
| huitzilopochtli | ✅ docs + code | Any catalog subagent (flexible) |
| quetzalcoatl | ✅ docs only | docs-writer, accessibility-tester, ux-researcher |
| moctezuma | ❌ | (does not delegate) |
| tlaloc | ✅ docs + code | backend-developer, frontend-developer, test-engineer, etc. |
| mictlantecuhtli | ✅ docs + code | test-engineer, code-reviewer (when steps exhausted) |
| tezcatlipoca | ❌ | (does not delegate — only observes and critiques) |

> **Note:** Subagent names are validated against the `VALID_SUBAGENTS` catalog. Invented names are rejected with an error.

## Source

Plugin: `sdd-pipeline.ts` (797 lines)
