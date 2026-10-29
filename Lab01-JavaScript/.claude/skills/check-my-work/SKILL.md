---
name: check-my-work
description: Use when a student asks to check, review, or self-grade their progress on one of the README.md exercises in this lab — e.g. "check my work", "review exercise 12", "what am I missing", "is this correct", "am I done with the arrays section". Reviews the student's code against that exercise's stated learning objectives and highlights concepts that seem missing or misapplied, WITHOUT rewriting or fixing their code.
---

# Check my work

You are reviewing a student's progress on a lab exercise, not grading a submission and not fixing their code. Follow `AGENTS.md` at the repo root — this skill is the "self-check" tool it refers to, so the same no-solutions rule applies here even more strictly than in normal conversation.

## Steps

1. **Figure out what to review.** If the student named an exercise number or section, use that. Otherwise infer it from context: which file did they just edit (`basic.js` → "The basic", `array.js` → "Arrays", `objects.js` → "Objects", `functions.js` → "Functions", `async.js` / `asyncWithModules.js` → "Asynchronous programming" / "Modules", `dom.js` → "DOM"). If it's still ambiguous, ask which exercise(s) to check instead of guessing broadly.

2. **Read the exercise text itself** from `README.md` — not just the number, the full instructions. Pay attention to anything that specifies *how* to solve it (e.g. "using a while loop and an if statement", "use arrow function syntax", "using the reduce() function", "without using bigint"), not just what output is expected. That's the actual rubric — there is no separate answer key to compare against.

3. **Read the student's current code** for that exercise in `src/js/`.

4. **Compare the code against the exercise's stated requirements**, not against what you would have written. Check:
   - Does it use the specific language feature(s) the exercise calls out?
   - Does it address every sub-part of the exercise (exercises often have several lettered/numbered sub-questions or multiple functions)?
   - Are there JS concepts from that section (scope, coercion, `this` binding, closures, prototypes, promises, etc.) that the exercise implies but the code doesn't demonstrate understanding of?
   - If the exercise asks analysis questions ("why does this happen?"), check whether those are answered somewhere (comments, or ask the student directly), not just whether code runs.

5. **Report back in this shape:**
   - **Looks solid:** what's implemented and correctly demonstrates the concept.
   - **Worth a second look:** concepts the exercise calls for that seem missing, unused, or misapplied. For each one: name the concept, point at *where* in their code (or its absence) makes you think that, and ask a guiding question rather than stating the fix — e.g. "Exercise 4 asks you to compare function vs block scope, but I don't see a case where a `let` inside the `if` block shadows the outer one — what do you expect `console.log(y)` to print right after the block, and did you check that?"
   - **Try this:** a concrete next action (run it and check the console, re-read a specific MDN section, add a `console.log` in a specific spot) — never a corrected code block.

## Hard limits

- Do not paste a corrected or completed version of their function, even a small one. Describe the gap and ask a question instead.
- Do not silently edit their files. This is a read-only review — if they then ask you to fix something specific, that's a normal separate request, not part of "checking work".
- If the code looks completely correct, say so plainly and briefly — don't invent nitpicks to fill out the format.
