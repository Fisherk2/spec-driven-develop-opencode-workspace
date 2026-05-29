# SDD Pipeline Plugin

OpenCode plugin que hookea el lifecycle de la API real del SDK `@opencode-ai/plugin`.

## Hooks implementados

| Evento (API real) | Propósito |
|---|---|
| `experimental.chat.system.transform` | Detecta y persiste tipo de agente + inyecta estado SDD + role rules en el system prompt |
| `chat.message` | Detecta intención del usuario y sugiere slash commands SDD |
| `tool.execute.before` | Bloquea comandos destructivos + separación quetzalcoatl/tezcatlipoca |
| `tool.execute.after` | Auditoría de herramientas |
| `experimental.session.compacting` | Re-inyecta estado SDD + persiste estado del pipeline |

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

- `.opencode/plugins/.sdd-state.json` — estado persistido del pipeline (fase, tareas, tipo de agente)
- `.opencode/plugins/.sdd-audit.log` — traza de auditoría con rotación automática (>500 líneas → trunca a 250)

Ambos ignorados por git.

## Cómo funciona

1. **Al iniciar sesión**: `experimental.chat.system.transform` detecta qué agente primario está activo (6 agentes: huitzilopochtli, quetzalcoatl, moctezuma, tlaloc, mictlantecuhtli, tezcatlipoca), lo persiste en `.sdd-state.json`, e inyecta el estado SDD + role rules en el system prompt. La detección usa dos fases: primero un patrón de identidad de alta confianza (`You are **AgentName**`), luego keywords como fallback.
2. **Cada mensaje**: `chat.message` detecta menciones de agente (`@tlaloc`, `agente tezcatlipoca`), comandos slash (`/build`, `/review`), y palabras clave de intención (`/spec`, `/build`, etc.). Cuando detecta una mención o comando, actualiza el agente activo y persiste el cambio.
3. **Antes de cada herramienta**: `tool.execute.before` bloquea comandos destructivos (rm -rf, git push --force), escritura de código para quetzalcoatl, y modificación de specs para tezcatlipoca
4. **Después de cada herramienta**: `tool.execute.after` registra en el log de auditoría
5. **En compactación**: `experimental.session.compacting` re-inyecta el estado SDD + role rules y persiste el estado del pipeline

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
2. `chat.message` detecta menciones y comandos en mensajes del usuario
3. Estado persistido en `.sdd-state.json` se actualiza en ambos hooks

## Fuente

Plugin: `sdd-pipeline.ts`
