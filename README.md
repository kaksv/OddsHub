# OddsHub

Prediction markets hub with a BetPawa-inspired UI. Aggregates **Polymarket** and **Kalshi** with filters, live Polymarket prices, watchlist, and read-only portfolio.

## Features

- **Multi-source** — Polymarket + Kalshi (toggle in filters)
- **Live prices** — Polymarket CLOB midpoints (green dot on odds, 30s refresh)
- **Filters** — Min 24h volume, min liquidity, source toggles
- **Home tabs** — Trending (24h vol) vs High volume (total vol)
- **Watchlist** — Star markets, view on `/favorites`
- **Wallet connect** — Polygon via Reown AppKit + wagmi (header button)
- **Portfolio** — Auto-loads positions when wallet is connected
- **In-app trading** — Polymarket limit orders from the bet slip (CLOB, EOA wallets)
- **Dark mode** — Header toggle + `/settings`
- **Demo bet slip** — Selections only; trade on source site

## Stack

Vite · React · TypeScript · Tailwind · TanStack Query

## Development

```bash
npm install
cp .env.example .env.development   # then fill VITE_REOWN_PROJECT_ID
npm run dev
```

1. **API proxy** — `127.0.0.1:8787` (auto-started)
2. **Wallet** — free [Reown Cloud](https://dashboard.reown.com) project ID → `VITE_REOWN_PROJECT_ID` in `.env.development`

**Do not set `VITE_API_PROXY` on Vercel production.**

## Vercel deploy

1. Push the `OddsHub` folder as the repo root (or set Root Directory to `OddsHub`).
2. Framework: Vite — build `npm run build`, output `dist`.
3. **No env vars required** for production — `/api/*` serverless routes in `/api` proxy to Polymarket/Kalshi.
4. Do **not** copy `VITE_API_PROXY` from `.env.development` into Vercel.

## API routes (local + Vercel)

| Route | Upstream |
|-------|----------|
| `/api/gamma` | Polymarket Gamma |
| `/api/clob` | Polymarket CLOB |
| `/api/data` | Polymarket Data |
| `/api/kalshi` | Kalshi Trade API |

## Wallet stack

- **wagmi** — React hooks for Ethereum (no UI, no embedded wallets by itself)
- **Reown AppKit** — connect modal (MetaMask, WalletConnect, Coinbase, etc.)
- **Polygon only** — Polymarket chain

## Trading (Polymarket)

1. Connect wallet (Polygon)
2. Tap **Yes** / **No** on a Polymarket market
3. Set stake per order in the bet slip → **Place order(s)**

Uses `@polymarket/clob-client` with your wallet signature. API credentials are stored in **sessionStorage** only.

**Supported:** MetaMask / EOA wallets on Polygon with USDC balance on Polymarket.

**Not yet supported:** Polymarket proxy/Safe/deposit-wallet accounts — use polymarket.com for those.

Kalshi selections link out to kalshi.com.

## Coming soon

- Additional data sources
- Proxy/Safe wallet types for Polymarket

## Disclaimer

Not affiliated with Polymarket, Kalshi, or BetPawa. No real trading in OddsHub.
