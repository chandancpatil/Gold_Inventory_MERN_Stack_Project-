import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // This allows connections from all network interfaces
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 5173 // Ensures HMR works on network devices
    }
  }
})
