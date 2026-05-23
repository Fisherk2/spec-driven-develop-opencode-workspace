# Agent Skills en OpenCode

> **📖 For task-to-skill discovery, see the [Meta-Skill](../../skills/using-agent-skills/SKILL.md) — it contains the decision tree for finding which skill applies to your current task. For the complete skills reference by phase, see [USER_GUIDE.md > Skills Reference](../../USER_GUIDE.md#skills-reference).

Skills son instrucciones reutilizables que OpenCode puede descubrir desde tu repositorio o directorio home. Se cargan bajo demanda a través de la herramienta nativa `skill` -- los agentes ven los skills disponibles y pueden cargar el contenido cuando sea necesario.

> **Documentación oficial:** [opencode.ai/docs/skills](https://opencode.ai/docs/skills/)

---

## Estructura de Directorios

Crea una carpeta por nombre de skill con una `SKILL.md` dentro:

```
skills/
  skill-name/
    SKILL.md           # Required: The skill definition
    supporting-file.md # Optional: Reference material loaded on demand
```

### Rutas Soportadas

| Ruta                                             | Tipo                |
|--------------------------------------------------|---------------------|
| `skills/<name>/SKILL.md`               | Proyecto (Con symlink)|
| `.opencode/skills/<name>/SKILL.md`               | Proyecto (OpenCode)  |
| `~/.config/opencode/skills/<name>/SKILL.md`     | Global (OpenCode)   |
| `.claude/skills/<name>/SKILL.md`                 | Proyecto (Claude-compatible) |
| `~/.claude/skills/<name>/SKILL.md`               | Global (Claude-compatible) |
| `.agents/skills/<name>/SKILL.md`                 | Proyecto (Agent-compatible) |
| `~/.agents/skills/<name>/SKILL.md`               | Global (Agent-compatible) |

---

## Estructura SKILL.md

Cada `SKILL.md` comienza con YAML Frontmatter:

```markdown
---
name: git-release
description: Create consistent releases and changelogs
license: MIT
compatibility: opencode
metadata:
  audience: maintainers
  workflow: github
---

# Skill Title

## Overview
One-two sentences explaining what this skill does and why it matters.

## When to Use
- Bullet list of triggering conditions (symptoms, task types)
- When NOT to use (exclusions)

## [Core Process / The Workflow / Steps]
The main workflow, broken into numbered steps or phases.
Include code examples where they help.
Use flowcharts (ASCII) where decision points exist.

## [Specific Techniques / Patterns]
Detailed guidance for specific scenarios.
Code examples, templates, configuration.

## Common Rationalizations
| Rationalization | Reality |
|---|---|
| Excuse agents use to skip steps | Why the excuse is wrong |

## Red Flags
- Behavioral patterns indicating the skill is being violated
- Things to watch for during review

## Verification
After completing the skill's process, confirm:
- [ ] Checklist of exit criteria
- [ ] Evidence requirements
```

### Campos Obligatorios

| Campo         | Descripción                                     | Obligatorio |
|---------------|------------------------------------------------|-------------|
| `name`        | Nombre del skill (1-64 caracteres, lowercase)     | Sí          |
| `description` | Descripción (1-1024 caracteres)                 | Sí          |
| `license`     | Licencia                                       | No          |
| `compatibility` | Compatibilidad                                | No          |
| `metadata`    | Mapa Key-Value (Strings)                       | No          |

### Reglas de Nomenclatura

- 1-64 caracteres
- Solo caracteres alfanuméricos lowercase con guiones simples
- No puede comenzar o terminar con `-`
- Sin `--` consecutivos
| **Debe coincidir con el nombre del directorio**

Regex: `^[a-z0-9]+(-[a-z0-9]+)*$`

---

## Cómo los Agentes Descubren Skills

OpenCode lista los skills disponibles en la descripción de la herramienta `skill`:

```xml
<available_skills>
  <skill>
    <name>git-release</name>
    <description>Create consistent releases and changelogs</description>
  </skill>
</available_skills>
```

El agente carga un skill con:
```
skill({ name: "git-release" })
```

---

## Configurar Permissions

### Global

```json
{
  "permission": {
    "skill": {
      "*": "allow",
      "pr-review": "allow",
      "internal-*": "deny",
      "experimental-*": "ask"
    }
  }
}
```

| Permission | Comportamiento                                      |
|------------|-----------------------------------------------------|
| `allow`    | El skill se carga inmediatamente                  |
| `deny`     | El skill está oculto, acceso denegado               |
| `ask`      | Se pregunta al usuario antes de cargar             |

### Por Agente (Markdown)

```yaml
---
permission:
  skill:
    "documents-*": "allow"
---
```

### Por Agente (JSON)

```json
{
  "agent": {
    "plan": {
      "permission": {
        "skill": {
          "internal-*": "allow"
        }
      }
    }
  }
}
```

### Deshabilitar completamente la herramienta Skill

```json
{
  "agent": {
    "plan": {
      "tools": {
        "skill": false
      }
    }
  }
}
```

---

## Solución de Problemas

Si un skill no aparece:

1. Verifica si `SKILL.md` está correctamente capitalizado
2. Verifica si el Frontmatter contiene `name` y `description`
3. Asegúrate de que los nombres de skill son únicos en todas las rutas
4. Verifica las permissions -- skills con `deny` están ocultos

---

## Naming Conventions

- Skill directories: `lowercase-hyphen-separated`
- Skill files: `SKILL.md` (always uppercase)
- Supporting files: `lowercase-hyphen-separated.md`
- References: stored in `references/` at the project root, not inside skill directories

## Mejores Prácticas

1. **Formular descripciones precisas** -- El agente decide basado en la Description si carga el skill
2. **Sección "When to use me"** -- Ayuda al agente a decidir
3. **Skills modulares** -- Cada skill con una tarea clara
4. **Skills globales para flujos de trabajo personales** en `~/.config/opencode/skills/`
5. **Skills de proyecto para flujos de trabajo en equipo** en `.opencode/skills/` (commitear a Git)

## Cross-Skill References

Reference other skills by name:

```markdown
Follow the @test-driven-development skill for writing tests.
If the build breaks, use the @debugging-and-error-recovery skill.
```

Don't duplicate content between skills — reference and link instead.

For **cross-phase navigation**, the [Meta-Skill](../../skills/using-agent-skills/SKILL.md) serves as the canonical index. Its Quick Reference table lists every skill alongside its phase, so agents and humans can find any skill from any entry point.

---

## Ejemplos de Skills

Definiciones de skills listas para usar las encuentras en [`skills/`](../../skills/).