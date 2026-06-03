import { useState, type ReactNode } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { BetSlip } from './BetSlip'
import { ProxyBanner } from './ProxyBanner'

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-dvh flex flex-col">
      <Header onMenuClick={() => setMenuOpen(true)} />
      <div className="flex flex-1 max-w-[1600px] w-full mx-auto">
        <Sidebar mobileOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        <main className="flex-1 min-w-0 p-3 sm:p-4 pb-20 xl:pb-4">
          <ProxyBanner />
          {children}
        </main>
        <BetSlip />
      </div>
    </div>
  )
}
