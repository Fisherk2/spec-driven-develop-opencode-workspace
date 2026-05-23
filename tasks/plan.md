# Tuning Plan: Metadatos de Agentes

**Objetivo:** Revisar y ajustar manualmente los parámetros de configuración de cada agente, uno por uno, siguiendo el orden del flujo de trabajo SDD.

**Formato de referencia:** `agents/tezcatlipoca.md` (Rich Extended)

---

## Checklist de Tuning por Agente

Para cada agente, revisar estos parámetros:

| Parámetro | Qué ajustar | Rango/Valores |
|-----------|-------------|---------------|
| `temperature` | Creatividad del agente | 0.1 (analítico), 0.2 (código estándar), 0.3-0.4 (creativo/build) |
| `model_options.thinking.budgetTokens` | Tokens de razonamiento | 4000 (rápido), 6000 (estándar), 8000 (complejo), 10000+ (debugging) |
| `permission.bash` | Comandos shell permitidos | Específicos del dominio del agente |
| `permission.edit` | Write/Edit | `allow` (constructores) o `deny` (analíticos/revisores) |
| `steps` | Máximo de iteraciones | Solo para subagentes que lo necesiten |
| `model` | Override de modelo | Solo si el agente necesita un modelo específico |
| `color` | Color distintivo | Hex único, verificable |
| `hidden` | Ocultar del @ autocomplete | `true` para agentes muy especializados |

---

## Orden de Tuning (por fase SDD)

### Fase 1: DEFINE — Especificación y Análisis

| # | Agente | Rol | Notas de configuración |
|:-:|--------|-----|----------------------|
| 1 | **quetzalcoatl** | Architect of Specifications | **Primary agent** (mode: primary). Ya configurado. Verificar temperature=0.2, budgetTokens=6000, steps=10 |
| 2 | **business-analyst** | Business Analyst | Arq C (read-only). Verificar `edit: deny` y solo `git log` en bash. ¿Necesita `webfetch`? |
| 3 | **product-manager** | Product Manager | Arq C. Similar a BA. ¿Debe tener `websearch` para research de mercado? |
| 4 | **project-manager** | Project Manager | Arq C. ¿Necesita `task` permission para crear subagentes de seguimiento? |
| 5 | **scrum-master** | Scrum Master | Arq C. ¿Necesita permisos adicionales? Bajo temperature (0.1) |
| 6 | **ux-researcher** | UX Researcher | Arq D (puede escribir docs de investigación). ¿Necesita `websearch` y `webfetch`? |
| 7 | **market-researcher** | Market Researcher | Arq C. Research de mercado. ¿`websearch` y `webfetch` esenciales? |
| 8 | **competitive-analyst** | Competitive Analyst | Arq C. Análisis competitivo. ¿Permisos web? |
| 9 | **trend-analyst** | Trend Analyst | Arq C. Análisis de tendencias. |
| 10 | **research-analyst** | Research Analyst | Arq C. Investigación general. |
| 11 | **content-marketer** | Content Marketer | Arq D (escribe contenido). ¿`edit: allow` para docs? |
| 12 | **sales-engineer** | Sales Engineer | Arq C. Soporte técnico-ventas. |
| 13 | **prompt-engineer** | Prompt Engineer | Arq D. Diseño de prompts. ¿Necesita `skill: allow` para cargar skills de prompting? |

### Fase 2: PLAN — Arquitectura y Diseño

| # | Agente | Rol | Notas de configuración |
|:-:|--------|-----|----------------------|
| 14 | **microservices-architect** | Microservices Architect | Arq C (read-only). temperature=0.1. ¿Permisos para leer logs/diagramas? |
| 15 | **graphql-architect** | GraphQL Architect | Arq C. Diseño de schemas. ¿`edit: deny` o `allow` para schemas `.graphql`? |
| 16 | **seo-specialist** | SEO Specialist | Arq D. Análisis SEO. ¿`webfetch` para verificar meta tags en URLs? |

### Fase 3: BUILD — Construcción (Código)

#### 3.1 Core Build

| # | Agente | Rol | Notas de configuración |
|:-:|--------|-----|----------------------|
| 17 | **tezcatlipoca** | Build Agent | **Primary agent** (mode: primary). Ya configurado. Verificar temperature=0.4, budgetTokens=8000 |
| 18 | **context-manager** | Context Manager | Arq D. Gestión de contexto de agente. ¿steps limitados (5)? |
| 19 | **error-coordinator** | Error Coordinator | Arq D. Coordinación de errores entre agentes. |
| 20 | **knowledge-synthesizer** | Knowledge Synthesizer | Arq D. Síntesis de documentación técnica. |
| 21 | **search-specialist** | Search Specialist | Arq D. Búsqueda técnica. ¿`websearch` y `webfetch` esenciales? |
| 22 | **scientific-literature-researcher** | Scientific Researcher | Arq D. Research académico. ¿`webfetch` para papers? |
| 23 | **legal-advisor** | Legal Advisor | Arq C (read-only). Asesoría legal/licencias. |

#### 3.2 Lenguajes de Programación

| # | Agente | Rol | Notas de configuración |
|:-:|--------|-----|----------------------|
| 24 | **python-pro** | Python Specialist | Arq D. Verificar bash: pip, poetry, uv, pytest, ruff, mypy. temperature=0.2 |
| 25 | **typescript-pro** | TypeScript Specialist | Arq D. Verificar bash: npm, npx, bun, tsc, eslint. |
| 26 | **javascript-pro** | JavaScript Specialist | Arq D. Similar a TypeScript pero vanilla JS. |
| 27 | **golang-pro** | Go Specialist | Arq D. Verificar bash: go, gofmt, golangci-lint. |
| 28 | **rust-engineer** | Rust Engineer | Arq D. Verificar bash: cargo, rustc, clippy. |
| 29 | **java-architect** | Java Architect | Arq D. Verificar bash: mvn, gradle, java. |
| 30 | **cpp-pro** | C++ Specialist | Arq D. Verificar bash: g++, cmake, make. |
| 31 | **csharp-developer** | C# Developer | Arq D. Verificar bash: dotnet. |
| 32 | **php-pro** | PHP Specialist | Arq D. Verificar bash: composer, php. |
| 33 | **ruby-pro** | Ruby Specialist | Arq D. Verificar bash: gem, bundle, rake. |
| 34 | **kotlin-specialist** | Kotlin Specialist | Arq D. Verificar bash: gradle, kotlin. |
| 35 | **swift-expert** | Swift Expert | Arq D. Verificar bash: swift, xcodebuild. |
| 36 | **elixir-expert** | Elixir Expert | Arq D. Verificar bash: mix, elixir. |
| 37 | **postgres-pro** | PostgreSQL Specialist | Arq D. Verificar bash: psql. ¿`edit: allow` para SQL? |

#### 3.3 Frameworks y Frontend

| # | Agente | Rol | Notas de configuración |
|:-:|--------|-----|----------------------|
| 38 | **react-specialist** | React Specialist | Arq D. Verificar bash: npm, npx, bun. ¿Necesita `webfetch`? |
| 39 | **vue-expert** | Vue Expert | Arq D. Verificar bash. |
| 40 | **angular-architect** | Angular Architect | Arq D. Verificar bash: ng, npm. |
| 41 | **nextjs-developer** | Next.js Developer | Arq D. Verificar bash: next, npm, bun. |
| 42 | **django-developer** | Django Developer | Arq D. Verificar bash: pip, python, django-admin. |
| 43 | **fastapi-developer** | FastAPI Developer | Arq D. Verificar bash: pip, uvicorn. |
| 44 | **spring-boot-engineer** | Spring Boot Engineer | Arq D. Verificar bash: mvn, gradle, java. |
| 45 | **laravel-specialist** | Laravel Specialist | Arq D. Verificar bash: composer, artisan, php. |
| 46 | **flutter-expert** | Flutter Expert | Arq D. Verificar bash: flutter, dart. |
| 47 | **backend-developer** | Backend Generalist | Arq D. Amplio espectro de bash. |
| 48 | **frontend-developer** | Frontend Generalist | Arq D. HTML/CSS/JS tooling. |
| 49 | **fullstack-developer** | Fullstack Generalist | Arq D. Máximo espectro de bash. |

#### 3.4 Dominios Especializados

| # | Agente | Rol | Notas de configuración |
|:-:|--------|-----|----------------------|
| 50 | **fintech-engineer** | Fintech Engineer | Arq D. Payment processing, compliance. ¿Seguridad extra? |
| 51 | **game-developer** | Game Developer | Arq D. Verificar bash: unity, godot, love2d. |
| 52 | **blockchain-developer** | Blockchain Developer | Arq D. Verificar bash: solc, truffle, hardhat. |
| 53 | **iot-engineer** | IoT Engineer | Arq D. C++, Python embebido, protocolos. |
| 54 | **embedded-systems** | Embedded Systems | Arq D. Cross-compilation, C/C++. |
| 55 | **payment-integration** | Payment Integration | Arq D. APIs de pago, PCI compliance. |
| 56 | **mobile-app-developer** | Mobile App Developer | Arq D. React Native, Flutter, Swift/Kotlin. |
| 57 | **mobile-developer** | Mobile Developer | Arq D. Nativo Android/iOS. |

#### 3.5 AI/ML/Datos

| # | Agente | Rol | Notas de configuración |
|:-:|--------|-----|----------------------|
| 58 | **ai-engineer** | AI Engineer | Arq D. Verificar bash: python, pip, huggingface, transformers. |
| 59 | **machine-learning-engineer** | ML Engineer | Arq D. Verificar bash: python, pip, sklearn, torch. budgetTokens=8000 |
| 60 | **nlp-engineer** | NLP Engineer | Arq D. NLP pipelines, transformers, spaCy. |
| 61 | **llm-architect** | LLM Architect | Arq D. LLM integration, RAG, fine-tuning. budgetTokens=8000 |
| 62 | **data-scientist** | Data Scientist | Arq D. Análisis, notebooks, pandas, sklearn. |
| 63 | **data-engineer** | Data Engineer | Arq D. Pipelines ETL, spark, airflow. |
| 64 | **data-analyst** | Data Analyst | Arq D. SQL, visualización, dashboards. |
| 65 | **data-researcher** | Data Researcher | Arq D. Research cuantitativo. |
| 66 | **mlops-engineer** | MLOps Engineer | Arq D. ML pipelines, docker, kubeflow. |

#### 3.6 Infraestructura y Cloud

| # | Agente | Rol | Notas de configuración |
|:-:|--------|-----|----------------------|
| 67 | **docker-expert** | Docker Expert | Arq D. Verificar `edit` restringido a `Dockerfile*`, `docker-compose*`. |
| 68 | **devops-engineer** | DevOps Engineer | Arq D. Amplio bash: docker, kubectl, terraform, CI/CD. |
| 69 | **sre-engineer** | SRE Engineer | Arq D. Monitoring, alerting, SLIs/SLOs. |
| 70 | **cloud-architect** | Cloud Architect | Arq D. Multi-cloud, cost optimization. |
| 71 | **database-administrator** | DBA | Arq D. Verificar bash: psql, mysql, mongosh, sqlcmd. |
| 72 | **sql-pro** | SQL Specialist | Arq D. Queries optimización, modelado. |
| 73 | **kubernetes-specialist** | K8s Specialist | Arq D. Verificar `bash`: `kubectl *: ask`, `helm *: ask`. |
| 74 | **terraform-engineer** | Terraform Engineer | Arq D. Verificar bash: terraform, tofu. |
| 75 | **azure-infra-engineer** | Azure Engineer | Arq D. Verificar bash: az, powershell. |
| 76 | **network-engineer** | Network Engineer | Arq C (mayormente análisis). |
| 77 | **platform-engineer** | Platform Engineer | Arq D. Internal developer platform. |
| 78 | **websocket-engineer** | WebSocket Engineer | Arq D. Tiempo real, conexiones persistentes. |

#### 3.7 Herramientas y Soporte Técnico

| # | Agente | Rol | Notas de configuración |
|:-:|--------|-----|----------------------|
| 79 | **cli-developer** | CLI Developer | Arq D. Verificar bash para CLI tooling. |
| 80 | **mcp-developer** | MCP Developer | Arq D. Desarrollo de MCP servers. ¿`edit` en `.opencode/tools/`? |
| 81 | **chaos-engineer** | Chaos Engineer | Arq D. Testing de resiliencia. ¿`bash` permisivo? |
| 82 | **legacy-modernizer** | Legacy Modernizer | Arq D. Refactoring código legacy. |
| 83 | **tooling-engineer** | Tooling Engineer | Arq D. Build tools, task runners. |
| 84 | **dx-optimizer** | DX Optimizer | Arq D. Developer experience. |

### Fase 4: VERIFY — Testing y Depuración

| # | Agente | Rol | Notas de configuración |
|:-:|--------|-----|----------------------|
| 85 | **test-engineer** | QA Engineer | Arq D. Ya configurado. Verificar temperature=0.2, lsp: allow |
| 86 | **debugger** | Debugging Specialist | Arq C. Ya configurado. Verificar bash: `git bisect *: allow`, `git blame *: allow` |
| 87 | **error-detective** | Error Detective | Arq D. Análisis de errores en logs. ¿`grep` y `bash` para journalctl/logs? |
| 88 | **accessibility-tester** | A11y Tester | Arq C (read-only). WCAG auditing. ¿`webfetch` para verificar URLs? |

### Fase 5: REVIEW — Revisión y Calidad

| # | Agente | Rol | Notas de configuración |
|:-:|--------|-----|----------------------|
| 89 | **code-reviewer** | Code Reviewer | Arq C. Ya configurado. Verificar temperature=0.1, steps=15 |
| 90 | **security-auditor** | Security Auditor | Arq C. Ya configurado. Verificar temperature=0.1, permisos de auditoría |
| 91 | **database-optimizer** | DB Optimizer | Arq C. Ya configurado. Añadir `lsp: allow` si falta |
| 92 | **refactorer** | Refactoring Specialist | Arq D. Refactoring de código. temperature=0.1 |
| 93 | **tooling-engineer** | Tooling Engineer | Arq D. Build/CI tooling. |

### Fase 6: SHIP — Despliegue y Entrega

| # | Agente | Rol | Notas de configuración |
|:-:|--------|-----|----------------------|
| 94 | **deployment-engineer** | Deployment Engineer | Arq D. Ya configurado. Verificar bash para CI/CD |
| 95 | **build-engineer** | Build Engineer | Arq D. Ya configurado. Verificar docker/npm/bun permissions |
| 96 | **dependency-manager** | Dependency Manager | Arq C. Ya configurado. Verificar `lsp: allow` |
| 97 | **git-workflow-manager** | Git Workflow Manager | Arq C. Ya configurado. Verificar `git *` en bash |
| 98 | **docs-writer** | Technical Writer | Arq D. Ya configurado. Verificar `lsp: allow` |
| 99 | **incident-responder** | Incident Responder | Arq D. Ya configurado. Verificar journalctl/kubectl/docker |

---

## Proceso

Para cada agente (en orden numérico, del 1 al 99):

1. **Leer** el archivo actual del agente
2. **Analizar** los parámetros contra el checklist de tuning
3. **Preguntar** al usuario qué ajustes hacer
4. **Aplicar** los cambios acordados
5. **Confirmar** y pasar al siguiente

```
Iteración típica:

  → Abrir agents/<nombre>.md
  → Revisar: temperature, budgetTokens, permissions, color, steps
  → Preguntar: "¿Ajustamos X a Y? ¿Algo más en este agente?"
  → Aplicar cambios
  → "Siguiente: <nombre-del-siguiente>"
```

---
