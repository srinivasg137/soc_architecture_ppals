# Portal publishing

The canonical static website is `public-site/`. It contains the current home page, profile, SoC Parts 1 and 2, PCIe Parts 1–4, dropdown navigation, figures, and bundled interactive lab.

GitHub Pages publishes `main` → `/docs`. After editing the canonical portal, run:

```sh
python3 scripts/export-portal-pages.py
```

Commit `public-site/`, the generated matching files in `docs/`, and any changed source templates together. The exporter adds `/soc_architecture_ppals/` to root-relative HTML asset and navigation URLs. Other repository files and historical assets are preserved.

The profile image is `public-site/assets/srinivas-profile.jpeg`; home and About display it above their existing introductions.

`build-portal.py` is the portal generator. Its templates and `content/pipeline-depth.html` must remain synchronized with page edits. The checked-in static output is the deployable snapshot; no Node build is required to publish it.

The lab bundle is included as published on the hosted website. Its UI explains the model scope and presets. Rebuilding the lab from separate React sources is a separate operation and should be reviewed before replacing that bundle.
