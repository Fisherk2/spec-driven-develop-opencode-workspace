# Recomendaciones de Modelos para OpenCode

OpenCode soporta más de 75 LLM Providers a través de AI SDK y Models.dev. La elección del modelo correcto por agente y tarea tiene un gran impacto en calidad y costos.

> **Documentación oficial:** [opencode.ai/docs/models](https://opencode.ai/docs/models/)

---

## Modelos Recomendados (2026)

Los siguientes modelos funcionan bien con OpenCode (generación de código + tool-calling)

### Propietarios

| Modelo| Provider  | Fortalezas|
| ------ | --------- | -------- |
| **Claude Opus 4.7**   | Anthropic | **Plan & Build Crítico**: Razonamiento de nivel PhD (91.3% GPQA Diamond), contexto 1M. Brilla en arquitectura de sistemas complejos, descomposición de microservicios y diseño de algoritmos. Úsalo para el "System Design" inicial del agente. |
| **Claude Sonnet 4.6** | Anthropic | **Build & Debug Principal**: El workhorse diario. SWE-bench Verified líder, equilibrio perfecto calidad/costo. Ideal para iteración de código, refactoring y agentes de implementación continua.                                                |
| **Claude Haiku 4.5**  | Anthropic | **Explore & Title/Summary**: 73.3% SWE-bench a 1/3 del costo de Sonnet. Velocidad extrema para navegar codebase, indexar símbolos, generar resúmenes de commits y nombrar variables/funciones.                                                  |
| **GPT 5.5 Pro**       | OpenAI    | **Build Ultra-Complejo**: Máxima capacidad generativa. Reservado para módulos donde un error cuesta caro (seguridad, concurrencia, transacciones). Precio premium justificado solo para componentes críticos.                                   |
| **GPT 5.4**           | OpenAI    | **Build & Plan General**: Contexto 128K-400K, excelente para generación de código full-stack y planificación de features medianas. El "default" seguro para agentes de build.                                                                   |
| **GPT 5.2 Codex**     | OpenAI    | **Build Especializado**: Optimizado para sintaxis y patrones de código. Ideal para tareas repetitivas de boilerplate y migraciones de lenguaje.                                                                                                 |
| **o3 / o3-pro**       | OpenAI    | **Plan & Debug Algorítmico**: Razonamiento extendido con thinking tokens. Brilla en depuración de bugs lógicos complejos, race conditions y optimización de queries.                                                                            |
| **o4-mini**           | OpenAI    | **Debug Económico**: Razonamiento a fracción del costo de o3. Perfecto para troubleshooting iterativo en bucles de agente.                                                                                                                      |
| **Gemini 3.1 Pro**    | Google    | **Plan Multimodal**: Contexto 2M tokens. Excelente cuando el agente debe analizar diagramas de arquitectura, PDFs técnicos y especificaciones visuales junto al código.                                                                         |
| **Gemini 2.5 Flash**  | Google    | **Explore & Summary**: \$0.30/\$2.50 por 1M, contexto 1M. El mejor valor para indexar repositorios masivos, generar embeddings semánticos y resumir documentación técnica.                                                                      |
| **Grok 4.3**          | xAI       | **Explore en Tiempo Real**: Acceso a datos actualizados. Útil cuando el agente investiga librerías recién publicadas, CVEs o documentación web no indexada.                                                                                     |
| **Minimax M2.7**      | MiniMax   | **Build**: Benchmarks sólidos en agentic coding. Alternativa viable para equipos que buscan diversificar proveedores en el pipeline de build.                                                                                                   |
### Opensource

| Modelo | Provider | Fortalezas|
| --- | --- | --- |
| **DeepSeek V4 Pro**             | DeepSeek | **Build & Plan**: 56.7% en Agentic Coding (LiveBench). El open source más cercano a GPT-5.4/Claude Sonnet. Ideal para self-hosting de agentes de codificación en entornos privados.            |
| **DeepSeek R1**                 | DeepSeek | **Plan & Debug**: Modelo reasoning open source. \$0.55/\$2.19 por 1M. Excelente para análisis estático, revisión de PRs y detección de vulnerabilidades lógicas.                               |
| **DeepSeek V3.2**               | DeepSeek | **Explore Económico**: \$0.28/\$0.42 por 1M. Ultra barato para tareas de alto volumen: búsqueda en codebase, análisis de dependencias, indexación.                                             |
| **Kimi K2.6 Thinking**          | Moonshot | **Plan & Build**: 58.3% Agentic Coding, contexto masivo (2M+). Supera a muchos privados en análisis de grandes monorepos. Ideal para planificación cuando el contexto es el cuello de botella. |
| **Kimi K2.5**                   | Moonshot | **Build General**: Buen balance para codificación diaria. Fuerte en lenguajes de nicho y legacy code.                                                                                          |
| **Qwen3.6 Plus / Qwen3.5 Plus** | Alibaba  | **Build & Plan**: Líderes open source en benchmarks de código. Qwen Coder especializado en generación de software enterprise. Soporte multilingüe técnico excelente.                           |
| **Qwen3 Coder**                 | Alibaba  | **Build Especializado**: Optimizado para programación. Competidor directo de GPT Codex en tareas de desarrollo puro.                                                                           |
| **GLM 5.1**                     | Z-AI     | **Plan & Build**: 55% Agentic Coding. Fuerte en razonamiento matemático y arquitectura de sistemas distribuidos.                                                                               |
| **Llama 4 Maverick**            | Meta     | **Build & Debug**: Modelo open source avanzado. ~\$0.20/\$0.60 vía APIs. Buen rendimiento en tareas full-stack y debugging general.                                                            |
| **Llama 4 Scout**               | Meta     | **Explore**: Contexto 10M tokens. Sin rival open source para navegar repositorios enormes o analizar logs masivos en un solo paso.                                                             |
| **Mistral Devstral Medium**     | Mistral  | **Build**: Especializado en desarrollo software. Bueno para generación de código estructurado y tests.                                                                                         |
| **Mistral Large 3**             | Mistral  | **Build & Plan**: Capacidad general fuerte, precio competitivo (\$0.50/\$1.50).                                                                                                                |
| **Nemotron 3 Super**            | NVIDIA   | **Build & Debug**: Optimizado por NVIDIA para tareas técnicas. Buen rendimiento en generación de shaders, CUDA y código de sistemas.                                                           |
| **Gemma 4 27B**                 | Google   | **Summary & Explore**: Open source ligero. Ideal para resúmenes rápidos, clasificación de archivos y tareas de routing en pipelines agenticos.                                                 |

### Gratis

| Modelo | Provider | Fortalezas |
|--------|----------|------------|
| **Big Pickle** | OpenCode Zen | **Build & Plan General**: Modelo versátil gratuito. Buen equilibrio para codificación diaria, debugging y análisis de código. Ideal como modelo principal *zero-cost*. |
| **DeepSeek V4 Flash Free** | OpenCode Zen | **Build Rápido**: Contraparte gratuita del DeepSeek V4. Menor capacidad que la versión Pro pero suficiente para tareas de código recurrentes, refactoring ligero y generación de boilerplate. |
| **Nemotron 3 Super Free** | OpenCode Zen | **Build & Debug Técnico**: Optimizado por NVIDIA para tareas técnicas. Buen rendimiento en generación de shaders, CUDA y código de sistemas. Alternativa gratuita sólida para agentes de build. |
| **Qwen3 Coder 480B (free)** | OpenRouter | **Build**: El modelo gratuito más potente para generación de software (contexto 262K). Ideal como modelo principal de agentes de codificación. |
| **DeepSeek R1 (free)** | OpenRouter | **Plan & Debug**: Razonamiento matemático y lógico de nivel GPT-4 (contexto 128K). Excelente para análisis estático, revisión de PRs y depuración de bugs complejos. |
| **Meta Llama 4 Scout (free)** | OpenRouter | **Explore Masivo**: Contexto de 10M de tokens. Sin rival para navegar repositorios enormes o analizar logs extensos en una sola pasada. |
| **Meta Llama 3.3 70B (free)** | OpenRouter | **Build & Plan General**: Sólido propósito general (contexto 128K). Buen equilibrio calidad/velocidad para codificación diaria y planificación de features. |
| **Google Gemini 2.0 Flash (free)** | OpenRouter | **Explore & Summary Multimodal**: Contexto 1M, multimodal. Ideal para analizar documentación técnica, diagramas y resumir repositorios grandes. |
| **DeepSeek V3 (free)** | OpenRouter | **Build Económico**: Alternante general sólida (contexto 128K). Bueno para tareas de código recurrentes cuando Qwen3 Coder no está disponible. |
| **Mistral Small 24B (free)** | OpenRouter | **Build Alternativo**: Alojado en EU (contexto 128K). Buena opción para equipos con requisitos de residencia de datos europeos. |
| **Z-AI GLM 4.5 Air (free)** | OpenRouter | **small_model / Title/Summary**: Ligero y rápido. Ideal como modelo pequeño del sistema para generar títulos, resúmenes y compactación. |
| **MiniMax M2.5 (free)** | OpenRouter | **Build General**: Alternativa gratuita sólida. Buen rendimiento en tareas de codificación estándar. |
| **Nous Hermes 3 (free)** | OpenRouter | **Debug**: Variante de Llama fine-tuneada (contexto 128K). Fuerte en tareas de depuración y análisis de código legado. |
| **Google Gemma 3 12B (free)** | OpenRouter | **Explore Ligero**: Modelo abierto de Google, rápido y eficiente (contexto 128K). Ideal para agentes de exploración en proyectos pequeños. |

> 💡 **Tip:** Puedes usar el router inteligente `openrouter/free` que selecciona automáticamente el mejor modelo gratuito disponible según tu solicitud. O específica uno concreto con `openrouter/<modelo>:free`.

---

## Estrategia de Modelos: Modelos Correctos para Tareas Correctas

### La regla de oro: No uses el modelo más caro en todas partes

```
# Pago
Agente Build     -> Modelo potente    (Sonnet 4.5, Opus 4.5, GPT 5.2)
Agente Plan      -> Modelo económico (Haiku 4.5, GPT 5.1 Codex)
Agente Explore   -> Modelo económico (Haiku 4.5)
Agente Title/Summary -> Modelo más pequeño (automático via small_model)

# Open source
Agente Build     -> DeepSeek V4 Pro, Kimi K2.6 Thinking, Qwen3.6 Plus, GLM 5.1, Llama 4 Maverick
Agente Plan      -> DeepSeek R1, Kimi K2.6 Thinking, Qwen3.5 Plus, GLM 5.1
Agente Explore   -> DeepSeek V3.2, Llama 4 Scout, Qwen3.5 Plus (versión free), Mistral Small
Agente Title/Summary -> Llama 3.2 3B Instruct, Gemma 4 4B/9B, Mistral Small, Qwen3 8B

# Gratis
Agente Build     -> opencode/deepseek-v4-flash-free / opencode/big-pickle / openrouter/qwen/qwen3-coder-480b:free / openrouter/meta-llama/llama-3.3-70b-instruct:free
Agente Plan      -> opencode/big-pickle / opencode/nemotron-3-super-free / openrouter/deepseek/deepseek-r1:free / openrouter/mistral/mistral-small-24b:free
Agente Explore   -> opencode/nemotron-3-super-free / opencode/deepseek-v4-flash-free / openrouter/meta-llama/llama-4-scout:free / openrouter/google/gemini-2.0-flash:free
Agente Title/Summary -> opencode/deepseek-v4-flash-free / openrouter/z-ai/glm-4.5-air:free / openrouter/google/gemma-3-12b:free
```

### Configuración en opencode.json

#### Para modelos de pago

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-5-20250929",
  "small_model": "anthropic/claude-haiku-4-5-20250929",
  "agent": {
    "build": {
      "model": "anthropic/claude-sonnet-4-5-20250929"
    },
    "plan": {
      "model": "anthropic/claude-haiku-4-5-20250929"
    }
  }
}
```

#### Para modelos gratuitos

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "opencode/deepseek-v4-flash-free",
  "small_model": "openrouter/z-ai/glm-4.5-air:free",
  "agent": {
    "build": {
      "model": "opencode/deepseek-v4-flash-free"
    },
    "plan": {
      "model": "opencode/big-pickle"
    },
    "explore": {
      "model": "opencode/nemotron-3-super-free"
    }
  }
}
```

---

## Optimización de Tokens

### 1. small_model para tareas del sistema

```json
{
  "small_model": "anthropic/claude-haiku-4-5-20250929"
}
```

Se usa automáticamente para generación de títulos y tareas ligeras.

### 2. Modelos económicos para Subagents

Los Subagents por defecto heredan el modelo del Primary Agent que los llama. Anula esto:

```json
{
  "agent": {
    "explore": {
      "model": "anthropic/claude-haiku-4-5-20250929"
    },
    "general": {
      "model": "anthropic/claude-haiku-4-5-20250929"
    }
  }
}
```

### 3. Limitar Steps

`steps` controla cuántas iteraciones agenticas puede ejecutar un agente como máximo. Si se alcanza el límite, el agente debe resumir su trabajo y listar las tareas restantes.

**Límites de Steps recomendados por tipo de agente:**

| Tipo de Agente       | Steps | Justificación                               |
|----------------------|-------|--------------------------------------------|
| Agentes de escritura de código | ilimitado | Deben iterar hasta que el código esté listo |
| Agentes Review/Análisis | 10-15  | Leen, analizan, crean reporte             |
| Agentes Orquestación  | 5-10   | Delegan, no ejecutan ellos mismos        |
| Agentes Docs/Fast     | 5-10   | Tareas rápidas y enfocadas               |
| Agentes Debugging    | 15-20  | Necesitan más pasos para trace analysis    |

```json
{
  "agent": {
    "code-reviewer": {
      "steps": 15,
      "model": "anthropic/claude-sonnet-4-5-20250929"
    },
    "context-manager": {
      "steps": 5,
      "model": "anthropic/claude-haiku-4-5-20250929"
    },
    "debugger": {
      "steps": 20,
      "model": "anthropic/claude-sonnet-4-5-20250929"
    }
  }
}
```

### 4. Configurar Compaction

La compaction comprime automáticamente el contexto de conversación cuando se vuelve demasiado largo. Sin compaction, una sesión larga puede superar el límite de tokens.

```json
{
  "compaction": {
    "auto": true,
    "prune": true,
    "reserved": 10000
  }
}
```

| Opción    | Descripción                                       |
|-----------|---------------------------------------------------|
| `auto`    | Compacción automática cuando el contexto es largo |
| `prune`   | Eliminar mensajes antiguos después de compaction |
| `reserved` | Mínimo de tokens reservados para nuevos mensajes (predeterminado: 10000) |

### 5. Usar MCP Servers con moderación

Cada MCP Server agrega sus descripciones de herramientas al contexto. Esto son a menudo 500-2000 tokens por servidor. Con 10 servidores son 5000-20000 tokens que se envían en CADA petición.

**Estrategia:** Desactivar MCP Servers globalmente y activarlos solo para agentes específicos:

```json
{
  "tools": {
    "my-mcp*": false
  },
  "agent": {
    "database-optimizer": {
      "tools": {
        "postgres*": true
      }
    }
  }
}
```

### 6. Estrategia de Tier de Agentes (Resumen de Costos)

Una optimización completa de costos combina todas las medidas:

```json
{
  "model": "anthropic/claude-sonnet-4-5-20250929",
  "small_model": "anthropic/claude-haiku-4-5-20250929",
  "compaction": { "auto": true, "prune": true },
  "agent": {
    "build":   { "model": "anthropic/claude-sonnet-4-5-20250929" },
    "plan":    { "model": "anthropic/claude-haiku-4-5-20250929" },
    "explore": { "model": "anthropic/claude-haiku-4-5-20250929" },
    "code-reviewer":  { "model": "anthropic/claude-sonnet-4-5-20250929", "steps": 15 },
    "docs-writer":    { "model": "anthropic/claude-haiku-4-5-20250929",  "steps": 10 },
    "context-manager":{ "model": "anthropic/claude-haiku-4-5-20250929",  "steps": 5 }
  }
}
```

---

### Variantes Custom

```json
{
  "provider": {
    "openai": {
      "models": {
        "gpt-5": {
          "variants": {
            "thinking": {
              "reasoningEffort": "high",
              "textVerbosity": "low"
            },
            "fast": {
              "reasoningEffort": "low",
              "textVerbosity": "low"
            }
          }
        }
      }
    }
  }
}
```

Cambia con el keybind `variant_cycle`.

---

## Configuración de Provider

### Ajustar Timeouts

```json
{
  "provider": {
    "anthropic": {
      "options": {
        "timeout": 600000,
        "chunkTimeout": 30000
      }
    }
  }
}
```

### AWS Bedrock

```json
{
  "provider": {
    "amazon-bedrock": {
      "options": {
        "region": "us-east-1",
        "profile": "my-aws-profile"
      }
    }
  }
}
```

---

## Comparación de Costos (Valores aproximados)

| Modelo              | Input $/1M Tokens | Output $/1M Tokens | Recomendación               |
|---------------------|-------------------|---------------------|-----------------------------|
| Claude Opus 4.5     | ~$15              | ~$75                | Solo para tareas complejas   |
| Claude Sonnet 4.5   | ~$3               | ~$15                | Estándar para Agente Build  |
| Claude Haiku 4.5   | ~$0.80            | ~$4                 | Plan/Explore/Subagents      |
| GPT 5.2             | ~$5               | ~$20                | Alternativa para Build      |
| GPT 5.1 Codex       | ~$3               | ~$12                | Generación de código        |

*Los precios son valores orientativos y pueden cambiar.*

---

## Mejores Prácticas

1. **Build = Modelo potente:** Aquí se escribe código, la calidad es importante
2. **Plan/Explore = Modelo económico:** Leer y analizar no necesita un modelo caro
3. **Establecer small_model:** Ahorra en Title/Summary/tareas del sistema
4. **Limitar Steps:** Evita costos no controlados
5. **Usar variantes:** Ajusta el reasoning-effort según la situación
6. **Activar compaction:** Deja el consumo de tokens en sesiones largas controlable
7. **Minimizar MCP Servers:** Menos servidores = menos consumo de contexto