// src/charts/ChoroplethMap/ChoroplethMap.tsx
import React from 'react'
import Map, { Source, Layer } from 'react-map-gl/maplibre'
import type { LayerProps } from 'react-map-gl/maplibre'
import { ChartFrame } from '../ChartFrame/ChartFrame'
import { chartTokens } from '../../tokens/chartTokens'
import type { BaseProps } from '../../types/shared'

// Consumers must import 'maplibre-gl/dist/maplibre-gl.css' once in their app entry.
// See MapCard.tsx for rationale (bundle size + vitest worker starvation).

const COLOMBIA_CENTER = { longitude: -74.3, latitude: 4.6 } as const
const DEFAULT_ZOOM = 5
const DEFAULT_HEIGHT = 300
const TILE_STYLE_URL = 'https://demotiles.maplibre.org/style.json'

export interface ChoroplethMapProps extends BaseProps {
  /** GeoJSON FeatureCollection of Polygon/MultiPolygon regions. Each Feature.properties must contain the valueField. */
  data: GeoJSON.FeatureCollection
  /** Property name in each feature's properties containing the numeric metric. */
  valueField: string
  /** Color scale ramp from low to high. Default: chartTokens.heatmapRamp. */
  colorScale?: string[]
  /** Map center. Default Colombia. */
  center?: { longitude: number; latitude: number }
  /** Initial zoom level. Default 5. */
  zoom?: number
  /** Component height in px. Default 300. */
  height?: number
  /** Accessible label for the map. Required. */
  ariaLabel: string
  /** Loading state. Default false. */
  loading?: boolean
}

function readNumeric(feature: GeoJSON.Feature, field: string): number {
  const raw = (feature.properties ?? {})[field]
  return typeof raw === 'number' && Number.isFinite(raw) ? raw : 0
}

export function ChoroplethMap({
  data,
  valueField,
  colorScale,
  center = COLOMBIA_CENTER,
  zoom = DEFAULT_ZOOM,
  height = DEFAULT_HEIGHT,
  ariaLabel,
  loading = false,
  className,
  style,
  'data-testid': testId,
}: ChoroplethMapProps) {
  const isEmpty = !loading && data.features.length === 0

  const ramp: readonly string[] =
    colorScale && colorScale.length >= 2 ? colorScale : chartTokens.heatmapRamp
  const lowColor = ramp[0] ?? chartTokens.heatmapRamp[0]
  const highColor = ramp[ramp.length - 1] ?? chartTokens.heatmapRamp[chartTokens.heatmapRamp.length - 1]

  const values = data.features.map((f) => readNumeric(f, valueField))
  const minVal = values.length > 0 ? Math.min(...values) : 0
  const maxVal = values.length > 0 ? Math.max(...values) : 1
  const safeMax = maxVal === minVal ? minVal + 1 : maxVal

  const fillPaint: LayerProps['paint'] = {
    'fill-color': [
      'interpolate',
      ['linear'],
      ['get', valueField],
      minVal,
      lowColor,
      safeMax,
      highColor,
    ] as unknown as string,
    'fill-opacity': 0.75,
  }

  const outlinePaint: LayerProps['paint'] = {
    'line-color': '#ffffff',
    'line-width': 0.5,
  }

  return (
    <ChartFrame
      ariaLabel={ariaLabel}
      height={height}
      loading={loading}
      isEmpty={isEmpty}
      {...(className !== undefined ? { className } : {})}
      {...(style !== undefined ? { style } : {})}
      {...(testId !== undefined ? { 'data-testid': testId } : {})}
    >
      <Map
        initialViewState={{
          longitude: center.longitude,
          latitude: center.latitude,
          zoom,
        }}
        mapStyle={TILE_STYLE_URL}
        style={{ width: '100%', height }}
      >
        <Source id="choropleth-regions" type="geojson" data={data}>
          <Layer id="choropleth-fill" type="fill" paint={fillPaint} />
          <Layer id="choropleth-outline" type="line" paint={outlinePaint} />
        </Source>
      </Map>
    </ChartFrame>
  )
}
