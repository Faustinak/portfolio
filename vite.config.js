import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Works correctly whether the site is served at the root of a custom domain
// (faustinakoduah.com) OR at the interim GitHub Pages subpath
// (username.github.io/repo-name/). Set VITE_BASE_PATH during the GitHub
// Actions build to match wherever it's actually being hosted.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.VITE_BASE_PATH || '/',
})
