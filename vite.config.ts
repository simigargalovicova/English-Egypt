import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/**
 * GitHub Pages serves this repo from /English-Egypt/, so the production build
 * needs that prefix on its asset URLs. The dev server stays at / so
 * `npm run dev` is still just http://localhost:5173.
 *
 * Hosting at a domain root instead (Netlify, Vercel, your own server)?
 * Build with BASE_PATH=/ and the prefix goes away.
 */
export default defineConfig(({ command }) => ({
  base: process.env.BASE_PATH ?? (command === 'build' ? '/English-Egypt/' : '/'),
  plugins: [react()],
}))
