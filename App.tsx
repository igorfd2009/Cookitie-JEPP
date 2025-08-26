import { Topbar } from './components/Topbar';
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
import { useState, useCallback } from 'react';

// Sistema de Autenticação
import { AuthProvider } from './contexts/AuthContext';
import { AuthDebug } from './components/AuthDebug';
import { LoginStatus } from './components/LoginStatus';

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
  maxStock: number;
}

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'products' | 'checkout'>('products');

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
    setCurrentPage('checkout');
  }, []);

  const handleBackToProducts = useCallback(() => {
    setCurrentPage('products');
  }, []);



  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <AuthProvider>
      <div className="min-h-screen">
        {/* Fixed Topbar */}
        <Topbar />
        
        {/* Main Content */}
        <main>
          {currentPage === 'products' ? (
            <>
                      {/* Hero Section */}
          <Hero onGoToCheckout={handleGoToCheckout} />
              
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
          ) : (
            /* Checkout Page */
            <ClientProvider>
              <CheckoutPage
                cartItems={cartItems}
                onClearCart={clearCart}
                onBackToProducts={handleBackToProducts}
              />
            </ClientProvider>
          )}


        </main>

        {/* Sticky Mobile CTA */}
        <ClientProvider>
          <StickyMobileCTA currentPage={currentPage} onGoToCheckout={handleGoToCheckout} />
        </ClientProvider>

        {/* Status de Login */}
        <ClientProvider>
          <div className="container mx-auto px-4 py-6">
            <LoginStatus />
          </div>
        </ClientProvider>

        {/* Debug do Sistema de Autenticação */}
        <ClientProvider>
          <AuthDebug />
        </ClientProvider>

        {/* Admin Dashboard */}
        <ClientProvider>
          <AdminDashboard />
        </ClientProvider>

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
      </div>
    </AuthProvider>
  );
}