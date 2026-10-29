---
name: debug-in-browser
description: Use when a student's exercise page isn't behaving as expected — e.g. "nothing shows up", "the page is blank", "I'm getting an error", "the console isn't showing what I expect", "clicking the table doesn't do anything". Runs the actual page with Playwright to see the real error (instead of guessing from reading the source), then walks the student through finding it themselves in browser DevTools — the raw error/line/identifier is for your own grounding only and is never pasted to the student.
---

# Debug in browser

Two things have to both be true: your hint has to be _accurate_ (grounded in what's really happening, not a guess from reading the source), and the student still has to be the one who opens DevTools, reads the real message, and finds the fix. This skill uses Playwright to get you the first part, then coaches like a human tutor for the second.

Same rule as everywhere else in this repo (see `AGENTS.md`): describe, ask, don't hand over the fix.

## Step 0 — ground yourself first, silently

Before saying anything about the likely cause, run:

```
node .claude/skills/debug-in-browser/scripts/capture.mjs <page.html>
```

Pick `<page.html>` based on what the student is working on (`playground.html`, `array.html`, `objects.html`, `functions.html`, `async.html`, `modules.html`,
`dom.html`). Add `--click "<selector>"` if the symptom is about an interaction (e.g. the DOM highlighting exercise).

This call is for you, not the student. **Never** paste its JSON output, the literal error message, the identifier it names, or the line number into the conversation. Doing that would just be handing them the answer through a side door instead of the front door. Use it only to make sure the nudge you give next is actually correct.

## Step 1 — send them to DevTools with a calibrated nudge, not the answer

Tell them to open DevTools (F12 / right-click → Inspect / Cmd+Option+I), go to the **Console** tab, and refresh. Pair that with one clue drawn from the _category_ of what you just saw — never the specific name:

- `ReferenceError: X is not defined` → "it's saying something isn't defined — look for that in your code and check where, or if, you defined it."
- `TypeError: Cannot read properties of undefined/null` → "it's complaining about reading a property on something that doesn't have a value yet — check what that thing is supposed to be at that point."
- `SyntaxError` → "the browser can't even parse the file — look for a mismatched bracket, paren, or quote, maybe a little above the line it points to."
- 404 on a `<script>` → "check that the path in your script tag actually matches where the file lives."
- Module/CORS-looking error on a `type="module"` page (`dom.html`, `modules.html`, `array.html`) → "how are you opening this page — via alocal server, or straight from the file system?"
- `pageErrors` empty and console looks as expected, but the page still doesn't behave right → it's a logic bug, not a crash. Point them at the **Elements** tab to check whether the DOM actually changed, and suggest adding their own `console.log(...)` at a couple of points to narrow down where behavior diverges from what they expect.

## Step 2 — let them find and read the real thing

Wait for them to report what they actually see in DevTools. That's the real investigation — don't shortcut it by confirming too eagerly. If what they report doesn't match what you saw (they misread it, or something changed), re-run the capture rather than trusting your first read.

## Step 3 — connect it to their code without naming the fix

Once they've read the real error/identifier themselves, ask questions that connect it to their code: "where else does that name show up? Where would you expect it to have been created?" Let them do the pointing.

## Step 4 — iterate

After they try something, you can silently re-run the capture script to check whether that error is gone or a new one appeared, before deciding whether to keep going on the same issue. Still never paste the raw output — fold what changed back into another category-level nudge.

## Hard limits

- Never show the raw script output, exact error text, exact identifier, exact line number, or a screenshot to the student. Translate it into an abstracted, category-level nudge every time.
- Never write or suggest the corrected code.
- The student opens DevTools and reads the message themselves, every time — you already know the answer, but they need to do it to build the habit. Don't skip Step 1 just because Step 0 already told you the fix.
- If asked to just reveal what the tool found: follow `AGENTS.md` — push back once, and if they insist, phrase it as a stronger nudge ("refresh and read the console — it'll point you right at it") rather than quoting the internal capture output directly.

## Setup this needs (one-time)

- Node.js (already required for the rest of this lab).
- `npm install` in the repo root (installs the `playwright` package).
- `npx playwright install chromium` (downloads the actual browser binary — `npm install` alone does not do this).
