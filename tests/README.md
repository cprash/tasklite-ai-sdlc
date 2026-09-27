# TaskLite E2E Tests (Playwright)

Playwright test suite covering both the **UI** (React frontend) and the **API** (Express backend) for TaskLite.

## Structure

```
tests/
├── playwright.config.ts   # Two projects: "api" and "ui", plus webServer auto-start
├── e2e/
│   ├── api/                # API tests (request context, no browser)
│   │   ├── health.spec.ts
│   │   └── tasks.spec.ts
│   └── ui/                 # UI tests (browser-driven)
│       ├── task-management.spec.ts
│       └── task-edit-mode.spec.ts
├── pages/
│   └── TaskPage.ts         # Page Object Model for the app
├── api-clients/
│   └── tasks.client.ts     # Thin wrapper around /api/tasks used by API tests
└── utils/
    └── test-data.ts        # Unique test data helpers
```

## Prerequisites

- Backend set up per the root [README.md](../README.md#backend-setup-and-run-instructions) (`backend/.env` with `DATABASE_URL`, migrations applied).
- Frontend dependencies installed (`cd frontend && npm install`).
- Google Chrome installed locally (the `ui` project drives it via Playwright's `channel: "chrome"` option — see [Browser setup](#browser-setup) below).

## Install

```bash
cd tests
npm install
```

## Browser setup

The `ui` project is configured with `channel: "chrome"` in [playwright.config.ts](playwright.config.ts), so it drives your **system-installed Google Chrome** instead of downloading Playwright's bundled Chromium. This means `npx playwright install` is **not required** in most environments.

If Chrome isn't installed, either:
- Install [Google Chrome](https://www.google.com/chrome/), or
- Switch to a bundled browser: remove the `channel: "chrome"` line from the `ui` project in [playwright.config.ts](playwright.config.ts) and run `npm run install:browsers` once to download Playwright's Chromium.

## Run

By default, `playwright.config.ts` starts both the backend (`http://localhost:3000`) and frontend (`http://localhost:5173`) dev servers automatically via `webServer`, and reuses them if already running.

```bash
npm test              # run both API and UI projects (15 tests)
npm run test:api       # run only API tests
npm run test:ui        # run only UI tests
npm run test:headed    # run UI tests with a visible browser
npm run report         # open the last HTML report
```

Override the default URLs if needed:

```bash
FRONTEND_URL=http://localhost:5173 BACKEND_URL=http://localhost:3000 npm test
```

## Troubleshooting

- **`npx playwright install` times out downloading Chromium**: this can happen behind restrictive firewalls/proxies where Node's HTTP client hangs on the CDN download even though the network is otherwise fine. The `ui` project sidesteps this entirely by using `channel: "chrome"` (system Chrome), so no browser download is needed as long as Chrome is installed.
- **API tests get 404s with an HTML body (`Unexpected token '<'`)**: verify `baseURL` for the `api` project ends with a trailing slash (e.g. `http://localhost:3000/api/`) and that request paths in [api-clients/tasks.client.ts](api-clients/tasks.client.ts) don't start with `/`. A leading slash resolves against the baseURL's origin only, dropping the `/api` prefix.
