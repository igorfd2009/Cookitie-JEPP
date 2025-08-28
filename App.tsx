import './styles/theme.css';
import { Topbar } from './components/Topbar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CountdownTimer } from './components/CountdownTimer';
import { Products } from './components/Products';

import { CheckoutPage } from './components/CheckoutPage';

import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { StickyMobileCTA } from './components/StickyMobileCTA';
import { AdminDashboard } from './components/AdminDashboard';

import { ClientProvider } from './components/ClientProvider';
import { ShoppingCartModal, FloatingCartButton } from './components/ShoppingCart';
import { Toaster } from "sonner";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useCallback, useEffect } from 'react';

// Sistema de Autenticação
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppStateProvider } from './contexts/AppStateContext';
// (Removido) Componentes de teste de autenticação
import { MyOrders } from './components/orders/MyOrders';
import { AuthModals } from './components/auth/AuthModals';
import { NotificationSystem } from './components/ui/NotificationSystem';
import { SystemDiagnostic } from './components/SystemDiagnostic';

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
  maxStock: number;
}

function AppContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'products' | 'checkout' | 'orders' | 'diagnostic'>('products');
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [nextPageAfterAuth, setNextPageAfterAuth] = useState<null | 'checkout' | 'orders'>(null);

  const addToCart = useCallback((product: any) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Se o item já existe, aumenta a quantidade
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, item.maxStock) }
            : item
        );
      } else {
        // Se é um novo item, adiciona ao carrinho
        return [...prevItems, {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          quantity: 1,
          image: product.image,
          maxStock: product.stock
        }];
      }
    });
  }, []);

  const updateCartItemQuantity = useCallback((id: string, quantity: number) => {
    setCartItems(prevItems => {
      if (quantity === 0) {
        return prevItems.filter(item => item.id !== id);
      }
      return prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
    });
  }, []);

  const removeCartItem = useCallback((id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const handleCheckout = useCallback(() => {
    // Fechar o carrinho e ir para a página de checkout
    closeCart();
    setCurrentPage('checkout');
  }, [closeCart]);

  const handleGoToCheckout = useCallback(() => {
    if (!isAuthenticated) {
      setNextPageAfterAuth('checkout');
      setShowAuthModal(true);
      return;
    }
    setCurrentPage('checkout');
  }, [isAuthenticated]);

  const handleBackToProducts = useCallback(() => {
    setCurrentPage('products');
  }, []);

  const handleGoToOrders = useCallback(() => {
    if (!isAuthenticated) {
      setNextPageAfterAuth('orders');
      setShowAuthModal(true);
      return;
    }
    setCurrentPage('orders');
  }, [isAuthenticated]);

  const handleGoToDiagnostic = useCallback(() => {
    setCurrentPage('diagnostic');
  }, []);

  // Navegar automaticamente após autenticação
  useEffect(() => {
    if (isAuthenticated && nextPageAfterAuth) {
      setCurrentPage(nextPageAfterAuth);
      setNextPageAfterAuth(null);
      setShowAuthModal(false);
    }
  }, [isAuthenticated, nextPageAfterAuth]);

  // Verificar se deve abrir diagnóstico via URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('diagnostic') === 'true') {
      setCurrentPage('diagnostic');
    }
  }, []);



  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
      <div className="min-h-screen">
        {/* Fixed Topbar */}
        <Topbar onGoToCheckout={handleGoToCheckout} onGoToOrders={handleGoToOrders} hasItemsInCart={cartItemCount > 0} />
        <Header 
          onCartClick={openCart} 
          onOrdersClick={handleGoToOrders}
          cartItemCount={cartItemCount} 
        />
        
        {/* Main Content */}
        <main>
          {currentPage === 'products' ? (
            <>
                      {/* Hero Section */}
          <Hero onGoToCheckout={handleGoToCheckout} hasItemsInCart={cartItemCount > 0} />
              
              {/* Countdown Timer */}
              <div className="py-6 md:py-8">
                <CountdownTimer />
              </div>
              
              {/* Products Section */}
              <Products 
                onAddToCart={addToCart}
                onOpenCart={openCart}
                onGoToCheckout={handleGoToCheckout}
                cartItemCount={cartItemCount}
              />
              

              

              
              {/* FAQ Section */}
              <FAQ />
              
                      {/* Footer */}
          <Footer onGoToCheckout={handleGoToCheckout} />
            </>
          ) : currentPage === 'checkout' ? (
            /* Checkout Page */
            <ClientProvider>
              <CheckoutPage
                cartItems={cartItems}
                onClearCart={clearCart}
                onBackToProducts={handleBackToProducts}
                onGoToOrders={handleGoToOrders}
              />
            </ClientProvider>
          ) : currentPage === 'orders' ? (
            /* Orders Page */
            <MyOrders onBackToProducts={handleBackToProducts} />
          ) : (
            /* System Diagnostic Page */
            <SystemDiagnostic />
          )}


        </main>

        {/* Sticky Mobile CTA */}
        <ClientProvider>
          <StickyMobileCTA currentPage={currentPage} onGoToCheckout={handleGoToCheckout} />
        </ClientProvider>

        {/* Debug da Autenticação - removido em produção */}



        {/* Admin Dashboard - habilitar via VITE_ENABLE_ADMIN=true */}
        {import.meta.env.VITE_ENABLE_ADMIN === 'true' && (
          <ClientProvider>
            <AdminDashboard />
          </ClientProvider>
        )}

        {/* Diagnostic Access - habilitar via ?diagnostic=true na URL ou modo dev */}
        {(import.meta.env.DEV || new URLSearchParams(window.location.search).get('diagnostic') === 'true') && (
          <div className="fixed bottom-4 left-4 z-50">
            <button
              onClick={handleGoToDiagnostic}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg"
            >
              🔧 Diagnóstico
            </button>
          </div>
        )}

        {/* Shopping Cart Modal */}
        <ShoppingCartModal
          items={cartItems}
          onUpdateQuantity={updateCartItemQuantity}
          onRemoveItem={removeCartItem}
          onClearCart={clearCart}
          onCheckout={handleCheckout}
          isOpen={isCartOpen}
          onClose={closeCart}
        />

        {/* Floating Cart Button */}
        <FloatingCartButton
          itemCount={cartItemCount}
          onClick={openCart}
          totalPrice={cartTotalPrice}
          currentPage={currentPage}
        />

        {/* Toast Notifications */}
        <Toaster 
          position="top-right"
          expand={true}
          richColors
          closeButton
        />
        <ToastContainer position="top-right" autoClose={3000} newestOnTop hideProgressBar={false} />
        {/* Modal de Autenticação Global */}
        <AuthModals
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultTab="login"
        />
      </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppStateProvider>
        <AppContent />
        <NotificationSystem />
      </AppStateProvider>
    </AuthProvider>
  );
}