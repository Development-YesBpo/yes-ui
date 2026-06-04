# @yes/ui

Librería de componentes UI unificada para YES BPO. Reemplaza los sets de componentes construidos por separado en AppCenter, CRM v1, DASHBOARD, AUTO-NOM, PECS, YES Links y Lead Getter con una sola fuente de verdad — tokenizada, testeada y documentada.

**Estado actual:** v1.2.0 — **42 componentes base + 19 charts** (61 widgets exportados), **591 tests pasando**, Storybook completo.

🔗 **Storybook en vivo:** https://development-yesbpo.github.io/yes-ui/

---

## Catálogo de componentes

Cada componente se exporta por nombre desde `@yes/ui` y se documenta en Storybook con stories `Default`, `Variants`, `States` e `Interactive` + página MDX con tabla de variantes y controles.

### Wave 1 — Atoms (7)
`Icon` · `Avatar` · `Spinner` · `Button` · `Badge` · `ChannelBadge` · `Chip`

### Wave 2 — Controles de formulario (6)
`Input` · `Select` · `Textarea` · `Toggle` · `SearchInput` · `Checkbox`

### Wave 3 — Feedback (4)
`Alert` · `Toast` (+ `ToastContainer`, `useToast`) · `Skeleton` · `EmptyState`

### Wave 4 — Navegación (2)
`Tabs` · `Sidebar`

### Wave 5 — Overlay (3)
`Modal` · `Drawer` · `FilterPanel`

### Wave 6 — Datos (9)
`Card` · `KPICard` · `Widget` · `Table` · `TableAdvanced` · `Pagination` · `Toolbar` · `GroupFilter` · `BulkActionBar`

### Wave 7 — Meta acciones (7)
`PageHeader` · `SegmentedControl` · `ButtonToolbar` (+ `ToolbarButton`) · `SplitButton` · `ColumnManager` · `ActionMenu` · `AdminBanner`

### Wave 8 — Comunicación y layout (4)
`AgentStatusIndicator` · `ConversationItem` · `MessageBubble` · `PanelRich`

### Wave 9 — Charts (19)

| Categoría | Widgets |
|-----------|---------|
| Series temporales | `LineChart` · `AreaChart` |
| Barras | `BarChart` · `HorizontalBarChart` |
| Composición | `PieChart` · `DonutChart` · `FunnelChart` |
| Distribución | `ScatterChart` · `BubbleChart` · `HeatmapChart` |
| Comparación | `RadarChart` · `ComboChart` (doble eje) · `WaterfallChart` |
| Métricas / tablas | `StatStrip` · `PivotTable` · `PivotTableLite` |
| Mapas | `MapCard` (burbujas geolocalizadas) · `ChoroplethMap` (regiones) |

Charts usan `@ant-design/plots` (renderer SVG vía `@antv/g-svg`). Mapas usan `maplibre-gl` + `react-map-gl`.

---

## Instalación

```bash
pnpm add @yes/ui
```

```ts
// 1. Tokens (importar una sola vez en el entry de la app)
import '@yes/ui/tokens/primitives'
import '@yes/ui/tokens/default'
import '@yes/ui/tokens/themes/light'   // o themes/dark

// 2. Componentes
import { Button, KPICard, LineChart, MapCard } from '@yes/ui'
```

Si usas los charts de mapas (`MapCard`, `ChoroplethMap`), añade también:

```ts
import 'maplibre-gl/dist/maplibre-gl.css'
```

---

## Comandos

| Comando | Qué hace |
|---------|----------|
| `pnpm dev` | Storybook local en http://localhost:6006 |
| `pnpm test` | Vitest (591 tests) |
| `pnpm typecheck` | TypeScript en modo estricto (`exactOptionalPropertyTypes`) |
| `pnpm build` | Compila la librería → `dist/` (ESM + CJS + d.ts) |
| `pnpm build:storybook` | Storybook estático → `storybook-static/` |
| `pnpm check-dist` | Verifica que `dist/` tenga todos los artefactos esperados |

---

## Stack técnico

- React 18 + TypeScript 5 (`strict` + `exactOptionalPropertyTypes` + `noUncheckedIndexedAccess`)
- Vite 6 + tsup (build), Vitest + RTL + jsdom (tests)
- Storybook 8.6 (`react-vite`)
- `@ant-design/plots` para charts cartesianos / circulares / radar / waterfall / funnel
- `maplibre-gl` + `react-map-gl` para mapas (`MapCard`, `ChoroplethMap`)
- Lucide para iconos
- pnpm 9.15

---

## Tokens

Toda decisión visual deriva de `design-system-reference/colors_and_type.css`:

| Familia | Tokens CSS | Equivalente en código |
|---------|------------|----------------------|
| Color | `--yes-color-*` (`semantic.css`) | — |
| Tipografía | `--yes-font-*`, `--yes-text-*` | Manrope (body) · Barlow Semi Condensed (display) · JetBrains Mono (code) |
| Radius | `--yes-radius-*` | 6 / 8 / 12 / 9999 px |
| Charts (canvas/SVG) | `--yes-chart-*` | `chartTokens.ts` (typed source of truth) |

Para temas alternativos importa `@yes/ui/tokens/themes/dark` después de `default`.

---

## Estructura del repo

```
src/
├── components/   ← Wave 1–8 (42 componentes)
├── charts/       ← Wave 9 (19 widgets) + ChartFrame (wrapper interno)
├── tokens/       ← primitives.css + semantic.css + themes/
├── hooks/        ← useId · useFocusTrap · useControllable · useResizeObserver
├── utils/        ← cn · polymorphic
├── types/        ← BaseProps · FieldProps · Tone · Size · StatusVariant
└── index.ts      ← API pública (barrel)

.storybook/        ← Configuración de Storybook (main.ts + preview.ts)
.github/workflows/ ← CI: deploy de Storybook a GitHub Pages
design-system-reference/  ← Referencias visuales (preview HTML por componente)
docs/              ← HANDBOOK + planes de wave + specs
```

---

## Cómo contribuir

Cada componente sigue el **contrato de 6 archivos**: `.tsx`, `.module.css`, `.test.tsx`, `.stories.tsx`, `.mdx`, `index.ts`. Sin excepciones.

Flujo de trabajo: **RED → GREEN → VISUAL**

1. **RED** — escribir tests primero (`.test.tsx`), correr `pnpm test`, confirmar que fallan por la razón esperada.
2. **GREEN** — implementar lo mínimo para hacer pasar los tests. CSS modules solo estructura (sin colores, sin tamaños hardcodeados — todo vía `var(--yes-*)`).
3. **VISUAL** — comparar Storybook contra `design-system-reference/preview/components-{name}.html` lado a lado. La salida debe coincidir píxel-a-píxel.

### Branch protection en `main`

- Push directo bloqueado — todo cambio entra vía Pull Request.
- 1 aprobación requerida; reviews stale se descartan al haber nuevos commits.
- Status checks del workflow de Storybook obligatorios.
- Sin force push, sin eliminación de la branch.
- Conversaciones del PR deben resolverse antes del merge.
- `enforce_admins: true` — la regla también aplica a admins.

### Otras reglas

- Commits en español, mensaje conciso.
- Sin co-author lines.
- Sin `dangerouslySetInnerHTML`, sin `window`/`document` a nivel de módulo, sin `addEventListener` directo dentro de componentes.
- Botones siempre `type="button"` salvo que sean explícitamente `type="submit"`.
- Texto de UI en español colombiano.

Ver `CLAUDE.md` para el reglamento completo y `docs/HANDBOOK.md` para operaciones (cómo correr, capturar evidencia, reportar y verificar).

---

## Seguridad

- Secret scanning + push protection activados en GitHub (bloquea push si detecta credenciales).
- Sin tokens, claves ni `.env` rastreados en historia (verificado contra todo blob del repo).
- `.gitignore` excluye `node_modules/`, `dist/`, `storybook-static/`, `.env*`, `*.pem`, `*.key`, `*.p12`, `*.pfx` y junk de OS.

---

## Licencia

UNLICENSED — uso interno YES BPO.
