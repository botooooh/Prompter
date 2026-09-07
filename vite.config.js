import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo-arrondi.png'],
      manifest: {
        name: 'Prompteur',
        short_name: 'Prompteur',
        description: 'Progressive Web App de prompteur avec design Samsung One UI.',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        icons: [
          {
            src: 'logo-arrondi.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo-arrondi.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
