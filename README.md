# creation-space

Creation Space: a standalone Three.js exploration page for "What is Creation".

## Local run

```bash
cd <your-local-path>/creation-space
./server.sh
# then open http://localhost:3001/
```

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
