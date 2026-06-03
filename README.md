# OddsHub

Prediction markets browser with a BetPawa-inspired UI. Read-only MVP powered by the [Polymarket Gamma API](https://docs.polymarket.com).

## Why a proxy?

Polymarket’s API does **not** send CORS headers. Browsers cannot call `gamma-api.polymarket.com` directly. OddsHub runs a **local proxy** that forwards requests server-side.

## Development

```bash
cd OddsHub
npm install
npm run dev
```

This starts **two processes**:

1. **Gamma proxy** — `http://127.0.0.1:8787` (`server/gamma-proxy.mjs`)
2. **Vite app** — usually `http://localhost:5173`

Open the Vite URL shown in the terminal.

### Health check

```bash
curl http://127.0.0.1:8787/health
# {"ok":true,"gamma":"https://gamma-api.polymarket.com","status":200}
```

### If markets still don’t load

1. Stop all old terminals (`Ctrl+C`), then run `npm run dev` again.
2. Confirm the proxy is up: `curl http://127.0.0.1:8787/health`
3. If health fails, your network may block `gamma-api.polymarket.com` (VPN/firewall/DNS).
4. Run proxy alone for logs: `npm run proxy`
5. Run UI only (proxy must already be running): `npm run dev:web`

## Production build

```bash
npm run build
npm run preview   # also starts the gamma proxy
```

For real deployment, host `server/gamma-proxy.mjs` (or equivalent) and route `/api/gamma` to it.

## Disclaimer

OddsHub displays public data from Polymarket. Not affiliated with Polymarket or BetPawa. No real trading in this app.
