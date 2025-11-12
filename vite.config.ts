// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Anything starting with /api will be sent to port 5000
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        // remove /api prefix if your Express endpoint is /generate-course not /api/generate-course
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
})
