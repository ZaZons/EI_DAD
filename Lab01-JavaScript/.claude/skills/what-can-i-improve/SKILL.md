---
name: what-can-i-improve
description: Use when a student wants style/quality feedback on code that already works and already satisfies the exercise — e.g. "what can I improve", "is this clean", "any suggestions for this code", "how could I write this better". Reviews already-correct code for readability, naming, and idiom, strictly using only concepts already taught by this point in README.md — never suggests techniques from later sections and never suggests performance/optimization changes.
---

# What can I improve

This is for code that already works. It is not `check-my-work` (requirements coverage) and not `debug-in-browser` (something's broken) — if either of those is actually what's needed, say so and point at that skill instead of forcing a style review onto broken or incomplete code.

## Scope — read this before saying anything

Two hard boundaries, both there because going past them stops being a readability suggestion and starts being either a spoiler or a distraction:

1. **Only concepts already taught, cumulatively, up to this exercise.** Work out which `README.md` section the file belongs to (see mapping below), then only draw on that section and everything *before* it in the document. Do not suggest `.reduce()`, closures, `async`/`await`, optional chaining, etc. if the student hasn't reached the section that introduces them yet, even if it would genuinely be cleaner — that's not an improvement to them, it's an answer key for a later exercise.
   - `basic.js` → only "The basic" section is in bounds.
   - `array.js` → "The basic" + "Arrays".
   - `objects.js` → + "Objects".
   - `functions.js` → + "Functions".
   - `async.js`, `asyncWithModules.js` → + "Asynchronous programming" (+ "Modules" if the file is under `modules/`).
   - `dom.js` → all sections through "DOM".

2. **No performance or optimization suggestions.** Not Big-O, not micro-optimizations, not "avoid recomputing this", not restructuring for speed. This lab is about learning the language, not tuning it. If a change would only matter for performance, leave it out even if it's technically true.

Everything else — naming, duplication, dead code, magic numbers, consistency (e.g. mixing `var` and `let` after the scope section covered why that matters), using the construct the exercise actually asked for instead of a workaround, splitting an overloaded function, cutting needless complexity — is fair game.

## Steps

1. Confirm what to review (a file, or "the arrays section", etc.) and which `README.md` section(s) that puts in bounds per the mapping above.
2. Skim that section (and everything before it) in `README.md` if you're not already sure what's been introduced by that point.
3. Read the student's code.
4. Look for opportunities that fall inside both boundaries above. Don't pad the review to hit some quota — if there's nothing worth mentioning,
   say the code looks clean and stop.
5. For each suggestion:
   - Name the specific thing (not "this could be cleaner" — say what: unclear name, duplicated block, `var` where the exercise's whole
     point was `let`/`const`, etc.).
   - Explain briefly *why* it matters for readability/correctness-adjacent habits, not performance.
   - Illustrate with a small **generic** example of the pattern (e.g. a two-line made-up snippet showing the idiom), not a rewritten version
     of their actual file. Let them apply it themselves.
6. If they ask you to just make the change, apply the same rule as `AGENTS.md`: point at what to change and why, offer to talk through it, don't silently edit the file for them.

## Output shape

- **Looks clean:** what's already well-written, briefly.
- **Worth polishing:** one item per suggestion, each with the "what / why / small illustrative example" shape above — only using concepts already covered.
- Nothing to pad with if the second section is empty — that's a fine outcome.
