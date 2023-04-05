import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    exclude: "*"
  })],
  server: {
    host: "172.26.82.56",
    port: 80
  },
  base: "http://172.26.82.56"
})
