# Wave 9c — Charts: ScatterChart · BubbleChart · HeatmapChart · StatStrip

> **REQUIRED SUB-SKILLS (inject into every implementer):**
> 1. `superpowers:test-driven-development` — RED before GREEN, no exceptions. Paste vitest output at every transition.
> 2. Sequential thinking — reason step-by-step before any code.
>
> **NO git commit/push. No renderer prop. exactOptionalPropertyTypes conditional spreads. Per-prop casts only.**

**Goal:** 4 components — `ScatterChart`, `BubbleChart`, `HeatmapChart` (all via AntV), `StatStrip` (pure DOM, no AntV).

**AntV v2 imports:**
```ts
import { Scatter } from '@ant-design/plots'   // ScatterChart + BubbleChart (sizeField variant)
import { Heatmap } from '@ant-design/plots'   // HeatmapChart
```
`StatStrip` uses only React + yes-ui tokens (no AntV).

**Gallery references:**
- ScatterChart → `Widget Gallery.html → ScatterSVG` (TMO vs CSAT scatter)
- BubbleChart  → `Widget Gallery.html → BubbleSVG` (Volumen × CSAT × costo)
- HeatmapChart → `Widget Gallery.html → HeatmapSVG` (hora × día × intensidad)
- StatStrip    → `Widget Gallery.html → StatStrip` (fila compacta de métricas operativas)

**Confirmed AntV v2 types:**
- `Scatter`: `CommonConfig<ScatterOptions>` where `ScatterOptions = Options`. Props: `xField`, `yField`, `colorField`, `sizeField` (maps to `encode.size`), `autoFit`, `theme`, `legend`, `label`.
- `Heatmap`: `CommonConfig<HeatmapOptions>`. Props: `xField`, `yField`, `colorField` (intensity), `autoFit`, `theme`. Color scale via `scale.color.range`.
- `sizeField` is a standard `Options` field (confirmed in `constants/index.js`: `sizeField: 'encode.size'`).

---

## Canonical patterns (same as Waves 9a + 9b — do not deviate)

See `src/charts/LineChart/LineChart.tsx` (implementation), `src/charts/LineChart/LineChart.test.tsx` (tests), `src/charts/LineChart/LineChart.stories.tsx` (stories), `src/charts/LineChart/LineChart.mdx` (docs).

Key rules:
- `import React from 'react'` at top of every `.tsx`
- Conditional spreads for optional ChartFrame props
- `vi.mock('@ant-design/plots', ...)` before chart imports in tests; JSON.stringify with function replacer
- Stories: `title: 'Wave 9 — Charts/X'`, Default + Loading + Empty, `<div style={{ width: N }}>`, Spanish data
- MDX: `import { Meta, Canvas, Controls } from '@storybook/blocks'`, `<Meta of={XStories} />`, one `<Canvas>`, `<Controls />`

---

## Task 21: `ScatterChart`

**Files:** 6 files in `src/charts/ScatterChart/` + modify `src/index.ts`

**Reasoning to do before writing:**
1. AntV `Scatter` — same component as BubbleChart but WITHOUT `sizeField`. `xField` and `yField` are both numeric. `colorField` colors points by category (optional). No `sizeField`.
2. srTable headers: `[xField, yField]` or `[xField, yField, colorField]` if colorField present.
3. `Scatter` mock testid: `plots-scatter`.
4. No `showGrid` override needed — use `axis` grid config.

- [x] **Step 1: Write the failing test**

```tsx
// src/charts/ScatterChart/ScatterChart.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@ant-design/plots', () => ({
  Scatter: (props: Record<string, unknown>) => (
    <div data-testid="plots-scatter" data-props={JSON.stringify(props, (_k, v) =>
      typeof v === 'function' ? '__fn__' : v)} />
  ),
}))

import { ScatterChart } from './ScatterChart'

const DATA = [
  { tmo: 3.2, csat: 94, agente: 'Carlos'    },
  { tmo: 4.5, csat: 88, agente: 'Ana'       },
  { tmo: 6.3, csat: 75, agente: 'Valentina' },
  { tmo: 2.9, csat: 96, agente: 'Juan'      },
]

describe('ScatterChart', () => {
  it('renders a role=img frame with ariaLabel', () => {
    render(
      <ScatterChart data={DATA} xField="tmo" yField="csat"
        ariaLabel="TMO vs CSAT por agente" />,
    )
    expect(screen.getByRole('img', { name: 'TMO vs CSAT por agente' })).toBeInTheDocument()
  })

  it('forwards xField, yField, autoFit and theme to Scatter', () => {
    render(<ScatterChart data={DATA} xField="tmo" yField="csat" ariaLabel="x" />)
    const props = JSON.parse(screen.getByTestId('plots-scatter').dataset.props!)
    expect(props.xField).toBe('tmo')
    expect(props.yField).toBe('csat')
    expect(props.autoFit).toBe(true)
    expect(props.theme.type).toBe('classic')
  })

  it('forwards colorField when provided', () => {
    render(<ScatterChart data={DATA} xField="tmo" yField="csat" colorField="agente" ariaLabel="x" />)
    const props = JSON.parse(screen.getByTestId('plots-scatter').dataset.props!)
    expect(props.colorField).toBe('agente')
  })

  it('shows Skeleton when loading', () => {
    render(
      <ScatterChart data={DATA} xField="tmo" yField="csat"
        ariaLabel="x" loading data-testid="sc" />,
    )
    expect(screen.queryByTestId('plots-scatter')).not.toBeInTheDocument()
    expect(screen.getByTestId('sc')).toBeInTheDocument()
  })

  it('shows EmptyState when data is empty', () => {
    render(<ScatterChart data={[]} xField="tmo" yField="csat" ariaLabel="x" />)
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
  })

  it('builds srTable including colorField when provided', () => {
    render(
      <ScatterChart data={DATA} xField="tmo" yField="csat" colorField="agente" ariaLabel="x" />,
    )
    expect(screen.getByRole('columnheader', { name: 'tmo' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'agente' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '94' })).toBeInTheDocument()
  })
})
```

- [x] **Step 2: Run → paste FAIL output**

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm test src/charts/ScatterChart/ScatterChart.test.tsx
```

- [x] **Step 3: Write the implementation**

```tsx
// src/charts/ScatterChart/ScatterChart.tsx
import React from 'react'
import { Scatter } from '@ant-design/plots'
import { ChartFrame } from '../ChartFrame/ChartFrame'
import { antvTheme } from '../antvTheme'
import type { BaseChartProps } from '../chartTypes'

export interface ScatterChartProps extends Omit<BaseChartProps, 'showGrid' | 'showValues' | 'valueFormatter'> {
  /** Numeric field for the X axis (e.g. TMO in minutes). */
  xField: string
  /** Numeric field for the Y axis (e.g. CSAT score). */
  yField: string
  /** Category field to color-code points by group. */
  colorField?: string
  /** X axis label shown below the axis. */
  xLabel?: string
  /** Y axis label shown beside the axis. */
  yLabel?: string
}

export function ScatterChart({
  data,
  xField,
  yField,
  colorField,
  xLabel,
  yLabel,
  ariaLabel,
  height = 200,
  colors,
  showLegend = false,
  loading = false,
  className,
  style,
  'data-testid': testId,
}: ScatterChartProps) {
  const isEmpty = !loading && data.length === 0

  const srTable = {
    headers: colorField ? [xField, yField, colorField] : [xField, yField],
    rows: data.map((d) =>
      colorField
        ? [d[xField] as string | number, d[yField] as string | number, d[colorField] as string | number]
        : [d[xField] as string | number, d[yField] as string | number],
    ),
  }

  return (
    <ChartFrame
      ariaLabel={ariaLabel}
      height={height}
      loading={loading}
      isEmpty={isEmpty}
      srTable={srTable}
      {...(className !== undefined ? { className } : {})}
      {...(style !== undefined ? { style } : {})}
      {...(testId !== undefined ? { 'data-testid': testId } : {})}
    >
      <Scatter
        data={data as Array<Record<string, unknown>>}
        xField={xField}
        yField={yField}
        colorField={colorField}
        autoFit
        height={height}
        theme={colors ? { ...antvTheme, category10: colors } : antvTheme}
        legend={showLegend ? { color: { position: 'top' } } : false}
        point={{ style: { fillOpacity: 0.65, r: 5 } }}
        axis={{
          x: { title: xLabel ?? xField },
          y: { title: yLabel ?? yField, gridStroke: antvTheme.axis.gridStroke },
        }}
      />
    </ChartFrame>
  )
}
```

```css
/* src/charts/ScatterChart/ScatterChart.module.css */
/* Structural intent only — NOT imported. Layout delegated to ChartFrame + AntV. */
```

```ts
// src/charts/ScatterChart/index.ts
export { ScatterChart } from './ScatterChart'
export type { ScatterChartProps } from './ScatterChart'
```

- [x] **Step 4: Run → paste PASS (6 tests)**

- [x] **Step 5: Write stories**

```tsx
// src/charts/ScatterChart/ScatterChart.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ScatterChart } from './ScatterChart'

const DATA = [
  { tmo: 3.2, csat: 94 }, { tmo: 2.8, csat: 96 }, { tmo: 4.5, csat: 88 },
  { tmo: 5.1, csat: 82 }, { tmo: 6.3, csat: 75 }, { tmo: 3.9, csat: 91 },
  { tmo: 4.2, csat: 89 }, { tmo: 7.1, csat: 71 }, { tmo: 3.6, csat: 93 },
  { tmo: 5.8, csat: 79 }, { tmo: 2.9, csat: 95 }, { tmo: 4.8, csat: 86 },
]

const meta: Meta<typeof ScatterChart> = {
  title: 'Wave 9 — Charts/ScatterChart',
  component: ScatterChart,
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof ScatterChart>

export const Default: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <ScatterChart data={DATA} xField="tmo" yField="csat"
        xLabel="TMO (min)" yLabel="CSAT (%)"
        ariaLabel="TMO vs CSAT por agente" />
    </div>
  ),
}
export const Loading: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <ScatterChart data={DATA} xField="tmo" yField="csat" loading ariaLabel="Cargando" />
    </div>
  ),
}
export const Empty: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <ScatterChart data={[]} xField="tmo" yField="csat" ariaLabel="Sin datos" />
    </div>
  ),
}
```

- [x] **Step 6: Write MDX docs**

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as ScatterChartStories from './ScatterChart.stories'

<Meta of={ScatterChartStories} />

# ScatterChart

Dispersión de puntos para identificar correlaciones y outliers. Usa `@ant-design/plots` (`Scatter`).

**Referencia:** `Dashboard-Comps/Widget Gallery.html → ScatterSVG`

## Cuándo usar

- Correlación entre TMO y CSAT por agente — identifica outliers y cuadrantes de rendimiento.
- Cualquier par de métricas numéricas donde el patrón de distribución importa.
- Para una tercera dimensión (tamaño de burbuja) usa `BubbleChart`.

<Canvas of={ScatterChartStories.Default} />

## Accesibilidad

`role="img"` con `aria-label` obligatorio (vía `ChartFrame`). Tabla oculta con los datos disponible para lectores de pantalla.

## Props

<Controls />
```

- [x] **Step 7: Wire export in `src/index.ts`** (append under `// ─── Charts (Wave 9) ───`)
```ts
export { ScatterChart } from './charts/ScatterChart'
export type { ScatterChartProps } from './charts/ScatterChart'
```

- [x] **Step 8: Integration + Playwright**
```bash
pnpm typecheck && pnpm build && \
node -e "const x=require('./dist/index.cjs'); if(!x.ScatterChart){process.exit(1)}; console.log('export OK')"
```
Playwright: story id `wave-9-charts-scatterchart--default`.

- [x] **Step 9: Stage**
```bash
git add src/charts/ScatterChart/ src/index.ts
```

---

## Task 22: `BubbleChart`

**Files:** 6 files in `src/charts/BubbleChart/` + modify `src/index.ts`

**Key difference from ScatterChart:** adds `sizeField` (maps bubble radius to a third numeric dimension). Uses same `Scatter` AntV component.

**Reasoning to do first:**
1. `sizeField` maps to `encode.size` in AntV v2 (confirmed in `constants/index.js`). It is a standard `Options` field — no cast needed.
2. `sizeRange?: [number, number]` controls min/max bubble radius in pixels.
3. srTable headers: `[xField, yField, sizeField]` or `[xField, yField, sizeField, colorField]`.
4. Mock testid: `plots-bubble` (distinct from scatter, so mock returns `plots-bubble`).
   BUT — the AntV component is still `Scatter`. The mock must map `Scatter` to `plots-bubble`.

- [x] **Step 1: Write the failing test**

```tsx
// src/charts/BubbleChart/BubbleChart.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@ant-design/plots', () => ({
  Scatter: (props: Record<string, unknown>) => (
    <div data-testid="plots-bubble" data-props={JSON.stringify(props, (_k, v) =>
      typeof v === 'function' ? '__fn__' : v)} />
  ),
}))

import { BubbleChart } from './BubbleChart'

const DATA = [
  { campaña: 'Cobranza',  volumen: 2340, csat: 78, costo: 38 },
  { campaña: 'Soporte',   volumen: 1876, csat: 88, costo: 30 },
  { campaña: 'Ventas',    volumen: 1543, csat: 92, costo: 25 },
  { campaña: 'Retención', volumen: 987,  csat: 85, costo: 20 },
]

describe('BubbleChart', () => {
  it('renders a role=img frame with ariaLabel', () => {
    render(
      <BubbleChart data={DATA} xField="volumen" yField="csat" sizeField="costo"
        colorField="campaña" ariaLabel="Campañas: volumen × CSAT × costo" />,
    )
    expect(screen.getByRole('img', { name: 'Campañas: volumen × CSAT × costo' })).toBeInTheDocument()
  })

  it('forwards xField, yField, sizeField, colorField, autoFit and theme', () => {
    render(
      <BubbleChart data={DATA} xField="volumen" yField="csat" sizeField="costo"
        colorField="campaña" ariaLabel="x" />,
    )
    const props = JSON.parse(screen.getByTestId('plots-bubble').dataset.props!)
    expect(props.xField).toBe('volumen')
    expect(props.yField).toBe('csat')
    expect(props.sizeField).toBe('costo')
    expect(props.colorField).toBe('campaña')
    expect(props.autoFit).toBe(true)
    expect(props.theme.type).toBe('classic')
  })

  it('shows Skeleton when loading', () => {
    render(
      <BubbleChart data={DATA} xField="volumen" yField="csat" sizeField="costo"
        ariaLabel="x" loading data-testid="bc" />,
    )
    expect(screen.queryByTestId('plots-bubble')).not.toBeInTheDocument()
    expect(screen.getByTestId('bc')).toBeInTheDocument()
  })

  it('shows EmptyState when data is empty', () => {
    render(
      <BubbleChart data={[]} xField="volumen" yField="csat" sizeField="costo" ariaLabel="x" />,
    )
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
  })

  it('builds srTable with xField, yField, sizeField and colorField', () => {
    render(
      <BubbleChart data={DATA} xField="volumen" yField="csat" sizeField="costo"
        colorField="campaña" ariaLabel="x" />,
    )
    expect(screen.getByRole('columnheader', { name: 'volumen' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'costo' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '2340' })).toBeInTheDocument()
  })
})
```

- [x] **Step 2: Run → paste FAIL**

- [x] **Step 3: Write the implementation**

```tsx
// src/charts/BubbleChart/BubbleChart.tsx
import React from 'react'
import { Scatter } from '@ant-design/plots'
import { ChartFrame } from '../ChartFrame/ChartFrame'
import { antvTheme } from '../antvTheme'
import type { BaseChartProps } from '../chartTypes'

export interface BubbleChartProps extends Omit<BaseChartProps, 'showGrid' | 'showValues' | 'valueFormatter'> {
  /** Numeric field for the X axis (e.g. volumen de llamadas). */
  xField: string
  /** Numeric field for the Y axis (e.g. CSAT %). */
  yField: string
  /** Numeric field that maps to bubble radius (third dimension). */
  sizeField: string
  /** Category field to color bubbles by group. */
  colorField?: string
  /** [minPx, maxPx] range for bubble radius. Default [4, 40]. */
  sizeRange?: [number, number]
}

export function BubbleChart({
  data,
  xField,
  yField,
  sizeField,
  colorField,
  sizeRange = [4, 40],
  ariaLabel,
  height = 220,
  colors,
  showLegend = true,
  loading = false,
  className,
  style,
  'data-testid': testId,
}: BubbleChartProps) {
  const isEmpty = !loading && data.length === 0

  const headers = colorField
    ? [xField, yField, sizeField, colorField]
    : [xField, yField, sizeField]

  const srTable = {
    headers,
    rows: data.map((d) =>
      colorField
        ? [d[xField] as string | number, d[yField] as string | number,
           d[sizeField] as string | number, d[colorField] as string | number]
        : [d[xField] as string | number, d[yField] as string | number,
           d[sizeField] as string | number],
    ),
  }

  return (
    <ChartFrame
      ariaLabel={ariaLabel}
      height={height}
      loading={loading}
      isEmpty={isEmpty}
      srTable={srTable}
      {...(className !== undefined ? { className } : {})}
      {...(style !== undefined ? { style } : {})}
      {...(testId !== undefined ? { 'data-testid': testId } : {})}
    >
      <Scatter
        data={data as Array<Record<string, unknown>>}
        xField={xField}
        yField={yField}
        sizeField={sizeField}
        colorField={colorField}
        size={sizeRange}
        autoFit
        height={height}
        theme={colors ? { ...antvTheme, category10: colors } : antvTheme}
        legend={showLegend ? { color: { position: 'top' } } : false}
        point={{ style: { fillOpacity: 0.5, stroke: 'white', lineWidth: 1 } }}
        axis={{
          x: { title: xField },
          y: { title: yField, gridStroke: antvTheme.axis.gridStroke },
        }}
        tooltip={{ title: colorField ?? sizeField }}
      />
    </ChartFrame>
  )
}
```

```css
/* src/charts/BubbleChart/BubbleChart.module.css */
/* Structural intent only — NOT imported. Layout delegated to ChartFrame + AntV. */
```

```ts
// src/charts/BubbleChart/index.ts
export { BubbleChart } from './BubbleChart'
export type { BubbleChartProps } from './BubbleChart'
```

- [x] **Step 4: Run → paste PASS (5 tests)**

- [x] **Step 5: Write stories**

```tsx
// src/charts/BubbleChart/BubbleChart.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { BubbleChart } from './BubbleChart'

const DATA = [
  { campaña: 'Cobranza',  volumen: 2340, csat: 78, costo: 38 },
  { campaña: 'Soporte',   volumen: 1876, csat: 88, costo: 30 },
  { campaña: 'Ventas',    volumen: 1543, csat: 92, costo: 25 },
  { campaña: 'Retención', volumen: 987,  csat: 85, costo: 20 },
  { campaña: 'Info',      volumen: 654,  csat: 71, costo: 14 },
]

const meta: Meta<typeof BubbleChart> = {
  title: 'Wave 9 — Charts/BubbleChart',
  component: BubbleChart,
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof BubbleChart>

export const Default: Story = {
  render: () => (
    <div style={{ width: 500 }}>
      <BubbleChart
        data={DATA} xField="volumen" yField="csat" sizeField="costo"
        colorField="campaña"
        ariaLabel="Campañas: volumen × CSAT × costo relativo" />
    </div>
  ),
}
export const Loading: Story = {
  render: () => (
    <div style={{ width: 500 }}>
      <BubbleChart data={DATA} xField="volumen" yField="csat" sizeField="costo"
        loading ariaLabel="Cargando" />
    </div>
  ),
}
export const Empty: Story = {
  render: () => (
    <div style={{ width: 500 }}>
      <BubbleChart data={[]} xField="volumen" yField="csat" sizeField="costo"
        ariaLabel="Sin datos" />
    </div>
  ),
}
```

- [x] **Step 6: Write MDX docs**

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as BubbleChartStories from './BubbleChart.stories'

<Meta of={BubbleChartStories} />

# BubbleChart

Dispersión con una tercera dimensión codificada en el radio de la burbuja. Usa `@ant-design/plots` (`Scatter` con `sizeField`).

**Referencia:** `Dashboard-Comps/Widget Gallery.html → BubbleSVG`

## Cuándo usar

- Campañas mapeadas en tres ejes: volumen × CSAT × costo relativo.
- Cualquier caso donde tres métricas numéricas deben compararse simultáneamente.
- Para solo dos dimensiones usa `ScatterChart`.

<Canvas of={BubbleChartStories.Default} />

## Accesibilidad

`role="img"` con `aria-label` obligatorio (vía `ChartFrame`). Tabla oculta con `xField`, `yField`, `sizeField` y `colorField` disponible para lectores de pantalla.

## Props

<Controls />
```

- [x] **Step 7: Wire export**
```ts
export { BubbleChart } from './charts/BubbleChart'
export type { BubbleChartProps } from './charts/BubbleChart'
```

- [x] **Step 8: Integration + Playwright** (story id `wave-9-charts-bubblechart--default`)

- [x] **Step 9: Stage**
```bash
git add src/charts/BubbleChart/ src/index.ts
```

---

## Task 23: `HeatmapChart`

**Files:** 6 files in `src/charts/HeatmapChart/` + modify `src/index.ts`

**Reasoning to do first:**
1. AntV `Heatmap` — `xField` (e.g. hour), `yField` (e.g. day), `colorField` (numeric intensity). Data is long-format: one row per `{x, y, value}` combination.
2. Color scale: AntV v2 uses `scale.color.range` array for the gradient. Our brand ramp = `chartTokens.heatmapRamp`.
3. srTable headers: `[xField, yField, colorField]`, rows: all data points.
4. Mock testid: `plots-heatmap`.

- [x] **Step 1: Write the failing test**

```tsx
// src/charts/HeatmapChart/HeatmapChart.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@ant-design/plots', () => ({
  Heatmap: (props: Record<string, unknown>) => (
    <div data-testid="plots-heatmap" data-props={JSON.stringify(props, (_k, v) =>
      typeof v === 'function' ? '__fn__' : v)} />
  ),
}))

import { HeatmapChart } from './HeatmapChart'

const DATA = [
  { hora: '8h',  dia: 'Lun', llamadas: 68  },
  { hora: '9h',  dia: 'Lun', llamadas: 132 },
  { hora: '10h', dia: 'Lun', llamadas: 187 },
  { hora: '8h',  dia: 'Mar', llamadas: 72  },
  { hora: '9h',  dia: 'Mar', llamadas: 145 },
]

describe('HeatmapChart', () => {
  it('renders a role=img frame with ariaLabel', () => {
    render(
      <HeatmapChart data={DATA} xField="hora" yField="dia" colorField="llamadas"
        ariaLabel="Volumen de llamadas por hora y día" />,
    )
    expect(screen.getByRole('img', { name: 'Volumen de llamadas por hora y día' })).toBeInTheDocument()
  })

  it('forwards xField, yField, colorField, autoFit and theme to Heatmap', () => {
    render(
      <HeatmapChart data={DATA} xField="hora" yField="dia" colorField="llamadas" ariaLabel="x" />,
    )
    const props = JSON.parse(screen.getByTestId('plots-heatmap').dataset.props!)
    expect(props.xField).toBe('hora')
    expect(props.yField).toBe('dia')
    expect(props.colorField).toBe('llamadas')
    expect(props.autoFit).toBe(true)
    expect(props.theme.type).toBe('classic')
  })

  it('shows Skeleton when loading', () => {
    render(
      <HeatmapChart data={DATA} xField="hora" yField="dia" colorField="llamadas"
        ariaLabel="x" loading data-testid="hc" />,
    )
    expect(screen.queryByTestId('plots-heatmap')).not.toBeInTheDocument()
    expect(screen.getByTestId('hc')).toBeInTheDocument()
  })

  it('shows EmptyState when data is empty', () => {
    render(
      <HeatmapChart data={[]} xField="hora" yField="dia" colorField="llamadas" ariaLabel="x" />,
    )
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
  })

  it('builds srTable with xField, yField, colorField headers', () => {
    render(
      <HeatmapChart data={DATA} xField="hora" yField="dia" colorField="llamadas" ariaLabel="x" />,
    )
    expect(screen.getByRole('columnheader', { name: 'hora' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'llamadas' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '68' })).toBeInTheDocument()
  })
})
```

- [x] **Step 2: Run → paste FAIL**

- [x] **Step 3: Write the implementation**

```tsx
// src/charts/HeatmapChart/HeatmapChart.tsx
import React from 'react'
import { Heatmap } from '@ant-design/plots'
import { ChartFrame } from '../ChartFrame/ChartFrame'
import { antvTheme } from '../antvTheme'
import { chartTokens } from '../../tokens/chartTokens'
import type { BaseChartProps } from '../chartTypes'

export interface HeatmapChartProps extends Omit<BaseChartProps, 'showGrid' | 'showValues' | 'showLegend' | 'valueFormatter'> {
  /** Category field for columns (e.g. hours of day). */
  xField: string
  /** Category field for rows (e.g. days of week). */
  yField: string
  /** Numeric intensity field — determines cell color. */
  colorField: string
  /** Color ramp from low to high intensity. Defaults to brand navy ramp. */
  colorScale?: string[]
}

export function HeatmapChart({
  data,
  xField,
  yField,
  colorField,
  colorScale,
  ariaLabel,
  height = 200,
  loading = false,
  className,
  style,
  'data-testid': testId,
}: HeatmapChartProps) {
  const isEmpty = !loading && data.length === 0

  const srTable = {
    headers: [xField, yField, colorField],
    rows: data.map((d) => [
      d[xField] as string | number,
      d[yField] as string | number,
      d[colorField] as string | number,
    ]),
  }

  const ramp = colorScale ?? [...chartTokens.heatmapRamp]

  return (
    <ChartFrame
      ariaLabel={ariaLabel}
      height={height}
      loading={loading}
      isEmpty={isEmpty}
      srTable={srTable}
      {...(className !== undefined ? { className } : {})}
      {...(style !== undefined ? { style } : {})}
      {...(testId !== undefined ? { 'data-testid': testId } : {})}
    >
      <Heatmap
        data={data as Array<Record<string, unknown>>}
        xField={xField}
        yField={yField}
        colorField={colorField}
        autoFit
        height={height}
        theme={antvTheme}
        legend={false}
        style={{ inset: 1, radius: 2 }}
        scale={{ color: { range: ramp } }}
        axis={{
          x: { tickCount: 6 },
          y: { tickCount: 7 },
        }}
      />
    </ChartFrame>
  )
}
```

```css
/* src/charts/HeatmapChart/HeatmapChart.module.css */
/* Structural intent only — NOT imported. Layout delegated to ChartFrame + AntV. */
```

```ts
// src/charts/HeatmapChart/index.ts
export { HeatmapChart } from './HeatmapChart'
export type { HeatmapChartProps } from './HeatmapChart'
```

- [x] **Step 4: Run → paste PASS (5 tests)**

- [x] **Step 5: Write stories**

```tsx
// src/charts/HeatmapChart/HeatmapChart.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { HeatmapChart } from './HeatmapChart'

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const HOURS = ['6h','8h','10h','12h','14h','16h','18h','20h','22h','0h','2h','4h']
const RAW = [
  [12,8,15,45,78,92,88,65,43,28,18,9],
  [10,7,12,52,85,96,91,72,48,32,21,11],
  [11,9,14,48,80,89,85,68,45,30,19,10],
  [13,8,16,55,88,98,94,75,51,35,23,12],
  [14,10,18,60,92,100,96,78,54,38,25,14],
  [5,3,8,22,45,62,58,48,35,24,15,7],
  [3,2,5,15,32,48,44,36,25,18,11,5],
]
const DATA = DAYS.flatMap((dia, di) =>
  HOURS.map((hora, hi) => ({ hora, dia, llamadas: RAW[di][hi] }))
)

const meta: Meta<typeof HeatmapChart> = {
  title: 'Wave 9 — Charts/HeatmapChart',
  component: HeatmapChart,
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof HeatmapChart>

export const Default: Story = {
  render: () => (
    <div style={{ width: 560 }}>
      <HeatmapChart data={DATA} xField="hora" yField="dia" colorField="llamadas"
        height={220} ariaLabel="Volumen de llamadas por hora y día de semana" />
    </div>
  ),
}
export const Loading: Story = {
  render: () => (
    <div style={{ width: 560 }}>
      <HeatmapChart data={DATA} xField="hora" yField="dia" colorField="llamadas"
        loading ariaLabel="Cargando" />
    </div>
  ),
}
export const Empty: Story = {
  render: () => (
    <div style={{ width: 560 }}>
      <HeatmapChart data={[]} xField="hora" yField="dia" colorField="llamadas"
        ariaLabel="Sin datos" />
    </div>
  ),
}
```

- [x] **Step 6: Write MDX docs**

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as HeatmapChartStories from './HeatmapChart.stories'

<Meta of={HeatmapChartStories} />

# HeatmapChart

Mapa de calor de intensidad por dos dimensiones categóricas. Usa `@ant-design/plots` (`Heatmap`).

**Referencia:** `Dashboard-Comps/Widget Gallery.html → HeatmapSVG`

## Cuándo usar

- Volumen de llamadas por hora del día × día de la semana — identifica picos de demanda y ventanas de baja carga.
- Cualquier métrica que varía en dos dimensiones categóricas.
- Los datos deben estar en formato largo: una fila por combinación `xField × yField`.

<Canvas of={HeatmapChartStories.Default} />

## Accesibilidad

`role="img"` con `aria-label` obligatorio (vía `ChartFrame`). Tabla oculta con los datos disponible para lectores de pantalla.

## Props

<Controls />
```

- [x] **Step 7: Wire export**
```ts
export { HeatmapChart } from './charts/HeatmapChart'
export type { HeatmapChartProps } from './charts/HeatmapChart'
```

- [x] **Step 8: Integration + Playwright** (story id `wave-9-charts-heatmapchart--default`)

- [x] **Step 9: Stage**
```bash
git add src/charts/HeatmapChart/ src/index.ts
```

---

## Task 24: `StatStrip`

**Files:** 6 files in `src/charts/StatStrip/` + modify `src/index.ts`

**This is pure DOM — NO AntV, NO ChartFrame.** StatStrip is a compact metric bar, not a chart.

**Reasoning to do first:**
1. From the gallery reference: a flex row of equal-width cells, each with a large bold value (`Barlow Semi Condensed`) and a small uppercase label (`Manrope`). Cells separated by a 1px border using `--yes-color-border`. Single border around the whole strip using `--yes-radius-card`.
2. Props: `items: { label: string; value: string; unit?: string }[]`. Plus `BaseProps`.
3. NO `ariaLabel` as a separate required prop — the component renders visible text with proper semantics. Use `role="list"` or `dl` / `<table>` for semantic structure.
4. Tests: use RTL, no AntV mock needed. Assert items render, label/value text visible, data-testid forwarded.

- [ ] **Step 1: Write the failing test**

```tsx
// src/charts/StatStrip/StatStrip.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StatStrip } from './StatStrip'

const ITEMS = [
  { label: 'Agentes activos', value: '84' },
  { label: 'En cola',         value: '12' },
  { label: 'Nivel servicio',  value: '82%' },
  { label: 'Abandono',        value: '8.2%' },
  { label: 'AHT',             value: '4:23', unit: 'min' },
]

describe('StatStrip', () => {
  it('renders all item values', () => {
    render(<StatStrip items={ITEMS} />)
    expect(screen.getByText('84')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('82%')).toBeInTheDocument()
  })

  it('renders all item labels', () => {
    render(<StatStrip items={ITEMS} />)
    expect(screen.getByText('Agentes activos')).toBeInTheDocument()
    expect(screen.getByText('En cola')).toBeInTheDocument()
    expect(screen.getByText('Nivel servicio')).toBeInTheDocument()
  })

  it('renders unit when provided', () => {
    render(<StatStrip items={ITEMS} />)
    expect(screen.getByText('min')).toBeInTheDocument()
  })

  it('forwards data-testid to the root element', () => {
    render(<StatStrip items={ITEMS} data-testid="strip" />)
    expect(screen.getByTestId('strip')).toBeInTheDocument()
  })

  it('applies className to the root element', () => {
    render(<StatStrip items={ITEMS} className="custom-class" data-testid="strip" />)
    expect(screen.getByTestId('strip')).toHaveClass('custom-class')
  })
})
```

- [ ] **Step 2: Run → paste FAIL**

- [ ] **Step 3: Write the implementation**

```tsx
// src/charts/StatStrip/StatStrip.tsx
import React from 'react'
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'

export interface StatStripItem {
  /** Short uppercase label below the value (e.g. "Agentes activos"). */
  label: string
  /** The metric value (e.g. "84", "82%", "4:23"). */
  value: string
  /** Optional unit shown smaller after the value (e.g. "min"). */
  unit?: string
}

export interface StatStripProps extends BaseProps {
  /** List of metrics to display. */
  items: StatStripItem[]
}

const ROOT_STYLE: React.CSSProperties = {
  display: 'flex',
  width: '100%',
  borderRadius: 'var(--yes-radius-card)',
  overflow: 'hidden',
  border: '1px solid var(--yes-color-border)',
}

const CELL_BASE: React.CSSProperties = {
  flex: 1,
  padding: 'var(--yes-space-3) var(--yes-space-3)',
  background: 'var(--yes-color-surface)',
  textAlign: 'center',
}

const VALUE_STYLE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-display)',
  fontSize: 22,
  fontWeight: 700,
  color: 'var(--yes-color-text)',
  lineHeight: 1,
}

const UNIT_STYLE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 11,
  fontWeight: 400,
  color: 'var(--yes-color-text-muted)',
  marginLeft: 'var(--yes-space-1)',
}

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 9,
  fontWeight: 700,
  color: 'var(--yes-color-text-subtle)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginTop: 'var(--yes-space-1)',
}

export function StatStrip({
  items,
  className,
  style,
  'data-testid': testId,
}: StatStripProps) {
  return (
    <div
      className={cn(className)}
      style={{ ...ROOT_STYLE, ...style }}
      data-testid={testId}
    >
      {items.map((item, i) => (
        <div
          key={item.label}
          style={{
            ...CELL_BASE,
            borderLeft: i > 0 ? '1px solid var(--yes-color-border)' : 'none',
          }}
        >
          <div style={VALUE_STYLE}>
            {item.value}
            {item.unit && <span style={UNIT_STYLE}>{item.unit}</span>}
          </div>
          <div style={LABEL_STYLE}>{item.label}</div>
        </div>
      ))}
    </div>
  )
}
```

```css
/* src/charts/StatStrip/StatStrip.module.css */
/* Structural intent only — NOT imported.
   Root: flex row, full width, overflow hidden, border + radius from --yes-radius-card.
   Cell: flex 1, center-aligned text, left border from --yes-color-border (except first).
   Value: Barlow Semi Condensed, 22px, bold.
   Label: Manrope, 9px, uppercase, --yes-color-text-subtle. */
```

```ts
// src/charts/StatStrip/index.ts
export { StatStrip } from './StatStrip'
export type { StatStripProps, StatStripItem } from './StatStrip'
```

- [ ] **Step 4: Run → paste PASS (5 tests)**

- [ ] **Step 5: Write stories**

```tsx
// src/charts/StatStrip/StatStrip.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { StatStrip } from './StatStrip'

const ITEMS_CC = [
  { label: 'Agentes activos', value: '84'   },
  { label: 'En cola',         value: '12'   },
  { label: 'Nivel servicio',  value: '82%'  },
  { label: 'Abandono',        value: '8.2%' },
  { label: 'AHT',             value: '4:23', unit: 'min' },
]

const ITEMS_MINI = [
  { label: 'Conversaciones', value: '1.284' },
  { label: 'CSAT',           value: '94.2%' },
  { label: 'T. respuesta',   value: '1:24',  unit: 'min' },
  { label: 'Agentes',        value: '18'    },
]

const meta: Meta<typeof StatStrip> = {
  title: 'Wave 9 — Charts/StatStrip',
  component: StatStrip,
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof StatStrip>

export const ContactCenter: Story = {
  render: () => (
    <div style={{ width: 600 }}>
      <StatStrip items={ITEMS_CC} />
    </div>
  ),
}
export const Dashboard: Story = {
  render: () => (
    <div style={{ width: 500 }}>
      <StatStrip items={ITEMS_MINI} />
    </div>
  ),
}
```

- [ ] **Step 6: Write MDX docs**

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as StatStripStories from './StatStrip.stories'

<Meta of={StatStripStories} />

# StatStrip

Fila compacta de métricas operativas en tiempo real. Componente DOM puro, sin AntV.

**Referencia:** `Dashboard-Comps/Widget Gallery.html → StatStrip`

## Cuándo usar

- Barra de estado superior de un dashboard operativo (agentes activos, en cola, nivel de servicio, abandono, AHT).
- Cuando se necesitan 3–6 métricas de un vistazo sin la jerarquía de un `KPICard`.
- Para métricas individuales con delta usa `KPICard`.

<Canvas of={StatStripStories.ContactCenter} />

## Accesibilidad

Cada métrica es texto visible con su etiqueta. No usa `role="img"` — el contenido es directamente legible por tecnología asistiva.

## Props

<Controls />
```

- [ ] **Step 7: Wire export**
```ts
export { StatStrip } from './charts/StatStrip'
export type { StatStripProps, StatStripItem } from './charts/StatStrip'
```

- [ ] **Step 8: Integration + Playwright** (story id `wave-9-charts-statstrip--contact-center`)

- [ ] **Step 9: Stage**
```bash
git add src/charts/StatStrip/ src/index.ts
```

---

## Task 25: Wave 9c integration sweep + Playwright all stories

- [ ] **Gate 1**: `pnpm test` → expect 549 + 21 new (6+5+5+5) = **574 total passing**
- [ ] **Gate 2**: `pnpm typecheck` → exit 0
- [ ] **Gate 3**: `pnpm build && pnpm check-dist` → Build success
- [ ] **Gate 4**: Export sweep for `ScatterChart, BubbleChart, HeatmapChart, StatStrip`
- [ ] **Gate 5**: Playwright sweep — all 4 new default stories + 2 Wave 9b regressions

---

## Notes for implementers

1. **No renderer prop** on any AntV component.
2. **StatStrip is not a chart** — no ChartFrame, no AntV, no ariaLabel requirement. Pure DOM.
3. **BubbleChart mock returns `plots-bubble` but intercepts `Scatter`** — this is intentional to distinguish from ScatterChart tests.
4. **HeatmapChart `scale.color.range`** — if AntV types reject `scale`, cast only that prop: `{...({ scale: { color: { range: ramp } } } as Record<string, unknown>)}`.
5. **`point` and `style` props** on Scatter/Heatmap — if TS complains, cast individually.
6. **JSON.stringify with function replacer** in ALL test mocks (except StatStrip which has no AntV).
