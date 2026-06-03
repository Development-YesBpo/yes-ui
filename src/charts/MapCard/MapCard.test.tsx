// src/charts/MapCard/MapCard.test.tsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('maplibre-gl/dist/maplibre-gl.css', () => ({}))

vi.mock('react-map-gl/maplibre', () => {
  const serialize = (v: unknown) =>
    JSON.stringify(v, (_k, val) =>
      typeof val === 'function' ? '__fn__' : val,
    )
  const Map = (props: Record<string, unknown> & { children?: React.ReactNode }) => (
    <div
      data-testid="maplibre-map"
      data-props={serialize({ ...props, children: undefined })}
    >
      {props.children as React.ReactNode}
    </div>
  )
  const Source = (props: Record<string, unknown> & { children?: React.ReactNode }) => (
    <div data-testid="maplibre-source" data-props={serialize({ ...props, children: undefined })}>
      {props.children as React.ReactNode}
    </div>
  )
  const Layer = (props: Record<string, unknown>) => (
    <div data-testid={`maplibre-layer-${String(props.id ?? 'x')}`} data-props={serialize(props)} />
  )
  const Marker = () => null
  return { default: Map, Source, Layer, Marker }
})

import { MapCard } from './MapCard'

const POINTS: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-74.08, 4.71] },
      properties: { ciudad: 'Bogotá', llamadas: 3000 },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-75.57, 6.24] },
      properties: { ciudad: 'Medellín', llamadas: 1500 },
    },
  ],
}

describe('MapCard', () => {
  it('renders a role="img" container with the aria-label', () => {
    render(<MapCard data={POINTS} sizeField="llamadas" ariaLabel="Mapa de llamadas por ciudad" />)
    expect(
      screen.getByRole('img', { name: 'Mapa de llamadas por ciudad' }),
    ).toBeInTheDocument()
  })

  it('forwards data, center and zoom to Map via initialViewState', () => {
    render(
      <MapCard
        data={POINTS}
        sizeField="llamadas"
        center={{ longitude: -74.3, latitude: 4.6 }}
        zoom={6}
        ariaLabel="x"
      />,
    )
    const props = JSON.parse(screen.getByTestId('maplibre-map').dataset.props!)
    expect(props.initialViewState.longitude).toBe(-74.3)
    expect(props.initialViewState.latitude).toBe(4.6)
    expect(props.initialViewState.zoom).toBe(6)
    const sourceProps = JSON.parse(screen.getByTestId('maplibre-source').dataset.props!)
    expect(sourceProps.type).toBe('geojson')
    expect(sourceProps.data.features).toHaveLength(2)
  })

  it('shows a Skeleton when loading (no map rendered)', () => {
    render(
      <MapCard
        data={POINTS}
        sizeField="llamadas"
        loading
        ariaLabel="Cargando"
        data-testid="mc"
      />,
    )
    expect(screen.queryByTestId('maplibre-map')).not.toBeInTheDocument()
    expect(screen.getByTestId('mc')).toBeInTheDocument()
  })

  it('shows EmptyState when data has no features', () => {
    render(
      <MapCard
        data={{ type: 'FeatureCollection', features: [] }}
        sizeField="llamadas"
        ariaLabel="Sin datos"
      />,
    )
    expect(screen.queryByTestId('maplibre-map')).not.toBeInTheDocument()
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
  })

  it('forwards data-testid to the root element', () => {
    render(
      <MapCard
        data={POINTS}
        sizeField="llamadas"
        ariaLabel="x"
        data-testid="mc-root"
      />,
    )
    expect(screen.getByTestId('mc-root')).toBeInTheDocument()
  })
})
