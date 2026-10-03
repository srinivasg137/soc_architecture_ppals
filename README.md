# SoC Architecture Lab - Width vs Frequency

## Open the lab

[Open SoC Architecture Lab - Width vs Frequency](https://soc-ppa-tradeoff-lab.srinivasg137.chatgpt.site)

The live lab is public and opens without an owner sign-in.

[Source on GitHub](https://github.com/srinivasg137/soc_architecture_ppals)

For a local copy, follow **Run locally** below.

## What this lab compares

An interactive architecture-stage lab for comparing:

- One 512-bit datapath at 1 GHz
- One 256-bit datapath at 2 GHz
- Two parallel 256-bit engines at 1 GHz

The explorer models payload overhead, bubble cycles, utilization, parallel scheduling efficiency and shared bandwidth limits. It compares independently entered power and area, normalized PPA, energy per payload bit and physical sensitivity bounds. Timing risk, routing pressure and scalability remain explicit engineering judgments.

## Small-block power assumptions

Power controls, cards and sensitivity ranges use **mW**. Internal power values remain in W, so energy per payload bit and throughput/W preserve the correct units.

| Option | Starter power estimate |
| --- | ---: |
| 512-bit at 1 GHz | 20 mW |
| 256-bit at 2 GHz | 20 mW |
| Two 256-bit engines at 1 GHz, aggregate | 20 mW |

The example block power budget is **50 mW**. These are editable architecture-stage assumptions, not measurements of the three options. Equal starting power leaves A and B tied for nominal energy at the default workload; the decision summary reports ties explicitly.

**Published scale reference:** [Fischer et al., FlooNoC, section VI-D](https://arxiv.org/html/2409.17606v2). This 12 nm HPC design has a 512-bit wide transport operating at 1.26 GHz. Post-layout power simulation at TT, 0.8 V, 25°C during a 4 KiB neighbor DMA transfer reports 127.7 mW for a tile. About 15% is attributed to the DMA, wide AXI4 crossbar and NoC: `127.7 mW × 0.15 ≈ 19.2 mW`. The lab rounds that component contribution to 20 mW as a scale-only starter hypothesis. The 50 mW constraint is an example allowance, not a published budget.

Scope this example to small on-chip data-moving logic: all engines, control, FIFOs, local clocks and shared logic. Exclude CPU cores, bulk SRAM, DRAM and off-chip PHYs. Match clock-tree and leakage allocation before using the reference; the 19.2 mW component contribution does not allocate all tile-wide power to the transport block. The reference is a post-layout HPC result, not commercial server silicon data and not a calibration of the lab's utilization, area or implementation variants.

Equal power is only a starting hypothesis. Voltage, activity, wire length, buffering, cell sizing, added pipeline stages and duplicated control can change it. Power remains an independent input when workload utilization changes. The default ±25% sensitivity range is an editable scenario, not a measured accuracy claim; widen it when the design scope or implementation is uncertain. Area now uses the logic-area scale reference below; physical scores remain illustrative.

## Small-block logic area assumptions

| Option | Starter occupied logic-area estimate | Default ±25% scenario |
| --- | ---: | ---: |
| 512-bit at 1 GHz | 0.150 mm² | 0.1125–0.1875 mm² |
| 256-bit at 2 GHz | 0.150 mm² | 0.1125–0.1875 mm² |
| Two 256-bit engines at 1 GHz, aggregate | 0.150 mm² | 0.1125–0.1875 mm² |

The example **logic-area budget is 0.200 mm²**. Area inputs use comparable occupied logic/macro area; a standalone floorplan also needs whitespace and routing allowance. The lab does not predict that extra footprint.

**Published scale reference:** [FlooNoC, Figure 9(a), section VI-C and Table III](https://arxiv.org/html/2409.17606v2), in 12 nm at 1.26 GHz. The NoC occupies 1.37 mm² across 32 tiles, a mean of 0.0428 mm² per tile. The tile breakdown reports 3.5% NoC, 6.9% NoC plus wide crossbar and 5.3% DMA. An approximate average transport-logic contribution follows:

```text
(1.37 mm² / 32) × ((6.9 + 5.3) / 3.5) ≈ 0.149 mm²
```

The lab rounds this inference to 0.15 mm². The 0.20 mm² budget is an editable engineering allowance, not a published limit. The sensitivity interval is a scenario, not a statistical confidence interval or measured model accuracy.

The reference does not characterize the 256-bit, 2 GHz or dual-engine variants. Equal starter areas avoid assuming an area winner before implementation evidence. Enter different values when pipeline depth, FIFO capacity, duplicated control, drive strength and layout provide a basis. Exclude CPU cores, bulk memory and off-chip PHYs from this transport example. Both engines plus shared logic must be counted for option C.

## Public hosting

The lab and this repository are public. Only the example assumptions ship with the source; edits remain in the current browser session. Reloading restores the defaults.

The live link above uses Sites. A standalone React/Vite build is included for GitHub Pages, so GitHub hosting does not require the Sites or Cloudflare runtime. The `docs/` directory contains the built static lab with relative asset URLs and a `.nojekyll` file.

To enable GitHub Pages for this repository, open **Settings → Pages**, choose **Deploy from a branch**, select **main** and **/docs**, then **Save**. Once GitHub finishes its Pages deployment, its project URL will be `https://srinivasg137.github.io/soc_architecture_ppals/`.

After editing the source, regenerate `docs/` with `pnpm build:pages` and commit the resulting files. The GitHub source copy omits deployed Site identity, credentials and runtime secrets. Its empty `.openai/hosting.json` supports the original local build configuration; it does not register or deploy a Site.

## Run locally

Requirements: Node.js 22.18 or newer and pnpm. Use the included `pnpm-lock.yaml`.

For the standalone version used by GitHub Pages:

```sh
pnpm install --frozen-lockfile
pnpm dev:pages
pnpm build:pages
pnpm preview:pages
```

For the original Sites runtime:

```sh
pnpm install --frozen-lockfile
pnpm dev -- --hostname 127.0.0.1
```

Open the loopback address printed by the development server. The standard development port is 5173. 

```sh
pnpm build
pnpm start
```

The local production preview also binds to loopback. Building does not deploy anything.

## Validate

With a Node version supporting built-in TypeScript stripping (22.18+ or 24+):

```sh
node --experimental-strip-types tests/model.test.mjs
pnpm exec tsc --noEmit
```

The model suite covers raw and effective throughput, units, parallel efficiency, shared caps, normalization, zero-throughput handling, independent power inputs, mW/W control conversions, energy ties, sub-mW values, logic-area scale, fractional area/budget edits, physical bounds, trial provenance, Pareto comparisons, input validation, shared/per-architecture edits, tab selection and reset. It includes a cross-product scenario sweep. Full browser visual QA has not been performed.

## Model and session scope

All rates use decimal GB/s. Requested width and frequency are design targets, not evidence of achieved timing. Default powers and occupied logic areas are scale-referenced estimates; physical scores are illustrative. Source-backed user-entered trial frequency can replace the target for modeling; values are not independently verified. No conclusion certifies timing closure or silicon feasibility.

Assumptions are held in the current browser session. Reloading resets edits. Calculation inputs are not sent to external services.

Primary source files: `app/page.tsx`, `app/globals.css`, `lib/ppa-model.ts`, `tests/model.test.mjs`. The GitHub Pages entry is `github-pages/main.tsx` with `vite.pages.config.ts`.
