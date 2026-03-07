# creation-space

Creation Space: a standalone Three.js exploration page for "What is Creation".

## Local run

```bash
cd <your-local-path>/creation-space
./server.sh
# then open http://localhost:3001/
```

Optional port:

```bash
./server.sh 4173
```

## URL query (Intent timing seed)

You can seed the initial Intent view from URL params:

- `utime` (or `uTime`): initial shader timeline seconds
- `camdeg` (or `camDeg`): camera angle offset in degrees (`-90` etc)
- `camrad` (or `camRad`): camera angle offset in radians
- `camturn` (or `camTurn`): camera turn offset (`1.0 = 360deg`)
- `camphase` (or `camPhase`): legacy alias, treated as radians

Example:

```text
http://localhost:3001/?graphic=i&utime=10000&camdeg=-90
```

Small nudge example:

```text
http://localhost:3001/?graphic=i&utime=10000&camrad=-0.1
```

## Codex session bootstrap

For Codex conversations targeting this repository, run this first:

```bash
node scripts/articles-en-semi-auto.mjs --mode check
```

Purpose:
- detect new items from `https://uminomae.github.io/pjdhiro/api/creation-articles.json`
- show pending EN cache fields (`title_en`, `excerpt_en`) before implementation work

## Embed API (for external pages)

`src/graphics-entry.js` exports `createEmbeddedGraphic()` for mounting the graphics into a target element.

```html
<div id="embed-canvas" style="width: 100%; height: 420px;"></div>
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
  }
}
</script>
<script type="module">
  import { createEmbeddedGraphic } from "https://YOUR_HOST/src/graphics-entry.js";

  const app = await createEmbeddedGraphic({
    container: "#embed-canvas",
    graphicMode: "hoji", // hoji | sinobi | i
    autoStart: true,
    autoResize: true,
  });

  // app.stop();
  // app.start();
  // app.destroy();
</script>
```

Notes:
- Cross-site import requires CORS (`Access-Control-Allow-Origin`) on the script host.
- This project uses ES Modules and bare specifier `three`, so host page must provide an import map (or bundler equivalent).

## Articles EN semi-auto

`assets/articles/articles.json` (EN cache) can be synced against the live API with:

```bash
node scripts/articles-en-semi-auto.mjs --mode check
node scripts/articles-en-semi-auto.mjs --mode sync
```

Modes:
- `check`: compare API vs local cache and print pending EN queue.
- `sync`: update local cache with new/updated API items while preserving `title_en` / `excerpt_en`.
- `routine`: same as `sync` and optionally posts a summary to GitHub issue (`--notify-issue`).

## Reports asset hosting

All REPORTS assets (survey, guides, domains) are hosted on the pjdhiro repository.
`src/reports.js` fetches data and markdown from `raw.githubusercontent.com` and links PDFs via GitHub Pages.

- **Data**: `https://raw.githubusercontent.com/uminomae/pjdhiro/main/assets/creation/manifests/domains.json`
- **MD**: `https://raw.githubusercontent.com/uminomae/pjdhiro/main/assets/creation/{survey,guides,domains}/{lang}/md/*.md`
- **PDF**: `https://uminomae.github.io/pjdhiro/assets/creation/{survey,guides,domains}/{lang}/pdf/*.pdf`

PDF availability is checked at runtime via HEAD requests (`resolveFirstAvailablePdfUrl` in `src/reports.js`).

## Reports taxonomy scenarios

For exploratory category checks, you can override the report taxonomy from the URL without editing `src/reports.js`.

Examples:

```text
http://localhost:3004/?reportsScenario=split-d22
http://localhost:3004/?lang=en&reportsScenario=split-d22
```

Notes:
- Scenario files live under `assets/reports/scenarios/*.json`.
- The current visual-check fixture is `assets/reports/scenarios/split-d22.json`.
- `reportsTaxonomyTest=split-d22` remains as a backward-compatible alias.
- When a scenario is active, the reports section shows the active scenario label under the domain reports heading.

## Domain EN markdown audit / sync

If `domains/en/pdf/*.pdf` exists in `pjdhiro` but `domains/en/md/*.md` is missing, use:

```bash
node scripts/domains-en-md-sync.mjs --mode check
node scripts/domains-en-md-sync.mjs --mode sync
```

Defaults:
- build source: `../kesson-driven-thinking/build/creation/domains/en/md`
- publish target: `../pjdhiro/assets/creation/domains/en/md`
- manifest source: `../pjdhiro/assets/creation/manifests/domains.json`

What it does:
- reads expected EN domain markdown paths from the `pjdhiro` manifest
- checks build copy vs publish copy for `domains/en/md/*.md`
- in `sync` mode, copies missing/changed files from `kesson-driven-thinking/build/creation/` into `pjdhiro/assets/creation/`
