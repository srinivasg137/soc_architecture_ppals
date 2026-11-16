# SoC PPALS — Srinivas Gaddam

Practical SoC architecture articles, the PCIe Gen6 / Gen7 series, and interactive architecture labs.

Website: https://srinivasg137.github.io/soc_architecture_ppals/

## Publishing and editing

GitHub Pages publishes `main` → `/docs`. Edit the portal HTML, CSS and JavaScript in `docs/` and commit to main. Deployment status is available in GitHub Actions.

- Home: `docs/index.html`
- Profile: `docs/about/index.html`; photo: `docs/srinivas-profile.jpeg`
- SoC articles: `docs/soc-architecture/part-1/` and `part-2/`
- PCIe articles: `docs/pcie/part-1/` through `part-4/`
- Lab landing page: `docs/width-vs-frequency/index.html`
- Shared styling and navigation behavior: `docs/style.css`, `docs/site.js`

Article bodies and figures are preserved from the author's published articles. Navigation and card titles use consistent spelling. Dates are publication dates retrieved from the source article metadata. Reading times are estimates at 200 words per minute. When adding an article, update the series listing, navigation dropdowns, and homepage latest-article card.

## Width vs Frequency lab

Part 1 compares three architectures with 128 decimal GB/s raw capacity:

| Architecture | Configuration |
| --- | --- |
| A: wider datapath | 1024 bits at 1 GHz |
| B: higher frequency | 512 bits at 2 GHz |
| C: parallel engines | Two 512-bit engines at 1 GHz |

The article's useful payload target is 96 GB/s. Default losses (10% overhead, 5% bubbles, 80% utilization, and 90% parallel efficiency for C) intentionally demonstrate that equal raw capacity does not ensure the target. A/B deliver 87.552 GB/s and C delivers 78.7968 GB/s before any tighter shared cap. Entering zero overhead, 15% bubbles, 90% utilization and 100% parallel efficiency yields the article's 97.92 GB/s example for all three.

Power (20 mW per architecture) and occupied logic area (0.15 mm² per architecture) remain editable, equal placeholders, not validated predictions for these widths. The 50 mW and 0.20 mm² budgets are illustrative constraints. The scale reference is a published 512-bit FlooNoC implementation, not characterization of these 1024-bit, 2 GHz or dual-engine variants. Reassess values for the actual process, voltage, activity, buffering, timing and physical scope. See Model & evidence in the lab for the reference and limitations.

Calculations run in the browser. Inputs reset on reload. Power and area are independent inputs; changing throughput assumptions does not automatically rescale them. Timing and routing scores are judgments, not measurements or hidden throughput multipliers.

## Build and verify

Use Node.js 22.18 or newer and the project's package manager:

```sh
pnpm install
node tests/model.test.mjs
pnpm build:pages
```

The build writes only to `docs/lab-app/`, preserving the portal. Commit source changes and generated lab files together. The lab entry point is `github-pages/main.tsx`, the UI is `app/page.tsx`, and calculations are in `lib/ppa-model.ts`.

## Domain

The current public address is GitHub Pages. A custom domain requires registration, ownership verification and DNS configuration before activation.
