import { useState, useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Products } from './components/Products'
import { BottomSection } from './components/BottomSection'
import { Cart } from './components/Cart'
import { Checkout } from './components/Checkout'
import { MyOrders } from './components/MyOrders'
import { AuthModal } from './components/AuthModal'
import { Footer } from './components/Footer'
import { FlavorsPage } from './components/FlavorsPage'
import { useAuth } from './contexts/AuthContext'
import { Toaster } from 'sonner'
import './styles/globals.css'
import { Admin } from './components/Admin'
import { CookitieBreadcrumb } from './components/CookitieBreadcrumb'

type Page = 'products' | 'cart' | 'checkout' | 'orders' | 'admin' | 'flavors'

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

  // Scroll para o topo quando mudar de página
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

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
        return (
          <>
            <Hero onGoToCheckout={handleGoToCheckout} />
            <Products onNavigateToFlavors={() => setCurrentPage('flavors')} />
            <BottomSection />
          </>
        )
      case 'cart':
        return <Cart onGoToCheckout={handleGoToCheckout} onBackToProducts={() => setCurrentPage('products')} />
      case 'checkout':
        return <Checkout onOrderComplete={() => setCurrentPage('orders')} onBackToCart={() => setCurrentPage('cart')} />
      case 'orders':
        return <MyOrders onBackToProducts={() => setCurrentPage('products')} />
      case 'flavors':
        return <FlavorsPage onBackToProducts={() => setCurrentPage('products')} />
      case 'admin':
        return <Admin onBackToProducts={() => setCurrentPage('products')} />
      default:
        return (
          <>
            <Hero onGoToCheckout={handleGoToCheckout} />
            <Products onNavigateToFlavors={() => setCurrentPage('flavors')} />
            <BottomSection />
          </>
        )
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDFAF5' }}>
      {currentPage !== 'admin' && (
        <Header 
          currentPage={currentPage}
          onNavigate={(page) => {
            console.log('🔄 [HEADER] Navegando para:', page)
            setCurrentPage(page as Page)
          }}
          onGoToOrders={handleGoToOrders}
          onShowAuth={() => setShowAuthModal(true)}
        />
      )}
      
      {/* Breadcrumb Navigation */}
      {currentPage !== 'admin' && currentPage !== 'products' && (
        <CookitieBreadcrumb currentPage={currentPage} onNavigate={setCurrentPage} />
      )}
      
      <main>
        {renderPage()}
      </main>


      {currentPage !== 'admin' && <Footer showFullContent={currentPage === 'products' || currentPage === 'flavors'} />}

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAdminLogin={() => {
          console.log('🎯 App.tsx: Recebeu chamada onAdminLogin!')
          console.log('🎯 Mudando página para: admin')
          setCurrentPage('admin')
          console.log('🎯 Página alterada!')
        }}
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