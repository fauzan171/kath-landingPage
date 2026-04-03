import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './contexts/LanguageContext.tsx'
import { SessionProvider } from './components/SessionProvider.tsx'

/**
 * Note: AuthProvider from AuthContext.tsx has been removed.
 * Authentication now uses Supabase Auth via useAuth hook from '@/hooks/useAuth'.
 * The AuthContext.tsx is deprecated and will be removed in a future version.
 */

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <SessionProvider>
          <App />
        </SessionProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
