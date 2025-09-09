import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', // allow external access
    port: 5000,      // Replit usually maps 5000 → public URL
    strictPort: true, // fail if 5000 is taken (keeps it consistent)
    hmr: {
      clientPort: 443, // force HMR to use HTTPS
    },
    allowedHosts: ['.replit.dev'] // allow all Replit subdomains
  }
})
