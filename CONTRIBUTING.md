# Contribuir

¡Gracias por tu interés en contribuir! Este proyecto es una colección de skills de ingeniería de grado de producción para agentes de codificación AI.

---

## Añadir una Nueva Skill

1. **Coloca la skill en la carpeta `skills/`**
   - Instálala manualmente creando `skills/<skill-name>/SKILL.md` con el formato adecuado
   - O instálala automáticamente con `find-skills` (que la descargará en la ubicación que indiques)
   - Asegúrate de que el nombre del directorio sea kebab-case

2. **Migra el directorio `references/` si existe**
   - Si la skill contiene un directorio `references/` interno, mueve **todo su contenido** a la carpeta raíz `references/` del proyecto
   - Esto mantiene el material de referencia centralizado y accesible para todas las skills
   - Elimina el directorio `references/` vacío dentro de la skill después de migrar

3. **Crea o ajusta el `SKILL.md`** siguiendo el formato en [docs/ai-agent-setup/skill-anatomy.md](docs/ai-agent-setup/skill-anatomy.md)
   - Incluye frontmatter YAML con los campos `name` y `description`
   - La `description` debe indicar brevemente qué hace la skill, seguida de condiciones "Use when"

4. **Actualiza la documentación de skills disponibles** (prioridad: meta-skill primero):
   - **[skills/using-agent-skills/SKILL.md](skills/using-agent-skills/SKILL.md)** — Añade la skill al árbol de "Skill Discovery" bajo la subsección **"Skill Extras"** y a la tabla "Quick Reference" con la fase **"Extra"**
   - **[USER_GUIDE.md](USER_GUIDE.md)** — Añade la skill a la tabla de fase apropiada y actualiza el árbol de estructura del proyecto

5. **Reinicia tu sesión de OpenCode** para que reconozca la nueva skill

### Estándar de Calidad de las Skills

Las skills deben ser:

- **Específicas** — Pasos accionables, no consejos vagos
- **Verificables** — Criterios de salida claros con requisitos de evidencia
- **Probadas en batalla** — Basadas en flujos de trabajo de ingeniería reales, no ideales teóricos
- **Mínimas** — Solo el contenido necesario para guiar al agente correctamente

### Estructura

Toda nueva skill debe tener:

- [SKILL.md](docs/ai-agent-setup/skill-anatomy.md) en el directorio de la skill
- Frontmatter YAML con `name` y `description` válidos

Las nuevas skills deben seguir generalmente la anatomía estándar:

- **Overview** — Qué hace esta skill y por qué importa
- **When to Use** — Condiciones de activación
- **Process** — Flujo de trabajo paso a paso
- **Common Rationalizations** — Excusas que los agentes usan para saltarse pasos, con refutaciones
- **Red Flags** — Señales de advertencia de que la skill se está aplicando incorrectamente
- **Verification** — Cómo confirmar que la skill se aplicó correctamente

### Qué No Hacer

- No dupliques contenido entre skills — referencia otras skills en su lugar
- No añadas skills que sean consejos vagos en lugar de procesos accionables
- No crees archivos de soporte a menos que el contenido supere las 100 líneas
- No pongas material de referencia dentro de los directorios de skills — usa `references/` en su lugar

### Referencias

Para más información sobre descubrimiento de skills, anatomía de skills, y referencia completa:

- [skills/using-agent-skills/SKILL.md](skills/using-agent-skills/SKILL.md) — Meta-skill: árbol de decisión para descubrir qué skill aplicar según la tarea, Quick Reference de todas las skills, y operating behaviors globales
- [docs/ai-agent-setup/skill-anatomy.md](docs/ai-agent-setup/skill-anatomy.md) — Guía de creación de skills: frontmatter, secciones estándar, principios de escritura

---

## Añadir un Nuevo Agente

Para añadir un nuevo agente especializado, sigue estos pasos:

### Pasos

1. Crea `agents/<nombre-agente>.md` con el mismo formato de frontmatter que los agentes existentes
2. Define el rol, alcance, formato de salida y reglas
3. Añade un bloque **Composition** al final (Invoke directly when / Invoke via / Do not invoke from another persona)
4. Añade el agente a la tabla en [docs/opencode/08-orchestration-patterns.md](docs/opencode/08-orchestration-patterns.md)
5. **Actualiza la sección `## Agent Personas` en [USER_GUIDE.md](USER_GUIDE.md)** con el nuevo agente
6. Si el agente habilita un nuevo patrón de orquestación, documéntalo en [docs/opencode/08-orchestration-patterns.md](docs/opencode/08-orchestration-patterns.md)

### Reglas para Agentes

- Un agente es un único rol con un único formato de salida. Si necesitas un segundo rol, crea un segundo agente.
- **Los agentes no invocan a otros agentes.** La composición es trabajo de los comandos o del usuario.
- Un agente puede invocar skills (el *cómo*).
- Todo archivo de agente termina con un bloque "Composition" indicando dónde encaja.

### Estructura de un Agente

```
agents/
  <nombre-agente>.md    # Formato frontmatter:
                        # ---
                        # name: nombre-agente
                        # role: Título del rol
                        # perspective: Perspectiva especializada
                        # ---
                        #
                        # [Contenido del agente]
                        #
                        # ## Composition
                        # [Dónde se invoca este agente]
```

### Ejemplo de Frontmatter

El proyecto soporta dos formatos de frontmatter según el tipo de agente:

**Formato simple** (agentes de revisión / QA / seguridad):
```yaml
---
name: code-reviewer
description: Senior code reviewer that evaluates changes across five dimensions — correctness, readability, architecture, security, and performance
---
```

**Formato extendido OpenCode** (agentes que requieren configuración de permisos y modelo):
```yaml
---
description: Build Agent - Execute Plans (Write/Edit Enabled)
mode: primary
color: "#FF55FF"
model: opencode/qwen3.6-plus-free
temperature: 0.9
permission:
  write: allow
  edit: allow
  read: allow
  bash: ask
---
```

Ambos formatos son válidos. Usa el formato simple para agentes puramente analíticos o de revisión, y el extendido para agentes con permisos de escritura y configuración específica de plataforma.

### Agentes Existentes

| Agente | Rol | Propósito |
|--------|-----|----------|
| [analysis](agents/analysis.md) | Architect of Specifications | Transforma ideas y requisitos en planes de ejecución detallados sin generar código |
| [implement](agents/implement.md) | Build Agent | Ejecuta planes de implementación validados — construir, probar y modificar código |
| [code-reviewer](agents/code-reviewer.md) | Senior Staff Engineer | Revisión de cinco ejes antes del merge |
| [security-auditor](agents/security-auditor.md) | Security Engineer | Detección de vulnerabilidades, auditoría OWASP |
| [test-engineer](agents/test-engineer.md) | QA Engineer | Estrategia de pruebas, análisis de cobertura, patrón Prove-It |

### Qué No Hacer

- No crear agentes que invoquen a otros agentes
- No añadir múltiples roles en un solo agente
- No duplicar funcionalidad existente

### Referencias

Para más información sobre orquestación de agentes, patrones válidos e inválidos, y ejemplos de composición, ver:
- [docs/opencode/08-orchestration-patterns.md](docs/opencode/08-orchestration-patterns.md) — Guía completa de agentes y orquestación

---

## Modificar Skills Existentes

- Mantén los cambios enfocados y mínimos
- Preserva la estructura y el tono existentes
- Verifica que el frontmatter YAML siga siendo válido después de las ediciones

---

## Reportar Problemas

Abre un issue si encuentras:

- Una skill que da orientación incorrecta o desactualizada
- Cobertura faltante para un flujo de trabajo de ingeniería común
- Inconsistencias entre skills

---

## Licencia

Al contribuir, aceptas que tus contribuciones serán licenciadas bajo la Licencia MIT.