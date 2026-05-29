---
description: Design UI/UX specifications — create structured specification documents for design systems, user flows, and component architectures for creative projects
agent: quetzalcoatl
---

Invoke the @skills/ui-ux-design-pro/SKILL.md.

## Related Skills
Skills that complement the design workflow:

- **Design Taste Frontend**: @skills/design-taste-frontend/SKILL.md — Senior UI/UX engineering with metric-based rules
- **Frontend UI Engineering**: @skills/frontend-ui-engineering/SKILL.md — Build production-quality UIs
- **Architecture Diagrams**: @skills/architecture-diagrams/SKILL.md — Document user flows and system architecture

---

`/design` is a **fan-out orchestrator**. It runs specialist personas in parallel against the design request, then merges their reports into a comprehensive design specification. The personas operate independently — no shared state, no ordering — which is what makes parallel execution safe and useful here.

## Phase 0 — Pre-flight: Understand design scope

Before spawning subagents, clarify with the user:

1. **Project type**: New design system, component audit, landing page, dashboard, mobile app, etc.
2. **Target users**: Who will use this interface?
3. **Existing design**: Is there an existing design system or starting from scratch?
4. **Constraints**: Brand guidelines, accessibility requirements, tech stack

Ask clarifying questions about:
- Visual style preferences (modern, minimal, corporate, playful)
- Reference designs or inspiration
- Performance and accessibility requirements
- Platform (web, mobile, desktop)

## Phase A — Parallel fan-out

Spawn subagents concurrently using the Agent tool. **Issue all Agent tool calls in a single assistant turn so they execute in parallel** — sequential calls defeat the purpose of this command.

In OpenCode, each call passes `subagent_type` matching the persona's `name` field:

1. **`ux-researcher`** — Conduct user research analysis. Define target personas, map user journeys, identify pain points and opportunities. Output user research insights and persona definitions.
2. **`frontend-developer`** — Analyze technical feasibility. Evaluate component architecture, state management needs, API integration points, and performance constraints. Output technical design constraints.
3. **`accessibility-tester`** — Define accessibility requirements. Map WCAG 2.1 AA/AAA compliance needs, keyboard navigation patterns, screen reader support, and color contrast requirements. Output accessibility specification.

In other harnesses without an Agent tool, invoke each persona's system prompt sequentially and treat their outputs as if returned in parallel — the merge phase still works.

Constraints (from OpenCode's subagent model):
- Subagents cannot spawn other subagents — do not let one persona delegate to another.
- Each subagent gets its own context window and returns only its report to this main session.
- If you need teammates that talk to each other instead of just reporting back, use Claude Code Agent Teams and reference these personas as teammate types (see @docs/opencode/08-orchestration-patterns.md).

**Persona resolution.** If you've defined your own `ux-researcher`, `frontend-developer`, or `accessibility-tester` in `.opencode/agents/` or `~/.opencode/agents/`, those take precedence over this plugin's versions — `/design` picks up your customizations automatically.

## Phase B — Merge in main context

Once all reports are back, the main agent (not a sub-persona) synthesizes them into a comprehensive design specification:

1. **User Experience** — Aggregate `ux-researcher` insights: personas, journeys, pain points, opportunities
2. **Technical Constraints** — Pull from `frontend-developer`: component architecture, state management, API needs, performance
3. **Accessibility** — Integrate `accessibility-tester` requirements: WCAG compliance, keyboard nav, screen readers
4. **Design System** — Define tokens, colors, typography, spacing, components based on all inputs
5. **User Flows** — Create flow diagrams combining UX research and technical constraints

## Phase C — Save design specification

1. Save the design specification to `specs/design/DESIGN.md` with the following structure:

```markdown
# [Project Name] — Design Specification
## Overview
[Project description and goals]
## User Personas
[From ux-researcher output]
## User Flows
[Flow diagrams and user journeys]
## Design System
### Tokens
- Colors, typography, spacing, shadows
### Components
- Component hierarchy and states
### Patterns
- Interaction patterns and conventions
## Technical Constraints
[From frontend-developer output]
## Accessibility Requirements
[From accessibility-tester output]
## References
- [Inspiration links]
- [Brand guidelines]
```

2. Also create or update supporting files in `specs/design/`

## Rules

1. The Phase A personas run in parallel — never sequentially.
2. Personas do not call each other. The main agent merges in Phase B.
3. Always save the design specification to `specs/design/DESIGN.md`.
4. Create supporting files in `specs/design/` for detailed components, styles, and flows.
5. Ask clarifying questions in Phase 0 if the design scope is ambiguous.
