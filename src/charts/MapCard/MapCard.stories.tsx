// src/charts/MapCard/MapCard.stories.tsx
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { MapCard } from './MapCard'

const CITIES_GEOJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', geometry: { type: 'Point', coordinates: [-74.08, 4.71] }, properties: { ciudad: 'Bogotá',      llamadas: 3241 } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [-75.57, 6.24] }, properties: { ciudad: 'Medellín',    llamadas: 1876 } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [-76.52, 3.43] }, properties: { ciudad: 'Cali',        llamadas: 987  } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [-73.12, 7.12] }, properties: { ciudad: 'Bucaramanga', llamadas: 543  } },
  ],
}

const EMPTY_GEOJSON: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] }

const meta: Meta<typeof MapCard> = {
  title: 'Wave 9 — Charts/MapCard',
  component: MapCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Mapa de burbujas (puntos). Usa `maplibre-gl` + `react-map-gl`. Referencia: `Gap Widgets - Implementation Spec.html § 05`.',
      },
    },
  },
  args: {
    data: CITIES_GEOJSON,
    sizeField: 'llamadas',
    ariaLabel: 'Llamadas por ciudad en Colombia',
  },
}
export default meta
type Story = StoryObj<typeof MapCard>

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 600 }}>
      <MapCard {...args} />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Default (Colombia)</h4>
        <MapCard data={CITIES_GEOJSON} sizeField="llamadas" ariaLabel="Default" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Centrado en Bogotá, zoom 9</h4>
        <MapCard data={CITIES_GEOJSON} sizeField="llamadas"
          center={{ longitude: -74.08, latitude: 4.71 }} zoom={9}
          ariaLabel="Bogotá zoom alto" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Altura compacta (180px)</h4>
        <MapCard data={CITIES_GEOJSON} sizeField="llamadas" height={180} ariaLabel="Altura compacta" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Coloreado por ciudad</h4>
        <MapCard data={CITIES_GEOJSON} sizeField="llamadas" colorField="ciudad" ariaLabel="Color por ciudad" />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Cargando</h4>
        <MapCard data={EMPTY_GEOJSON} sizeField="llamadas" loading ariaLabel="Cargando mapa" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Vacío</h4>
        <MapCard data={EMPTY_GEOJSON} sizeField="llamadas" ariaLabel="Sin datos en el mapa" />
      </div>
    </div>
  ),
}

export const Interactive: Story = {
  render: (args) => (
    <div style={{ width: 600 }}>
      <MapCard {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const img = canvas.getByRole('img', { name: 'Llamadas por ciudad en Colombia' })
    await expect(img).toBeVisible()
  },
}
