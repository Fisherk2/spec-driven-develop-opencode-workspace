# Registro de Cambios (Changelog)

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Sin Lanzar]

### Agregado
- Marcador de posición para cambios futuros

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