# WAHA Agent Playbook

This guide summarizes how to explore, modify, and validate the WhatsApp HTTP API
(WAHA) codebase when assisting as an automation or coding agent.

## Product & Variants

- WAHA ships in **Core** and **Plus** editions
- Core lives under `src/core` and supports the default session with minimal
  media features
- Plus extends core via `src/plus` to add multi-session orchestration, richer
  media handling, and external storage integrations
- Core code must remain free from Plus-only references (pre-commit hook rejects
  "plus" in core files)
- Commit subjects: changes that touch `src/plus` require `[PLUS] …` prefix;
  everything else uses `[core] …`

## Tech Stack

- **Runtime**: Node.js 22.x, Yarn 3.6 (Berry)
- **Framework**: NestJS v11 with dependency injection and modular controllers in
  `src/api`
- **Engines**: WhatsApp engines are abstracted (`WEBJS`, `GOWS`, `NOWEB`,
  `WPP`). Core uses `SessionManagerCore`; Plus swaps to `SessionManagerPlus`
  with extra storage backends (Mongo/Postgres/SQLite)
- **ESM Bridge**: ESM-only dependencies (Baileys) load through
  `src/vendor/esm.ts`
- **Utilities**: RxJS streams drive webhook event fan-out. Prefer existing
  helpers in `src/utils` and `src/core/utils`

## Key Paths

- `src/main.ts`: runtime entry point; dynamically loads AppModule (Core vs Plus)
- `src/api/**`: REST controllers and WebSocket gateway
- `src/core/**`: shared abstractions (config services, engine bootstrap,
  storage, session management)
- `src/plus/**`: multi-session orchestration, advanced media services, and
  external persistence layers
- `src/structures/**` and `src/utils/**`: DTOs, enums (event names follow
  `domain.action`), helper utilities

## Coding Expectations

- Favor composability and long-lived solutions
- Reuse existing helpers (`parseBool`, `DefaultMap`, media factories) instead of
  reinventing logic
- Stick to NestJS patterns: inject dependencies through constructors, expose
  provider tokens from modules
- Logging goes through injected `PinoLogger` or helpers in
  `src/utils/logging.ts`
- Respect path aliases (`@waha/...`) defined in `tsconfig.json`
- Prefer named function declarations over `const` arrow functions
- Avoid naming unused variables with a leading underscore
- Do not write verbose ternaries; use idiomatic helpers like `??` (nullish
  coalescing)
- Do not place `await` or other async calls inside ternary expressions (`?:`);
  use explicit `if/else` blocks
- For configs, prefer runtime configurability over constants (environment keys
  follow `WAHA_*` and `WAHA_SESSION_CONFIG_*`)

## How to Run API

```bash
export DEBUG=1
export WAHA_API_KEY=666
export WAHA_DASHBOARD_PASSWORD=666
export WAHA_DASHBOARD_USERNAME=admin
export WWHATSAPP_SWAGGER_USERNAME=admin
export WHATSAPP_SWAGGER_PASSWORD=666
export WHATSAPP_DEFAULT_ENGINE={WEBJS|WPP|NOWEB|GOWS}
export WAHA_DEBUG_MODE=True
export WAHA_HTTP_STRICT_MODE=1
export WAHA_MEDIA_STORAGE=LOCAL
export WHATSAPP_FILES_FOLDER=./.media

npm run start
```

## Code Guidelines

- Add `@Activity()` (from `src/core/abc/activity.ts`) to every engine method
  that makes a network call to WhatsApp servers
- It triggers `maintainPresenceOnline()` before the method runs, keeping the
  session ONLINE during API activity and scheduling an OFFLINE transition after
  an idle period
- Skip it on methods that only throw `NotImplementedByEngineError` /
  `AvailableInPlusVersion`

## Related Sources

- WEBJS: `../whatsapp-web.js`
- NOWEB: `../WhiskeySockets-Baileys` and `../whatsapp-rust-bridge`
- GOWS: `../gows` and `../whatsmeow`
- WPP: `../wa-js`, `../wppconnect`, `../wppconnect-server`
- ChatWoot: `../chatwoot`
