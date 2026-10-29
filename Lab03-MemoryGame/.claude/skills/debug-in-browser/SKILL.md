---
name: debug-in-browser
description: Use when a student's VueJS app for this lab isn't behaving as expected — e.g. "nothing shows up", "the page is blank", "the counter buttons don't work", "the API version isn't showing", "Echo isn't coming back", "I'm getting an error", "the console isn't showing what I expect". Runs the actual page with Playwright to see the real error (instead of guessing from reading the source), then walks the student through finding it themselves in browser DevTools — the raw error/line/identifier is for your own grounding only and is never pasted to the student.
---

# Debug in browser

Two things have to both be true: your hint has to be _accurate_ (grounded in what's really happening, not a guess from reading the source), and the student still has to be the one who opens DevTools, reads the real message, and finds the fix. This skill uses Playwright to get you the first part, then coaches like a human tutor for the second.

Same rule as everywhere else in this repo (see `AGENTS.md`): describe, ask, don't hand over the fix.

## Before you start — this app runs on live dev servers, not static files

This lab's project isn't static HTML opened from disk — it's a Vite-served Vue SPA (`frontend/`, default `http://localhost:5173`) that, depending on the exercise, talks to a Laravel API (`api/`, default `http://localhost:8000`) and a Socket.IO server (`websockets/`, default `http://localhost:3000`). Those have to already be running; this skill does not start them for the student.

If the symptom could plausibly be "a service isn't running" rather than a code bug (nothing loads at all, a fetch/socket call never resolves), ask first whether they have `npm run dev` running in `frontend/`, and — for the Laravel/WebSocket exercises — `php artisan serve` in `api/` and `npm run dev` in `websockets/`. Don't spend a DevTools round-trip on something a missing terminal would explain.

## Step 0 — ground yourself first, silently

Before saying anything about the likely cause, run:

```
node .claude/skills/debug-in-browser/scripts/capture.mjs [url] [--click "<selector>"]
```

Defaults to `http://localhost:5173/` if no URL is given — that's right for every exercise in this worksheet, since `main.js` mounts `AboutPage` directly at the root. Add `--click "<selector>"` if the symptom is about an interaction (e.g. `--click "button:has-text('Increase')"` for the counter, `--click "text=Send"` for the Echo button).

This call is for you, not the student. **Never** paste its JSON output, the literal error message, the identifier it names, the line number, or a raw failed-request URL into the conversation. Doing that would just be handing them the answer through a side door instead of the front door. Use it only to make sure the nudge you give next is actually correct.

## Step 1 — send them to DevTools with a calibrated nudge, not the answer

Tell them to open DevTools (F12 / right-click → Inspect / Cmd+Option+I), go to the **Console** tab, and refresh. Pair that with one clue drawn from the _category_ of what you just saw — never the specific name:

- `ReferenceError: X is not defined` → "it's saying something isn't defined — look for that in your code and check where, or if, you defined it."
- `TypeError: Cannot read properties of undefined/null` → "it's complaining about reading a property on something that doesn't have a value yet — check what that thing is supposed to be at that point."
- `SyntaxError` / Vite overlay showing a compile error → "the build can't even parse the file — look for a mismatched tag between `<template>` and `<script setup>`, or a bracket/paren/quote issue."
- `navigationError` or the page never loads at all → "can your browser reach the app at all? Is `npm run dev` still running in the `frontend` folder, and does the terminal show any errors?"
- Failed request to `localhost:8000/api/metadata` (connection refused, or `failedRequests` shows it) → "check the Network tab for that request — is the Laravel server (`php artisan serve`) still running?"
- Failed request/response but status 500 → "that's the server responding with an error, not a network problem — did you add the `abort(500, ...)` line from the exercise? What does the response body actually say, and did your fetch call ask for JSON via the `Accept` header?"
- Socket-related: no `"connected"` state, no echo coming back → "check the Console and Network → WS tab — is the `websockets` server (`npm run dev` in that folder) running on port 3000, and does the client actually call `io('http://localhost:3000')`?"
- Vue warning like `Failed to resolve component` → "Vue is telling you it doesn't know a component you used in the template — check how (or whether) it's imported/registered."
- `pageErrors`/`failedRequests` empty and console looks as expected, but the page still doesn't behave right → it's a logic bug, not a crash. Point them at the **Elements** tab to check whether the DOM actually changed, and suggest adding their own `console.log(...)` at a couple of points (e.g. inside `increase`/`decrease`, or the socket event handler) to narrow down where behavior diverges from what they expect.

## Step 2 — let them find and read the real thing

Wait for them to report what they actually see in DevTools. That's the real investigation — don't shortcut it by confirming too eagerly. If what they report doesn't match what you saw (they misread it, or something changed — e.g. they restarted a server), re-run the capture rather than trusting your first read.

## Step 3 — connect it to their code without naming the fix

Once they've read the real error/identifier themselves, ask questions that connect it to their code: "where else does that name show up? Where would you expect it to have been created — `main.js`, or inside the component?" Let them do the pointing.

## Step 4 — iterate

After they try something, you can silently re-run the capture script to check whether that error is gone or a new one appeared, before deciding whether to keep going on the same issue. Still never paste the raw output — fold what changed back into another category-level nudge.

## Hard limits

- Never show the raw script output, exact error text, exact identifier, exact line number, exact failed URL, or a screenshot to the student. Translate it into an abstracted, category-level nudge every time.
- Never write or suggest the corrected code.
- The student opens DevTools and reads the message themselves, every time — you already know the answer, but they need to do it to build the habit. Don't skip Step 1 just because Step 0 already told you the fix.
- If asked to just reveal what the tool found: follow `AGENTS.md` — push back once, and if they insist, phrase it as a stronger nudge ("refresh and read the console/Network tab — it'll point you right at it") rather than quoting the internal capture output directly.

## Setup this needs (one-time)

- Node.js (already required for the rest of this lab).
- `npm install` in this repo's root (installs the `playwright` package).
- `npx playwright install chromium` (downloads the actual browser binary — `npm install` alone does not do this).
- The student's `frontend` (and, for the relevant exercises, `api` and `websockets`) dev servers running before you call the capture script.
