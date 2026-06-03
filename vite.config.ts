import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { polymarketApiProxy } from './vite.polymarket-proxy'

const PROXY_PORT = 8787

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_API_PROXY ?? `http://127.0.0.1:${PROXY_PORT}`

  const apiProxy = { target: proxyTarget, changeOrigin: true }

  return {
    plugins: [react(), tailwindcss(), polymarketApiProxy()],
    server: {
      proxy: {
        '/api/gamma': apiProxy,
        '/api/clob': apiProxy,
        '/api/data': apiProxy,
        '/api/kalshi': apiProxy,
      },
    },
    preview: {
      proxy: {
        '/api/gamma': apiProxy,
        '/api/clob': apiProxy,
        '/api/data': apiProxy,
        '/api/kalshi': apiProxy,
      },
    },
  }
})
