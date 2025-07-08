import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Kahani - Your Personal Movie & Book Companion',
        short_name: 'Kahani',
        description:
          'Discover personalized movie, TV show, and book recommendations',
        theme_color: '#ef4444',
        background_color: '#000000',
        display: 'standalone',
        icons: [
          {
            src: 'images/icon.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'images/icon.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        // Cache optimization
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.themoviedb\.org\/.*$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tmdb-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
            },
          },
          {
            urlPattern: /^https:\/\/image\.tmdb\.org\/.*$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tmdb-images',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV === 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', '@heroicons/react'],
          'api-vendor': ['axios'],
          // Group related components
          'auth-components': [
            './src/pages/Login',
            './src/pages/AuthCallback',
            './src/components/auth/LoginIllustrations',
          ],
          'media-components': [
            './src/pages/Movies',
            './src/pages/TVShows',
            './src/pages/Books',
            './src/components/MovieCard',
            './src/components/TVShowCard',
            './src/components/BookCard',
          ],
          'detail-components': [
            './src/pages/MovieDetail',
            './src/pages/TVShowDetail',
            './src/pages/BookDetail',
            './src/pages/BookDetails',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.warn'],
      },
      mangle: {
        safari10: true,
      },
    },
    assetsInlineLimit: 4096,
    reportCompressedSize: false,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@heroicons/react/24/outline',
      '@heroicons/react/24/solid',
    ],
    exclude: ['framer-motion'],
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
})
