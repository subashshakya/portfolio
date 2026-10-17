import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves a project repo at /<repo>/. Override with BASE_PATH=/ for a custom domain or user site.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? (process.env.BASE_PATH ?? '/portfolio/') : '/',
  plugins: [react(), tailwindcss()],
}))
