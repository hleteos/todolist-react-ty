import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Configuración del proxy para la API de colores - solo en desarrollo y no en producción. Configurar un proxy en el backend. 
      '/colors-api': {
        target: 'https://x-colors.herokuapp.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/colors-api/, ''),
        secure: false,
      }
    }
  }
})