// src/charts/MapCard/MapCard.tsx
import React from 'react'
import Map, { Source, Layer } from 'react-map-gl/maplibre'
import type { LayerProps } from 'react-map-gl/maplibre'
import { ChartFrame } from '../ChartFrame/ChartFrame'
import { chartTokens } from '../../tokens/chartTokens'
import type { BaseProps } from '../../types/shared'

// Consumers must import 'maplibre-gl/dist/maplibre-gl.css' once in their app entry.
// We intentionally do NOT import it here: bundling 700KB of CSS into every consumer
// who never renders a map is wasteful, and importing it at module level slows the
// vitest worker pool to a crawl when the index barrel is traversed.

const COLOMBIA_CENTER = { longitude: -74.3, latitude: 4.6 } as const
const DEFAULT_ZOOM = 5
const DEFAULT_HEIGHT = 300
const TILE_STYLE_URL = 'https://demotiles.maplibre.org/style.json'

export interface MapCardProps extends BaseProps {
  /** GeoJSON FeatureCollection of Points. Each Feature.properties contains the data fields. */
  data: GeoJSON.FeatureCollection
  /** Property name for bubble size (numeric). */
  sizeField: string
  /** Optional property name for bubble color category. */
  colorField?: string
  /** Map center. Default Colombia. */
  center?: { longitude: number; latitude: number }
  /** Initial zoom level. Default 5. */
  zoom?: number
  /** Component height in px. Default 300. */
  height?: number
  /** Accessible label for the map. Required. */
  ariaLabel: string
  /** Show a Skeleton while the map initializes. Default false. */
  loading?: boolean
}

function readNumeric(feature: GeoJSON.Feature, field: string): number {
  const raw = (feature.properties ?? {})[field]
  return typeof raw === 'number' && Number.isFinite(raw) ? raw : 0
}

export function MapCard({
  data,
  sizeField,
  colorField,
  center = COLOMBIA_CENTER,
  zoom = DEFAULT_ZOOM,
  height = DEFAULT_HEIGHT,
  ariaLabel,
  loading = false,
  className,
  style,
  'data-testid': testId,
}: MapCardProps) {
  const isEmpty = !loading && data.features.length === 0

  const sizes = data.features.map((f) => readNumeric(f, sizeField))
  const minVal = sizes.length > 0 ? Math.min(...sizes) : 0
  const maxVal = sizes.length > 0 ? Math.max(...sizes) : 1
  const safeMax = maxVal === minVal ? minVal + 1 : maxVal

  const circlePaint: LayerProps['paint'] = {
    'circle-radius': [
      'interpolate',
      ['linear'],
      ['get', sizeField],
      minVal,
      6,
      safeMax,
      30,
    ] as unknown as number,
    'circle-color': (colorField ? ['get', colorField] : chartTokens.primary) as unknown as string,
    'circle-opacity': 0.7,
    'circle-stroke-width': 1.5,
    'circle-stroke-color': '#ffffff',
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
        <Source id="mapcard-points" type="geojson" data={data}>
          <Layer id="mapcard-circles" type="circle" paint={circlePaint} />
        </Source>
      </Map>
    </ChartFrame>
  )
}
