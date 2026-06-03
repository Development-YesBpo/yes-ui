import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: true,
  external: [
    'react',
    'react-dom',
    '@ant-design/plots',
    '@antv/g-svg',
    'maplibre-gl',
    'maplibre-gl/dist/maplibre-gl.css',
    'react-map-gl',
    'react-map-gl/maplibre',
  ],
  // Token CSS files (global custom properties) are copied separately
  // by scripts/copy-tokens.mjs — they must not be bundled into JS.
  //
  // Component visual styles use inline React.CSSProperties + a per-component
  // <style> block injected at runtime (see docs/HANDBOOK.md § 4 "How to add
  // a component" → CSS Modules note). The `.module.css` files in each
  // component directory document structural intent but are NOT imported,
  // so there is nothing for tsup to bundle here.
})
