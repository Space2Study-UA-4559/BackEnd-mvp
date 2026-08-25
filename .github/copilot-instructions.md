# Copilot / VS Code Agent

This is an Express 4 + Mongoose 6 REST API (`develop`). Follow `AGENTS.md` for the full loop. You do not see Cursor `.mdc` rules — this file is the substitute.

## Stack (do not upgrade in generated code)

- Express 4, CommonJS `require`, alias `~/` → `src/`
- Layers: routes → controllers (`asyncWrapper`) → services → Mongoose models
- Auth: JWT Bearer access token + httpOnly refresh cookie. Roles via `restrictTo`
- Errors: `src/utils/errorsHelper.js` → error middleware JSON `{ status, code, message }`
- Mail: Pug templates in `src/emails/{en,ua}/`
- Tests: Jest 28 + Supertest. Integration uses `src/test/setup.js` (real Mongo). Coverage 80%
- Node 18. Do not change ESLint `linebreak-style` unless asked
- Docker is `npm start` + Mongo in Compose, not a production nginx/multi-stage image
- Sonar keys in `sonar-project.properties` stay `CHANGE_ME`. CI scan runs only with `SONAR_TOKEN`. Do not point CI at `ita-social-projects`

## MCP (`.vscode/mcp.json`)

| Need | Use |
| --- | --- |
| Express 4 / Mongoose 6 / Jest 28 / jsonwebtoken 8 | Context7, pin those majors |
| GitHub issues / PRs | `github` MCP if `GITHUB_PERSONAL_ACCESS_TOKEN` is set, else `gh` |
| Live Swagger and network on `:8080` | `chrome-devtools` (VS Code has no Cursor Browser) |
| Unused imports | `npm run lint` |
| Dead files / exports / deps | `npx knip@5` (report only). Do not add `@knip/mcp` |

Do not add Playwright, Knip, CodeRabbit, or MUI MCP. Never put a PAT in a committed JSON file.

There is no Cursor Bugbot here. Review by reading the diff; do not invent a review MCP.

Commit and push only when the user asks. Never commit `.env`, `.env.local`, `.env.test.local`, tokens, `node_modules`, or `src/test/coverage`.
