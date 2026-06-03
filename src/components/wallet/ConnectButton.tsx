import { useAppKit } from '@reown/appkit/react'
import { Wallet } from 'lucide-react'
import { isWalletConfigured } from '../../config/wallet'
import { useWallet } from '../../hooks/useWallet'

const headerActionClass =
  'flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-md text-sm font-semibold text-white transition-colors'

export function ConnectButton() {
  const { open } = useAppKit()
  const { isConnected, shortAddress } = useWallet()

  if (!isWalletConfigured) {
    return (
      <span
        className="hidden sm:inline text-[10px] max-w-[120px] leading-tight text-white/80"
        title="Add VITE_REOWN_PROJECT_ID from cloud.reown.com"
      >
        Wallet N/A
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={() => open({ view: isConnected ? 'Account' : 'Connect' })}
      className={headerActionClass}
      aria-label={isConnected ? 'Wallet account' : 'Connect wallet'}
    >
      <Wallet className="size-4" />
      <span className="hidden sm:inline">{isConnected ? shortAddress : 'Connect'}</span>
    </button>
  )
}
