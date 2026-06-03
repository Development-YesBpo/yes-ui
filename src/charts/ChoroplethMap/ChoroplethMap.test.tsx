// src/charts/ChoroplethMap/ChoroplethMap.test.tsx
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

import { ChoroplethMap } from './ChoroplethMap'

const makeBox = (lng: number, lat: number, v: number): GeoJSON.Feature => ({
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [lng - 0.3, lat - 0.3],
        [lng + 0.3, lat - 0.3],
        [lng + 0.3, lat + 0.3],
        [lng - 0.3, lat + 0.3],
        [lng - 0.3, lat - 0.3],
      ],
    ],
  },
  properties: { departamento: `Depto ${v}`, contactos: v },
})

const REGIONS: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [makeBox(-74.08, 4.71, 3000), makeBox(-75.57, 6.24, 500)],
}

describe('ChoroplethMap', () => {
  it('renders a role="img" container with the aria-label', () => {
    render(
      <ChoroplethMap
        data={REGIONS}
        valueField="contactos"
        ariaLabel="Mapa de contactos por departamento"
      />,
    )
    expect(
      screen.getByRole('img', { name: 'Mapa de contactos por departamento' }),
    ).toBeInTheDocument()
  })

  it('forwards data, center and zoom to Map via initialViewState', () => {
    render(
      <ChoroplethMap
        data={REGIONS}
        valueField="contactos"
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

  it('renders fill and outline layers with the provided color scale', () => {
    const scale = ['#000000', '#222222', '#444444']
    render(
      <ChoroplethMap
        data={REGIONS}
        valueField="contactos"
        colorScale={scale}
        ariaLabel="x"
      />,
    )
    const fillProps = JSON.parse(
      screen.getByTestId('maplibre-layer-choropleth-fill').dataset.props!,
    )
    expect(fillProps.type).toBe('fill')
    expect(fillProps.paint['fill-color']).toEqual([
      'interpolate',
      ['linear'],
      ['get', 'contactos'],
      500,
      '#000000',
      3000,
      '#444444',
    ])
    expect(
      screen.getByTestId('maplibre-layer-choropleth-outline'),
    ).toBeInTheDocument()
  })

  it('shows a Skeleton when loading (no map rendered)', () => {
    render(
      <ChoroplethMap
        data={REGIONS}
        valueField="contactos"
        loading
        ariaLabel="Cargando"
        data-testid="cm"
      />,
    )
    expect(screen.queryByTestId('maplibre-map')).not.toBeInTheDocument()
    expect(screen.getByTestId('cm')).toBeInTheDocument()
  })

  it('shows EmptyState when data has no features', () => {
    render(
      <ChoroplethMap
        data={{ type: 'FeatureCollection', features: [] }}
        valueField="contactos"
        ariaLabel="Sin datos"
      />,
    )
    expect(screen.queryByTestId('maplibre-map')).not.toBeInTheDocument()
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
  })
})
