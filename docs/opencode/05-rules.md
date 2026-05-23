# Rules (AGENTS.md) en OpenCode

Rules son instrucciones específicas de proyecto y usuario que OpenCode proporciona en el contexto del LLM. Se definen a través de archivos `AGENTS.md` o la configuración `instructions`.

> **Documentación oficial:** [opencode.ai/docs/rules](https://opencode.ai/docs/rules/)

---

## Crear AGENTS.md

### Automáticamente

```bash
opencode
# Luego en el TUI:
/init
```

Escanea el proyecto y genera un `AGENTS.md` apropiado.

### Manualmente

Crea un `AGENTS.md` en la raíz del proyecto:

```markdown
# My Project

This is a TypeScript monorepo using bun workspaces.

## Project Structure
- `packages/` - Workspace packages (functions, core, web)
- `infra/` - Infrastructure definitions
- `sst.config.ts` - Main configuration

## Code Standards
- Use TypeScript with strict mode
- Shared code goes in `packages/core/`
- Import via workspace names: `@my-app/core/example`

## Testing
- Use vitest for unit tests
- Run `bun test` for full suite
- Minimum 80% coverage

## Conventions
- Conventional commits (feat:, fix:, chore:)
- PR reviews required before merge
```

---

## Tipos de Archivos y Ubicaciones

### Específico del proyecto

`AGENTS.md` en la raíz del proyecto. Se commitea a Git y se comparte con el equipo.

### Global (personal)

`~/.config/opencode/AGENTS.md` -- aplica a todas las sesiones de OpenCode.

**Recomendación:** Preferencias personales aquí (ej. idioma, estilo de código, patrones preferidos).

### Compatibilidad con Claude Code

Como fallback también se soportan:
- `CLAUDE.md` (si no hay `AGENTS.md`)
- `~/.claude/CLAUDE.md` (si no hay `AGENTS.md` global)

Se puede desactivar con:
```bash
export OPENCODE_DISABLE_CLAUDE_CODE=1
```

---

## Prioridad

1. Archivos locales (hacia arriba desde el directorio actual): `AGENTS.md`, `CLAUDE.md`
2. Archivo global: `~/.config/opencode/AGENTS.md`
3. Archivo Claude Code: `~/.claude/CLAUDE.md`

Gana el primer archivo coincidente por categoría.

---

## Instrucciones Custom por Config

### Incluir archivos locales

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [
    "CONTRIBUTING.md",
    "docs/guidelines.md",
    ".cursor/rules/*.md"
  ]
}
```

### URLs remotas

```json
{
  "instructions": [
    "https://raw.githubusercontent.com/my-org/shared-rules/main/style.md"
  ]
}
```

Las instrucciones remotas se cargan con timeout de 5 segundos.

---

## Referenciar archivos externos

### Recomendado: opencode.json

```json
{
  "instructions": [
    "docs/development-standards.md",
    "test/testing-guidelines.md",
    "packages/*/AGENTS.md"
  ]
}
```

### Alternativa: Lazy Loading en AGENTS.md

```markdown
# Project Rules

## External File Loading
CRITICAL: When you encounter a file reference (e.g., @rules/general.md),
use your Read tool to load it on a need-to-know basis.

## Guidelines
For TypeScript code style: @docs/typescript-guidelines.md
For React patterns: @docs/react-patterns.md
For API design: @docs/api-standards.md
For testing: @test/testing-guidelines.md
```

---

## Mejores Prácticas

1. **Commitear AGENTS.md a Git:** Estándares del equipo
2. **AGENTS.md global para preferencias personales:** Idioma, estilo, comportamiento del editor
3. **instructions en opencode.json:** Reutilizar docs existentes en lugar de duplicar
4. **Glob Patterns para monorepos:** `packages/*/AGENTS.md`
5. **Mantenerlo compacto:** Solo lo importante. El agente tiene contexto limitado.
6. **Documentar estructura de proyecto:** Ayuda masivamente al agente a navegar
7. **Usar /init:** Generación automática como punto de partida