---
name: check-my-work
description: Use when a student asks to check, review, or self-grade their progress on one of the README.md exercises in this lab — e.g. "check my work", "review the About Page exercise", "what am I missing", "is this correct", "am I done with the Laravel connection". Reviews the student's code against that exercise's stated learning objectives and highlights concepts that seem missing or misapplied, WITHOUT rewriting or fixing their code.
---

# Check my work

You are reviewing a student's progress on a lab exercise, not grading a submission and not fixing their code. Follow `AGENTS.md` at the repo root — this skill is the "self-check" tool it refers to, so the same no-solutions rule applies here even more strictly than in normal conversation.

## Steps

1. **Figure out what to review, and where the code actually is.** This worksheet's code lives in a separate project (`api/`, `frontend/`, `websockets/`) that the student created via `setup.md`, not in this repo. If you don't already know the project root, ask. Then figure out which exercise section applies — if the student named one, use that; otherwise infer it from what they just edited:
   - `frontend/src/pages/about/AboutPage.vue` (template + `<script setup>` with `ref`/`reactive`) → "About Page"
   - `frontend/src/main.js` mounting `AboutPage` → "About Page" (step 4)
   - `AboutPage.vue` with `onMounted` + `fetch` to `/api/metadata`, plus `api/routes/api.php` → "Connect to Laravel"
   - `frontend/src/main.js` (`io(...)`, `app.provide('socket', ...)`) and `AboutPage.vue` (`inject('socket')`, emit/listener for `"echo"`) → "Connect to Web Sockets"
   - `frontend/vite.config.js`, `frontend/src/index.css`, `AboutPage.vue` template using Shadcn components (Button/Input) → "Add Shadcn"
   - A standalone HTML+JS pair outside the main project, or Options-API / explicit `setup()` versions of the same component → "Extras"

   If it's still ambiguous, ask which exercise(s) to check instead of guessing broadly.

2. **Read the exercise text itself** from `README.md` — not just the number, the full instructions. Pay attention to anything that specifies *how* to solve it (e.g. "using the `v-on:<event>` attribute" vs "using `@<event>`", "use the async/await syntax", "use the provide()/inject() mechanism"), not just what the end result should look like. That's the actual rubric — there is no separate answer key to compare against.

3. **Read the student's current code** for that exercise in the project files listed above.

4. **Compare the code against the exercise's stated requirements**, not against what you would have written. Check:
   - Does it use the specific mechanism the exercise calls out (`ref` vs `reactive`, `v-on:` vs `@`, `onMounted`, `provide`/`inject`, async/await, the `Accept` header on the fetch call, etc.)?
   - Does it address every sub-part of the exercise (exercises often have several lettered/numbered sub-steps, e.g. both buttons, both the emit and the listener, both the connected-state span and the received-message display)?
   - Are there concepts the exercise implies but the code doesn't demonstrate — reactivity (why `ref`/`reactive` instead of plain variables), the Vue component lifecycle, why the `Accept: application/json` header matters for the error-handling step, what `provide`/`inject` is for versus prop drilling?
   - If the exercise asks analysis questions ("what does `onMounted()` do?", "why couldn't we see the error information without the `Accept` header?"), check whether those are answered somewhere (comments, or ask the student directly), not just whether the app runs.

5. **Report back in this shape:**
   - **Looks solid:** what's implemented and correctly demonstrates the concept.
   - **Worth a second look:** concepts the exercise calls for that seem missing, unused, or misapplied. For each one: name the concept, point at *where* in their code (or its absence) makes you think that, and ask a guiding question rather than stating the fix — e.g. "The WebSockets section asks you to reflect `socket.connected` in the Connection span — I don't see that binding in your template, what does the span currently show, and does it ever change?"
   - **Try this:** a concrete next action (run it and check the Network tab, re-read the relevant Vue/Socket.IO doc link from `README.md`, click the buttons and watch the console) — never a corrected code block.

## Hard limits

- Do not paste a corrected or completed version of their component, template, or function, even a small one. Describe the gap and ask a question instead.
- Do not silently edit their files. This is a read-only review — if they then ask you to fix something specific, that's a normal separate request, not part of "checking work".
- If the code looks completely correct, say so plainly and briefly — don't invent nitpicks to fill out the format.
