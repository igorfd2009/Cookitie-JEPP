import { useState } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { Header } from './components/Header'
import { Products } from './components/Products'
import { Cart } from './components/Cart'
import { Checkout } from './components/Checkout'
import { MyOrders } from './components/MyOrders'
import { AuthModal } from './components/AuthModal'
import { useAuth } from './contexts/AuthContext'
import { Toaster } from 'sonner'
import './styles/globals.css'

type Page = 'products' | 'cart' | 'checkout' | 'orders'

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('products')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { isAuthenticated } = useAuth()

  const handleGoToCheckout = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    setCurrentPage('checkout')
  }

  const handleGoToOrders = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    setCurrentPage('orders')
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'products':
        return <Products />
      case 'cart':
        return <Cart onGoToCheckout={handleGoToCheckout} />
      case 'checkout':
        return <Checkout onOrderComplete={() => setCurrentPage('orders')} />
      case 'orders':
        return <MyOrders />
      default:
        return <Products />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onGoToCheckout={handleGoToCheckout}
        onGoToOrders={handleGoToOrders}
        onShowAuth={() => setShowAuthModal(true)}
      />
      
      <main className="container mx-auto px-4 py-8">
        {renderPage()}
      </main>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <Toaster position="top-right" />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  )
}