import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: ['.ngrok-free.dev', 'localhost', '127.0.0.1'],
    // Dev-only proxy when frontend calls /api locally.
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  preview: {
    host: true,
    allowedHosts: ['.ngrok-free.dev', 'localhost', '127.0.0.1'],
  },
})
