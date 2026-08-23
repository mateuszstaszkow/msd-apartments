import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { copyFileSync, existsSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';

/**
 * GitHub Pages serves project sites from `/<repo>/`; the deploy workflow feeds
 * that in as BASE_PATH. Everything else (local dev, custom domain) sits at `/`.
 */
const base = `/${(process.env.BASE_PATH ?? '/').replace(/^\/|\/$/g, '')}/`.replace('//', '/');

/**
 * GitHub Pages has no SPA rewrite rule, so deep links such as `/apartments/zagiel`
 * hit the 404 handler. Shipping the app shell as 404.html makes the router pick
 * the URL up from there.
 */
function spaFallback(): Plugin {
  return {
    name: 'msd-spa-fallback',
    apply: 'build',
    closeBundle() {
      const dist = fileURLToPath(new URL('./dist/', import.meta.url));
      if (existsSync(`${dist}index.html`)) copyFileSync(`${dist}index.html`, `${dist}404.html`);
    },
  };
}

export default defineConfig({
  base,
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'logo.png', 'robots.txt'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webp,jpg,jpeg,woff2}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: `${base}index.html`,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/i\.ytimg\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'youtube-thumbnails',
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /\/apartments\/.*\.(?:png|jpg|jpeg|webp|avif)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'apartment-photos',
              expiration: { maxEntries: 160, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      manifest: {
        name: 'MSD Apartments — seaside apartments for rent & sale',
        short_name: 'MSD Apartments',
        description:
          'MSD Apartments handles property rental and selling in cities near the sea since 2019. Browse apartments in Koszalin (Baltic Sea) and Costa del Sol.',
        theme_color: '#0ea5e9',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: base,
        scope: base,
        lang: 'en',
        categories: ['travel', 'lifestyle', 'business'],
        icons: [
          { src: `${base}icons/icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: `${base}icons/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: `${base}icons/icon-maskable-512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        shortcuts: [
          { name: 'Catalogue', short_name: 'Catalogue', url: `${base}apartments` },
          { name: 'Contact', short_name: 'Contact', url: `${base}contact` },
        ],
      },
    }),
    spaFallback(),
  ],
  build: {
    target: 'es2020',
  },
});
