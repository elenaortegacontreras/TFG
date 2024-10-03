import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: true,
    // host: '0.0.0.0'
    // open: true // Abre el navegador automáticamente
  },
})
