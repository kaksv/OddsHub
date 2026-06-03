import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { polygon, type AppKitNetwork } from '@reown/appkit/networks'

export const reownProjectId = import.meta.env.VITE_REOWN_PROJECT_ID as string | undefined

export const isWalletConfigured = Boolean(reownProjectId?.trim())

export const networks = [polygon] as [AppKitNetwork, ...AppKitNetwork[]]

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId: reownProjectId ?? 'placeholder-not-used',
  ssr: false,
})

export const wagmiConfig = wagmiAdapter.wagmiConfig

if (isWalletConfigured) {
  createAppKit({
    adapters: [wagmiAdapter],
    networks,
    projectId: reownProjectId!,
    defaultNetwork: polygon,
    metadata: {
      name: 'OddsHub',
      description: 'Prediction markets from Polymarket and Kalshi',
      url: typeof window !== 'undefined' ? window.location.origin : 'https://oddshub.vercel.app',
      icons: [
        typeof window !== 'undefined'
          ? `${window.location.origin}/favicon.svg`
          : 'https://oddshub.vercel.app/favicon.svg',
      ],
    },
    themeVariables: {
      '--w3m-accent': '#00a651',
      '--w3m-border-radius-master': '8px',
    },
    features: {
      analytics: false,
    },
  })
}
