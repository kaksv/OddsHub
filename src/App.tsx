import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SlipProvider } from './context/SlipContext'
import { AppShell } from './components/layout/AppShell'
import { HomePage } from './pages/HomePage'
import { CategoryPage } from './pages/CategoryPage'
import { EventDetailPage } from './pages/EventDetailPage'
import { SearchPage } from './pages/SearchPage'

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
      <SlipProvider>
        <BrowserRouter>
          <AppShell>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/event/:slug" element={<EventDetailPage />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </AppShell>
        </BrowserRouter>
      </SlipProvider>
    </QueryClientProvider>
  )
}
