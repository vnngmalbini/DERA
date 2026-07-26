import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  headLinkOptions: {
    preset: '2023',
  },
  preset: {
    ...minimal2023Preset,
    maskable: {
      sizes: [512],
      padding: 0.25,
      resizeOptions: { background: '#366800' },
    },
    apple: {
      sizes: [180],
      padding: 0.18,
      resizeOptions: { background: '#366800' },
    },
  },
  images: ['pwa-assets/icon-source.svg'],
})
