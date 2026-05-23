# Migration Checklist v2 — Fases 7-10

## Fase 7: Descartar ya fusionados (8 agents)
- [ ] `rm agents-review/architect-reviewer.md`
- [ ] `rm agents-review/performance-engineer.md`
- [ ] `rm agents-review/test-writer.md`
- [ ] `rm agents-review/test-automator.md`
- [ ] `rm agents-review/compliance-auditor.md`
- [ ] `rm agents-review/security-engineer.md`
- [ ] `rm agents-review/api-designer.md`
- [ ] `rm agents-review/technical-writer.md`

## Fase 8: Fusionar coincidencias exactas (8 agents)
- [ ] 8.1 Enrich `agents/build-engineer.md` ← `build-engineer.md` (bundlers, JVM tools)
- [ ] 8.2 Enrich `agents/database-optimizer.md` ← `database-optimizer.md` (scaling, connection)
- [ ] 8.3 Enrich `agents/debugger.md` ← `debugger.md` (tools & techniques)
- [ ] 8.4 Enrich `agents/dependency-manager.md` ← `dependency-manager.md` (supply chain, size)
- [ ] 8.5 Enrich `agents/deployment-engineer.md` ← `deployment-engineer.md` (rollback checklist)
- [ ] 8.6 Enrich `agents/docs-writer.md` ← `docs-writer.md` (rules section)
- [ ] 8.7 Enrich `agents/git-workflow-manager.md` ← `git-workflow-manager.md` (branch protection)
- [ ] 8.8 Enrich `agents/incident-responder.md` ← `incident-responder.md` (triage framework)

## Fase 9: Fusionar agentes adicionales (10 agents)
- [ ] 9.1 Enrich `agents/debugger.md` ← `error-detective.md` (error classification)
- [ ] 9.2 Enrich `agents/code-reviewer.md` ← `refactorer.md` (refactoring principles)
- [ ] 9.3 Enrich `agents/build-engineer.md` ← `docker-expert.md` (Docker best practices)
- [ ] 9.4 Enrich `agents/build-engineer.md` ← `tooling-engineer.md` (linters, code gen)
- [ ] 9.5 Enrich `agents/deployment-engineer.md` ← `devops-engineer.md` (quality gates)
- [ ] 9.6 Enrich `agents/deployment-engineer.md` ← `sre-engineer.md` (SLOs/observability)
- [ ] 9.7 Enrich `agents/deployment-engineer.md` ← `cloud-architect.md` (cloud principles)
- [ ] 9.8 Enrich `agents/database-optimizer.md` ← `database-administrator.md` (backup/recovery)
- [ ] 9.9 Enrich `agents/database-optimizer.md` ← `sql-pro.md` (advanced SQL patterns)
- [ ] 9.10 Enrich `agents/build-engineer.md` ← `dx-optimizer.md` (inner loop optimization)

## Fase 10: Commit final
- [ ] git add + commit "feat(agents): complete migration v2 with 101-agent analysis"
