# Configuración de OpenCode

Esta guía explica cómo configurar OpenCode para esta plantilla — comandos slash, personas de agente, skills y el flujo de trabajo SDD completo.

> **Para una referencia completa de todos los skills y comandos**, consulta [USER_GUIDE.md](../../USER_GUIDE.md).

---

## Prerrequisitos

- **OpenCode IDE** — El único IDE compatible con esta plantilla
- **Node.js >= 18** y **bun**
- **Git**

---

## Resumen de la Estructura del Proyecto

Cuando abres este proyecto en OpenCode, estos son los archivos y directorios clave con los que el IDE interactúa:

```
project-root/
├── AGENTS.md              # Personas de agente, reglas y orquestación
├── commands/              # 7 comandos slash cargados por OpenCode
│   ├── spec.md            #   /spec  → fase DEFINE
│   ├── plan.md            #   /plan  → fase PLAN
│   ├── build.md           #   /build → fase BUILD
│   ├── test.md            #   /test  → fase VERIFY
│   ├── review.md          #   /review → fase REVIEW
│   ├── code-simplify.md   #   /code-simplify → simplificación
│   └── ship.md            #   /ship  → fase SHIP
├── agents/                # 5 personas de agente especializadas
│   ├── analysis.md        #   Arquitecto de Especificaciones
│   ├── implement.md       #   Agente de Build
│   ├── code-reviewer.md   #   Ingeniero Senior Staff
│   ├── test-engineer.md   #   Especialista en QA
│   └── security-auditor.md #   Ingeniero de Seguridad
├── skills/                # 33 skills de ingeniería (SKILL.md por directorio)
│   ├── spec-driven-development/
│   ├── test-driven-development/
│   └── ...
└── .opencode/             # Configuración de OpenCode
    ├── agents/ → agents/  #   Symlink a agents/
    ├── commands/ → commands/ # Symlink a commands/
    ├── skills/ → skills/  #   Symlink a skills/
    └── package.json       #   Dependencias de plugins
```

---

## Qué Hace OpenCode Automáticamente

### 1. Carga Comandos Slash

El directorio `commands/` es detectado automáticamente por OpenCode. Escribe `/` en el chat para ver todos los comandos disponibles:

| Comando | Fase | Qué hace |
|---------|------|----------|
| `/spec` | DEFINE | Crea una especificación estructurada antes de escribir código |
| `/plan` | PLAN | Divide especificaciones en tareas pequeñas y ordenadas |
| `/build` | BUILD | Implementación incremental con TDD |
| `/test` | VERIFY | Escribe tests fallidos, implementa, refactoriza |
| `/review` | REVIEW | Revisión de código multi-eje antes del merge |
| `/code-simplify` | REVIEW | Simplifica código complejo sin cambiar su comportamiento |
| `/ship` | SHIP | Lista de verificación pre-lanzamiento, despliegue gradual, monitoreo |

Los comandos también activan skills complementarios automáticamente. Por ejemplo, `/build` activa `incremental-implementation` más `solid`, `error-handling-patterns`, `ui-ux-design-pro`, y otros dependiendo de la tarea.

### 2. Proporciona Personas de Agente

El directorio `agents/` define 5 agentes especializados. Cada uno tiene un rol, perspectiva y formato de salida específicos. Puedes invocarlos directamente:

- `analysis` — Analizar, diseñar y planificar antes de escribir código
- `implement` — Ejecutar planes de build validados
- `code-reviewer` — Revisión de cinco ejes antes del merge
- `test-engineer` — Estrategia de pruebas y análisis de cobertura
- `security-auditor` — Detección de vulnerabilidades y evaluación OWASP

Comandos como `/review` y `/ship` componen múltiples agentes automáticamente.

### 3. Descubre Skills

Los 33 skills viven en `skills/<nombre-skill>/SKILL.md`. Los agentes de OpenCode reciben instrucciones (vía `AGENTS.md`) para:

1. Detectar cuándo un skill aplica a la tarea actual
2. Cargar el skill usando la herramienta integrada `skill`
3. Seguir el flujo de trabajo del skill paso a paso

Los skills se activan tanto a través de comandos slash como automáticamente según el contexto — diseñar una API activa `api-and-interface-design`, construir UI activa `frontend-ui-engineering`, depurar activa `debugging-and-error-recovery`, y así sucesivamente.

---

## Primeros Pasos Después de Abrir el Proyecto

### 1. Instalar Dependencias de Plugins

```bash
cd .opencode && bun install && cd ..
```

### 2. Configurar Context7 (Opcional pero Recomendado)

Context7 proporciona documentación actualizada para cualquier librería o framework:

```bash
npx ctx7@latest setup
```

Una vez configurado, el skill `find-docs` obtiene automáticamente la documentación actual de la API cuando preguntas sobre cualquier librería.

### 3. Comenzar con el Meta-Skill

Carga el [Meta-Skill](../../skills/using-agent-skills/SKILL.md) para descubrir qué skill aplica a tu tarea actual. Contiene:
- Un **árbol de decisión** que mapea tipos de tarea (implementar código, diseñar API, depurar, etc.) al skill apropiado
- **Comportamientos operativos centrales** que aplican a todos los skills (superficiar suposiciones, gestionar confusión, objetar)
- Una tabla de **Referencia Rápida** que resume cada skill por fase

> Este es el punto de entrada canónico para el descubrimiento de skills. Tanto agentes como humanos deberían consultarlo cuando no estén seguros de qué skill aplica.

### 4. Ejecutar tu Primer Flujo de Trabajo

```bash
/spec "Describe lo que quieres construir"
/plan
/build
/test
/review
/ship
```

---

> **📖 Para la anatomía completa de los skills (diagrama, principios clave, cómo funcionan los skills):** consulta [USER_GUIDE.md > Skills Reference](../../USER_GUIDE.md#skills-reference). Esta guía de configuración se enfoca solo en la configuración de OpenCode.

---

## Archivos de Configuración

### AGENTS.md

Este archivo define las personas de agente, sus reglas y orquestación. Instruye a los agentes para:
- Verificar siempre si un skill aplica antes de actuar
- Seguir los skills exactamente cuando aplican
- Nunca saltarse flujos de trabajo requeridos (spec, plan, test)
- Superficiar suposiciones y gestionar la confusión activamente

### .opencode/package.json

Contiene la dependencia de plugin de OpenCode requerida:

```json
{
  "dependencies": {
    "@opencode-ai/plugin": "1.15.0"
  }
}
```

---

## Solución de Problemas

| Problema | Causa Posible | Solución |
|----------|---------------|----------|
| `/spec` no funciona | Plugin no instalado | Ejecuta `cd .opencode && bun install` |

> **Para la tabla completa de solución de problemas (Context7, skills, y más):** consulta [USER_GUIDE.md](../../USER_GUIDE.md#troubleshooting).

---

## Documentación Relacionada

| Guía | Cubre |
|------|-------|
| [Meta-Skill (using-agent-skills)](../../skills/using-agent-skills/SKILL.md) | Árbol de decisión para descubrimiento de skills, comportamientos operativos centrales, modos de fallo e índice de Referencia Rápida de todos los skills |
| [USER_GUIDE.md](../../USER_GUIDE.md) | Referencia completa de los 33 skills, comandos y flujos de trabajo |
| [08-orchestration-patterns.md](./08-orchestration-patterns.md) | Personas de agente, patrones de orquestación y matriz de decisión |