import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      'https://phase4project-xp0u.onrender.com': {
        target: 'https://phase4project-xp0u.onrender.com',
        changeOrigin: true,

      }
    }
  }
})