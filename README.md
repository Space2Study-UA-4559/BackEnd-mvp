# BackEnd MVP

REST API of an educational marketplace: students look for tutors, tutors publish offers, and both sides manage profiles and cooperations.

## Tech stack

| Area | Used in this repo |
| --- | --- |
| HTTP | Express 4 (`src/app.js`, `src/initialization/`) |
| Database | MongoDB 4, Mongoose 6 |
| Auth | JWT (`jsonwebtoken`), bcrypt, httpOnly refresh cookie |
| Mail | Nodemailer, `email-templates`, Pug (`en` / `ua`) |
| Google | `googleapis` (Gmail OAuth + Google Sign-In) |
| Uploads | Azure Blob Storage (`azure-storage`) |
| Jobs | `cron` (unverified users, last-login reminder) |
| Logs | Winston, `winston-mongodb` (errors) |
| API docs | Swagger UI at `/api-docs` (`docs/**/*.yaml`) |
| Tests | Jest 28, Supertest, Node test environment |
| Quality | ESLint, Prettier, Husky, lint-staged |
| Runtime | Node.js 18 |
| Containers | Docker, Docker Compose (API + Mongo) |
| CI | GitHub Actions (tests, Docker build) |

The source is CommonJS JavaScript. Path alias `~/` → `src/` (`module-alias`).

How to use Cursor Agent, VS Code Copilot Agent, Bugbot, and MCP: [docs/agents.md](docs/agents.md) (Ukrainian). Cursor rules: `AGENTS.md` + `.cursor/rules/`. VS Code: `.github/copilot-instructions.md` + `.vscode/mcp.json`. Claude Code: `CLAUDE.md` + `.mcp.json`.

Working branch: `develop`.

## Requirements

- Node.js 18.x (Docker image uses `18.14.2`)
- npm
- MongoDB (local, Docker Compose, or Atlas)
- A client origin that matches `CLIENT_URL` (Compose/dev default is `http://localhost:3000`)

## Setup

```shell
npm install
```

Create a `.env.local` file in the project root (dotenv loads `.env.local`, then `.env`). For tests it loads `.env.test.local` when `NODE_ENV=test`.

```env
MONGODB_URL=mongodb://localhost:27017/space2study
CLIENT_URL=http://localhost:3000
COOKIE_DOMAIN=localhost
SERVER_URL=http://localhost:8080
SERVER_PORT=8080

JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRES_IN=
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=
JWT_RESET_SECRET=
JWT_RESET_EXPIRES_IN=
JWT_CONFIRM_SECRET=
JWT_CONFIRM_EXPIRES_IN=

MAIL_USER=
MAIL_PASS=
MAIL_FIRSTNAME=
MAIL_LASTNAME=
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REFRESH_TOKEN=
GMAIL_REDIRECT_URI=

STORAGE_ACCOUNT=
ACCESS_KEY=
AZURE_HOST=
```

| Variable | Purpose |
| --- | --- |
| `MONGODB_URL` | Mongo connection string |
| `CLIENT_URL` | CORS origin (the Vite client) |
| `COOKIE_DOMAIN` | Domain for the refresh-token cookie |
| `SERVER_URL` | Public API URL (Swagger server) |
| `SERVER_PORT` | Listen port (`8080` in Docker) |
| `JWT_*_SECRET` / `JWT_*_EXPIRES_IN` | Access, refresh, reset-password, and email-confirm tokens |
| `MAIL_USER` / `MAIL_PASS` | Superadmin seed email/password and Gmail sender |
| `MAIL_FIRSTNAME` / `MAIL_LASTNAME` | Superadmin display name |
| `GMAIL_*` | Gmail OAuth for outbound mail |
| `STORAGE_ACCOUNT` / `ACCESS_KEY` / `AZURE_HOST` | Azure Blob uploads |

Do not commit `.env`, `.env.local`, or `.env.test.local`.

On first start the app seeds a superadmin (from `MAIL_*`) if none exists, and default categories if the collection is empty.

## Scripts

```shell
npm start          # Nodemon, src/app.js (legacy-watch). Default http://localhost:8080
npm test           # Jest, maxWorkers=1, coverage (also runs on pre-push)
npm run lint       # ESLint on the repo with --fix
```

Pre-commit runs lint-staged (ESLint `--fix` + Prettier on staged `*.js`). Full tests with coverage run on pre-push and in GitHub Actions.

## Docker

Dev containers: API on `http://localhost:8080`, Mongo on `27017`. Swagger UI: `http://localhost:8080/api-docs`.

```shell
docker compose up --build
```

Compose injects `MONGODB_URL=mongodb://db:27017/space2study` into the server container. JWT, mail, and Azure values still come from dotenv files — keep a local `.env` / `.env.local` next to `compose.yaml` when you run Compose.

CI builds the image as `backend:test` and does not push it. SonarCloud is a student stub (`CHANGE_ME` in `sonar-project.properties`); the scan step runs only when `SONAR_TOKEN` is set.

## Agents and MCP

Student guide: [docs/agents.md](docs/agents.md).

| Editor | Instructions | MCP |
| --- | --- | --- |
| Cursor | `AGENTS.md`, `.cursor/rules/*.mdc` | `.cursor/mcp.json` |
| VS Code + Copilot Agent | `.github/copilot-instructions.md` | `.vscode/mcp.json` |
| Claude Code CLI | `CLAUDE.md` (`@AGENTS.md`) | `.mcp.json` |

Restart the editor or CLI after pulling MCP changes. In VS Code open Copilot Chat in **Agent** mode (`chat.mcp.enabled` is on in `.vscode/settings.json`). Claude Code: run `claude` in the repo root and approve `.mcp.json` servers on first use.

| Server | What it is for | Auth |
| --- | --- | --- |
| `context7` | Version-specific docs (Express 4, Mongoose 6, Jest 28, …) | Optional `CONTEXT7_API_KEY` |
| `github` | Issues, PRs, Actions | `GITHUB_PERSONAL_ACCESS_TOKEN` or `/add-plugin github` |
| `chrome-devtools` | Live Chrome: network, console, Swagger on `:8080` | Local Chrome |
| Built-in Browser | Cursor Agent click-through on `:8080/api-docs` | Enable in Cursor Agent tools |

**Not MCP (on purpose).** Code review: Cursor Bugbot / Security Review. Unused imports: `npm run lint`. Dead files/exports/deps: `npx knip@5` (Node 18). Official `@knip/mcp` needs Node 20+, so it is not in this repo.

Do not add Playwright MCP or MUI MCP. Do not put tokens in JSON files. Do not drive the same page with Browser and Chrome DevTools at once.

**GitHub token** (skip this if you use `/add-plugin github`):

```powershell
[System.Environment]::SetEnvironmentVariable("GITHUB_PERSONAL_ACCESS_TOKEN", "ghp_your_token", "User")
```

Then restart the editor. Never commit a GitHub PAT. `@modelcontextprotocol/server-github` is deprecated — this repo does not use it. In Cursor you can skip the env var and use `/add-plugin github`.

## Project structure

```
src/
  app.js            Process entry
  configs/          Env-backed config objects
  consts/           Auth roles, errors, validation constants
  controllers/      HTTP handlers (req/res only)
  cron-jobs/        Scheduled jobs
  emails/           Pug templates (`en`, `ua`)
  initialization/   Env, DB, Express, listen
  logger/           Winston
  middlewares/      Auth, validation, language, errors, asyncWrapper
  models/           Mongoose models
  routes/           Express routers
  seed/             Superadmin and category seed
  services/         Business logic
  test/
    unit/           Jest specs for services, middlewares, cron
    integration/    Supertest specs against controllers
    coverage/       Jest coverage output
  utils/            Helpers (errors, aggregation, mailer, …)
  validation/       Request schemas and service validators
docs/               OpenAPI YAML for Swagger
```

Path alias: `~/` → `src/`.

## Conventions

- **Layers.** Routes wire middlewares and controllers. Controllers call services. Services talk to models. Do not query Mongoose from a route file.
- **Errors.** Throw helpers from `src/utils/errorsHelper.js`. The error middleware turns them into JSON `{ status, code, message }`.
- **Auth.** Bearer access token via `authMiddleware`. Role checks via `restrictTo(...)`. Refresh token is an httpOnly cookie.
- **Async.** Wrap controllers with `asyncWrapper`. Do not leave unhandled promise rejections in route handlers.
- **Validation.** Request bodies go through `validationMiddleware` and schemas in `src/validation/schemas/`.
- **i18n (mail).** Email language comes from `langMiddleware` (`en` / `ua`), not from Accept-Language alone.

## Tests

Unit and integration specs live under `src/test/` and run in Node via Jest + Supertest.

Integration tests start the real Express app and MongoDB, then drop the database between cases (`src/test/setup.js`). Point `.env.test.local` at a disposable database.

Coverage reports go to `src/test/coverage/`. Global thresholds are 70% for branches and 80% for functions, lines, and statements.

Do not unit-test third-party libraries, Pug templates, or OpenAPI YAML. Prefer HTTP assertions through Supertest over reaching into private helpers when an integration spec already covers the path.

## License

MIT. See [LICENSE](LICENSE).
