# Agentes en OpenCode

Los agentes son asistentes de IA especializados en OpenCode que pueden ser configurados para tareas y flujos de trabajo específicos. Permiten crear herramientas enfocadas con sus propios prompts, modelos y acceso a herramientas.

> **Documentación oficial:** [opencode.ai/docs/agents](https://opencode.ai/docs/agents/)

---

## Tipos de Agentes

### Primary Agents

Primary Agents son los asistentes principales con los que interactúas directamente. Cambias entre ellos con **Tab**.

| Agente      | Modo     | Descripción                                  |
|-------------|----------|---------------------------------------------|
| **Build**   | `primary` | Agente estándar con todas las herramientas activadas |
| **Plan**    | `primary` | Agente de análisis y planificación, de solo lectura |

### Subagents

Subagents son llamados por Primary Agents para tareas especializadas o mencionados manualmente con `@mention`.

| Agente      | Modo       | Descripción                                         |
|-------------|------------|-----------------------------------------------------|
| **General** | `subagent` | Agente de propósito general, acceso completo a herramientas |
| **Explore** | `subagent` | Agente de solo lectura rápido para exploración de código base |

### Agentes de Sistema Ocultos

| Agente       | Función                          |
|--------------|----------------------------------|
| **Compaction** | Comprime el contexto largo       |
| **Title**     | Genera títulos cortos de sesión  |
| **Summary**   | Crea resúmenes de sesión        |

---

## Configurar Agentes

### Por JSON (opencode.json)

```json
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "build": {
      "mode": "primary",
      "model": "anthropic/claude-sonnet-4-20250514",
      "prompt": "{file:./prompts/build.txt}"
    },
    "plan": {
      "mode": "primary",
      "model": "anthropic/claude-haiku-4-20250514"
    },
    "code-reviewer": {
      "description": "Revisa código por mejores prácticas y posibles problemas",
      "mode": "subagent",
      "model": "anthropic/claude-sonnet-4-20250514",
      "prompt": "You are a code reviewer. Focus on security, performance, and maintainability.",
      "permission": {
        "edit": "deny",
        "bash": "deny"
      }
    }
  }
}
```

### Por Markdown (.opencode/agents/*.md)

Los agentes también pueden definirse como archivos Markdown:

- **Global:** `~/.config/opencode/agents/`
- **Por proyecto:** `.opencode/agents/`

El nombre del archivo se convierte en el nombre del agente (ej. `review.md` -> Agente `review`).

```markdown
---
description: Revisa código por calidad y mejores prácticas
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.1
permission:
  edit: deny
  bash:
    "*": ask
    "git diff": allow
    "git log*": allow
  webfetch: deny
---

You are in code review mode. Focus on:

- Code quality and best practices
- Potential bugs and edge cases
- Performance implications
- Security considerations

Provide constructive feedback without making direct changes.
```

---

## Opciones de Configuración Importantes

### Description (Obligatorio)

```json
"description": "Revisa código por mejores prácticas y posibles problemas"
```

### Model

Anula el modelo por agente. Si no se especifica, los Primary Agents usan el modelo global; los Subagents usan el modelo del Primary Agent que los llama.

```json
"model": "anthropic/claude-haiku-4-20250514"
```

### Temperature

Controla la creatividad (0.0-1.0):
- **0.0-0.2:** Determinístico, ideal para análisis de código
- **0.3-0.5:** Equilibrado, bueno para desarrollo
- **0.6-1.0:** Creativo, bueno para brainstorming

### Max Steps

Limita las iteraciones agenticas:

```json
"steps": 5
```

### Permissions

```json
"permission": {
  "edit": "deny",
  "bash": {
    "*": "ask",
    "git status *": "allow",
    "git push *": "deny"
  },
  "webfetch": "deny"
}
```

Posibles valores: `"allow"`, `"ask"`, `"deny"`

### Task Permissions (Control de Subagents)

Controla qué Subagents puede llamar un agente:

```json
"permission": {
  "task": {
    "*": "deny",
    "orchestrator-*": "allow",
    "code-reviewer": "ask"
  }
}
```

### Hidden

Oculta un subagent del menú de autocompletado `@`:

```json
"hidden": true
```

### Color

```json
"color": "#ff6b6b"
```

---

## Crear Agente (CLI)

```bash
opencode agent create
```

Wizard interactivo que:
1. Pregunta si es global o específico del proyecto
2. Solicita la descripción
3. Genera el system prompt
4. Configura el acceso a herramientas
5. Crea el archivo Markdown

---

## Mejores Prácticas

1. **Usa modelos separados por agente:** Haiku para Plan/Explore, Sonnet/Opus para Build
2. **Mínimos permisos:** Dale a los agentes solo las herramientas que necesitan
3. **Prompts específicos:** Cuanto más claro sea el system prompt, mejor el resultado
4. **Subagents para tareas recurrentes:** Code Review, Docs, Security Audit
5. **Usa Task Permissions:** Controla qué subagents pueden ser llamados
6. **Ajusta temperature:** Bajo para análisis, alto para tareas creativas

---

## Ejemplos de Agentes

Definiciones de agentes listas para usar las encuentras en [`skills/`](../../skills/).