import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon-196.png', 'apple-icon-180.png', 'masked-icon.svg'],
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
                cleanupOutdatedCaches: true,
                sourcemap: true,
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'gstatic-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    }
                ]
            },
            manifest: {
                name: 'Secure Mobile App',
                short_name: 'SecureAuth',
                description: 'Secure Mobile Authentication App with biometric support',
                theme_color: '#0f172a',
                background_color: '#0f172a',
                display: 'standalone',
                orientation: 'portrait',
                start_url: '/',
                scope: '/',
                categories: ['security', 'utilities'],
                icons: [
                    {
                        src: 'manifest-icon-192.maskable.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'manifest-icon-512.maskable.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: 'manifest-icon-512.maskable.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            },
            devOptions: {
                enabled: true
            }
        })
    ],
    server: {
        host: true,
        port: 5174
    }
})
