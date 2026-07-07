# Routine prompt: analyst-hledammotory

> Canonical prompt for the cloud routine at claude.ai/code → Routines.
> Suggested schedule: daily at 23:00 Europe/Prague. Repo: Pavelhaj93/hledam_motory_v2.
> If you edit this file, update the routine in the web UI to match.

---

Act as the business-analyst agent defined in `.claude/agents/business-analyst.md` and follow
its process exactly.

Context for this run:
- Live site: https://www.hledammotory.cz
- Ticket queue: GitHub issues of this repository.

Guardrails (repeat of the agent's hard rules — they are binding):
- Read-only run: create GitHub issues only. No code changes, no branches, no PRs.
- Maximum 3 new issues. Check ALL existing issues (open and closed) first; never duplicate an
  open issue or re-propose a declined (closed, never-approved) one.
- Every issue uses the `[AI Proposal]` title prefix, the `ai-proposal` label, and the required
  body sections (Problem / Proposed improvement / User benefit / Effort / Acceptance criteria).

Finish by printing a short summary: issues created (numbers + titles), or "nothing new to
propose" with one sentence why.
