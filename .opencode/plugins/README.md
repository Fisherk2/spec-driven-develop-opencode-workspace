# SDD Pipeline Plugin

OpenCode plugin que hookea el lifecycle de la API real del SDK `@opencode-ai/plugin`.

## Hooks implementados

| Evento (API real) | Propósito |
|---|---|
| `experimental.chat.system.transform` | Inyecta meta-skill + estado SDD en el system prompt desde el PRIMER mensaje |
| `chat.message` | Detecta intención del usuario y sugiere slash commands SDD |
| `tool.execute.before` | Bloquea comandos destructivos + separación analysis/implement |
| `tool.execute.after` | Auditoría de herramientas |
| `experimental.session.compacting` | Re-inyecta meta-skill durante compactación + persiste estado |

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

- `.opencode/plugins/.sdd-state.json` — estado persistido del pipeline
- `.opencode/plugins/.sdd-audit.log` — traza de auditoría append-only

Ambos ignorados por git.

## Cómo funciona

1. **Al iniciar sesión**: `experimental.chat.system.transform` inyecta el meta-skill y estado SDD en el system prompt
2. **Cada mensaje**: `chat.message` detecta palabras clave y sugiere `/spec`, `/build`, etc.
3. **Antes de cada herramienta**: `tool.execute.before` bloquea rm -rf, git push --force, y agentes fuera de rol
4. **Después de cada herramienta**: `tool.execute.after` registra en el log de auditoría
5. **En compactación**: `experimental.session.compacting` re-inyecta el meta-skill y persiste el estado

## Fuente

Plugin: `sdd-pipeline.ts`
