import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { polymarketApiProxy } from './vite.polymarket-proxy'

const PROXY_PORT = 8787

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_GAMMA_PROXY ?? `http://127.0.0.1:${PROXY_PORT}`

  return {
    plugins: [react(), tailwindcss(), polymarketApiProxy()],
    server: {
      proxy: {
        '/api/gamma': {
          target: proxyTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/gamma/, ''),
        },
      },
    },
    preview: {
      proxy: {
        '/api/gamma': {
          target: proxyTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/gamma/, ''),
        },
      },
    },
  }
})
