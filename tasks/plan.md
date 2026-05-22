# Plan de Integración: Skill Extras en el flujo Spec-Driven Development

> **Objetivo:** Acoplar los 12 Skill Extras dentro de las 6 fases existentes del pipeline
> (DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP) sin crear nuevas fases,
> actualizando comandos, skills y documentación.

---

## 1. Principios de Integración

| Principio | Aplicación |
|-----------|-----------|
| **Sin nuevas fases** | Los 12 Extras se distribuyen entre las 6 fases existentes |
| **Referencia desde comandos** | Cada comando slash (`/spec`, `/plan`, etc.) carga los Extras relevantes como sub-skills |
| **Auto-detección** | Los Extras se cargan cuando el contexto lo amerita (no siempre) |
| **Flowchart unificado** | El meta-skill `using-agent-skills` incorpora los Extras en el árbol principal |
| **Sin nuevos agentes** | Los 5 agentes existentes (`analysis`, `implement`, `code-reviewer`, `security-auditor`, `test-engineer`) son suficientes |

---

## 2. Mapeo Fase → Skill Extra

```
FASE        SKILL EXTRA                        MECANISMO
──────      ──────────                         ──────────
DEFINE      agent-md-refactor                  PRE-FLIGHT en /spec (>200 líneas → sugerir refactor)
            clean-ddd-hexagonal                Sub-skill en /spec (arquitectura backend)
            design-patterns                    Sub-skill en /spec (patrones de solución)
            architecture-diagrams              Sub-skill en /spec (documentar arquitectura)
            ui-ux-design-pro                   Sub-skill en /spec (diseño UI/UX)
            crafting-effective-readmes         Sub-skill en /spec (si no hay README adecuado)

PLAN        clean-ddd-hexagonal                Sub-skill en /plan (descomposición módulos)
            design-patterns                    Sub-skill en /plan (patrones en diseño)
            architecture-diagrams              Sub-skill en /plan (visualizar plan)

BUILD       solid                              Sub-skill en /build (calidad de código)
            error-handling-patterns            Sub-skill en /build (código resiliente)
            ui-ux-design-pro                   Sub-skill en /build (implementación UI)
            design-taste-frontend              Sub-skill en /build (consistencia visual)
            bash-defensive-patterns            Sub-skill en /build (scripts shell)
            clean-ddd-hexagonal                Sub-skill en /build (dominio DDD)

VERIFY      error-handling-patterns            Sub-skill en /test (pruebas de errores)
            design-taste-frontend              Sub-skill en /test (verificación visual)
            *escalación a incident-response*   Si debugging detecta incidente en producción

REVIEW      solid                              Sub-skill en /review (calidad código)
            refactoring-patterns               Sub-skill en /review y /code-simplify
            error-handling-patterns            Sub-skill en /review (revisión errores)
            design-patterns                    Sub-skill en /review (revisión patrones)
            design-taste-frontend              Sub-skill en /review (revisión frontend)

SHIP        crafting-effective-readmes         Sub-skill en /ship (documentación)
            architecture-diagrams              Sub-skill en /ship (diagramas en docs)
            bash-defensive-patterns            Sub-skill en /ship (scripts CI/CD)
            incident-response                  Sub-skill en /ship (gestión post-launch)
                                                También escalable desde debugging-and-error-recovery

---

## 3. Mapeo Comando → Skills (actualizado)

### `/spec` — DEFINE
```
Skills base:
  - spec-driven-development (principal)

PRE-FLIGHT (antes de empezar el spec):
  - agent-md-refactor          → Si AGENTS.md > 200 líneas, sugerir refactorizar antes
  - crafting-effective-readmes → Si no hay README o está desactualizado, sugerir crearlo

Skills Extra referenciables (durante el spec):
  - clean-ddd-hexagonal        → al diseñar arquitectura backend
  - design-patterns            → al diseñar soluciones recurrentes
  - architecture-diagrams      → al documentar arquitectura del sistema
  - ui-ux-design-pro           → al diseñar features con mucha UI
```

### `/plan` — PLAN
```
Skills base:
  - planning-and-task-breakdown (principal)

Skills Extra referenciables:
  - clean-ddd-hexagonal        → al descomponer módulos del dominio
  - design-patterns            → al definir patrones de implementación
  - architecture-diagrams      → al visualizar dependencias y flujos
```

### `/build` — BUILD
```
Skills base:
  - incremental-implementation (principal)
  - test-driven-development
  - frontend-ui-engineering    (si hay UI)
  - api-and-interface-design   (si hay APIs)
  - context-engineering        (si necesita contexto)
  - source-driven-development  (si necesita docs oficiales)

Skills Extra referenciables:
  - solid                      → al escribir código nuevo
  - error-handling-patterns    → al implementar manejo de errores
  - ui-ux-design-pro           → al implementar UI desde diseño
  - design-taste-frontend      → al implementar frontend (consistencia visual)
  - bash-defensive-patterns    → al escribir scripts shell
  - clean-ddd-hexagonal        → al implementar lógica de dominio
```

### `/test` — VERIFY
```
Skills base:
  - test-driven-development (principal)
  - browser-testing-with-devtools  (si es browser)

Skills Extra referenciables:
  - error-handling-patterns    → al probar paths de error
  - design-taste-frontend      → al verificar consistencia visual
```

### `/review` — REVIEW
```
Skills base:
  - code-review-and-quality (principal)
  - security-and-hardening   (sub-skill de revisión)
  - performance-optimization (sub-skill de revisión)

Skills Extra referenciables:
  - solid                      → al evaluar calidad del código
  - error-handling-patterns    → al revisar manejo de errores
  - design-patterns            → al revisar uso de patrones
  - refactoring-patterns       → al sugerir mejoras estructurales
  - design-taste-frontend      → al revisar frontend
```

### `/code-simplify` — REVIEW
```
Skills base:
  - code-simplification (principal)
  - code-review-and-quality

Skills Extra referenciables:
  - refactoring-patterns       → al aplicar refactorizaciones nombradas
  - solid                      → al simplificar manteniendo principios
```

### `/ship` — SHIP
```
Skills base:
  - shipping-and-launch (principal)
  - git-workflow-and-versioning
  - ci-cd-and-automation
  - deprecation-and-migration
  - documentation-and-adrs

Skills Extra referenciables:
  - crafting-effective-readmes → al generar/revisar README
  - architecture-diagrams      → al documentar arquitectura final
  - bash-defensive-patterns    → al escribir scripts de CI/CD
  - incident-response          → al gestionar incidentes post-launch
                                (también escalable desde debugging-and-error-recovery)
```

---

## 4. Archivos a modificar

### 4.1 Comandos (7 archivos)
Cada comando debe listar los Skill Extra que puede cargar según contexto.

| Archivo | Cambio |
|---------|--------|
| `commands/spec.md` | Añadir PRE-FLIGHT (agent-md-refactor, crafting-effective-readmes) + Extras de DEFINE |
| `commands/plan.md` | Añadir referencias a Extras de PLAN |
| `commands/build.md` | Añadir referencias a Extras de BUILD |
| `commands/test.md` | Añadir referencias a Extras de VERIFY + escalación a incident-response |
| `commands/review.md` | Añadir referencias a Extras de REVIEW |
| `commands/code-simplify.md` | Añadir referencia a refactoring-patterns |
| `commands/ship.md` | Añadir referencias a Extras de SHIP (incluye incident-response) |

### 4.2 Meta-skill (1 archivo)
| Archivo | Cambio |
|---------|--------|
| `skills/using-agent-skills/SKILL.md` | Integrar Extras en el flowchart principal y tabla de fases |

### 4.3 Guías de usuario (2 archivos)
| Archivo | Cambio |
|---------|--------|
| `USER_GUIDE.md` | Mover Skill Extras a las tablas de fase (ya no como bloque separado) |
| `AGENTS_GUIDE.md` | Actualizar si es necesario (referencias cruzadas) |

### 4.4 Skills base (opcional, según necesidad)
| Archivo | Cambio |
|---------|--------|
| `skills/spec-driven-development/SKILL.md` | Referenciar Extras de arquitectura/diseño |
| `skills/incremental-implementation/SKILL.md` | Referenciar solid, error-handling |
| `skills/code-review-and-quality/SKILL.md` | Referenciar solid, design-patterns, error-handling |
| `skills/code-simplification/SKILL.md` | Referenciar refactoring-patterns |
| `skills/frontend-ui-engineering/SKILL.md` | Referenciar ui-ux-design-pro, design-taste-frontend |
| `skills/documentation-and-adrs/SKILL.md` | Referenciar crafting-effective-readmes, architecture-diagrams |

---

## 5. Orden de Ejecución Recomendado

```
Fase 1: Documentación (meta-skill + guías)
  1.1 skills/using-agent-skills/SKILL.md    — Integrar Extras en flowchart
  1.2 USER_GUIDE.md                         — Mover Extras a tablas de fase
  1.3 AGENTS_GUIDE.md                       — Actualizar si es necesario

Fase 2: Comandos (punto de entrada)
  2.1 commands/spec.md                      — Añadir Extras de DEFINE
  2.2 commands/plan.md                      — Añadir Extras de PLAN
  2.3 commands/build.md                     — Añadir Extras de BUILD
  2.4 commands/test.md                      — Añadir Extras de VERIFY
  2.5 commands/review.md                    — Añadir Extras de REVIEW
  2.6 commands/code-simplify.md             — Añadir Extras de REVIEW
  2.7 commands/ship.md                      — Añadir Extras de SHIP

Fase 3: Skills base (referencias profundas)
  3.1 spec-driven-development/SKILL.md      — Referencias a Extras
  3.2 incremental-implementation/SKILL.md   — Referencias a Extras
  3.3 code-review-and-quality/SKILL.md      — Referencias a Extras
  3.4 code-simplification/SKILL.md          — Referencia a refactoring-patterns
  3.5 frontend-ui-engineering/SKILL.md      — Referencias a Extras
  3.6 documentation-and-adrs/SKILL.md       — Referencias a Extras
```

---

## 6. Criterios de Aceptación

- [ ] Cada Extra aparece en al menos una fase del pipeline
- [ ] Cada comando lista los Extras relevantes que puede cargar
- [ ] El meta-skill `using-agent-skills` incluye los Extras en su árbol de decisión principal
- [ ] `USER_GUIDE.md` refleja la nueva distribución (sin bloque "Skill Extras" separado)
- [ ] Los 7 comandos están actualizados con referencias a Extras
- [ ] Ningún Extra queda sin asignación de fase
- [ ] `agent-md-refactor` integrado como PRE-FLIGHT en DEFINE (/spec) con detección >200 líneas
- [ ] `incident-response` integrado en SHIP (/ship) como gestión post-launch + escalación desde debugging
- [ ] Ningún Extra queda fuera del ciclo (todos asignados a una fase o punto de entrada)

---

## 7. Notas sobre Extras específicos

| Skill Extra | Fase | Nota de integración |
|------------|------|-------------------|
| `agent-md-refactor` | DEFINE | PRE-FLIGHT en `/spec`. Si AGENTS.md >200 líneas, se sugiere al usuario refactorizar antes de escribir el spec. No intrusivo: es una sugerencia, no un bloqueo. |
| `incident-response` | SHIP | Gestión post-launch. También escalable desde `debugging-and-error-recovery` (VERIFY): si durante una depuración se detecta que el problema es un incidente en producción con usuarios afectados, se sugiere cargar esta skill. |
| `refactoring-patterns` | REVIEW | Acoplamiento natural con `code-simplification`. Ambos en REVIEW. |
| `design-taste-frontend` | BUILD / REVIEW | Complementa a `frontend-ui-engineering` en BUILD y a `code-review-and-quality` en REVIEW. |
| `crafting-effective-readmes` | DEFINE / SHIP | PRE-FLIGHT en `/spec` (si no hay README) y complemento de `documentation-and-adrs` en SHIP. |
| `architecture-diagrams` | DEFINE / PLAN / SHIP | Transversal: diseñar (DEFINE), visualizar plan (PLAN), documentar (SHIP). |

---

## 8. Riesgos y Mitigaciones

| Riesgo | Mitigación |
|--------|-----------|
| Sobrecarga de referencias en comandos | Usar referencias condicionales ("si aplica, carga X") |
| Confusión sobre cuándo cargar cada Extra | El meta-skill unificado sirve como guía de decisión |
| Duplicación de esfuerzo (misma info en varios sitios) | Una sola fuente de verdad: el meta-skill. Comandos referencian al meta-skill. |
| Inconsistencia entre comandos y skills | Validación cruzada: cada comando debe mencionar lo que su skill principal ya referencia |
