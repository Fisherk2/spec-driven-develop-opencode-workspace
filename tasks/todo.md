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

### Branch 2 — Finalización

- [ ] **BC4** Commit cambios en `feat/agent-permission-hierarchy`
- [ ] **BC5** Fusionar en `develop`: `git checkout develop && git merge feat/agent-permission-hierarchy`
- [ ] **BC6** Eliminar branch local: `git branch -d feat/agent-permission-hierarchy`

---

## Branch 3: `feat/plugin-orchestration`

### Issue #5 — Establecer orquestación de agentes en el plugin

- [ ] **5.1** Leer y entender plugin actual (`sdd-pipeline.ts`) — 371 líneas
- [ ] **5.2** Actualizar `AGENT_DETECT_PATTERNS` para 6 agentes:
  - [ ] 5.2.1 huitzilopochtli: patrón de detección actualizado
  - [ ] 5.2.2 quetzalcoatl: patrón actualizado
  - [ ] 5.2.3 moctezuma: NUEVO patrón
  - [ ] 5.2.4 tlaloc: NUEVO patrón
  - [ ] 5.2.5 mictlantecuhtli: NUEVO patrón
  - [ ] 5.2.6 tezcatlipoca: patrón actualizado
- [ ] **5.3** Actualizar `buildRoleRules()`:
  - [ ] 5.3.1 Huitzilopochtli: "Solo delega. No escribes código ni documentación."
  - [ ] 5.3.2 Quetzalcoatl: "Planeas y diseñas. Delegas documentación. NO escribes código."
  - [ ] 5.3.3 Moctezuma: "Escribes planes y tareas. NO escribes código. NO delegas."
  - [ ] 5.3.4 Tlaloc: "Implementas. Escribes código y documentación. Delega si es necesario."
  - [ ] 5.3.5 Mictlantecuhtli: "Pruebas y validas. Escribes tests. NO delegas."
  - [ ] 5.3.6 Tezcatlipoca: "Revisas y criticas. NO escribes nada. NO delegas."
- [ ] **5.4** Implementar matriz de decisiones de delegación en `tool.execute.before`:
  - [ ] 5.4.1 Huitzilopochtli: bloquear Write/Edit completamente
  - [ ] 5.4.2 Quetzalcoatl: bloquear Write/Edit en extensiones de código (.ts, .js, .py, etc.)
  - [ ] 5.4.3 Moctezuma: bloquear bash (ejecución de código), permitir Write para docs
  - [ ] 5.4.4 Tezcatlipoca: bloquear Write/Edit+Bash completamente
  - [ ] 5.4.5 Mantener restricciones existentes (quetzalcoatl no escribe código, tezcatlipoca no modifica specs)
- [ ] **5.5** (Opcional) Separar en archivos modulares:
  - [ ] 5.5.1 `sdd-agents.ts` — Configuración y detección de agentes
  - [ ] 5.5.2 `sdd-permissions.ts` — Matriz de permisos y restricciones
  - [ ] 5.5.3 `sdd-delegation.ts` — Lógica de decisión de delegación
  - [ ] 5.5.4 `sdd-pipeline.ts` — Plugin principal (importa los módulos)
- [ ] **5.6** Verificar que el plugin compila:
  - [ ] 5.6.1 `cd .opencode && bun install` (si hay nuevas dependencias)
  - [ ] 5.6.2 Verificar typescript sintaxis

### Branch 3 — Finalización

- [ ] **BC7** Commit cambios en `feat/plugin-orchestration`
- [ ] **BC8** Fusionar en `develop`: `git checkout develop && git merge feat/plugin-orchestration`
- [ ] **BC9** Eliminar branch local: `git branch -d feat/plugin-orchestration`

---

## Post-Merge (en develop)

- [ ] **PM1** Verificar que todo está integrado en `develop` (`git log --oneline --graph`)
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
| `feat/agent-permission-hierarchy` | 33/33 tasks | 🔍 En revisión (no mergear) |
| `feat/plugin-orchestration` | 0/21 tasks | ⏳ Pendiente |
| **Total** | **0/79 tasks** | **⏳ Sin iniciar** |
