# OpenCode Setup

This guide explains how to configure OpenCode for this template — slash commands, agent personas, skills, and the full SDD workflow.

> **For a complete reference of all skills and commands**, see [USER_GUIDE.md](../../USER_GUIDE.md).

---

## Prerequisites

- **OpenCode IDE** — The only supported IDE for this template
- **Node.js >= 18** and **bun**
- **Git**

---

## Project Structure Overview

When you open this project in OpenCode, these are the key files and directories the IDE interacts with:

```
project-root/
├── AGENTS.md              # Agent personas, rules, and orchestration
├── commands/              # 7 slash commands loaded by OpenCode
│   ├── spec.md            #   /spec  → DEFINE phase
│   ├── plan.md            #   /plan  → PLAN phase
│   ├── build.md           #   /build → BUILD phase
│   ├── test.md            #   /test  → VERIFY phase
│   ├── review.md          #   /review → REVIEW phase
│   ├── code-simplify.md   #   /code-simplify → simplification
│   └── ship.md            #   /ship  → SHIP phase
├── agents/                # 5 specialized agent personas
│   ├── analysis.md        #   Architect of Specifications
│   ├── implement.md       #   Build Agent
│   ├── code-reviewer.md   #   Senior Staff Engineer
│   ├── test-engineer.md   #   QA Specialist
│   └── security-auditor.md #   Security Engineer
├── skills/                # 33 engineering skills (SKILL.md per directory)
│   ├── spec-driven-development/
│   ├── test-driven-development/
│   └── ...
└── .opencode/             # OpenCode configuration
    ├── agents/ → agents/  #   Symlink to agents/
    ├── commands/ → commands/ # Symlink to commands/
    ├── skills/ → skills/  #   Symlink to skills/
    └── package.json       #   Plugin dependencies
```

---

## What OpenCode Does Automatically

### 1. Loads Slash Commands

The `commands/` directory is auto-discovered by OpenCode. Type `/` in the chat to see all available commands:

| Command | Phase | What it does |
|---------|-------|-------------|
| `/spec` | DEFINE | Creates a structured specification before writing code |
| `/plan` | PLAN | Breaks specs into small, ordered tasks |
| `/build` | BUILD | Incremental implementation with TDD |
| `/test` | VERIFY | Write failing tests, implement, refactor |
| `/review` | REVIEW | Multi-axis code review before merge |
| `/code-simplify` | REVIEW | Simplify complex code without changing behavior |
| `/ship` | SHIP | Pre-launch checklist, staged rollout, monitoring |

Commands also activate complementary skills automatically. For example, `/build` triggers `incremental-implementation` plus `solid`, `error-handling-patterns`, `ui-ux-design-pro`, and others depending on the task.

### 2. Provides Agent Personas

The `agents/` directory defines 5 specialized agents. Each has a specific role, perspective, and output format. You can invoke them directly:

- `analysis` — Analyze, design, and plan before writing code
- `implement` — Execute validated build plans
- `code-reviewer` — Five-axis review before merge
- `test-engineer` — Test strategy and coverage analysis
- `security-auditor` — Vulnerability detection and OWASP assessment

Commands like `/review` and `/ship` compose multiple agents automatically.

### 3. Discovers Skills

All 33 skills live in `skills/<skill-name>/SKILL.md`. OpenCode agents are instructed (via `AGENTS.md`) to:

1. Detect when a skill applies to the current task
2. Load the skill using the built-in `skill` tool
3. Follow the skill's workflow step by step

Skills activate both through slash commands and automatically based on context — designing an API triggers `api-and-interface-design`, building UI triggers `frontend-ui-engineering`, debugging triggers `debugging-and-error-recovery`, and so on.

---

## First Steps After Opening the Project

### 1. Install Plugin Dependencies

```bash
cd .opencode && bun install && cd ..
```

### 2. Configure Context7 (Optional but Recommended)

Context7 provides up-to-date documentation for any library or framework:

```bash
npx ctx7@latest setup
```

Once configured, the `find-docs` skill automatically fetches current API docs when you ask about any library.

### 3. Start with the Meta-Skill

Load `@skills/using-agent-skills/SKILL.md` to discover which skill applies to your current task. This meta-skill contains a flowchart that maps task types to the right skill, core operating behaviors, and lifecycle sequences.

### 4. Run Your First Workflow

```bash
/spec "Describe what you want to build"
/plan
/build
/test
/review
/ship
```

---

> **📖 For the full skill anatomy (diagram, key principles, how skills work):** see [USER_GUIDE.md > How Skills Work](../../USER_GUIDE.md#how-skills-work). This setup guide focuses on OpenCode configuration only.

---

## Configuration Files

### AGENTS.md

This file defines agent personas, their rules, and orchestration. It instructs agents to:
- Always check if a skill applies before acting
- Follow skills exactly when they apply
- Never skip required workflows (spec, plan, test)
- Surface assumptions and manage confusion actively

### .opencode/package.json

Contains the required OpenCode plugin dependency:

```json
{
  "dependencies": {
    "@opencode-ai/plugin": "1.15.0"
  }
}
```

---

## Troubleshooting

| Problem | Possible Cause | Solution |
|---------|---------------|----------|
| `/spec` doesn't work | Plugin not installed | Run `cd .opencode && bun install` |

> **For the full troubleshooting table (Context7, skills, and more):** see [USER_GUIDE.md](../../USER_GUIDE.md#troubleshooting).

---

## Related Documentation

| Guide | Covers |
|-------|--------|
| [USER_GUIDE.md](../../USER_GUIDE.md) | Complete reference of all 33 skills, commands, and workflows |
| [references/orchestration-patterns.md](../../references/orchestration-patterns.md) | Agent personas, orchestration patterns, and decision matrix |
| [docs/ai-agent-setup/skill-anatomy.md](skill-anatomy.md) | Skill creation guide and format specification |
