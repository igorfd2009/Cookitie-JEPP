import { useState, useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { Header } from './components/Header'
import { Products } from './components/Products'
import { Cart } from './components/Cart'
import { Checkout } from './components/Checkout'
import { MyOrders } from './components/MyOrders'
import { Admin } from './components/Admin'
import { AuthModal } from './components/AuthModal'
import { Footer } from './components/Footer'
import { useAuth } from './contexts/AuthContext'
import { Toaster } from 'sonner'
import './styles/globals.css'
import { StickyMobileCTA } from './components/StickyMobileCTA'

type Page = 'products' | 'cart' | 'checkout' | 'orders' | 'admin'

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('products')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { isAuthenticated } = useAuth()

  // Verificar se é rota de admin
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const isAdmin = urlParams.get('admin') === 'true' || 
                   window.location.pathname.includes('/admin') ||
                   window.location.hash.includes('admin')
    
    if (isAdmin) {
      setCurrentPage('admin')
    }
  }, [])

  const handleGoToCheckout = () => {
    console.log('Tentando ir para checkout, autenticado:', isAuthenticated)
    if (!isAuthenticated) {
      console.log('Usuário não autenticado, abrindo modal')
      setShowAuthModal(true)
      return
    }
    console.log('Navegando para checkout')
    setCurrentPage('checkout')
  }

  const handleGoToOrders = () => {
    console.log('Tentando ir para pedidos, autenticado:', isAuthenticated)
    if (!isAuthenticated) {
      console.log('Usuário não autenticado, abrindo modal')
      setShowAuthModal(true)
      return
    }
    console.log('Navegando para pedidos')
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
        return <MyOrders onBackToProducts={() => setCurrentPage('products')} />
      case 'admin':
        return <Admin onBackToProducts={() => setCurrentPage('products')} />
      default:
        return <Products />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage !== 'admin' && (
        <Header 
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onGoToCheckout={handleGoToCheckout}
          onGoToOrders={handleGoToOrders}
          onShowAuth={() => setShowAuthModal(true)}
        />
      )}
      
      <main className="container mx-auto px-4 py-8">
        {renderPage()}
      </main>

      {/* CTA móvel fixo para conversão em mobile */}
      <StickyMobileCTA currentPage={currentPage} onGoToCheckout={handleGoToCheckout} />

      {currentPage !== 'admin' && <Footer />}

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