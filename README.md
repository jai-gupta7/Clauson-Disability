# Clauson Task 02 - Complete Mobile Site Prototype

This dependency-free prototype implements M01-M11 from Design Manual v1.0. Open `index.html` or serve this folder locally. Use `?preview=320`, `?preview=375` or `?preview=390` to force the review canvas width in a larger browser.

Included interactions: sticky compact header, inline menu with Escape recovery, a compact five-category comparison switcher, descriptive SSDI/SSI eligibility selectors, interactive payment-summary cards, a quiet three-option scenario explorer, a complete seven-step local questionnaire with validation/review/confirmation, local newsletter validation and two one-time scroll treatments. Only the comparison category navigator is sticky; eligibility, payment and scenario controls remain in normal document flow. Tabs support click, touch, Arrow keys, Home and End. Print/export and no-JavaScript states expose every comparison, eligibility, payment and scenario panel. Interactive result panels always render at full opacity; other selected structural blocks use a one-time 10 px/260 ms entrance. Reduced-motion and export modes remain static. No form data is transmitted.

The visual-polish, Figma-parity and disclosure redesign add explicit SSDI/SSI comparison rows, separate program qualification paths, the source's full SSI exclusions and income context, interactive payment summaries, an attached scenario selector and result, flatter informational surfaces, a direct case-evaluation landing target, a rebalanced hero and clearer footer groups. The current page dimensions are recorded in the conformance report; static/export states preserve the full reading path. They preserve the approved brand tokens, source meaning and accessibility intent.

The artifact is an editable design prototype, not a deployed site. Read `CONTENT_STATUS.md` and `review/CONFORMANCE_REPORT.md` before publication. The local archive and linked cloud Figma node `1:2168` have both been inspected. The source's SSDI heading contains SSI criteria and has been corrected in this implementation; no additional editable questionnaire frames were found. Several benefits claims and contact destinations still require owner verification.

## Run locally

With Python 3 installed, run from this repository folder:

```sh
python -m http.server 4174 --bind 127.0.0.1
```

Open http://127.0.0.1:4174/?preview=390 for the mobile review view. No package installation or build step is required.

## Design source

## Deploy on Render

Create a Render Static Site connected to this repository, or use the included `render.yaml` Blueprint.

- Branch: `main`
- Build command: `node build.mjs`
- Publish directory: `dist`
- Root directory: leave blank

The build copies only the website and assets into the publish directory. No environment variables or backend service are needed. Forms remain demonstration-only and do not send data.

## Primary design submission

[Clauson design submission in Figma](https://www.figma.com/design/4QXf4LP3XG04pUY1YoPhG8/Clauson-Disability-Design-System?node-id=5-146)

Figma is the primary design submission. This repository preserves the local interaction prototype; it is not a claim of exact parity with the current Figma file. The dated review notes describe the prototype checks performed at that time.
