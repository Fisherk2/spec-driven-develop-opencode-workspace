# Task List: Integración de Skill Extras

> Referencia: [plan.md](plan.md)

---

## Fase 1: Documentación (meta-skill + guías)

- [ ] **1.1** Actualizar `skills/using-agent-skills/SKILL.md`
  - Integrar los 12 Skill Extras en el flowchart principal (árbol de decisión)
  - Cada Extra bajo su fase correspondiente (incluir agent-md-refactor en DEFINE, incident-response en SHIP)
  - Eliminar bloque separado "Skill Extras" del flowchart
  - Actualizar tabla Quick Reference

- [ ] **1.2** Actualizar `USER_GUIDE.md`
  - Mover los 12 Skill Extras de "Skill Extras" (bloque separado) a sus tablas de fase
  - agent-md-refactor → tabla DEFINE (PRE-FLIGHT check)
  - incident-response → tabla SHIP (gestión post-launch)
  - Actualizar diagrama Mermaid si aplica

- [ ] **1.3** Actualizar `AGENTS_GUIDE.md` (si es necesario)
  - Verificar que las referencias a skills/Extras sigan siendo correctas

---

## Fase 2: Comandos (punto de entrada)

- [ ] **2.1** Actualizar `commands/spec.md`
  - PRE-FLIGHT: agent-md-refactor (detectar AGENTS.md > 200 líneas)
  - PRE-FLIGHT: crafting-effective-readmes (si no hay README)
  - Sub-skills: clean-ddd-hexagonal, design-patterns, architecture-diagrams, ui-ux-design-pro

- [ ] **2.2** Actualizar `commands/plan.md`
  - Sub-skills: clean-ddd-hexagonal, design-patterns, architecture-diagrams

- [ ] **2.3** Actualizar `commands/build.md`
  - Sub-skills: solid, error-handling-patterns, ui-ux-design-pro, design-taste-frontend, bash-defensive-patterns, clean-ddd-hexagonal

- [ ] **2.4** Actualizar `commands/test.md`
  - Sub-skills: error-handling-patterns, design-taste-frontend
  - Escalación: Si debugging detecta incidente en producción → sugerir incident-response

- [ ] **2.5** Actualizar `commands/review.md`
  - Sub-skills: solid, error-handling-patterns, design-patterns, refactoring-patterns, design-taste-frontend

- [ ] **2.6** Actualizar `commands/code-simplify.md`
  - Sub-skills: refactoring-patterns, solid

- [ ] **2.7** Actualizar `commands/ship.md`
  - Sub-skills: crafting-effective-readmes, architecture-diagrams, bash-defensive-patterns, incident-response

---

## Fase 3: Skills base (referencias profundas)

- [ ] **3.1** Actualizar `skills/spec-driven-development/SKILL.md`
  - Referenciar: clean-ddd-hexagonal, design-patterns, architecture-diagrams, ui-ux-design-pro

- [ ] **3.2** Actualizar `skills/incremental-implementation/SKILL.md`
  - Referenciar: solid, error-handling-patterns, bash-defensive-patterns

- [ ] **3.3** Actualizar `skills/code-review-and-quality/SKILL.md`
  - Referenciar: solid, design-patterns, error-handling-patterns, design-taste-frontend

- [ ] **3.4** Actualizar `skills/code-simplification/SKILL.md`
  - Referenciar: refactoring-patterns como skill complementaria

- [ ] **3.5** Actualizar `skills/frontend-ui-engineering/SKILL.md`
  - Referenciar: ui-ux-design-pro, design-taste-frontend

- [ ] **3.6** Actualizar `skills/documentation-and-adrs/SKILL.md`
  - Referenciar: crafting-effective-readmes, architecture-diagrams

- [ ] **3.7** Actualizar `skills/debugging-and-error-recovery/SKILL.md`
  - Referenciar: incident-response como escalación (cuando el bug es un incidente en producción)

- [ ] **3.8** Actualizar `skills/shipping-and-launch/SKILL.md`
  - Referenciar: incident-response en la sección de rollback/monitoring

---

## Checklist de Verificación Final

- [ ] Todos los 12 Skill Extras están asignados a al menos una fase
- [ ] Los 7 comandos referencian los Extras correspondientes
- [ ] `using-agent-skills/SKILL.md` tiene los Extras en el flowchart principal (sin bloque separado)
- [ ] `USER_GUIDE.md` refleja la nueva distribución (sin bloque "Skill Extras" separado)
- [ ] `agent-md-refactor` integrado como PRE-FLIGHT en DEFINE (/spec)
- [ ] `incident-response` integrado en SHIP (/ship) + escalación desde debugging
- [ ] Ningún Extra quedó huérfano (sin asignación)
