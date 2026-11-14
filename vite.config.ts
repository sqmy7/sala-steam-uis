import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages serves this site under /sala-steam-uis/, not at the domain root.
export default defineConfig({
  base: '/sala-steam-uis/',
  plugins: [react(), tailwindcss()],
})
