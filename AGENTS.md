# Agent workflow

Backend MVP (Express 4, Mongoose 6, JWT, Jest 28, Node 18). Working branch is `develop`.

Match the user's language. Student-facing comments in config files stay Ukrainian.

## Loop

1. Read the relevant `.cursor/rules/*.mdc` before editing that area.
2. Change only what the task needs. Do not drive-by refactor or rebrand leftover copy unless asked.
3. After API/behavior changes, run the matching Jest spec, or `npm test` if the blast radius is wide. Integration specs need MongoDB and `.env.test.local`.
4. Optional live check: `npm start` and Swagger at `http://localhost:8080/api-docs`, or curl the route. A screenshot of Swagger is not enough — hit the endpoint.
5. Commit and push only when the user asks. Never commit `.env`, `.env.local`, `.env.test.local`, tokens, `node_modules`, or `src/test/coverage`.

## MCP

Declared in `.cursor/mcp.json` (Cursor), `.vscode/mcp.json` (VS Code Copilot Agent), `.mcp.json` (Claude Code). Same servers. Restart the client after changing them. CLI tools have no Cursor Browser — use `chrome-devtools` for Swagger / HTTP in Chrome.

| Need | Use |
| --- | --- |
| Express 4, Mongoose 6, Jest 28, jsonwebtoken 8 | Context7, with those majors pinned |
| GitHub issues / PRs / Actions | GitHub MCP, or `/add-plugin github` (OAuth) |
| Swagger UI / request inspection on `:8080` | Built-in Browser (Cursor) or `chrome-devtools` |
| Network (status, CORS, cookies, JSON body) | `chrome-devtools` MCP. Do not control the same tab with Browser and DevTools together. |
| Code review | `/review-bugbot` or `/review-security`, not a review MCP |
| Unused imports | `npm run lint` |
| Dead files / unused exports / unused deps | `npx knip@5` (read-only). `@knip/mcp` needs Node 20; this repo is Node 18. |
| Local git | `git` in the terminal |

GitHub MCP reads `GITHUB_PERSONAL_ACCESS_TOKEN` from the **OS environment**. Context7 works without a key; optional `CONTEXT7_API_KEY` raises limits. Never paste tokens into JSON.

Do not use `@modelcontextprotocol/server-github` (deprecated). Do not add Playwright, Knip, CodeRabbit, or MUI MCP.

## Git and CI

- Do not change ESLint `linebreak-style` or rewrite line endings unless asked.
- CI (`.github/workflows/main.yaml`): Mongo 6 service, `npm ci`, `npm test` (coverage for Sonar), local Docker build (`push: false`). Sonar runs only if `SONAR_TOKEN` is set. Keys in `sonar-project.properties` stay `CHANGE_ME` until students create their own SonarCloud project.
- Pre-commit: lint-staged on staged `*.js`. Pre-push: `npm test`.
- Docker is a **dev** image (`npm start` + Mongo in Compose), not a production multi-stage build. Do not restore `azure-pipeline.yaml` or push to the original ACR.

## Stack facts the model often gets wrong

- Layers: routes → controllers → services → models. No Mongoose in route files.
- Controllers: wrap with `asyncWrapper`. Errors via `src/utils/errorsHelper.js`.
- Auth: Bearer access token; refresh token is an httpOnly cookie.
- Alias: `~/` → `src/` (`module-alias`). CommonJS `require`, not ESM.
- Env: `.env.local` (runtime), `.env.test.local` when `NODE_ENV=test`.
