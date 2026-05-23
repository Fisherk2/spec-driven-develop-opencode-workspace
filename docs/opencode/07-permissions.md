# Permissions en OpenCode

Permissions controlan qué acciones se ejecutan automáticamente, solicitan confirmación o son bloqueadas.

> **Documentación oficial:** [opencode.ai/docs/permissions](https://opencode.ai/docs/permissions/)

---

## Acciones

| Acción   | Descripción                          |
|----------|--------------------------------------|
| `allow`  | Ejecutar sin preguntar               |
| `ask`    | Solicitar confirmación antes de ejecutar |
| `deny`   | Bloquear acción                     |

---

## Configuración Global

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "*": "ask",
    "bash": "allow",
    "edit": "deny"
  }
}
```

O todas a la vez:

```json
{
  "permission": "allow"
}
```

---

## Reglas Granulares (Sintaxis Object)

Gana la última regla coincidente. Regla `"*"` general primero, luego las específicas.

### Comandos Bash

```json
{
  "permission": {
    "bash": {
      "*": "ask",
      "git *": "allow",
      "npm *": "allow",
      "rm *": "deny",
      "grep *": "allow"
    }
  }
}
```

### Ediciones de Archivos

```json
{
  "permission": {
    "edit": {
      "*": "deny",
      "packages/web/src/content/docs/*.mdx": "allow"
    }
  }
}
```

### Wildcards

- `*` coincide con cero o más caracteres arbitrarios
- `?` coincide con exactamente un caracter

---

## Permission-Keys Disponibles

| Key                   | Descripción                                | Coincidencia Granular |
|-----------------------|-------------------------------------------|----------------------|
| `read`                | Leer archivo                               | Ruta de archivo      |
| `edit`                | Todas las modificaciones de archivo (edit, write, patch) | Ruta de archivo |
| `glob`                | Búsqueda de archivos                      | Glob Pattern         |
| `grep`                | Búsqueda de contenido                     | Regex Pattern        |
| `list`                | Listar directorio                          | Ruta de directorio    |
| `bash`                | Comandos shell                            | Comando parseado     |
| `task`                | Iniciar subagent                          | Tipo de subagent     |
| `skill`               | Cargar skill                               | Nombre de skill       |
| `lsp`                 | Consultas LSP                             | (no granular)        |
| `webfetch`            | Obtener URL                               | URL                  |
| `websearch`           | Búsqueda web                              | Query                |
| `external_directory`  | Acceso fuera del directorio del proyecto  | Ruta                 |
| `doom_loop`           | Mismo tool-call 3 veces repetido           | -                    |

---

## Valores Predeterminados

- La mayoría de permissions son `"allow"` por defecto
- `doom_loop` y `external_directory` son `"ask"`
- Los archivos `.env` se bloquean por defecto al leer:

```json
{
  "permission": {
    "read": {
      "*": "allow",
      "*.env": "deny",
      "*.env.*": "deny",
      "*.env.example": "allow"
    }
  }
}
```

---

## Permissions por Agente

Las permissions por agente se fusionan con las permissions globales. Las reglas de agente tienen prioridad.

### En opencode.json

```json
{
  "permission": {
    "bash": {
      "*": "ask",
      "git *": "allow"
    }
  },
  "agent": {
    "build": {
      "permission": {
        "bash": {
          "*": "ask",
          "git commit *": "ask",
          "git push *": "deny"
        }
      }
    }
  }
}
```

### En Markdown Agents

```yaml
---
description: Code review without edits
mode: subagent
permission:
  edit: deny
  bash: ask
  webfetch: deny
---
```

---

## Directorios Externos

```json
{
  "permission": {
    "external_directory": {
      "~/projects/personal/**": "allow"
    },
    "edit": {
      "~/projects/personal/**": "deny"
    }
  }
}
```

---

## Qué hace "Ask"

Con `ask`, la UI ofrece tres opciones:
- **once** -- Aprobar solo esta solicitud
- **always** -- Aprobar solicitudes futuras coincidentes (duración de sesión)
- **reject** -- Rechazar solicitud

---

## Mejores Prácticas

1. **Defaults seguras:** `"*": "ask"` como base, permisos específicos encima
2. **Controlar comandos Git:** `git push` y `git commit` con `ask` o `deny`
3. **Bloquear comandos destructivos:** `rm -rf *` con `deny`
4. **Agentes de solo lectura:** `edit: deny` y `bash: deny` para agentes de revisión
5. **Prestar atención al pattern-match:** `"git status"` vs `"git status *"` (con argumentos)
6. **Proteger .env:** Mantener el deny estándar para `.env`