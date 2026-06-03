import { useMutation } from '@tanstack/react-query'
import { useWalletClient, useSwitchChain } from 'wagmi'
import { polygon } from 'viem/chains'
import { useWallet } from './useWallet'
import { useSlip } from '../context/SlipContext'
import { createTradingClient, placeAllOrders } from '../lib/trading/clobClient'
import { canTradeSelection } from '../lib/trading/selection'

export function usePlaceOrders() {
  const { address, isConnected, isPolygon } = useWallet()
  const { data: walletClient } = useWalletClient()
  const { switchChainAsync } = useSwitchChain()
  const { selections } = useSlip()

  return useMutation({
    mutationFn: async (stakeUsd: number) => {
      if (!isConnected || !address) {
        throw new Error('Connect your wallet first.')
      }
      if (!walletClient) {
        throw new Error('Wallet client not ready — try reconnecting.')
      }
      if (!isPolygon) {
        await switchChainAsync({ chainId: polygon.id })
      }
      if (stakeUsd < 1) {
        throw new Error('Minimum stake is $1 per order.')
      }

      const tradable = selections.filter(canTradeSelection)
      if (!tradable.length) {
        throw new Error(
          'Only Polymarket markets with valid odds can be traded here. Remove Kalshi lines or pick Yes/No again.',
        )
      }

      const client = await createTradingClient(walletClient, address)
      return placeAllOrders(client, selections, stakeUsd)
    },
  })
}
