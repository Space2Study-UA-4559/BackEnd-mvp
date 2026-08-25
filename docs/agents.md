# Робота з агентами в цьому репо

Це інструкція **для людей**. Інструкції **для моделі** не треба вставляти в чат: Cursor — `AGENTS.md` і `.cursor/rules/`; VS Code Copilot — `.github/copilot-instructions.md`; Claude Code — `CLAUDE.md`.

Робоча гілка: `develop`. Стек: Express 4, Mongoose 6, JWT, Jest 28, Node 18.

## Що лежить у репо і навіщо

| Файл | Для кого | Навіщо |
| --- | --- | --- |
| `AGENTS.md` | Агент | Цикл роботи: не чіпати зайве, ганяти Jest, не комітити секрети |
| `.cursor/rules/project.mdc` | Агент (завжди) | Стек, гілка, Docker = API+Mongo |
| `.cursor/rules/src.mdc` | Агент (коли відкритий `src/`) | routes → controllers → services → models |
| `.cursor/rules/tests.mdc` | Агент (коли відкриті `src/test/`) | Jest 28, Supertest, `serverInit` |
| `.cursor/rules/docker.mdc` | Агент (Dockerfile / Compose) | Не збирати «прод» multi-stage |
| `.cursor/rules/mcp.mdc` | Агент (завжди) | Який MCP / CLI на яку задачу |
| `.cursor/mcp.json` | Cursor | GitHub, Context7, Chrome DevTools |
| `.vscode/mcp.json` | VS Code Copilot Agent | Ті самі сервери (`servers`, не `mcpServers`) |
| `.github/copilot-instructions.md` | GitHub Copilot | Заміна `.cursor/rules` у VS Code |
| `CLAUDE.md` + `.mcp.json` | Claude Code CLI | `@AGENTS.md` + ті самі MCP (`type` обов’язковий для HTTP) |

Після `git pull` перезапустіть редактор або CLI, інакше MCP може не підхопитись.

## Які агенти вміють цей флоу

Працює все, що відкриває **корінь репо** як workspace.

### Cursor

| Агент | Читає `AGENTS.md` + `.cursor/rules` | MCP з `.cursor/mcp.json` | Коли користуватись |
| --- | --- | --- | --- |
| **Cursor Agent** | Так | Так | Основний спосіб у Cursor |
| **Plan** | Так (читає код) | Зазвичай ні, поки не перейдете в Agent | Велика задача з кількома варіантами |
| **Ask** | Так | Обмежено | «Поясни», без правок файлів |
| **Cursor CLI** | Так | Так | Те саме з термінала |
| **Cloud Agent** | Так, якщо репо підключене | Secrets у дашборді Cursor | Довгі задачі поза IDE |
| **Bugbot** / **Security Review** | Diff | Ні | Рев’ю змін / PR |

Tab / inline autocomplete правила майже не читає.

### VS Code (GitHub Copilot)

Потрібні розширення **GitHub Copilot** + **GitHub Copilot Chat** і режим **Agent** у чаті (не звичайний Ask).

| Що | Де |
| --- | --- |
| Інструкції для моделі | `.github/copilot-instructions.md` (і `AGENTS.md`, якщо Copilot його підхоплює) |
| MCP | `.vscode/mcp.json` — у `.vscode/settings.json` увімкнено `chat.mcp.enabled` |
| Swagger / мережа | `chrome-devtools` (немає Cursor Browser і Bugbot) |

Command Palette: `MCP: List Servers`. Якщо `github` червоний — немає `GITHUB_PERSONAL_ACCESS_TOKEN`; Context7 має працювати без ключа.

**Не підхоплюють флоу:** ChatGPT / Claude у браузері, Copilot **completions** (сірий текст), агент в іншій папці без цих файлів.

### Claude Code CLI

Запускати з **кореня репо**. Ті самі MCP-сервери. Немає Cursor Browser і Bugbot — Swagger/мережа через `chrome-devtools`.

| CLI | Старт | Інструкції | MCP | Перший запуск |
| --- | --- | --- | --- | --- |
| **Claude Code** | `claude` | `CLAUDE.md` імпортує `AGENTS.md` | `.mcp.json` | Підтвердити project MCP у інтерактивній сесії |

Токен GitHub — змінна `GITHUB_PERSONAL_ACCESS_TOKEN` у середовищі оболонки, з якої стартує CLI.

## Що для чого: задача → інструмент

Агент обирає інструмент сам, якщо ви назвали задачу нормально. Нижче — що **має** статись.

| Задача | Хто / що | Не треба |
| --- | --- | --- |
| Написати / змінити роут, сервіс, модель | Cursor Agent + правила `src` | Новий фреймворк або ESM |
| Документація Express 4 / Mongoose 6 / Jest 28 | MCP `context7` (пін **цих** мажорів) | «як у Express 5 / Mongoose 8» |
| Swagger на `http://localhost:8080/api-docs` | Cursor: вбудований **Browser**. VS Code / Claude: `chrome-devtools` | Playwright MCP |
| Мережа: 401, CORS, cookie, JSON | MCP `chrome-devtools` | Водити ту саму вкладку Browser + DevTools одночасно |
| Issue / PR / Actions | MCP `github` або `/add-plugin github` | PAT у файлі в git |
| Рев’ю коду | Cursor: `/review-bugbot` або `/review-security`. VS Code: Copilot Agent по diff | CodeRabbit MCP |
| Невикористані імпорти | `npm run lint` (pre-commit + CI) | Окремий MCP |
| Мертві файли / експорти / залежності | `npx knip@5` (лише звіт) | `@knip/mcp` (потрібен Node 20, у нас 18) |
| Lint + тести з coverage | Pre-push (`npm test`) + GitHub Actions (Sonar лише з `SONAR_TOKEN`) | Окремий review MCP, Azure pipeline оригіналу |

## Як питати агента

Коротко і з результатом, не «покращ код».

- «Додай фільтр по статусу в `GET /offers` і покрий Jest integration spec.»
- «Логін повертає 401 — подивись мережу через chrome-devtools, `npm start` уже запущений.»
- «Зроби рев’ю незакомічених змін через Bugbot.»
- «Не коміть і не пуш, поки я не скажу.»

Агент комітить і пушить **лише коли ви просите**. Не кладіть у чат і не просіть закомітити `.env` чи GitHub-токени.

## Мінімальне налаштування студента

### Cursor

1. Відкрити **корінь** репо, режим **Agent**, у tools увімкнути Browser (для Swagger).
2. `context7` без ключа. GitHub: `/add-plugin github` або `GITHUB_PERSONAL_ACCESS_TOKEN`.
3. Chrome для `chrome-devtools`. Node 18, `.env.local` як у README, API на `:8080`.

### VS Code

1. Рекомендовані розширення з `.vscode/extensions.json` (Copilot + Copilot Chat + ESLint).
2. Copilot Chat → **Agent** (не Ask). MCP: Command Palette → `MCP: List Servers`.
3. Той самий `GITHUB_PERSONAL_ACCESS_TOKEN` у змінних середовища Windows/macOS, потім перезапуск VS Code. Токен не писати в JSON.
4. Swagger і мережа — через `chrome-devtools`, не Cursor Browser.

### Claude Code CLI

1. `cd` у корінь репо. Node 18 і `.env.local` як у README.
2. `GITHUB_PERSONAL_ACCESS_TOKEN` у **цьому** терміналі (не лише в GUI Cursor).
3. `claude` → approve `.mcp.json`.
4. Живий HTTP — `chrome-devtools` на `:8080`.

Червоний `github` без токена — нормально. Context7 працює і так.

GitHub MCP у **Cloud Agent** Cursor не бере ваш User env: Integrations або [Cloud Agents secrets](https://cursor.com/dashboard/cloud-agents).

## Чого не додавати

Playwright MCP, MUI MCP, Sequential Thinking, filesystem MCP, CodeRabbit, `@knip/mcp`, застарілий `@modelcontextprotocol/server-github`, `npm@latest` у Docker.

Якщо потрібен новий MCP — спочатку перевірте, чи задачу вже закриває Browser, ESLint, Knip CLI, Jest або Bugbot.
