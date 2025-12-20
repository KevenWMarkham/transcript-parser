import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToastProvider } from '@/components/ui/toast'

// Initialize demo account if it doesn't exist
const initializeDemoAccount = () => {
  const users = JSON.parse(localStorage.getItem('app_users') || '[]')
  const demoExists = users.find(
    (u: { email: string }) => u.email === 'demo@example.com'
  )

  if (!demoExists) {
    const demoUser = {
      id: 1,
      email: 'demo@example.com',
      name: 'Demo User',
      createdAt: new Date().toISOString(),
      passwordHash: btoa('demo123'), // base64 encoded password
    }
    users.push(demoUser)
    localStorage.setItem('app_users', JSON.stringify(users))
    console.log('✅ Demo account initialized: demo@example.com / demo123')
  }
}

initializeDemoAccount()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>
)
