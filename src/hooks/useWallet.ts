import { useAccount, useChainId, useDisconnect } from 'wagmi'
import { polygon } from 'viem/chains'

export function useWallet() {
  const { address, isConnected, isConnecting, isReconnecting, connector } = useAccount()
  const chainId = useChainId()
  const { disconnect } = useDisconnect()

  const isPolygon = chainId === polygon.id

  return {
    address,
    isConnected,
    isConnecting: isConnecting || isReconnecting,
    connector,
    chainId,
    isPolygon,
    disconnect,
    shortAddress: address
      ? `${address.slice(0, 6)}…${address.slice(-4)}`
      : undefined,
  }
}
