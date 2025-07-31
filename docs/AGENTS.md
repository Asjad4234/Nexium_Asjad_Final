# Smart Recipe Generator — AGENTS Guide

*This file is read by code‑generation and code‑review agents (e.g. OpenAI Codex, ChatGPT) to give them the context, guard‑rails and conventions they need to operate safely inside this repository. Put simply: **read this first, then write code.***

---

## 1  Project at a Glance

| Area          | Tech / Tool                                                    | Notes                                                          |
| ------------- | -------------------------------------------------------------- | -------------------------------------------------------------- |
| **Framework** | Next.js 14 (React 18, App‑router disabled)                     | see `next.config.mjs`                                          |
| **Language**  | TypeScript (strict)                                            | keep `tsc --noEmit` green                                      |
| **Styling**   | Tailwind CSS 3 + Headless UI                                   | utility‑first; no custom CSS unless Tailwind cannot express it |
| **Backend**   | Next.js API routes, MongoDB 5 via Mongoose, AWS S3, OpenAI SDK | DB helpers in `src/lib`                                        |
| **Auth**      | next‑auth v4 (Google OAuth)                                    | session helpers already wired                                  |
| **Tests**     | No testing framework configured                                 | no testing available                                           |
| **CI / CD**   | GitHub Actions → Vercel                                        | workflow files live in `.github/workflows`                     |

---

## 2  Directory Cheat‑Sheet (you will touch these the most)

```
src/
  pages/           👉  Page components & API routes
  components/      👉  Re‑usable UI + Hooks
  lib/             👉  DB / AWS / OpenAI helpers
  models/          👉  Mongoose schemas
  utils/           👉  Shared helpers (pure functions only!)
  types/           👉  Global TypeScript types
  styles/          👉  Global Tailwind entry point

docs/              👉  Architecture, testing strategy, reviews
```

> **Rule of thumb:** *If you add or rename anything outside those folders, document it in this file.*

---

## 3  Contribution Workflow

1. **Sync first** – run `git pull --rebase origin main`.
2. **Branch naming** – `<area>/<short‑slug>` e.g. `api/validate-inputs`.
3. **Commit style** – Conventional Commits (`feat:`, `fix:`, `test:` …). Include the package/folder in the subject when useful.
4. **PR title** – `[<area>] <one‑line summary>` (mirrors commit style).
5. **PR body** –

   * What changed & why
   * How to test locally (commands / URLs)
   * Screenshot or Loom for UI changes
6. **Labels** – add `type:feature`, `type:bug`, etc. so automations can pick them up.

The CI pipeline **must be green** (lint, type‑check) before merge.

---

## 4  Coding & Style Guidelines

* **TypeScript strict‑null‑checks ON** — no `any` unless *really* unavoidable (and add `// TODO: tighten type`).
* **React** — functional components, hooks not classes. Prefer `useCallback`, `useMemo` for expensive work.
* **Tailwind** — stick to the design tokens in `tailwind.config.ts`. Create utility classes before adding bespoke CSS.
* **API routes** —

  * Validate input with *zod* (or existing manual checks).
  * Prefer **dynamic route params** over body fields for REST operations (see `docs/o1-preview.md`).
  * Return proper HTTP codes (`401`, `403`, `404`, `500`).
* **Error handling** — never leak secrets; log server‑side details, surface generic message to the client.
* **Tests** —

  * No testing framework configured.
  * Focus on manual testing and code review.
* **Snapshots** — commit updated snapshots only when the diff is intentional.
* **Formatting** — repo is Prettier‑formatted; run `npm run lint -- --fix` before pushing.

---

## 5  Validation Checklist (run these before every PR)

```bash
# 1. Type‑check
npm run compileTS

# 2. ESLint (Next.js core‑web‑vitals config)
npm run lint
```

> **Tip**: MongoDB is expected at `mongodb://localhost:27018` (see `docker-compose.yml`). Run `docker compose up -d` once.

---

## 6  Areas Under Migration / Special Care

| Area                  | Status                                           | What the agent should do                                         |
| --------------------- | ------------------------------------------------ | ---------------------------------------------------------------- |
| **Recipe DELETE API** | Being refactored to REST‑ful `/api/recipes/[id]` | follow `docs/o1-preview.md` recommendations; update tests & docs |
| **Input validation**  | Incrementally introducing **zod**                | new routes **must** use zod schemas                              |
| **Manual testing** | All features require manual testing               | test all user flows manually before deployment                   |

If you touch those areas, **mention the migration step in your PR description** so reviewers can track progress.

---

## 7  Agent‑Specific Instructions

* **Always check** if the local checkout is *up‑to‑date*. If uncertain, ask the user: *“Has the code‑base been updated since `<last commit hash>`?”*
* **Search strategy** – scan `docs/` and commit history before rewriting large files; look for context in PR reviews.
* **Write helpers first** – if a new feature needs utilities, create them in `src/utils/` and unit‑test thoroughly.
* **Documentation** – update or create MD files in `docs/` when you introduce new concepts, environment variables, or scripts.
* **Output format** – When opening a PR:

  1. PR description follows the template in Section 3.
  2. Include fenced diff blocks (\`\`\`diff) for key changes so reviewers can skim quickly.
  3. End with `Closes #<issue>` when applicable.
* **Foot‑guns** – 

  * Avoid modifying `.next/**` or `public/**` generated assets.
  * Never commit secrets; use env placeholders.
  * Keep `vercel.json` function timeouts in mind (≤ 60 s).

---

## 8  FAQ for Future Agents

> **Q:** *Where do I place new environment variables?*
>
> **A:** Add to `.env.example` and document in `README.md → Installation`.

> **Q:** *How do I add testing?*
> **A:** No testing framework is currently configured. Consider adding Jest or Playwright for testing.

> **Q:** *What if I need a third‑party library?*
> **A:** 1) Check if an existing dep already solves it. 2) If new, justify in PR body; prefer lightweight, typed libs. 3) Run `npm install <pkg> && npm install -D @types/<pkg>` if typings missing.

Happy hacking! 🎉
