# Tools & Custom Tools en OpenCode

OpenCode viene con un conjunto de herramientas integradas y permite crear tus propias Custom Tools.

> **Documentación oficial:** [opencode.ai/docs/tools](https://opencode.ai/docs/tools/) | [opencode.ai/docs/custom-tools](https://opencode.ai/docs/custom-tools/)

---

## Built-in Tools

| Tool       | Descripción                                    | Permission Key |
|------------|------------------------------------------------|----------------|
| `bash`     | Ejecutar comandos shell                         | `bash`         |
| `edit`     | Editar archivos (exact string replacement)      | `edit`         |
| `write`    | Crear nuevos archivos / sobreescribir          | `edit`         |
| `read`     | Leer contenidos de archivos                    | `read`         |
| `grep`     | Buscar contenidos con regex                    | `grep`         |
| `glob`     | Encontrar archivos por pattern                  | `glob`         |
| `list`     | Listar directorios                              | `list`         |
| `patch`    | Aplicar patches                                | `edit`         |
| `skill`    | Cargar skills                                  | `skill`        |
| `todowrite` | Administrar listas de tareas                    | `todowrite`    |
| `webfetch` | Obtener contenidos web                          | `webfetch`     |
| `websearch` | Búsqueda web (Exa AI)                         | `websearch`   |
| `question` | Hacer preguntas al usuario                     | `question`     |
| `lsp`      | Consultas LSP (experimental)                   | `lsp`          |

### Configurar Tool Permissions

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "edit": "ask",
    "bash": "ask",
    "webfetch": "allow",
    "read": "allow"
  }
}
```

### Wildcards para MCP Tools

```json
{
  "permission": {
    "mymcp_*": "ask"
  }
}
```

---

## Crear Custom Tools

Custom Tools son archivos TypeScript/JavaScript que el LLM puede llamar durante conversaciones.

### Ubicaciones de almacenamiento

- **Local:** `.opencode/tools/`
- **Global:** `~/.config/opencode/tools/`

### Estructura básica

```typescript
// .opencode/tools/database.ts
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Query the project database",
  args: {
    query: tool.schema.string().describe("SQL query to execute"),
  },
  async execute(args) {
    return `Executed query: ${args.query}`
  },
})
```

El **nombre del archivo** se convierte en el **nombre de la herramienta** (`database.ts` -> Tool `database`).

### Múltiples herramientas por archivo

```typescript
// .opencode/tools/math.ts
import { tool } from "@opencode-ai/plugin"

export const add = tool({
  description: "Add two numbers",
  args: {
    a: tool.schema.number().describe("First number"),
    b: tool.schema.number().describe("Second number"),
  },
  async execute(args) {
    return args.a + args.b
  },
})

export const multiply = tool({
  description: "Multiply two numbers",
  args: {
    a: tool.schema.number().describe("First number"),
    b: tool.schema.number().describe("Second number"),
  },
  async execute(args) {
    return args.a * args.b
  },
})
```

Crea: `math_add` y `math_multiply`.

### Usar Context

```typescript
export default tool({
  description: "Get project information",
  args: {},
  async execute(args, context) {
    const { agent, sessionID, messageID, directory, worktree } = context
    return `Agent: ${agent}, Dir: ${directory}`
  },
})
```

### Tools en otros lenguajes

Ejemplo: Tool Python vía TypeScript Wrapper:

```typescript
// .opencode/tools/python-add.ts
import { tool } from "@opencode-ai/plugin"
import path from "path"

export default tool({
  description: "Add two numbers using Python",
  args: {
    a: tool.schema.number().describe("First number"),
    b: tool.schema.number().describe("Second number"),
  },
  async execute(args, context) {
    const script = path.join(context.worktree, ".opencode/tools/add.py")
    const result = await Bun.$`python3 ${script} ${args.a} ${args.b}`.text()
    return result.trim()
  },
})
```

---

## Archivo .ignore

Tools como `grep`, `glob`, `list` usan internamente ripgrep y respetan `.gitignore`. Para incluir archivos ignorados:

```
# .ignore
!node_modules/
!dist/
!build/
```

---

## Mejores Prácticas

1. **Custom Tools para tareas recurrentes:** DB queries, API calls, build scripts
2. **Descripciones claras:** El agente decide basado en la descripción cuándo usa la herramienta
3. **Usar Zod schemas:** Argumentos tipificados con buenos textos `.describe()`
4. **Respetar permissions:** Custom Tools con el mismo nombre que Built-in Tools los anulan
5. **Usar context.worktree:** Para rutas relativas dentro del proyecto