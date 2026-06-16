---
id: 2026-06-13_mox_demo_cursor-agent_WS0_scaffold
title: Session — mox_demo WS-0 scaffold (foundation)
date: 2026-06-13
agent: cursor-agent
repo: mox_demo
model: Composer (Cursor)
dispatch: docs/dispatch/00_ws0_scaffold.md
status: complete — WS-0 scaffold landed locally; Vercel deploy pending operator
---

# mox_demo WS-0 scaffold — session report

## Model

**Composer** (Cursor). No escalation.

## Objective

Execute `README.md` dispatch order starting with **WS-0 Scaffold** (`docs/dispatch/00_ws0_scaffold.md`): stand up `/frontend`, `/backend`, `/data`, shared `@hauska/atom-contract` wiring, config, and run instructions.

## Workspace

Primary clone: `P:\mox_demo` (connected to `https://github.com/empressaioemail-tech/mox_demo`, branch `main`).

### Pre-existing untracked assets (not created this session)

| Path | Notes |
|------|-------|
| `mox_html_original/` | Present before scaffold; not wired |
| `yardi_screenshots/` | Present before scaffold; WS-3 input |
| `docs/` | Pulled with repo content (dispatch briefs, property ground truth) |

---

## Deliverables

| Deliverable | Status | Location |
|-------------|--------|----------|
| Next.js frontend, Vercel-ready | ✅ built locally | `frontend/` |
| Placeholder landing + APS viewer slot | ✅ | `frontend/src/app/page.tsx`, `frontend/src/components/aps/ApsViewerSlot.tsx` |
| Component library directory | ✅ | `frontend/src/components/library/` |
| Backend service (Hono, Node) | ✅ | `backend/` |
| Health route | ✅ | `GET /health` |
| Stub atom read API | ✅ | `GET /api/atoms` |
| `@hauska/atom-contract` wired (frontend + backend) | ✅ typecheck passes | both `package.json` |
| `/data` fixtures dir + README | ✅ | `data/README.md` |
| `/assets` pointer README | ✅ | `assets/README.md` |
| `.env.example` | ✅ | root |
| `.gitignore` (secrets, node_modules, `apartment_bldg/`) | ✅ | root |
| README run instructions | ✅ | `README.md` |

---

## Verification

### Backend typecheck

```
cd backend && npm run typecheck   # exit 0
```

### Frontend typecheck + production build

```
cd frontend && npm run typecheck  # exit 0
cd frontend && npm run build      # exit 0 (Next.js 16.1.6 Turbopack)
```

### Backend health (local)

```
GET http://localhost:8787/health
→ { "status": "ok", "service": "mox-demo-backend", "scaffold": true, ... }
```

### Atom contract import

Backend stub uses `AccessPolicy` and `AtomReference` from `@hauska/atom-contract@^1.3.0`. Frontend component library types import `AccessPolicy`.

---

## Environment notes

1. **TLS / npm:** pnpm failed with `UNABLE_TO_VERIFY_LEAF_SIGNATURE` on this machine. Workaround: `NODE_OPTIONS=--use-system-ca` with **npm** (not pnpm). Document in run instructions if operators hit the same.
2. **Next.js Google Fonts:** Default create-next-app Geist fonts failed build (TLS to fonts.googleapis.com). Removed `next/font/google` from `layout.tsx`; enabled `experimental.turbopackUseSystemTlsCerts` in `next.config.ts`.
3. **Vercel deploy:** Not executed this session (no Vercel token / project link). Frontend builds clean; `frontend/vercel.json` present. Operator runs `cd frontend && npx vercel` to get live URL.

---

## Acceptance checklist (WS-0 brief)

| Criterion | Result |
|-----------|--------|
| Frontend deployable to Vercel | Build passes; deploy not run |
| Backend runs locally with passing health check | ✅ |
| `@hauska/atom-contract` types import and typecheck | ✅ |
| `.env.example` present; no secrets committed | ✅ |
| `apartment_bldg/` gitignored | ✅ |

---

## Not in scope (next dispatches)

Per README dependency order, **not started**:

- **WS-1 Spine** — APS upload, RVT extraction, substrate ground-truth atoms, deal molecule fixtures
- **WS-2 Engine** — LLM component assembly + gate
- **WS-R** — APS spike (parallel, early)
- **WS-3–7** — hero surfaces, context mockups, narrative

WS-1 blockers for next agent:

- APS app credentials in `.env` (`APS_CLIENT_ID`, `APS_CLIENT_SECRET`)
- RVT at `apartment_bldg/.../5 Story Apartment.rvt` (gitignored; must exist locally)
- Substrate tools: `hauska-engine` place/parcel/code, `hauska-mcp-server`

---

## Files created / modified

```
.env.example
.gitignore
README.md                          (run instructions appended)
assets/README.md
backend/                           (full scaffold)
data/README.md
frontend/                          (Next.js app + Mox landing)
docs/                              (pre-existing)
```

---

## Recommended next step

Dispatch **WS-1 Spine** (`docs/dispatch/01_ws1_spine.md`) once APS credentials and local RVT are in place. Optionally run **WS-R APS spike** in parallel to de-risk Model Derivative before full atom extraction.

---

## Git state (uncommitted)

All WS-0 work is local, unstaged. Operator may commit and push when ready.

```
modified:   README.md
untracked:  .env.example, .gitignore, assets/, backend/, data/, frontend/, docs/, mox_html_original/, yardi_screenshots/
```
