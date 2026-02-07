import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['banana.svg', 'logo.png'],
            manifest: {
                name: 'BananaClock',
                short_name: 'BananaClock',
                description: 'AI-powered banana ripeness detection',
                theme_color: '#111111',
                background_color: '#111111',
                display: 'standalone',
                scope: '/',
                start_url: '/',
                orientation: 'portrait',
                icons: [
                    {
                        src: 'icon-192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'icon-512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        })
    ],
    server: {
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist',
        sourcemap: true
    }
})
