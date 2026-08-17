import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'CamperMap Tunisie — Bivouac & 4x4',
        short_name: 'CamperMapTN',
        description: 'Carte interactive et guide des meilleurs spots de bivouac et pistes 4x4 en Tunisie.',
        theme_color: '#0c0a09',
        background_color: '#0c0a09',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f59e0b"><path d="M12 2L2 22h20L12 2zm0 4.5L18.5 19h-13L12 6.5z"/></svg>',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f59e0b"><path d="M12 2L2 22h20L12 2zm0 4.5L18.5 19h-13L12 6.5z"/></svg>',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.basemaps\.cartocdn\.com\/.*$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'carto-tiles-cache',
              expiration: {
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'spot-images-cache',
              expiration: {
                maxEntries: 150,
                maxAgeSeconds: 60 * 60 * 24 * 30
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
})


