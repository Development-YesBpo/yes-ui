// src/charts/ChoroplethMap/ChoroplethMap.stories.tsx
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { ChoroplethMap } from './ChoroplethMap'

const makeBox = (lng: number, lat: number, v: number): GeoJSON.Feature => ({
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [lng - 0.3, lat - 0.3], [lng + 0.3, lat - 0.3], [lng + 0.3, lat + 0.3], [lng - 0.3, lat + 0.3], [lng - 0.3, lat - 0.3],
    ]],
  },
  properties: { departamento: `Depto ${v}`, contactos: v },
})

const REGIONS_GEOJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    makeBox(-74.08, 4.71, 3241), makeBox(-75.57, 6.24, 1876),
    makeBox(-76.52, 3.43, 987),  makeBox(-73.12, 7.12, 543),
  ],
}

const EMPTY_GEOJSON: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] }

const meta: Meta<typeof ChoroplethMap> = {
  title: 'Wave 9 — Charts/ChoroplethMap',
  component: ChoroplethMap,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Mapa coroplético — colorea regiones según una métrica. Usa `maplibre-gl` + `react-map-gl`. Referencia: `Gap Widgets - Implementation Spec.html § 06`.',
      },
    },
  },
  args: {
    data: REGIONS_GEOJSON,
    valueField: 'contactos',
    ariaLabel: 'Contactos por departamento en Colombia',
  },
}
export default meta
type Story = StoryObj<typeof ChoroplethMap>

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 600 }}>
      <ChoroplethMap {...args} />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Rampa azul YES (default)</h4>
        <ChoroplethMap data={REGIONS_GEOJSON} valueField="contactos" ariaLabel="Rampa por defecto" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Rampa cálida</h4>
        <ChoroplethMap data={REGIONS_GEOJSON} valueField="contactos"
          colorScale={['#FFF7ED', '#FED7AA', '#F97316', '#9A3412']}
          ariaLabel="Rampa cálida" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Centrado, zoom alto</h4>
        <ChoroplethMap data={REGIONS_GEOJSON} valueField="contactos"
          center={{ longitude: -74.5, latitude: 5.5 }} zoom={7}
          ariaLabel="Zoom alto centrado" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Altura compacta (180px)</h4>
        <ChoroplethMap data={REGIONS_GEOJSON} valueField="contactos" height={180} ariaLabel="Altura compacta" />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Cargando</h4>
        <ChoroplethMap data={EMPTY_GEOJSON} valueField="contactos" loading ariaLabel="Cargando mapa" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Vacío</h4>
        <ChoroplethMap data={EMPTY_GEOJSON} valueField="contactos" ariaLabel="Sin datos" />
      </div>
    </div>
  ),
}

export const Interactive: Story = {
  render: (args) => (
    <div style={{ width: 600 }}>
      <ChoroplethMap {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const img = canvas.getByRole('img', { name: 'Contactos por departamento en Colombia' })
    await expect(img).toBeVisible()
  },
}
