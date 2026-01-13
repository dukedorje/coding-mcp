# @identikey/coding-mcp

MCP server with expert AI personas for architecture reviews, code advice, and research. Runs as a tool server in Cursor, Windsurf, or any MCP-compatible client.

## Quick Start

Add to your MCP config (e.g., `.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "coding-mcp": {
      "command": "npx",
      "args": ["-y", "@identikey/coding-mcp"],
      "env": {
        "XAI_API_KEY": "your-xai-key",
        "OPENAI_API_KEY": "your-openai-key"
      }
    }
  }
}
```

Or via Cursor Settings → MCP → Add Server.

### Environment Variables

| Variable         | Required | Description                                          |
| ---------------- | -------- | ---------------------------------------------------- |
| `XAI_API_KEY`    | Yes\*    | xAI/Grok API key ([get one](https://console.x.ai))   |
| `OPENAI_API_KEY` | Yes\*    | OpenAI API key (for GPT-5 reasoning)                 |
| `AI_PROVIDER`    | No       | Default provider: `xai` or `openai` (default: `xai`) |
| `XAI_MODEL`      | No       | xAI model override (default: `grok-4.1`)             |
| `OPENAI_MODEL`   | No       | OpenAI model override (default: `gpt-5.2`)           |

\*At least one API key required. The server auto-selects providers based on task type—xAI for quick advice, OpenAI for deep reasoning.

### Using bunx

```json
{
  "mcpServers": {
    "coding-mcp": {
      "command": "bunx",
      "args": ["@identikey/coding-mcp"],
      "env": {
        "XAI_API_KEY": "your-xai-key"
      }
    }
  }
}
```

## Tools

### `ask`

Natural language queries auto-routed to the best expert persona. Just ask—it figures out who should answer.

```
"How should I structure this React app?"  → routes to Iris (frontend)
"Is this auth implementation secure?"     → routes to Sentinel (security)
"Review this API design"                  → routes to Atlas (backend)
```

### `architect`

Deep architectural review with reasoning. Pass code + task description, get structured analysis.

### `code-review`

Git diff analysis. Point it at a repo, get review of changes vs main branch.

### `code-advice`

Quick, focused guidance on specific problems. Lower latency than full architect review.

### `researcher`

Multi-source research with citations. Searches across Google, arXiv, GitHub, StackExchange, etc.

### `persona`

Direct access to a specific expert. Skip auto-routing when you know who you want.

### `discover`

List available personas and their specialties.


## Personas

| Persona      | Focus                    | Style                                              |
| ------------ | ------------------------ | -------------------------------------------------- |
| **Charles**  | Pragmatic architecture   | Anti-enterprise, ships fast, calls out YAGNI       |
| **Sterling** | Enterprise systems       | Zero-downtime, compliance, multi-team coordination |
| **Ada**      | Algorithms & performance | Big-O, profiling, optimization                     |
| **Atlas**    | Backend & APIs           | Contract-first, database design, caching           |
| **Hermes**   | DevOps & SRE             | CI/CD, observability, Kubernetes                   |
| **Sentinel** | Security                 | Threat modeling, auth, compliance                  |
| **Iris**     | Frontend & UX            | Accessibility, design systems, React/Vue           |
| **Xavier**   | MVP development          | KISS, ship it, avoid yak shaving                   |

## Development

```bash
# Install deps
bun install

# Build
bun run build

# Test
bun test

# Run locally (for testing)
bun run start
```

### Local MCP Config

For development, point to your local build:

```json
{
  "mcpServers": {
    "coding-mcp-dev": {
      "command": "node",
      "args": ["/path/to/coding-mcp/build/index.js"],
      "env": {
        "XAI_API_KEY": "your-key"
      }
    }
  }
}
```

### Project Structure

```
src/
├── index.ts              # MCP server entry
├── common/
│   ├── apiClient.ts      # Unified AI provider client
│   ├── providerConfig.ts # Env vars, provider selection
│   └── ...
├── personas/
│   ├── charles/          # Each persona has its own module
│   ├── sterling/
│   └── ...
└── tools/
    ├── ask.ts            # Smart routing
    ├── architect.ts      # Deep review
    └── ...
```

## License

MIT
