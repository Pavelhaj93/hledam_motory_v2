# hledammotory.cz — Next.js + Sanity

Czech marketplace/catalog for motors and engine parts. Live site: https://www.hledammotory.cz

## Structure

npm workspaces monorepo:

- `frontend/` — Next.js 15.5 App Router, React 19, Tailwind CSS v4, next-intl (Czech primary),
  next-sanity, shadcn-style components (Radix + cva), sonner, embla-carousel, nodemailer.
- `studio/` — Sanity Studio v6.1.

## Commands (run from repo root)

| Command | What it does |
|---|---|
| `npm install` | Install all workspaces |
| `npm run dev` | Frontend + Studio in parallel |
| `npm run lint` | Next.js lint (frontend) |
| `npm run type-check` | `tsc --noEmit` in all workspaces |
| `npm run typegen --workspace=frontend` | Sanity TypeGen (also runs automatically as `prebuild`) |
| `npm run build --workspace=frontend` | Production build (runs typegen first) |

## Rules

- **Always** run `npm run typegen --workspace=frontend` after changing Sanity schemas or GROQ
  queries, and commit the regenerated types.
- Use `defineQuery` for GROQ queries; never use loose `any` for Sanity content.
- Never read, modify, or commit `.env*` files; secrets come from environment variables only.
- Do not modify `studio/sanity.config.ts` or delete schema definition files unless a ticket
  explicitly asks for it.
- All UI copy is Czech — keep new user-facing strings in Czech and route them through next-intl.
- Before opening a PR: `npm run lint`, `npm run type-check`, and
  `npm run build --workspace=frontend` must all pass.

## Automation conventions (AI agents)

This repo is worked on by scheduled Claude Code agents (see `.claude/agents/`):

- Work branches are named `claude/issue-<number>`; never push directly to `main`.
- GitHub Issues are the ticket queue. Label lifecycle:
  `ai-proposal` (analyst suggestion) → `approved` (human green-light) →
  `ai-in-progress` (being implemented) → closed by merged PR.
- A closed issue that never got the `approved` label was declined — do not re-propose it.
- One PR per issue, PR body must contain `Closes #<number>`.
