import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port:3000,
    // to get rid of the cors errors
    proxy:{
      "/api" : {
        target : "https://threads-clone-mern-egbgjmvv8-ayesha-328s-projects.vercel.app",
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
