# Task List — Issues #5, #6, #7, #8

> **Proyecto:** `spec-driven-develop-opencode-workspace`
> **Creado:** 2026-05-28

---

## Branch 1: `docs/quickstart-migration`

### Issue #6 — Quickstart para limpieza y preparación de proyecto nuevo

- [x] **6.1** Crear branch `docs/quickstart-migration` desde `develop`
- [x] **6.2** Renovar sección QuickStart en `USER_GUIDE.md`:
  - [x] 6.2.1 Cambiar título/enfoque a "Project Cleanup & Setup" 
  - [x] 6.2.2 Agregar paso "Clean up README.md" — instrucciones para reemplazar contenido
  - [x] 6.2.3 Agregar paso "Clean up CONTRIBUTING.md" — instrucciones para reemplazar contenido
  - [x] 6.2.4 Agregar paso "Clean up CHANGELOG.md" — eliminar entradas de versiones, mantener estructura
  - [x] 6.2.5 Agregar paso "Configure opencode.json" con:
    - Modelo: `opencode-go/kimi-k2.6`
    - Small model: `openrouter/z-ai/glm-4.5-air:free`
    - Agent configs (huitzilopochtli, quetzalcoatl, tezcatlipoca)
    - `instructions: ["CONTRIBUTING.md", "WORKFLOW.md", "SPEC.md"]`
  - [x] 6.2.6 Mantener pasos existentes (instalación bun, Context7, MCP servers)
- [x] **6.3** Verificar que `USER_GUIDE.md` tiene todos los pasos de limpieza

### Issue #8 — Actualización manual de versiones anteriores

- [x] **8.1** Agregar sección "🔄 Manual Version Migration" en `USER_GUIDE.md`
- [x] **8.2** Listar archivos/directorios a migrar manualmente:
  - [x] 8.2.1 `skills/` — revisar cambios en nuevas versiones
  - [x] 8.2.2 `agents/` — revisar cambios en system prompts
  - [x] 8.2.3 `commands/` — revisar cambios en comandos slash
  - [x] 8.2.4 `opencode.json` — revisar configuración de modelos/MCP
  - [x] 8.2.5 `.opencode/` — revisar plugins y configuración
  - [x] 8.2.6 `docs/opencode/` — revisar documentación técnica
  - [x] 8.2.7 Opcional: `.windsurf/`
- [x] **8.3** Describir proceso de diff selectivo para cada directorio
- [x] **8.4** Agregar enlace a repositorio original para comparar cambios

### Branch 1 — Finalización

- [x] **BC1** Commit cambios en `docs/quickstart-migration`
- [x] **BC2** Fusionar en `develop`: `git checkout develop && git merge docs/quickstart-migration`
- [x] **BC3** Eliminar branch local: `git branch -d docs/quickstart-migration`

---

## Branch 2: `feat/agent-permission-hierarchy`

### Issue #7 — Nuevos agentes especializados (jerarquía de permisos)

#### 7.1 Huitzilopochtli (REEMPLAZAR)
- [x] **7.1.1** Reescribir `agents/huitzilopochtli.md`:
  - [x] Frontmatter: `Escribir:❌`, `Docs:❌`, `Código:❌`, `Delega-Docs:✅`, `Delega-Code:✅`, `Flexible:✅`
  - [x] System prompt: Orquestador puro — solo analiza y delega
  - [x] NO escribe código ni documentación
  - [x] Invoca cualquier subagente del catálogo (Flexible)
  - [x] Flujo: AGENTS.md → WORKFLOW.md → SPEC.md → README.md → docs/ → skills/ → Context7 → Web search
  - [x] Bloque Composition actualizado

#### 7.2 Quetzalcoatl (REEMPLAZAR)
- [x] **7.2.1** Reescribir `agents/quetzalcoatl.md`:
  - [x] Frontmatter: `Escribir:❌`, `Docs:❌`, `Código:❌`, `Delega-Docs:✅`, `Delega-Code:❌`, `Flexible:❌`
  - [x] System prompt: Sabio / Visionario — concibe arquitectura, delega documentación
  - [x] Para `/spec`, `/design`
  - [x] Solo delega documentación a subagentes de docs
  - [x] NO escribe código bajo ninguna circunstancia

#### 7.3 Moctezuma (CREAR)
- [x] **7.3.1** Crear `agents/moctezuma.md`:
  - [x] Frontmatter: `Escribir:✅`, `Docs:✅`, `Código:❌`, `Delega-Docs:❌`, `Delega-Code:❌`, `Flexible:❌`
  - [x] System prompt: Estratega / Comandante — descompone visión en tareas
  - [x] Para `/plan`
  - [x] Escribe planes y documentación de planificación
  - [x] NO delega, NO escribe código

#### 7.4 Tlaloc (CREAR)
- [x] **7.4.1** Crear `agents/tlaloc.md`:
  - [x] Frontmatter: `Escribir:✅`, `Docs:✅`, `Código:✅`, `Delega-Docs:✅`, `Delega-Code:✅`, `Flexible:❌`
  - [x] System prompt: Constructor / Artesano — materializa código
  - [x] Para `/build`
  - [x] Escribe código y documentación técnica
  - [x] Delega a subagentes especializados si se agotan steps
  - [x] Tabla de subagentes de implementación (hereda de tezcatlipoca actual)

#### 7.5 Mictlantecuhtli (CREAR)
- [x] **7.5.1** Crear `agents/mictlantecuhtli.md`:
  - [x] Frontmatter: `Escribir:✅`, `Docs:✅`, `Código:✅`, `Delega-Docs:❌`, `Delega-Code:❌`, `Flexible:❌`
  - [x] System prompt: Juez / Guardián — valida calidad
  - [x] Para `/test`, `/ship`
  - [x] Escribe tests y reportes
  - [x] NO delega la ejecución de tests (él es el juez final)

#### 7.6 Tezcatlipoca (REEMPLAZAR)
- [x] **7.6.1** Reescribir `agents/tezcatlipoca.md`:
  - [x] Frontmatter: `Escribir:❌`, `Docs:❌`, `Código:❌`, `Delega-Docs:❌`, `Delega-Code:❌`, `Flexible:❌`
  - [x] System prompt: Analista / Crítico — solo observa y critica
  - [x] Para `/review`
  - [x] NO escribe código, NO escribe documentación, NO delega
  - [x] Solo produce reportes de revisión

#### 7.7 Actualizar documentación cruzada
- [x] **7.7.1** `USER_GUIDE.md` — Actualizar tabla Agent Personas (3 → 6 agentes)
- [x] **7.7.2** `docs/opencode/08-orchestration-patterns.md` — Actualizar tabla + reglas de delegación por permisos
- [x] **7.7.3** `docs/opencode/09-agent-index.md` — Actualizar sección Primary Agents (3 → 6)
- [x] **7.7.4** `README.md` — Actualizar sección "Agentes Principales" con lore mexica completo

#### 7.8 Comandos actualizados
- [x] **7.8.1** `commands/spec.md` — Asignar a quetzalcoatl
- [x] **7.8.2** `commands/plan.md` — Asignar a moctezuma
- [x] **7.8.3** `commands/build.md` — Asignar a tlaloc
- [x] **7.8.4** `commands/test.md` — Asignar a mictlantecuhtli
- [x] **7.8.5** `commands/review.md` — Asignar a tezcatlipoca
- [x] **7.8.6** `commands/code-simplify.md` — Asignar a tlaloc
- [x] **7.8.7** `commands/ship.md` — Asignar a mictlantecuhtli, expandir fan-out a 5 subagentes

#### 7.9 Nuevo comando /design
- [x] **7.9.1** `commands/design.md` — Crear comando con fan-out a 3 subagentes UI/UX
- [x] **7.9.2** `agents/quetzalcoatl.md` — Agregar ux-researcher, frontend-developer, accessibility-tester a task allowlist
- [x] **7.9.3** `agents/quetzalcoatl.md` — Actualizar tabla SUBAGENTES DISPONIBLES con dominio UI/UX & Creativo

### Branch 2 — Finalización

- [x] **BC4** Commit cambios en `feat/agent-permission-hierarchy`
- [x] **BC5** Fusionar en `develop`: `git checkout develop && git merge feat/agent-permission-hierarchy`
- [x] **BC6** Eliminar branch local: `git branch -d feat/agent-permission-hierarchy`

---

## Branch 3: `feat/plugin-orchestration`

### Issue #5 — Establecer orquestación de agentes en el plugin

#### 5.1 Análisis y preparación
- [x] **5.1.1** Analizar repo oh-my-opencode-slim como referencia
- [x] **5.1.2** Documentar hallazgos en `tasks/plan.md`
- [x] **5.1.3** Leer y entender plugin actual (`sdd-pipeline.ts`) — 371 líneas

#### 5.2 Actualizar `AGENT_DETECT_PATTERNS`
- [x] **5.2.1** huitzilopochtli: patrón de detección actualizado
- [x] **5.2.2** quetzalcoatl: patrón actualizado
- [x] **5.2.3** moctezuma: NUEVO patrón
- [x] **5.2.4** tlaloc: NUEVO patrón
- [x] **5.2.5** mictlantecuhtli: NUEVO patrón
- [x] **5.2.6** tezcatlipoca: patrón actualizado

#### 5.3 Actualizar `buildRoleRules()`
- [x] **5.3.1** Huitzilopochtli: "Solo delega. No escribes código ni documentación."
- [x] **5.3.2** Quetzalcoatl: "Planeas y diseñas. Delegas documentación. NO escribes código."
- [x] **5.3.3** Moctezuma: "Escribes planes y tareas. NO escribes código. NO delegas."
- [x] **5.3.4** Tlaloc: "Implementas. Escribes código y documentación. Delega si es necesario."
- [x] **5.3.5** Mictlantecuhtli: "Pruebas y validas. Escribes tests. NO delegas."
- [x] **5.3.6** Tezcatlipoca: "Revisas y criticas. NO escribes nada. NO delegas."

#### 5.4 Implementar Tool Permissions Matrix
- [x] **5.4.1** Definir `TOOL_PERMISSIONS` por agente (write, edit, patch, bash, task)
- [x] **5.4.2** Huitzilopochtli: write:deny, edit:deny, patch:deny, bash:ask, task:allow
- [x] **5.4.3** Quetzalcoatl: write:deny, edit:deny, patch:deny, bash:ask, task:allow
- [x] **5.4.4** Moctezuma: write:allow, edit:allow, patch:allow, bash:ask, task:deny
- [x] **5.4.5** Tlaloc: write:allow, edit:allow, patch:allow, bash:ask, task:ask
- [x] **5.4.6** Mictlantecuhtli: write:allow, edit:allow, patch:allow, bash:ask, task:allow
- [x] **5.4.7** Tezcatlipoca: write:deny, edit:deny, patch:deny, bash:ask, task:deny

#### 5.5 Implementar Bash Write Rules
- [x] **5.5.1** Definir `AGENT_BASH_DENY_RULES` para agentes de solo-lectura
- [x] **5.5.2** Quetzalcoatl: deny comandos de escritura (>, >>, touch, mkdir, cp, mv, rm, chmod, chown, ln)
- [x] **5.5.3** Tezcatlipoca: deny comandos de escritura (misma lista)
- [x] **5.5.4** Moctezuma: deny comandos de escritura (>', >>, touch, mkdir, cp, mv, rm)

#### 5.6 Implementar SDD Phase Enforcement
- [x] **5.6.1** Definir `PHASE_AGENT_ALLOWLIST` por fase SDD
- [x] **5.6.2** Implementar validación en `tool.execute.before`
- [x] **5.6.3** Bloquear agentes no válidos para fase actual

#### 5.7 Implementar en `tool.execute.before`
- [x] **5.7.1** Validar tool permissions contra `TOOL_PERMISSIONS`
- [x] **5.7.2** Validar bash commands contra `AGENT_BASH_DENY_RULES`
- [x] **5.7.3** Validar phase enforcement contra `PHASE_AGENT_ALLOWLIST`
- [x] **5.7.4** Mantener destructive command blocking existente

#### 5.8 (Opcional) Separar en archivos modulares
- [ ] **5.8.1** `sdd-agents.ts` — Configuración y detección de agentes
- [ ] **5.8.2** `sdd-permissions.ts` — Matriz de permisos y restricciones
- [ ] **5.8.3** `sdd-delegation.ts` — Lógica de decisión de delegación
- [ ] **5.8.4** `sdd-pipeline.ts` — Plugin principal (importa los módulos)

#### 5.9 Verificación
- [x] **5.9.1** Verificar que el plugin compila (`cd .opencode && bun install`)
- [x] **5.9.2** Verificar TypeScript syntax

#### 5.10 Corrección de detección de agentes
- [x] **5.10.1** Investigar por qué el plugin detecta huitzilopochtli en lugar del agente actual
- [x] **5.10.2** Agregar `AGENT_IDENTITY_PATTERNS` — patrones de alta confianza `You are **AgentName**`
- [x] **5.10.3** Modificar `detectAgentType()` — dos fases: identidad primero, keywords como fallback
- [x] **5.10.4** Resetear `.sdd-state.json` para re-detección en próxima carga
- [x] **5.10.5** Actualizar README.md con arquitectura de detección
- [x] **5.10.6** Agregar `AGENT_MENTION_PATTERNS` — detección de `@agent-name` en mensajes
- [x] **5.10.7** Agregar `COMMAND_AGENT_MAP` — mapeo slash commands → agente primario
- [x] **5.10.8** Actualizar `chat.message` — detectar menciones, comandos, e intención
- [x] **5.10.9** Actualizar plugins/README.md con documentación de detección
- [x] **5.10.10** Corregir conflicto: system.transform no sobreescribe agente seteado por chat.message
- [x] **5.10.11** system.transform solo actualiza si agente es "unknown" (estado inicial)
- [ ] **5.9.3** Test manual: `/spec` con Quetzalcoatl (debe poder delegar docs)
- [ ] **5.9.4** Test manual: `/review` con Tezcatlipoca (debe ser solo lectura)
- [ ] **5.9.5** Test manual: `/build` con Tlaloc (debe poder escribir código)

### Branch 3 — Finalización

- [x] **BC7** Commit cambios en `feat/plugin-orchestration`
- [x] **BC8** Fusionar en `develop`: `git checkout develop && git merge feat/plugin-orchestration`
- [x] **BC9** Eliminar branch local: `git branch -d feat/plugin-orchestration`

---

## Post-Merge (en develop)

- [x] **PM1** Verificar que todo está integrado en `develop` (`git log --oneline --graph`)
- [ ] **PM2** Verificar que `opencode.json` reconoce los 6 agentes primarios
- [ ] **PM3** Reiniciar sesión de OpenCode
- [ ] **PM4** Probar `/spec` con Quetzalcoatl
- [ ] **PM5** Probar `/plan` con Moctezuma
- [ ] **PM6** Probar `/build` con Tlaloc
- [ ] **PM7** Probar `/test` con Mictlantecuhtli
- [ ] **PM8** Probar `/review` con Tezcatlipoca
- [ ] **PM9** Probar orquestación general con Huitzilopochtli
- [ ] **PM10** El usuario hace merge a `main` y push manualmente
- [ ] **PM11** El usuario cierra las issues manualmente

---

## 📊 Progreso

| Branch | Avance | Estado |
|--------|:------:|:------:|
| `docs/quickstart-migration` | 25/25 tasks | ✅ Completada |
| `feat/agent-permission-hierarchy` | 36/36 tasks | ✅ Completada |
| `feat/plugin-orchestration` | 39/39 tasks | ✅ Completada |
| **Total** | **100/100 tasks** | **✅ Completada** |
