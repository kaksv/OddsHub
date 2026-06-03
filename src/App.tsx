import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Web3Provider } from './providers/Web3Provider'
import { SlipProvider } from './context/SlipContext'
import { FilterProvider } from './context/FilterContext'
import { ThemeProvider } from './context/ThemeContext'
import { WatchlistProvider } from './context/WatchlistContext'
import { AppShell } from './components/layout/AppShell'
import { HomePage } from './pages/HomePage'
import { CategoryPage } from './pages/CategoryPage'
import { EventDetailPage } from './pages/EventDetailPage'
import { SearchPage } from './pages/SearchPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { PortfolioPage } from './pages/PortfolioPage'
import { SettingsPage } from './pages/SettingsPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
      <ThemeProvider>
        <FilterProvider>
          <WatchlistProvider>
            <SlipProvider>
              <BrowserRouter>
                <AppShell>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/category/:slug" element={<CategoryPage />} />
                    <Route path="/event/:source/:slug" element={<EventDetailPage />} />
                    <Route
                      path="/event/:slug"
                      element={<EventDetailPage legacyPolymarket />}
                    />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/portfolio" element={<PortfolioPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </AppShell>
              </BrowserRouter>
            </SlipProvider>
          </WatchlistProvider>
        </FilterProvider>
      </ThemeProvider>
      </Web3Provider>
    </QueryClientProvider>
  )
}
