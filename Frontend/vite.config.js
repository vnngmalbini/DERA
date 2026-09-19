import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // pdfjs-dist is only ever reached via a lazy route (the Self Development
  // Library's PDF reader), so Vite's dev-server dependency scanner doesn't
  // discover it at startup — without this, the *first* book a youth opens
  // triggers an on-demand esbuild pass over it, stalling that request for
  // many seconds (and can even force a full-page reload mid-fetch). Listing
  // it here makes Vite pre-bundle it at server startup instead.
  optimizeDeps: {
    include: ['pdfjs-dist'],
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      devOptions: {
        // The dev-mode service worker runs the same Workbox NetworkFirst
        // caching on /api/* GETs as production, but `npm run dev` talks to
        // the Django server on a different origin/port than any built
        // deploy ever will — that combination makes the SW's fetch
        // interception fail outright on cross-origin GETs (e.g. login's
        // /api/auth/me/ call comes back net::ERR_FAILED), and any stale
        // cache from a previous backend port makes it worse. PWA behavior
        // should be verified against `vite build && vite preview` instead.
        enabled: false,
        type: 'module',
      },
      manifest: {
        name: 'DERA - Every Young Person Belongs Here',
        short_name: 'DERA',
        description:
          'Empowering rural Ghanaian youth with scholarships, mentorship, and career guidance.',
        theme_color: '#366800',
        background_color: '#fff8f6',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        lang: 'en',
        categories: ['education', 'lifestyle'],
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/admin/],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/lh3\.googleusercontent\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'remote-images',
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Same-origin or cross-origin PUBLIC API GET requests only: try
            // the network first (so data is always fresh when online) but
            // fall back to the last successful response on a flaky/offline
            // connection instead of a blank/broken screen.
            //
            // Deliberately excludes any request carrying an Authorization
            // header — nearly every /api/* GET a logged-in user makes
            // returns personal or otherwise sensitive data (their own
            // /auth/me/, notifications, a counselor's youth roster with
            // risk scores, quiz responses, donation history, ...), and
            // Cache Storage isn't cleared just because a user logs out.
            // Caching those would let a second person on a shared device
            // see the first person's data offline, or have it served back
            // to a *different* logged-in account. Public catalog data
            // (institutions, scholarships, the free-book library, ...) is
            // requested without a token and is exactly what this cache is
            // for.
            urlPattern: ({ url, request }) =>
              url.pathname.startsWith('/api/') && !request.headers.has('Authorization'),
            method: 'GET',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-get-responses',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
})
