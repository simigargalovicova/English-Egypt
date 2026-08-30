# Egypt English Adventure 🐫

An interactive one-hour English lesson for an **adult false beginner** (A1 → early A2)
— someone who has studied English before but freezes when they have to actually say
something. The learner walks an illustrated route across an Egypt holiday
(Airport → Hotel → Pool → Restaurant → Bazaar → Oasis) and, by the end, can handle a
short real conversation at a hotel desk, in a restaurant, in a shop, or by the pool.

Instructions are in **Slovak**, everything the learner produces is in **English**.

No login, no backend, no paid services. Progress lives in `localStorage`.

---

**Live app: https://simigargalovicova.github.io/English-Egypt/**

## Running it

Needs Node 20.19+ or 22.12+.

```bash
npm install
npm run dev              # http://localhost:5173
npm run dev -- --host    # also reachable from a phone on the same wifi
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm test` | Unit tests for the answer matcher and all lesson content |
| `npm run typecheck` | Typecheck app and tests |
| `npm run lint` | oxlint |
| `npm run verify` | lint + typecheck + test + build |
| `npm run smoke` | Drives the **whole lesson** in a real browser (see below) |

### The smoke test

`npm run smoke` builds nothing itself — run `npm run build` first. It then serves
`dist/`, opens a 390 × 844 phone viewport in Chromium, and plays the entire lesson:
all 11 missions, every mastery gate, the badge popups, a reload to prove persistence,
and the reset button. It fails on **any** console error or page error.

```bash
npm run build && npm run smoke
```

It needs a Chromium that Playwright can drive. If Playwright's own download is not
available, point it at an existing binary:

```bash
CHROME_PATH=/path/to/chromium npm run smoke
```

---

## How the lesson is built

The design principle throughout is **recognition → reconstruction → recall →
transfer**. The learner is never left in multiple-choice mode: by Stage 5 there is
no English on screen at all, and by Stage 10 there is no Slovak either.

| # | Mission | Location | What the learner does | Gate |
| --- | --- | --- | --- | --- |
| 1 | Cold Start | Airport | Types six answers **before any teaching**, and self-rates each | All six attempted |
| 2 | The English Engine | Airport | Picks ARE / DO / CAN for 12 mixed prompts; the pattern is explained *after* | 9 / 12, else a repair round |
| 3 | Sentence Surgery | Hotel | Turns 6 sentences into a negative (word tiles) and a question (typed) | 5 / 6, both halves right |
| 4 | Travel Chunks | Hotel | Meets 16 phrases with audio + Slovak, then writes each from memory | All 16 attempted |
| 5 | Build It | Hotel | Level A reorder → Level B fill the gaps → Level C free production | 4 / 6 per level |
| 6 | Hotel Mission | Hotel | Picks an *intention*, then finds the English themselves; 4 branches | 3 of 4 branches |
| 8 | Small Talk | Pool | Answers a stranger, nudged to add one extra detail | All six answered |
| 7 | Restaurant Mission | Restaurant | Six turns plus one **random** unexpected problem to react to | Half the turns |
| 9 | Error Detective | Bazaar | Types the repair for 10 broken sentences | 8 / 10 |
| 10 | Final Boss | Oasis | One of four random scenarios, six turns, no Slovak, costed hints | See below |
| 11 | Survival English | Oasis | Free recall from five starters, then picks 5 sentences to keep | All five written |

Missions unlock in order, and **only** by passing their gate — there is no
"mark as complete" button anywhere.

### The Final Boss gate

Passing needs either:

- the message getting through in **4 of 6** turns without revealing the model answer,
  **and** at least **4 different structures** used (BE / DO / CAN / I'd like /
  Wh- question / polite form / there is / accepting / thanking); or
- a clean run — every single turn understood — because communication is the point.

`npm test` asserts that each of the four scenarios is winnable on its own model
answers, so the gate can never become unreachable when content changes.

---

## Answer checking

Free typing is the default, so the matcher has to be generous without being useless.
`src/lib/normalize.ts` handles it:

- case, punctuation, doubled spaces and curly apostrophes are ignored
- contractions are expanded, so `I'm` = `I am` and `don't` = `do not`
- politeness words (`please`, `excuse me`, `thank you`) are ignored on a second pass
- each item accepts **several natural answers**, either as whole sentences or as
  keyword rules — `Can I have a towel`, `Could I have another towel, please` and
  `I'd like a towel` all pass the same prompt
- a small typo comes back as **"almost"**, not "wrong", and does not break the streak
- classic false-beginner slips (`I am like Egypt`, `Do you are…`, `I don't can…`,
  `I no understand`, `Where the toilet is`) are detected by name so feedback can
  explain the rule instead of just rejecting the answer

Feedback is never bare. A wrong answer always names the pattern; a correct answer
that still contains a slip gets the praise *and* a note for next time.

---

## Everything else

- **Gamification** — XP by interaction type (recognition +2, reconstruction +4,
  recall +6, scenario +8, self-correction bonus +3), streaks, mastery %, 8 badges,
  and an illustrated progress map.
- **Audio** — Web Speech API text-to-speech on every phrase, model answer and
  dialogue line. Speech *recognition* is opt-in in Settings and hidden entirely when
  the browser has no support. Typing is always available.
- **Teacher Mode** — a collapsible panel on every mission with the objective, target
  grammar, what to correct, what to let go, prompts to use, and when to move on. Off
  by default; it never interrupts the learner-facing flow.
- **Then and now** — the six Stage 1 prompts come back in the final summary, so the
  learner sees their own before/after answers side by side.
- **Accessibility** — 44px minimum tap targets, visible focus rings, labelled
  controls, no meaning carried by colour alone, and every piece of text audited to
  WCAG AA contrast (4.5:1) against its real background, gradients included.
- **Responsive** — built mobile-first and checked at 320, 390, 768 and 1280px with no
  horizontal overflow.
- `prefers-reduced-motion` disables the animation throughout.

## Deploying

Pushing to `main` runs `.github/workflows/deploy.yml`, which lints, typechecks,
tests and builds before publishing `dist/` to GitHub Pages — a failing test stops
the deploy, so a broken lesson never reaches the live URL.

Because Pages serves the app from `/English-Egypt/`, `vite.config.ts` sets that
as the production `base`. Hosting at a domain root instead (Netlify, Vercel, your
own server) just needs the prefix turned off:

```bash
BASE_PATH=/ npm run build
```

`npm run smoke` reads the prefix back out of the built HTML, so it always tests
the URLs that actually ship.

## Layout

```
src/
  data/        lesson content only — no components
  lib/         answer matching, speech, storage
  state/       progress context, reducer, persistence
  components/  reusable exercise + UI pieces
  stages/      one screen per mission
  styles/      tokens.css → base.css → app.css
scripts/
  smoke.mjs    full-lesson browser test
```

Content is deliberately kept out of components: adding a phrase, a scenario turn or
a new broken sentence means editing one array in `src/data`, and `npm test` will tell
you if the model answer does not pass its own validator.

## Notes

- Web fonts (Baloo 2, Nunito) load from Google Fonts. Offline, the app falls back to
  a system stack and still works; only the font request fails.
- Nothing here copies any existing language app's assets, mascot, colours or layout.
  The suitcase character, the map and the palette are original to this project.
