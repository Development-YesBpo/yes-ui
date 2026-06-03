import type { Preview } from '@storybook/react'
import '../src/tokens/primitives.css'
import '../src/tokens/semantic.css'
import '../src/tokens/themes/light.css'
import 'maplibre-gl/dist/maplibre-gl.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f5f5f7' },
        { name: 'dark', value: '#06080A' },
        { name: 'white', value: '#ffffff' },
      ],
    },
    docs: {
      toc: true,
    },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'label', enabled: true },
        ],
      },
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'YES UI token theme',
      defaultValue: 'light',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        showName: true,
      },
    },
  },
}

export default preview
