# Registro de Cambios (Changelog)

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Sin Lanzar]

## [2.0.0] - 2026-05-21

### Importante (Cambios Rupturantes)

Este lanzamiento representa una **reestructuración profunda** de la plataforma:

- **Migración de Claude Code a OpenCode nativo**: Los hooks de Claude Code han sido reemplazados por un plugin SDD Pipeline nativo
- **Eliminación de soporte multi-agente**: Se eliminan configuraciones de Claude Code, Gemini CLI, Copilot, Cursor y Windsurf
- **Reorganización de directorios**: `commands/` ahora reside en la raíz del proyecto (con symlink en `.opencode/commands/`)
- **Documentación unificada**: `AGENTS_GUIDE.md` eliminado y fusionado en `references/orchestration-patterns.md`

### Agregado

#### Nuevo Plugin SDD Pipeline

- `.opencode/plugins/sdd-pipeline.ts` - Lifecycle plugin con 5 hooks nativos de OpenCode:
  - `experimental.chat.system.transform` - Inyecta meta-skill en system prompt
  - `chat.message` - Detecta intención y sugiere comandos
  - `tool.execute.before` - Bloquea comandos destructivos y separa roles
  - `tool.execute.after` - Auditoría de herramientas
  - `experimental.session.compacting` - Re-inyecta meta-skill y persiste estado
- `.opencode/plugins/README.md` - Documentación del plugin
- Migración de `.opencode/` de pnpm a bun (gestor nativo de OpenCode)

#### Nuevas Skills (4 adicionales, total: 33)

- `refactoring-patterns` - Transformaciones de refactorización nombradas
- `error-handling-patterns` - Patrones de manejo de errores (exceptions, Result types, graceful degradation)
- `architecture-diagrams` - Diagramas de arquitectura con Mermaid, PlantUML, C4 model
- `incident-response` - Flujo de respuesta a incidentes (triage, comunicación, postmortem)

#### Nuevas Referencias Técnicas (16+ documentos)

**Arquitectura (9+ documentos):**
- `references/arch-c4-context-diagram.md` - Diagrama de contexto C4
- `references/arch-class-diagram.md` - Diagrama de clases
- `references/arch-component-diagram.md` / `arch-component-diagram-2.md` - Diagramas de componentes
- `references/arch-data-flow-diagram.md` - Diagrama de flujo de datos
- `references/arch-deployment-diagram.md` / `arch-deployment-diagram-2.md` - Diagramas de despliegue
- `references/arch-migration-template.sql` - Template de migración SQL
- `references/arch-sequence-diagram.md` - Diagrama de secuencia
- `references/arch-system-architecture-diagram.md` - Diagrama de arquitectura de sistema
- `references/arch-validate-schema.sh` - Script de validación de esquemas

**Refactoring (5+ documentos):**
- `references/refactoring-smell-catalog.md` - Catálogo de code smells
- `references/refactoring-composing-methods.md` - Composición de métodos
- `references/refactoring-moving-features.md` - Movimiento entre objetos
- `references/refactoring-organizing-data.md` - Organización de datos
- `references/refactoring-simplifying-conditionals.md` - Simplificación de condicionales
- `references/refactoring-workflow.md` - Flujo de trabajo de refactorización

#### Nuevo Agente Especialista

- `agents/implement.md` - Agente de implementación con restricción de confidencialidad de contenido

#### Nuevos Directorios

- `commands/` - Comandos custom en la raíz del proyecto (con symlink desde `.opencode/commands/`)
- `tasks/` - Directorio con `todo.md` y `plan.md` para el comando `/plan`

#### Infraestructura

- `.opencode/bun.lock` - Lock file de bun para gestor de paquetes
- `.gitignore` - Añadidos archivos de estado del pipeline SDD

### Cambiado

#### Documentación Principal

- `README.md` - Reestructuración completa:
  - Propuesta de valor clara en la descripción
  - Nueva sección de Características (30+ skills, 7 comandos, 5 agentes)
  - Prerrequisitos (Node.js >= 18, pnpm, OpenCode IDE, Git)
  - Quick Start de 5 pasos copy-pasteables
  - Migración de npm a pnpm
  - Bug fix en diagrama Mermaid (nodo G suelto eliminado)
  - Nuevas secciones: Estructura del Proyecto, Configuración, Troubleshooting
- `USER_GUIDE.md` - Reestructuración mayor (615 → 408 líneas):
  - Progresión piramidal: Quick Start → Comandos → Skills → Agentes → Tareas → Referencia
  - Eliminación de duplicación de skills (cada skill aparece una vez en su fase primaria)
  - Skills cross-phase usan nota corta + enlace a entrada canónica
  - Nueva sección Common Tasks (crear skills, agentes, Context7)
  - Eliminación de referencias a 'Skill Extra' y guías de otros agentes IA
  - Deduplicación bidireccional con opencode-setup.md y skill-anatomy.md

#### Meta-Skill y Comandos

- `skills/using-agent-skills/SKILL.md` - Integración de 12 Skill Extras en flowchart y Quick Reference
- **7 comandos actualizados** (`spec`, `plan`, `build`, `test`, `review`, `code-simplify`, `ship`):
  - Eliminado parámetro `model` fijo para flexibilidad
  - Agentes cambiados según el flujo (analysis/implement según corresponda)
  - Añadidas referencias a Skill Extras según su fase

#### Skills Base (8 actualizados)

- `spec-driven-development`, `incremental-implementation`, `frontend-ui-engineering`
- `debugging-and-error-recovery`, `code-review-and-quality`, `code-simplification`
- `documentation-and-adrs`, `shipping-and-launch`
- Formato de referencias mejorado (sin backticks en @skills/)
- Añadidas referencias profundas a Skill Extras correspondientes

#### Documentación de Agentes

- `AGENTS.md` - Limpiado (meta-skill ahora lo inyecta el plugin SDD)
- `agents/analysis.md` - Refactorizado como complemento del flujo analysis → implement
- `references/orchestration-patterns.md` - AGENTS_GUIDE.md fusionado, secciones Claude Code eliminadas
- `CONTRIBUTING.md` - Añadida sección de Referencias y registro del agente implement
- `docs/ai-agent-setup/opencode-setup.md` - Mejorado con referencias al meta-skill
- `docs/ai-agent-setup/skill-anatomy.md` - Añadidas referencias a meta-skill y USER_GUIDE.md

#### Enlaces y Referencias

- **42 enlaces internos corregidos** en 12 archivos `.md` (rutas a `references/`, `agents/`, URLs oficiales)
- Enlaces de `references/` actualizados (CHEATSHEET, art-of-readme, standard-readme, etc.)
- Enlaces en skills de clean-code, clean-ddd-hexagonal, crafting-effective-readmes, solid

### Removido

- `hooks/` - Directorio completo de hooks de Claude Code (7 archivos):
  - `hooks.json`, `SDD-CACHE.md`, `SIMPLIFY-IGNORE.md`
  - `sdd-cache-post.sh`, `sdd-cache-pre.sh`, `session-start.sh`
  - `simplify-ignore-test.sh`, `simplify-ignore.sh`
- `.claude/commands/` - 7 comandos de Claude Code
- `.claude-plugin/` - Plugin de Claude Code (marketplace.json, plugin.json)
- `.gemini/commands/` - 7 comandos de Gemini CLI
- `CLAUDE.md` - Placeholder de Claude Code
- `.github/workflows/test-plugin-install.yml` - CI de Claude Code
- `AGENTS_GUIDE.md` - Fusionado en `references/orchestration-patterns.md`
- `docs/ai-agent-setup/` - Guías de otros agentes (5 archivos):
  - `copilot-setup.md`, `cursor-setup.md`, `gemini-cli-setup.md`
  - `windsurf-setup.md`, `getting-started.md`
- `docs/ai-agent-setup/prompt-anatomy.md` - Sección CI/CD eliminada (no relevante)

### Corregido

- `skills-lock.json` - 3 `skillPath` erróneos corregidos
- `skills/incident-response/SKILL.md` - Enlace roto reparado
- Formato de referencias a skills en 7 comandos y 8 skills base (backticks eliminados)
- Término 'Skill Extra' eliminado de `USER_GUIDE.md` (reemplazado por referencias por fase)
- `LICENSE` y `README.md` - Error de tipado corregido
- Diagrama Mermaid en `README.md` - Nodo G suelto eliminado
- 42 enlaces internos rotos en 12 archivos `.md`

## [1.2.1] - 2026-05-13

### Corregido

- `USER_GUIDE.md` - Corrige hipervínculo de un archivo inexistente

## [1.2.0] - 2026-05-13

### Agregado

#### Nuevas Skills de UI/UX (2 skills + 13 referencias + CLI tool)

**Skills:**
- `ui-ux-design-pro` - Skill senior de diseño UI/UX para interfaces premium production
- `design-taste-frontend` - Skill de UI/UX Engineer senior

**Referencias Técnicas (13 documentos):**
- `references/accessibility.md` - Accesibilidad WCAG 2.1 AA
- `references/animation-and-motion.md` - Animaciones y movimiento
- `references/cognitive-principles.md` - Principios cognitivos
- `references/color-system.md` - Sistema de colores
- `references/component-patterns.md` - Patrones de componentes
- `references/critique-protocol.md` - Protocolo de crítica
- `references/depth-and-elevation.md` - Profundidad y elevación
- `references/design-directions.md` - Direcciones de diseño
- `references/icon-patterns.md` - Patrones de iconos
- `references/real-world-patterns.md` - Patrones del mundo real
- `references/spacing-and-layout.md` - Espaciado y layout
- `references/token-architecture.md` - Arquitectura de tokens
- `references/typography.md` - Tipografía

**CLI Tool Integrado:**
- `skills/ui-ux-design-pro/cli/` - Herramienta CLI con comandos:
  - `audit` - Auditoría de interfaces
  - `generate` - Generación de componentes
  - `icons` - Búsqueda de iconos
  - `search` - Búsqueda de patrones de diseño
- 40+ archivos CSV con patrones de diseño y stacks tecnológicos
- Casos de prueba para fintech y SaaS

**Agente de Análisis Mejorado:**
- Integración robusta de Context7 para fetch de documentación
- Cuestionario refinado antes del modo build
- Optimización de carga de tokens en sesiones
- Pregunta de actualización de documentación tras modo build

### Cambiado

- `CONTRIBUTING.md` - Añadido paso para actualizar documentación al añadir o eliminar skills
- Documentación de skills - Actualizado conteo de skills disponibles (29 total)
- Tabla de agentes en reglas de contribución - Actualizada

### Corregido

- Hipervínculos que no apuntaban a ningún destino del proyecto

## [1.1.2] - 2026-05-12

### Agregado

- `docs/` - Corrección de hipervínculos referenciales a ficheros del proyecto y adición de tabla de contenidos (ToC) a la guía de usuarios.

### Corregido

- `docs/` - Arreglos en la guía de cómo redactar un prompt para agentes IA (mejora de claridad y consistencia).

## [1.1.1] - 2026-05-12

### Agregado

- `agents/analysis.md` - Establece pautas restrictivas para prevenir la invocación de la herramienta `edit`:
  - Sección `TOOL RESTRICTIONS (ENFORCED)` con tabla de herramientas prohibidas
  - Directrices en `ROLE & DIRECTIVE` que refuerzan el "ANALYSIS MODE"
  - Ejemplo práctico de respuesta ante solicitudes de construcción
  - Reglas de interacción actualizadas (Edit/Write/Patch → proveer plan)

### Corregido

- `specs/design/DESING.md` - Corrige nombre del fichero (estaba escrito como `DESING.md`)

## [1.1.0] - 2026-05-11

### Agregado

#### Nuevos Skills (6 adicionales, total: 27)

**Arquitectura y Diseño:**
- `clean-ddd-hexagonal` - Clean Architecture + DDD + Hexagonal para backend services
- `design-patterns` - 20+ patrones de diseño documentados (Adapter, Builder, Command, Composite, Decorator, DTO, Facade, Factory, Identity-Map, Lazy-Load, Mediator, Observer, Proxy, Repository, Service-Layer, State, Strategy, Template-Method, Unit-of-Work, Chain-of-Responsibility)
- `solid` - Principios SOLID aplicados al desarrollo profesional
- `bash-defensive-patterns` - Patrones defensivos para scripts en Bash production-grade
- `crafting-effective-readmes` - Creación de READMEs efectivos con templates (OSS, internal, personal)
- `agent-md-refactor` - Refactorización de AGENTS.md siguiendo progressive disclosure

#### Nuevas Referencias Técnicas (20+ documentos)

**Código Limpio:**
- `code-smells.md` - Catálogo de code smells
- `comments-formatting.md` - Disciplina de comentarios y formato
- `error-handling.md` - Patrones de manejo de errores
- `functions-and-methods.md` - Diseño de funciones pequeñas
- `naming-conventions.md` - Convenciones de nomenclatura
- `testing-principles.md` - Principios de testing

**Arquitectura:**
- `architecture.md` - Principios arquitectónicos
- `complexity.md` - Gestión de complejidad
- `object-design.md` - Diseño orientado a objetos
- `solid-principles.md` - Referencia completa SOLID
- `tdd.md` - Test-Driven Development

**DDD y Patrones Arquitectónicos:**
- `CHEATSHEET.md` - Referencia rápida DDD
- `CQRS-EVENTS.md` - CQRS y Domain Events
- `DDD-STRATEGIC.md` - Strategic DDD (Bounded Contexts, Ubiquitous Language)
- `DDD-TACTICAL.md` - Tactical DDD (Aggregates, Value Objects, Repositories)
- `HEXAGONAL.md` - Arquitectura Hexagonal (Ports & Adapters)
- `LAYERS.md` - Arquitectura en Capas
- `TESTING.md` - Estrategias de testing en DDD

**READMEs:**
- `art-of-readme.md` - El arte de hacer README
- `make-a-readme.md` - Guía práctica de READMEs
- `standard-readme-spec.md` - Especificación Standard README
- `standard-readme-example-maximal.md` - Ejemplo completo
- `standard-readme-example-minimal.md` - Ejemplo mínimo

#### Nuevo Agente Especialista

- `analysis` - Agente de análisis con modo `ask-user-question` para diagnosticar y resolver problemas técnicos

#### Archivos de Proyecto Base

- `.env.example` - Plantilla de variables de entorno
- `.gitmessage` - Plantilla para mensajes de commit
- `Dockerfile` - Configuración Docker base
- `docker-compose.yml` - Orquestación de contenedores
- `Makefile` - Comandos make para automatización
- `WORKFLOW.md` - Documentación del flujo de trabajo
- `requirements.txt` - Dependencias Python base
- `scripts/build.sh` - Script de build
- `scripts/lint.sh` - Script de linting
- `scripts/setup.sh` - Script de setup inicial
- `scripts/test.sh` - Script de testing
- `docs/API_REFERENCE.md` - Referencia de API
- `docs/ARCHITECTURE.md` - Documentación arquitectónica
- `docs/SETUP.md` - Guía de configuración
- `specs/design/DESING.md` - Especificaciones de diseño
- `specs/design/components.md` - Documentación de componentes
- `specs/design/style-guide.md` - Guía de estilos
- `specs/design/user-flow.md` - Flujos de usuario

#### Expansión de .gitignore

Nuevas secciones agregadas al `.gitignore`:

- **Docker y Contenedores:** `.docker/`, `docker-compose.override.yml`, `*.kubeconfig`
- **Lenguajes Adicionales:** Go (vendor/), Rust (target/), Java/Maven (target/, .mvn/), Ruby (vendor/bundle/)
- **Frameworks Web:** Next.js (.next/), Vite/Webpack (dist/), Laravel (storage/*.key), Django (*.pot, *.mo)
- **Cloud e Infraestructura:** AWS (.aws/credentials), SSH (*.pem, *.key), GCP (service-account*.json), Terraform (*.tfstate, .terraform/)
- **Testing y Coverage:** `.nyc_output/`, `lcov.info`, `junit/`, `allure-results/`
- **Entornos Locales:** `local.properties`, `local.gradle`, `*.local`, `*.override`

### Cambiado

- `USER_GUIDE.md` - Actualizada con información sobre skills adicionales y flujo de invocación
- `AGENTS_GUIDE.md` → `references/orchestration-patterns.md` - Actualizada según guía de contribución con agente de análisis (luego fusionada en orchestration-patterns.md)
- `skills/using-agent-skills/SKILL.md` - Mejorada la detección contextual de skills
- Skills existentes (6) - Modificados para seguir lineamientos de la guía de contribución:
  - `agent-md-refactor`, `bash-defensive-patterns`, `clean-ddd-hexagonal`
  - `crafting-effective-readmes`, `design-patterns`, `solid`
- Árbol de archivos del proyecto - Establecida estructura definitiva de directorios
- `AGENTS.md` - Añadida referencia a skills disponibles

### Removido

- `skills/e2e-testing-patterns` - Eliminado (ya existe skill específica para TDD: `test-driven-development`)

### Corregido

- (ninguno en esta versión)

## [1.0.0] - 2026-05-09

### Agregado

#### Skills de Desarrollo (21 en total)

**Fase Definir:**
- `idea-refine` - Pensamiento divergente/convergente para explorar ideas
- `spec-driven-development` - Creación de especificaciones antes de codificar

**Fase Planear:**
- `planning-and-task-breakdown` - Descomposición en tareas verificables

**Fase Construir:**
- `incremental-implementation` - Implementación en slices verticales
- `test-driven-development` - Red-Green-Refactor con test pyramid
- `context-engineering` - Optimización del contexto del agente
- `source-driven-development` - Decisiones basadas en documentación oficial
- `frontend-ui-engineering` - Componentes production-quality
- `api-and-interface-design` - Contrato primero, Hyrum's Law

**Fase Verificar:**
- `browser-testing-with-devtools` - Chrome DevTools MCP para debugging
- `debugging-and-error-recovery` - Triage de 5 pasos

**Fase Revisar:**
- `code-review-and-quality` - Revisión de 5 ejes
- `code-simplification` - Claridad sobre complejidad
- `security-and-hardening` - OWASP Top 10 prevention
- `performance-optimization` - Core Web Vitals

**Fase Lanzar:**
- `git-workflow-and-versioning` - Trunk-based development
- `ci-cd-and-automation` - Shift Left, quality gates
- `deprecation-and-migration` - Code-as-liability mindset
- `documentation-and-adrs` - Registros de decisiones arquitectónicas
- `shipping-and-launch` - Pre-launch checklists

**Meta-skill:**
- `using-agent-skills` - Descubrimiento e invocación de skills

#### Comandos Personalizados

- **`/spec`** - Crear especificaciones
- **`/plan`** - Planificar implementación
- **`/build`** - Construir incrementalmente
- **`/test`** - Ejecutar pruebas
- **`/review`** - Revisión de calidad
- **`/code-simplify`** - Simplificar código
- **`/ship`** - Lanzar a producción

#### Agentes Especialistas

- `code-reviewer` - Senior Staff Engineer
- `test-engineer` - QA Specialist
- `security-auditor` - Security Engineer

#### Herramientas de la Plantilla

- **Context7** - Fetch de documentación actualizada para librerías/frameworks

#### Documentación

- `README.md` - Guía rápida con diagrama Mermaid
- `USER_GUIDE.md` - Referencia completa de 21 skills
- `AGENTS_GUIDE.md` → `references/orchestration-patterns.md` - Personas de agentes y orquestación (luego fusionada en orchestration-patterns.md)
- `CONTRIBUTING.md` - Directrices de contribución (Español)
- `skill-anatomy.md` - Anatomía y formato de skills
- `opencode-setup.md` - Configuración específica de OpenCode

#### Referencias

- `testing-patterns.md` - Patrones de testing
- `security-checklist.md` - OWASP Top 10
- `performance-checklist.md` - Core Web Vitals
- `accessibility-checklist.md` - WCAG 2.1 AA
- `orchestration-patterns.md` - Patrones de orquestación

### Cambiado

- Reorganización de estructura de directorios
- Consistencia en formato de documentación

### Deprecado

- (ninguno en esta versión inicial)

### Removido

- (ninguno en esta versión inicial)

### Corregido

- (ninguno en esta versión inicial)

### Seguridad

- SKILL.md de `security-and-hardening` incluye OWASP Top 10 prevention
- Principios de menor privilegio en configuración de agentes
- Validación de entrada en workflows de skills

---

## Información del Proyecto

### Repositorio
- **Nombre**: Plantilla Dev AI
- **Descripción**: Espacio de trabajo nativo para OpenCode con metodología Spec-Driven Development, 33 skills integradas, 5 agentes especialistas y pipeline SDD automatizado
- **Repositorio**: https://github.com/Fisherk2/plantilla-dev-ai
- **Licencia**: MIT License

### Stack Tecnológico
- **Plataforma**: OpenCode Agentic Workspace
- **Pipeline**: SDD Pipeline Plugin (5 hooks nativos de OpenCode)
- **Skills**: 33 skills de desarrollo profesional
- **Agentes**: 5 especialistas (analysis, implement, code-reviewer, test-engineer, security-auditor)
- **Documentación**: Context7 para APIs actualizadas · Markdown con diagramas Mermaid
- **Gestión de paquetes**: Bun (`.opencode/`)
- **Control de Versiones**: Git

### Documentación Relacionada

- **[README.md](README.md)** - Guía rápida y flujo de trabajo
- **[USER_GUIDE.md](USER_GUIDE.md)** - Referencia completa de 33 skills
- **[references/orchestration-patterns.md](references/orchestration-patterns.md)** - Agentes y orquestación (AGENTS_GUIDE.md fusionado)
- **[skills/using-agent-skills/SKILL.md](skills/using-agent-skills/SKILL.md)** - Meta-skill orquestador: descubrimiento e invocación de skills
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Directrices de contribución

### Instrucciones de Actualización

#### Desde Versiones Anteriores

**Al actualizar desde 1.x.x a 2.0.0:**

1. **Migración de Claude Code a OpenCode**: Los hooks de Claude Code (`hooks/`) ya no funcionan. Han sido reemplazados por el plugin SDD Pipeline nativo (`.opencode/plugins/sdd-pipeline.ts`). Elimina cualquier referencia a `hooks/` en tu configuración.
2. **Comandos reubicados**: Los comandos ahora residen en `commands/` (raíz del proyecto). Si usabas rutas absolutas a `.opencode/commands/`, actualízalas.
3. **Guías de setup eliminadas**: Las guías para Copilot, Cursor, Gemini CLI y Windsurf ya no están disponibles. Este proyecto es exclusivo para OpenCode.
4. **Documentación unificada**: `AGENTS_GUIDE.md` ya no existe. Su contenido está en `references/orchestration-patterns.md`.
5. **Nuevo gestor de paquetes**: `.opencode/` migró de pnpm a bun. Ejecuta `bun install` en `.opencode/` si usas el plugin SDD.
6. **Nuevos agentes**: El flujo `analysis → implement` reemplaza al antiguo agente único de construcción.

#### Para Versiones Futuras
Al actualizar desde 2.0.0 a versiones futuras:

1. **Revisa el CHANGELOG** para cambios rupturantes
2. **Ejecuta lint/typecheck** después de actualizar skills
3. **Verifica comandos personalizados** en tu configuración de OpenCode
4. **Revisa nuevas integraciones** en la documentación del proyecto

### Contribuyendo al CHANGELOG

Al contribuir a este proyecto:

1. **Agrega entradas** a la sección `[Sin Lanzar]`
2. **Sigue versionado semántico** para cambios rupturantes
3. **Usa categorías apropiadas** (Agregado, Cambiado, Deprecado, Removido, Corregido, Seguridad)
4. **Incluye fechas** en formato `YYYY-MM-DD`
5. **Proporciona descripciones claras** explicando el impacto de los cambios
6. **Agrupa por fase** (Definir, Planear, Construir, Verificar, Revisar, Lanzar)
7. **Referencia issues relacionados** o pull requests cuando aplique

### Por Qué Este CHANGELOG Importa

Este CHANGELOG sirve como documentación viva que:

- **Rastrea la evolución** de la plantilla de desarrollo asistido por IA
- **Comunica cambios** a usuarios y contribuyentes
- **Proporciona guía de actualización** para lanzamientos futuros
- **Documenta decisiones arquitectónicas** y su racional
- **Habilita procesos de lanzamiento automatizados** con seguimiento estructurado de cambios