# SDD Pipeline Plugin

OpenCode plugin que hookea el lifecycle de la API real del SDK `@opencode-ai/plugin`.

## Hooks implementados

| Evento (API real) | Propósito |
|---|---|
| `experimental.chat.system.transform` | Detecta agente activo + inyecta estado SDD + role rules + sugerencias de intent en el system prompt |
| `chat.message` | Detecta menciones de agente, comandos slash, e intención del usuario. Comandos tienen prioridad sobre menciones |
| `tool.execute.before` | Bloquea comandos destructivos + permisos por agente (write/edit/patch/bash/task) + SDD phase enforcement |
| `tool.execute.after` | Auditoría de herramientas con rotación automática |
| `experimental.session.compacting` | Re-inyecta estado SDD + role rules + persiste estado del pipeline |

## API real del SDK vs blog post

Basado en `@opencode-ai/plugin/dist/index.d.ts` (v1.14.41):

| Blog post / Plan | API real | Estado |
|---|---|---|
| `session.created` | ❌ No existe | Usamos `experimental.chat.system.transform` |
| `message.created` | `chat.message` | ✅ Corregido |
| `tool.call` | `tool.execute.before` | ✅ Corregido |
| `tool.result` | `tool.execute.after` | ✅ Corregido |
| `experimental.session.compacting` | `experimental.session.compacting` | ✅ Igual |
| `file.written` | ❌ No existe | Eliminado |
| `error` | ❌ No existe | Eliminado |
| `session.ended` | ❌ No existe | Persistencia en `session.compacting` |
| `command.executed` | `command.execute.before` | Eliminado (solo pre-ejecución) |

## Archivos de runtime

- `.opencode/plugins/.sdd-state.json` — estado persistido del pipeline (fase, tareas, tipo de agente, último intent)
- `.opencode/plugins/.sdd-audit.log` — traza de auditoría con rotación automática (>500 líneas → trunca a 250)

Ambos ignorados por git.

## Tool Permissions Matrix

Cada agente primario tiene permisos específicos por herramienta:

| Agente | write | edit | patch | bash | task |
|--------|:-----:|:----:|:-----:|:----:|:----:|
| huitzilopochtli | deny | deny | deny | ask | allow |
| quetzalcoatl | deny | deny | deny | ask | allow |
| moctezuma | allow | allow | allow | ask | deny |
| tlaloc | allow | allow | allow | ask | ask |
| mictlantecuhtli | allow | allow | allow | ask | allow |
| tezcatlipoca | deny | deny | deny | ask | deny |

- `deny` = bloqueado por el plugin
- `ask` = permiso global de `opencode.json` (por defecto: read-only)
- `allow` = permitido explícitamente

### Bash Write Rules

Agentes de solo-lectura (quetzalcoatl, tezcatlipoca, moctezuma) tienen deny explícito para comandos de escritura en bash: `>`, `>>`, `touch`, `mkdir`, `cp`, `mv`, `rm`, `chmod`, `chown`, `ln`. Los otros agentes heredan el `ask` global.

### Destructive Command Blocking

El plugin bloquea comandos destructivos para TODOS los agentes (incluyendo los que pueden escribir):

```typescript
DESTRUCTIVE_PATTERNS = [
  /rm\s+-r[f]?/i,           // rm -rf, rm -r
  /rm\s+--recursi/i,         // rm --recursive
  /git\s+push\s+--force/i,   // git push --force
  /git\s+push\s+-f/i,        // git push -f
  /DROP\s+TABLE/i,           // DROP TABLE
  /DELETE\s+FROM/i,          // DELETE FROM
]
```

## SDD Phase Enforcement

Solo agentes válidos por fase SDD pueden operar. Si un agente inválido intenta usar herramientas, recibe un error.

| Fase | Agentes válidos |
|------|----------------|
| idle | huitzilopochtli, quetzalcoatl, moctezuma |
| define | quetzalcoatl |
| plan | moctezuma |
| build | tlaloc |
| verify | mictlantecuhtli |
| review | tezcatlipoca |
| ship | mictlantecuhtli |

## Phase Suggestions

Cuando un agente es usado fuera de su fase típica, el plugin sugiere usar el comando correcto. Ejemplo:

```
> **Suggestion:** Consider /build first to implement code.
```

Las sugerencias son **advisory only** — nunca bloquean al agente.

## Intent Detection

`chat.message` detecta intención del usuario en mensajes de texto libre:

| Patrón | Intent |
|--------|--------|
| "create a rest api", "build a cli" | build |
| "write tests", "add unit tests" | test |
| "review this code", "check quality" | review |
| "create a spec", "define requirements" | spec |
| "plan this feature" | plan |

Cuando se detecta un intent, se almacena en `sddState.last_intent` y se inyecta como sugerencia visible en el system prompt:

```
> **Intent detected:** User wants to `build`. Suggest they use the command.
```

El intent se consume después de inyectarse (transitorio, no persistido entre sesiones).

### Prioridad: Comandos sobre menciones

Los comandos slash (`/build`, `/review`) tienen prioridad sobre las menciones (`@tlaloc`). Si el usuario escribe `@tlaloc /review`, se activa tezcatlipoca (por el comando), no tlaloc (por la mención).

## Cómo funciona

1. **Al iniciar sesión**: `experimental.chat.system.transform` detecta qué agente primario está activo (6 agentes), lo persiste en `.sdd-state.json`, e inyecta el estado SDD + role rules + sugerencias de intent en el system prompt. La detección usa tres mecanismos (ver Agent Detection Architecture).
2. **Cada mensaje**: `chat.message` detecta menciones de agente, comandos slash, e intención. Los comandos tienen prioridad sobre las menciones. Cuando detecta una mención o comando, actualiza el agente activo y persiste el cambio.
3. **Antes de cada herramienta**: `tool.execute.before` valida permisos del agente contra `TOOL_PERMISSIONS`, bloquea comandos destructivos, y verifica SDD phase enforcement.
4. **Después de cada herramienta**: `tool.execute.after` registra en el log de auditoría.
5. **En compactación**: `experimental.session.compacting` re-inyecta el estado SDD + role rules y persiste el estado del pipeline.

> El meta-skill (`using-agent-skills`) **no** se inyecta automáticamente para ahorrar tokens (~4,000 por llamada). OpenCode lo expone como skill disponible; los agentes lo cargan bajo demanda con la herramienta `skill`.

## Agent Detection Architecture

La detección de agentes usa **tres mecanismos**:

### 1. Identity Patterns (alta confianza — system prompt)
Patrones que matchean en el prompt del agente activo:
```
"You are **Tlaloc**" → detecta tlaloc
"You are **Huitzilopochtli**" → detecta huitzilopochtli
```

### 2. Agent Mention Patterns (user messages)
Detección de menciones en mensajes del usuario:
```
@tlaloc, agente tezcatlipoca → actualiza agente activo
```

### 3. Command-Agent Map (slash commands)
Mapeo de comandos slash a su agente primario:
```
/build → tlaloc
/review → tezcatlipoca
/spec → quetzalcoatl
```

**Flujo completo:**
1. `system.transform` detecta agente desde system prompt (identity → keywords)
2. `chat.message` detecta menciones y comandos en mensajes del usuario (comandos > menciones)
3. Estado persistido en `.sdd-state.json` se actualiza en ambos hooks

## Subagent Delegation

Los agentes primarios pueden delegar a subagentes vía `task()`. Cada subagente opera en un subcontexto aislado con sus **propios permisos**, no con los del padre.

| Agente primario | ¿Puede delegar? | Subagentes típicos |
|----------------|:---:|---|
| huitzilopochtli | ✅ docs + code | Cualquier subagente del catálogo (flexible) |
| quetzalcoatl | ✅ docs only | docs-writer, accessibility-tester, ux-researcher |
| moctezuma | ❌ | (no delega) |
| tlaloc | ✅ docs + code | backend-developer, frontend-developer, test-engineer, etc. |
| mictlantecuhtli | ❌ | (no delega — él es el juez final) |
| tezcatlipoca | ❌ | (no delega — solo observa y critica) |

## Fuente

Plugin: `sdd-pipeline.ts` (730 líneas)
