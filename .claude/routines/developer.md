# Routine prompt: developer-hledammotory

> Canonical prompt for the cloud routine at claude.ai/code → Routines.
> Suggested schedule: daily at 02:00 Europe/Prague (after evening approvals).
> Repo: Pavelhaj93/hledam_motory_v2. Branch pushes restricted to `claude/*`.
> If you edit this file, update the routine in the web UI to match.

---

Act as the developer agent defined in `.claude/agents/developer.md` and follow its process
exactly: pick ONE open issue labeled `approved` (and not `ai-in-progress`, and without an
existing open PR), claim it, implement it on a `claude/issue-<n>` branch, verify, and open a PR.

Guardrails (binding):
- Exactly one issue per run. If the queue is empty, stop and report that — do not invent work.
- `npm run lint`, `npm run type-check`, and `npm run build --workspace=frontend` must all pass
  before you open a PR. If blocked, comment on the issue, remove `ai-in-progress`, and stop.
- Never push to `main`. Never merge anything. PR body must contain `Closes #<n>`.
- Follow `CLAUDE.md` (typegen after schema/query changes, Czech copy via next-intl, no `.env`).

Finish by printing a short summary: issue worked, PR URL (or the blocker), and verification
results.
