import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/taller3-sustentacion/',
  plugins: [react(), tailwindcss()],
})
