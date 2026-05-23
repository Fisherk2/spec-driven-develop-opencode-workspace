# To-Do: Tuning de Metadatos de Agentes

**Estado:** ✅ Completado — todos los agentes sintonizados: 99/99

---

## Fase 1: DEFINE — Especificación y Análisis (13 agentes) ✅ COMPLETADA

| # | Agente | Estado | Notas de tuning |
|:-:|--------|--------|-----------------|
| 1 | quetzalcoatl | ✅ Sin cambios | Primary. temperature=0.2, steps=10, budgetTokens=6000. Sin cambios necesarios. |
| 2 | business-analyst | ✅ Modificado | temp=0.2→0.1, budget=6K→8K, hidden=true, quitado model override |
| 3 | product-manager | ✅ Modificado | temp=0.2→0.1, budget=6K→8K, hidden=true, quitado model override |
| 4 | project-manager | ✅ Modificado | temp=0.1, budget=8K, hidden=true, task:allow, quitado model |
| 5 | scrum-master | ✅ Modificado | temp=0.1, budget=8K, hidden=true, quitado model |
| 6 | ux-researcher | ✅ Modificado | Arq D: write/edit=ask, temp=0.1, budget=8K, hidden=true, quitado model |
| 7 | market-researcher | ✅ Modificado | temp=0.3→0.1, budget=8K, hidden=true, quitado model |
| 8 | competitive-analyst | ✅ Modificado | temp=0.3→0.1, budget=8K, hidden=true, quitado model |
| 9 | trend-analyst | ✅ Modificado | temp=0.3→0.1, budget=8K, hidden=true, quitado model |
| 10 | research-analyst | ✅ Modificado | temp=0.3→0.1, budget=8K, hidden=true, quitado model |
| 11 | content-marketer | ✅ Modificado | Arq D: write/edit=ask, temp=0.1, budget=8K, hidden=true, quitado model |
| 12 | sales-engineer | ✅ Modificado | temp=0.1, budget=8K, hidden=true, quitado model |
| 13 | prompt-engineer | ✅ Modificado | Arq D: edit=allow, skill=allow. temp=0.1, budget=8K, hidden, quitado model |

## Fase 2: PLAN — Arquitectura y Diseño (3 agentes) ✅ COMPLETADA

| # | Agente | Estado | Notas de tuning |
|:-:|--------|--------|-----------------|
| 14 | microservices-architect | ✅ Modificado | temp=0.3→0.1, budget=8K, hidden=true, quitado model |
| 15 | graphql-architect | ✅ Modificado | Arq D: edit=allow, bash=ask. temp=0.1, budget=8K, hidden, quitado model |
| 16 | seo-specialist | ✅ Modificado | Arq D: edit=allow, webfetch=allow. temp=0.1, budget=8K, hidden, quitado model |

## Fase 3: BUILD — Construcción (68 agentes)

### 3.5 AI/ML/Datos (9 agentes)

| # | Agente | Estado | Notas de tuning |
|:-:|--------|--------|-----------------|
| 58 | ai-engineer | ✅ Modificado | Arq D: edit=allow, bash=deny+python/pip/jupyter ask ✅. temp=0.1, budget=8K, hidden |
| 59 | machine-learning-engineer | ✅ Modificado | Arq D: edit=allow, bash=deny+python/pip/jupyter ask ✅. temp=0.1, budget=8K, hidden |
| 60 | nlp-engineer | ✅ Modificado | Arq D: edit=allow, bash=deny+python/pip/jupyter ask ✅. temp=0.1, budget=8K, hidden |
| 61 | llm-architect | ✅ Modificado | Arq D: edit=allow, bash=deny+python/pip/jupyter ask ✅. temp=0.1, budget=8K, hidden |
| 62 | data-scientist | ✅ Modificado | Arq D: edit=allow, bash=deny+python/pip/jupyter ask ✅. temp=0.1, budget=8K, hidden |
| 63 | data-engineer | ✅ Modificado | Arq D: edit=allow, bash=deny+python/pip/jupyter ask ✅. temp=0.1, budget=8K, hidden |
| 64 | data-analyst | ✅ Modificado | Arq D: edit=allow, bash=deny+python/pip/jupyter ask ✅. temp=0.1, budget=8K, hidden |
| 65 | data-researcher | ✅ Modificado | Arq D: edit=allow, bash=deny+python/pip/jupyter ask ✅. temp=0.1, budget=8K, hidden |
| 66 | mlops-engineer | ✅ Modificado | Arq D: edit=allow, bash=deny+python/pip/jupyter ask ✅. temp=0.1, budget=8K, hidden |

### 3.6 Infraestructura y Cloud (12 agentes)

| # | Agente | Estado | Notas de tuning |
|:-:|--------|--------|-----------------|
| 67 | docker-expert | ✅ Modificado | Arq D: edit=allow (Dockerfile*, docker-compose*, etc.), temp=0.1, budget=8K, hidden=true |
| 68 | devops-engineer | ✅ Modificado | Arq D: edit=allow, bash=docker/kubectl/terraform ask, temp=0.1, budget=8K, hidden=true |
| 69 | sre-engineer | ✅ Modificado | Arq D: edit=allow, bash=grep/git log ask, temp=0.1, budget=8K, hidden=true |
| 70 | cloud-architect | ✅ Modificado | Arq D: edit=allow, bash=aws/gcloud/az ask, temp=0.1, budget=8K, hidden=true |
| 71 | database-administrator | ✅ Modificado | Arq D: edit=allow, bash=psql/mysql/mongosh ask, temp=0.1, budget=8K, hidden=true |
| 72 | sql-pro | ✅ Modificado | Arq D: edit=allow, bash=psql/mysql ask, temp=0.1, budget=8K, hidden=true |
| 73 | kubernetes-specialist | ✅ Modificado | Arq D: edit=allow (k8s/*, helm/*, charts/*, *.yaml, *.yml ask), temp=0.1, budget=8K, hidden=true |
| 74 | terraform-engineer | ✅ Modificado | Arq D: edit=allow (*.tf, *.tfvars, *.hcl, modules/* allow), temp=0.1, budget=8K, hidden=true |
| 75 | azure-infra-engineer | ✅ Modificado | Arq D: edit=allow, bash=az/powershell ask, temp=0.1, budget=8K, hidden=true |
| 76 | network-engineer | ✅ Modificado | Arq C: edit=deny, bash=dig/nslookup/traceroute/ping/curl allow, temp=0.1, budget=8K, hidden=true |
| 77 | platform-engineer | ✅ Modificado | Arq D. Internal platform. temperature=0.2→0.1, budgetTokens=6000→8000, hidden=true, bash permisos específicos |
| 78 | websocket-engineer | ✅ Modificado | Arq D. Tiempo real. temperature=0.2→0.1, budgetTokens=6000→8000, hidden=true, bash permisos específicos |

### 3.7 Herramientas y Soporte Técnico (6 agentes)

| # | Agente | Estado | Notas de tuning |
|:-:|--------|--------|-----------------|
| 79 | cli-developer | ✅ Modificado | Arq D. CLI tooling. temperature=0.2→0.1, budgetTokens=6000→8000, hidden=true, bash permisos específicos |
| 80 | mcp-developer | ✅ Modificado | Arq D. MCP servers. temperature=0.2→0.1, budgetTokens=6000→8000, hidden=true, bash permisos específicos |
| 81 | chaos-engineer | ✅ Modificado | Arq D. Resilience testing. temperature=0.3 (mantenido), budgetTokens=6000→8000, hidden=true, bash permisos específicos |
| 82 | legacy-modernizer | ✅ Modificado | Arq D. Refactoring legacy. temperature=0.2→0.1, budgetTokens=6000→8000, hidden=true, edit=ask→allow, bash permisos específicos |
| 83 | tooling-engineer | ✅ Modificado | Arq D. Build tools. temperature=0.2→0.1, budgetTokens=6000→8000, hidden=true, bash permisos específicos |
| 84 | dx-optimizer | ✅ Modificado | Arq D. Developer experience. temperature=0.2→0.1, budgetTokens=6000→8000, hidden=true, bash permisos específicos |

## Fase 4: VERIFY — Testing y Depuración (4 agentes)

| # | Agente | Estado | Notas de tuning |
|:-:|--------|--------|-----------------|
| 85 | test-engineer | ✅ Modificado | Arq D. temperature=0.2 (mantenido), budgetTokens=6000→8000, hidden=true, bash permisos específicos |
| 86 | debugger | ✅ Modificado | Arq C. temperature=0.1 (mantenido), budgetTokens=6000→8000, hidden=true, bash permisos específicos |
| 87 | error-detective | ✅ Modificado | Arq D. temperature=0.1 (mantenido), budgetTokens=6000→8000, hidden=true, bash permisos específicos |
| 88 | accessibility-tester | ✅ Modificado | Arq C. temperature=0.1 (mantenido), budgetTokens=6000→8000, hidden=true, bash permisos específicos |

## Fase 5: REVIEW — Revisión y Calidad (5 agentes)

| # | Agente | Estado | Notas de tuning |
|:-:|--------|--------|-----------------|
| 89 | code-reviewer | ✅ Modificado | Arq C. temperature=0.1 (mantenido), budgetTokens=6000→8000, hidden=true, bash permisos específicos |
| 90 | security-auditor | ✅ Modificado | Arq C. temperature=0.1 (mantenido), budgetTokens=6000→8000, hidden=true, bash permisos específicos |
| 91 | database-optimizer | ✅ Modificado | Arq C. temperature=0.1 (mantenido), budgetTokens=6000→8000, hidden=true, lsp: allow añadido, bash permisos específicos |
| 92 | refactorer | ✅ Modificado | Arq D. temperature=0.2→0.1, budgetTokens=6000→8000, hidden=true, bash permisos específicos |
| 93 | tooling-engineer | ✅ Modificado | Arq D. (duplicado del #83, verificar), hidden=true |

## Fase 6: SHIP — Despliegue y Entrega (6 agentes)

| # | Agente | Estado | Notas de tuning |
|:-:|--------|--------|-----------------|
| 94 | deployment-engineer | ✅ Modificado | Arq D. temperature=0.2→0.1, budgetTokens=6000→8000, hidden=true, edit=ask→allow, bash permisos específicos |
| 95 | build-engineer | ✅ Modificado | Arq D. temperature=0.2→0.1, budgetTokens=6000→8000, hidden=true, edit=ask→allow, bash permisos específicos |
| 96 | dependency-manager | ✅ Modificado | Arq C. temperature=0.1 (mantenido), budgetTokens=6000→8000, hidden=true, lsp: allow, bash permisos específicos |
| 97 | git-workflow-manager | ✅ Modificado | Arq C. temperature=0.1 (mantenido), budgetTokens=6000→8000, hidden=true, edit=deny→allow, bash permisos específicos |
| 98 | docs-writer | ✅ Modificado | Arq D. temperature=0.3→0.1, budgetTokens=6000→8000, hidden=true, edit=ask→allow, lsp: allow, bash permisos específicos |
| 99 | incident-responder | ✅ Modificado | Arq D. temperature=0.1 (mantenido), budgetTokens=6000→8000, hidden=true, edit=ask→allow, bash permisos específicos |

---

## Resumen

| Estado | Cantidad |
|--------|:--------:|
| ⏸️ Pendiente | **0** |
| ✅ Completado | **99** |
| **Total** | **99** |
