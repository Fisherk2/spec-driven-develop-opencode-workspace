# Migration Plan v2: Complete 101-Agent Analysis

## Goal
Analizar y procesar TODOS los 101 agentes de `agents-review/` contra los 13 de `agents/`. Determinar para cada uno: fusionar en agents/, mantener en agents-review/, o descartar.

## Current State
- **agents/**: 13 agentes operativos (5 originales enriquecidos + 8 nuevos)
- **agents-review/**: 94 agentes (7 ya eliminados en Fase 1)
- **Ya fusionados (Fase 1)**: architect-reviewer, performance-engineer, test-writer, test-automator, compliance-auditor, security-engineer, api-designer
- **Ya eliminados**: code-reviewer, security-auditor, penetration-tester, agent-organizer, multi-agent-coordinator, task-distributor, workflow-orchestrator

---

## Global Categorization (101 agents)

| Category | Count | Action |
|----------|-------|--------|
| **Ya eliminados (Fase 1)** | 7 | Ya no existen |
| **Ya fusionados → descartar** | 7 | Eliminar de agents-review/ |
| **Ya cubiertos → descartar** | 1 | Eliminar de agents-review/ |
| **Coincidencia exacta → fusionar** | 8 | Fusionar contenido en agents/ homónimos |
| **Fusión adicional** | 10 | Fusionar contenido en agents/ existentes |
| **NO migrar (quedan en agents-review/)** | 68 | Mantener como referencia |
| **Total** | **101** | |

---

## Fase 7: Descartar ya fusionados/cubiertos (8 agents)

Eliminar de `agents-review/` porque su contenido ya se fusionó en `agents/` en Fase 1, o está cubierto por un agente existente:

| agents-review | Razón |
|---|---|
| `architect-reviewer.md` | Ya fusionado en `agents/code-reviewer.md` (sección Architecture) |
| `performance-engineer.md` | Ya fusionado en `agents/code-reviewer.md` (sección Performance) |
| `test-writer.md` | Ya fusionado en `agents/test-engineer.md` |
| `test-automator.md` | Ya fusionado en `agents/test-engineer.md` (sección Test Automation) |
| `compliance-auditor.md` | Ya fusionado en `agents/security-auditor.md` (sección Compliance) |
| `security-engineer.md` | Ya fusionado en `agents/security-auditor.md` (sección Infra Security) |
| `api-designer.md` | Ya fusionado en `agents/quetzalcoatl.md` (sección API Design) |
| `technical-writer.md` | Ya cubierto por `agents/docs-writer.md` |

---

## Fase 8: Fusionar coincidencias exactas (8 agents)

Cada agente de `agents-review/` tiene el MISMO nombre que uno de `agents/`. Contienen contenido único que enriquece al homónimo:

| agents-review → agents/ | Contenido único a fusionar | Prioridad |
|---|---|---|
| `build-engineer.md` → `agents/build-engineer.md` | Frontend bundlers (webpack/vite/esbuild), JVM tools (Gradle/Maven), code splitting, tree shaking | Alta |
| `database-optimizer.md` → `agents/database-optimizer.md` | Scaling section (partitioning/sharding/replicas), connection mgmt detallado | Alta |
| `debugger.md` → `agents/debugger.md` | git blame/pattern matching, tools & techniques section | Alta |
| `dependency-manager.md` → `agents/dependency-manager.md` | Supply chain risk, "Size" category, breaking changes analysis | Alta |
| `deployment-engineer.md` → `agents/deployment-engineer.md` | Rollback checklist, Safety rules | Alta |
| `docs-writer.md` → `agents/docs-writer.md` | Rules section (solo .md, TOC, referenciar source code) | Alta |
| `git-workflow-manager.md` → `agents/git-workflow-manager.md` | Branch protection rules, auto-merge, required checks | Alta |
| `incident-responder.md` → `agents/incident-responder.md` | Triage framework detallado, postmortem template | Alta |

---

## Fase 9: Fusionar agentes adicionales (10 agents)

Agentes SIN coincidencia exacta de nombre, pero cuyo contenido especializado enriquece a agentes existentes:

| agents-review → agents/ | Contenido único a fusionar | Prioridad |
|---|---|---|
| `error-detective.md` → `agents/debugger.md` | Clasificación de errores (Transient/Data/Logic/Config/Resource), correlation IDs, reportes por frecuencia/impacto | Alta |
| `refactorer.md` → `agents/code-reviewer.md` | Principios de refactorización (small steps, preserve behavior, test first), common refactorings list | Alta |
| `docker-expert.md` → `agents/build-engineer.md` | Docker best practices (HEALTHCHECK, .dockerignore, resource limits, non-root), optimization targets | Alta |
| `tooling-engineer.md` → `agents/build-engineer.md` | Linter config strategy, code generation (AST codemods), automation scripts (Makefiles/Taskfile) | Media |
| `devops-engineer.md` → `agents/deployment-engineer.md` | Quality gates pipeline, pipeline design principles (fail fast, cache, idempotent, secrets) | Alta |
| `sre-engineer.md` → `agents/deployment-engineer.md` | Observabilidad (metrics/logging/tracing), SLO framework (SLI/SLO/error budget/burn rate) | Media |
| `cloud-architect.md` → `agents/deployment-engineer.md` | Cloud architecture principles (Well-Architected, blast radius, cost visibility), service selection | Media |
| `database-administrator.md` → `agents/database-optimizer.md` | Backup/Recovery (RPO/RTO, backup testing), replication best practices, migration safety | Alta |
| `sql-pro.md` → `agents/database-optimizer.md` | Advanced SQL patterns (window functions, CTEs, LATERAL, MERGE), migration safety (concurrent index) | Alta |
| `dx-optimizer.md` → `agents/build-engineer.md` | Inner loop optimization (hot reload, IDE configs, pre-commit hooks), onboarding workflows | Media |

---

## NO migrados: Quedan en agents-review/ (68 agents)

Estos agentes son específicos de lenguaje, framework, dominio, infraestructura o proceso. Se quedan en `agents-review/` como referencia para futura evaluación. NO se migran a `agents/`.

### Lenguajes (15)
| Agent | Especialidad |
|---|---|
| `python-pro.md` | Python |
| `typescript-pro.md` | TypeScript |
| `javascript-pro.md` | JavaScript |
| `golang-pro.md` | Go |
| `rust-engineer.md` | Rust |
| `cpp-pro.md` | C++ |
| `csharp-developer.md` | C# |
| `java-architect.md` | Java |
| `php-pro.md` | PHP |
| `ruby-pro.md` | Ruby |
| `kotlin-specialist.md` | Kotlin |
| `swift-expert.md` | Swift |
| `elixir-expert.md` | Elixir |
| `csharp-developer.md` | C# |
| `postgres-pro.md` | PostgreSQL (DB específico) |

### Frameworks (11)
| Agent | Especialidad |
|---|---|
| `react-specialist.md` | React |
| `vue-expert.md` | Vue |
| `angular-architect.md` | Angular |
| `nextjs-developer.md` | Next.js |
| `django-developer.md` | Django |
| `fastapi-developer.md` | FastAPI |
| `spring-boot-engineer.md` | Spring Boot |
| `laravel-specialist.md` | Laravel |
| `flutter-expert.md` | Flutter |
| `backend-developer.md` | Backend genérico |
| `frontend-developer.md` | Frontend genérico |
| `fullstack-developer.md` | Fullstack genérico |

### Dominios (7)
| Agent | Especialidad |
|---|---|
| `fintech-engineer.md` | Fintech |
| `game-developer.md` | Game development |
| `blockchain-developer.md` | Blockchain/Web3 |
| `iot-engineer.md` | IoT |
| `embedded-systems.md` | Embedded systems |
| `payment-integration.md` | Payment processing |
| `mobile-app-developer.md` / `mobile-developer.md` | Mobile apps |

### AI/ML/Datos (7)
| Agent | Especialidad |
|---|---|
| `ai-engineer.md` | AI/ML engineering |
| `machine-learning-engineer.md` | ML pipelines |
| `nlp-engineer.md` | NLP |
| `llm-architect.md` | LLM architecture |
| `data-scientist.md` | Data science |
| `data-engineer.md` | Data engineering |
| `data-analyst.md` / `data-researcher.md` | Data analysis |
| `mlops-engineer.md` | MLOps |

### Infraestructura/Cloud (6)
| Agent | Especialidad |
|---|---|
| `kubernetes-specialist.md` | Kubernetes |
| `terraform-engineer.md` | Terraform/IaC |
| `azure-infra-engineer.md` | Azure |
| `network-engineer.md` | Networking |
| `platform-engineer.md` | Platform engineering |
| `websocket-engineer.md` | WebSocket/real-time |

### Arquitectura (2)
| Agent | Especialidad |
|---|---|
| `microservices-architect.md` | Microservicios |
| `graphql-architect.md` | GraphQL |

### QA/Testing (1)
| Agent | Especialidad |
|---|---|
| `accessibility-tester.md` | Accesibilidad WCAG |

### UX/Producto (3)
| Agent | Especialidad |
|---|---|
| `ux-researcher.md` | UX research |
| `seo-specialist.md` | SEO |
| `prompt-engineer.md` | Prompt engineering |

### Proceso/Negocio (10)
| Agent | Especialidad |
|---|---|
| `business-analyst.md` | Business analysis |
| `product-manager.md` | Product management |
| `project-manager.md` | Project management |
| `scrum-master.md` | Scrum |
| `sales-engineer.md` | Sales engineering |
| `competitive-analyst.md` | Competitive analysis |
| `content-marketer.md` | Content marketing |
| `market-researcher.md` | Market research |
| `trend-analyst.md` | Trend analysis |
| `research-analyst.md` | Research analysis |

### Otros (6)
| Agent | Especialidad |
|---|---|
| `cli-developer.md` | CLI tools |
| `mcp-developer.md` | MCP servers |
| `chaos-engineer.md` | Chaos engineering |
| `legacy-modernizer.md` | Legacy modernization |
| `knowledge-synthesizer.md` | Knowledge synthesis |
| `context-manager.md` | Context optimization |
| `error-coordinator.md` | Error coordination (skill-level) |
| `scientific-literature-researcher.md` | Scientific research |
| `search-specialist.md` | Search |
| `legal-advisor.md` | Legal |

---

## Resumen de Fases

| Fase | Descripción | Archivos a modificar |
|------|-------------|---------------------|
| **Fase 7** | Eliminar 8 agents ya fusionados/cubiertos | `agents-review/` (8 rm) |
| **Fase 8** | Fusionar 8 coincidencias exactas | `agents/*.md` (8 enrich) |
| **Fase 9** | Fusionar 10 agentes adicionales | `agents/*.md` (10 enrich) |
| **Fase 10** | Commit final de todas las fusiones | git commit |

**Total final: 13 agents en `agents/`** (enriquecidos) + **68 agents en `agents-review/`** (referencia)
