# Registro de Cambios (Changelog)

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Sin Lanzar]

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
- `AGENTS_GUIDE.md` - Actualizada según guía de contribución con agente de análisis
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
- **Integración multiplataforma** - OpenCode, Claude Code, Gemini CLI, Cursor, Windsurf

#### Documentación

- `README.md` - Guía rápida con diagrama Mermaid
- `USER_GUIDE.md` - Referencia completa de 21 skills
- `AGENTS_GUIDE.md` - Personas de agentes y orquestación
- `CONTRIBUTING.md` - Directrices de contribución (Español)
- `getting-started.md` - Guía de 5 pasos para nuevos usuarios
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
- **Descripción**: Espacio de trabajo para desarrollo asistido por IA con metodología Spec-Driven Development
- **Repositorio**: https://github.com/Fisherk2/plantilla-dev-ai
- **Licencia**: MIT License

### Stack Tecnológico
- **Framework**: OpenCode Agentic Workspace
- **Documentación**: Context7 para APIs actualizadas
- **Documentación**: Markdown con diagramas Mermaid
- **Control de Versiones**: Git

### Documentación Relacionada

- **[README.md](README.md)** - Guía rápida y flujo de trabajo
- **[USER_GUIDE.md](USER_GUIDE.md)** - Referencia completa de skills
- **[AGENTS_GUIDE.md](AGENTS_GUIDE.md)** - Agentes y orquestación
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Directrices de contribución

### Instrucciones de Actualización

#### Desde Versiones Anteriores
Este es el lanzamiento inicial (1.0.0). No se requiere ruta de actualización.

#### Para Versiones Futuras
Al actualizar desde 1.0.0 a versiones futuras:

1. **Revisa el CHANGELOG** para cambios rupturantes
2. **Ejecuta lint/typecheck** después de actualizar skills
3. **Verifica comandos personalizados** en tu configuración de OpenCode
4. **Revisa nuevas integraciones** en `docs/ai-agent-setup/`

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