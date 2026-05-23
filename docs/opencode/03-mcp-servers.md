# MCP Servers en OpenCode

MCP (Model Context Protocol) permite integrar herramientas y servicios externos en OpenCode. OpenCode soporta tanto MCP Servers locales como remotos.

> **Documentación oficial:** [opencode.ai/docs/mcp-servers](https://opencode.ai/docs/mcp-servers/)
>
> **Encontrar MCP Servers:** [mcp.so](https://mcp.so) | [glama.ai/mcp/servers](https://glama.ai/mcp/servers)

---

## Nota Importante: Consumo de Contexto

MCP Servers agregan tokens al contexto. Cuantos más MCP Tools estén activados, más rápido se alcanzará el límite de contexto.

**Recomendación:** Solo activa los MCP Servers que realmente necesites. Desactiva servers globalmente y actívalos solo para agentes específicos.

---

## MCP Servers Locales

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "my-local-mcp": {
      "type": "local",
      "command": ["npx", "-y", "my-mcp-command"],
      "enabled": true,
      "environment": {
        "MY_ENV_VAR": "my_env_var_value"
      }
    }
  }
}
```

### Opciones

| Opción        | Tipo    | Obligatorio | Descripción                         |
|---------------|---------|-------------|-------------------------------------|
| `type`        | String  | Sí          | Debe ser `"local"`                  |
| `command`     | Array   | Sí          | Comando y argumentos               |
| `environment` | Object  | No          | Variables de entorno               |
| `enabled`     | Boolean | No          | Activado/Desactivado al inicio     |
| `timeout`     | Number  | No          | Timeout en ms (predeterminado: 5000) |

---

## MCP Servers Remotos

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "my-remote-mcp": {
      "type": "remote",
      "url": "https://my-mcp-server.com",
      "enabled": true,
      "headers": {
        "Authorization": "Bearer {env:MY_API_KEY}"
      }
    }
  }
}
```

### Opciones

| Opción    | Tipo    | Obligatorio | Descripción                         |
|-----------|---------|-------------|-------------------------------------|
| `type`    | String  | Sí          | Debe ser `"remote"`                 |
| `url`     | String  | Sí          | URL del MCP Server                  |
| `enabled` | Boolean | No          | Activado/Desactivado al inicio     |
| `headers` | Object  | No          | HTTP Headers                        |
| `oauth`   | Object  | No          | Configuración OAuth                 |
| `timeout` | Number  | No          | Timeout en ms (predeterminado: 5000) |

---

## Autenticación OAuth

### Automático (Dynamic Client Registration)

```json
{
  "mcp": {
    "my-oauth-server": {
      "type": "remote",
      "url": "https://mcp.example.com/mcp"
    }
  }
}
```

### Con Credentials pre-registrados

```json
{
  "mcp": {
    "my-oauth-server": {
      "type": "remote",
      "url": "https://mcp.example.com/mcp",
      "oauth": {
        "clientId": "{env:MY_MCP_CLIENT_ID}",
        "clientSecret": "{env:MY_MCP_CLIENT_SECRET}",
        "scope": "tools:read tools:execute"
      }
    }
  }
}
```

### Comandos CLI

```bash
opencode mcp auth my-oauth-server    # Autenticar
opencode mcp list                     # Mostrar servers y estado de autenticación
opencode mcp logout my-oauth-server   # Eliminar credentials
```

---

## Control de MCP Servers por Agente

**Estrategia:** Desactivar globalmente, activar por agente.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "my-mcp": {
      "type": "local",
      "command": ["bun", "x", "my-mcp-command"],
      "enabled": true
    }
  },
  "tools": {
    "my-mcp*": false
  },
  "agent": {
    "my-agent": {
      "tools": {
        "my-mcp*": true
      }
    }
  }
}
```

---

## MCP Servers Recomendados

### Context7 -- Búsqueda de Documentación

```json
{
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp"
    }
  }
}
```

Uso: `use context7` en el prompt

### Sentry -- Error Tracking

```json
{
  "mcp": {
    "sentry": {
      "type": "remote",
      "url": "https://mcp.sentry.dev/mcp",
      "oauth": {}
    }
  }
}
```

Auth: `opencode mcp auth sentry`

### Grep by Vercel -- Búsqueda de Código GitHub

```json
{
  "mcp": {
    "gh_grep": {
      "type": "remote",
      "url": "https://mcp.grep.app"
    }
  }
}
```

### Otros MCP Servers útiles

| Server     | Descripción                  | URL/Package |
|------------|------------------------------|-------------|
| **Filesystem** | Acceso al sistema de archivos | `@modelcontextprotocol/server-filesystem` |
| **GitHub**    | GitHub API (¡Cuidado: muchos tokens!) | `@modelcontextprotocol/server-github` |
| **PostgreSQL** | Acceso a base de datos       | `@modelcontextprotocol/server-postgres` |
| **Puppeteer** | Automatización de navegador  | `@modelcontextprotocol/server-puppeteer` |
| **Memory**    | Almacenamiento persistente    | `@modelcontextprotocol/server-memory` |

---

## Mejores Prácticas

1. **Menos es más:** Solo activa los MCP Servers que realmente necesites
2. **Activación por Agente:** Desactiva MCP Servers globalmente y enciéndelos solo para agentes específicos
3. **Usa AGENTS.md:** Agrega instrucciones como "Use context7 for documentation lookups"
4. **Variables de Entorno:** Siempre referencia secrets con `{env:VAR_NAME}`, nunca hardcodeadas
5. **Configura Timeouts:** Para servers lentos, aumenta el timeout
6. **Evita GitHub MCP:** Consume muchos tokens -- usa en su lugar `gh` CLI via Bash