# Jugaad Diagnostics

AI-powered medical triage tool for ASHA workers in rural India — supporting symptom triage, skin image analysis, pregnancy risk assessment, and doctor chat in Hindi, English, and Marwari.

## Run & Operate

- `pnpm --filter @workspace/jugaad-diagnostics run dev` — run the React frontend (port 26079)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- Required env: `GROQ_API_KEY` — Groq API key (used by the API server for AI calls)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite (artifact: `jugaad-diagnostics`, preview path `/`)
- API: Express 5 (artifact: `api-server`, preview path `/api`)
- AI: Anthropic Claude (`claude-sonnet-4-20250514`) via `@anthropic-ai/sdk`
- No database — all state is in-memory/session

## Where things live

- `artifacts/jugaad-diagnostics/src/JugaadDiagnostics.jsx` — entire frontend app (single component, ~700 lines)
- `artifacts/jugaad-diagnostics/src/App.tsx` — thin wrapper that renders JugaadDiagnostics
- `artifacts/api-server/src/routes/claude.ts` — Claude AI proxy route (`POST /api/claude`)
- `artifacts/api-server/src/routes/index.ts` — route registration

## Architecture decisions

- Single large component for the frontend — mirrors the original Next.js design; easy to ship at a hackathon
- All AI calls go through the Express backend (`/api/claude`) — keeps the Anthropic API key server-side
- The pregnancy flow previously called `api.anthropic.com` directly from the browser — fixed to proxy through the backend
- No database needed — triage cases are stored in React state (resets on refresh), suitable for demo/field use
- `ANTHROPIC_API_KEY` must have credits; the app gracefully degrades and shows the error message in the UI if it doesn't

## Product

Five views accessible from the landing page:
1. **Landing** — dark green hero with ASHA worker illustration, stat cards, CTA buttons
2. **ASHA App (home)** — 2-step triage: patient info → symptoms + vitals; tabs for voice input, image analysis, doctor chat
3. **PHC Dashboard** — case list with RED/YELLOW/GREEN triage levels, ASHA worker activity, outbreak alerts
4. **Pregnancy** — 2-step maternal assessment with danger sign detection and risk scoring
5. **Help / Copilot** — free-form AI chat for ASHA workers in Hindi/English/Marwari

Languages: Hindi (default), English, Marwari (Rajasthani)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- The `ANTHROPIC_API_KEY` must have a positive credit balance; a zero-balance key gives a 400 error (gracefully surfaced in UI)
- Voice input uses the Web Speech API — only works in Chrome/Edge; not available in Firefox or WebViews
- Image analysis sends base64-encoded images to the backend; large images may be slow
- The frontend fetches `/api/claude` as a relative URL — this works because both artifacts are served through the same Replit proxy at `/` and `/api`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
