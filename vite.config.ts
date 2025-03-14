import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import replitThemePlugin from '@replit/vite-plugin-replit-theme-json'
import cartographer from '@replit/vite-plugin-cartographer'
import runtimeErrorModal from '@replit/vite-plugin-runtime-error-modal'

export default defineConfig({
  plugins: [react(), replitThemePlugin(), cartographer(), runtimeErrorModal()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    hmr: {
      clientPort: 443
    }
  }
})