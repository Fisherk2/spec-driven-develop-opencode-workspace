# MCP Servers in OpenCode

MCP (Model Context Protocol) allows integrating external tools and services into OpenCode. OpenCode supports both local and remote MCP Servers.

> **Official documentation:** [opencode.ai/docs/mcp-servers](https://opencode.ai/docs/mcp-servers/)
>
> **Find MCP Servers:** [mcp.so](https://mcp.so) | [glama.ai/mcp/servers](https://glama.ai/mcp/servers)

---

## Important Note: Context Consumption

MCP Servers add tokens to the context. The more MCP Tools are enabled, the faster you'll reach the context limit.

**Recommendation:** Only enable the MCP Servers you actually need. Disable servers globally and enable them only for specific agents.

---

## Local MCP Servers

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

### Options

| Option        | Type    | Required | Description                         |
|---------------|---------|----------|-------------------------------------|
| `type`        | String  | Yes      | Must be `"local"`                  |
| `command`     | Array   | Yes      | Command and arguments               |
| `environment` | Object  | No       | Environment variables               |
| `enabled`     | Boolean | No       | Enabled/Disabled at startup     |
| `timeout`     | Number  | No       | Timeout in ms (default: 5000) |

---

## Remote MCP Servers

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

### Options

| Option    | Type    | Required | Description                         |
|-----------|---------|----------|-------------------------------------|
| `type`    | String  | Yes      | Must be `"remote"`                 |
| `url`     | String  | Yes      | MCP Server URL                  |
| `enabled` | Boolean | No       | Enabled/Disabled at startup     |
| `headers` | Object  | No       | HTTP Headers                        |
| `oauth`   | Object  | No       | OAuth configuration                 |
| `timeout` | Number  | No       | Timeout in ms (default: 5000) |

---

## OAuth Authentication

### Automatic (Dynamic Client Registration)

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

### With Pre-registered Credentials

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

### CLI Commands

```bash
opencode mcp auth my-oauth-server    # Authenticate
opencode mcp list                     # Show servers and authentication status
opencode mcp logout my-oauth-server   # Remove credentials
```

---

## Per-Agent MCP Server Control

**Strategy:** Disable globally, enable per agent.

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

## Recommended MCP Servers

### Context7 -- Documentation Search

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

Usage: `use context7` in the prompt

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

### Grep by Vercel -- GitHub Code Search

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

### Other Useful MCP Servers

| Server     | Description                  | URL/Package |
|------------|------------------------------|-------------|
| **Filesystem** | File system access | `@modelcontextprotocol/server-filesystem` |
| **GitHub**    | GitHub API (Careful: many tokens!) | `@modelcontextprotocol/server-github` |
| **PostgreSQL** | Database access       | `@modelcontextprotocol/server-postgres` |
| **Puppeteer** | Browser automation  | `@modelcontextprotocol/server-puppeteer` |
| **Memory**    | Persistent storage    | `@modelcontextprotocol/server-memory` |

---

## Best Practices

1. **Less is more:** Only enable the MCP Servers you actually need
2. **Per-Agent Activation:** Disable MCP Servers globally and turn them on only for specific agents
3. **Use AGENTS.md:** Add instructions like "Use context7 for documentation lookups"
4. **Environment Variables:** Always reference secrets with `{env:VAR_NAME}`, never hardcoded
5. **Configure Timeouts:** For slow servers, increase the timeout
6. **Avoid GitHub MCP:** Consumes many tokens -- use `gh` CLI via Bash instead