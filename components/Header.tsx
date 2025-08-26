import { useAuth } from '../contexts/AuthContext';
import { UserMenuButton } from './user/UserMenuButton';
import { Button } from './ui/button';
import { LogIn, ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';
import { AuthModals } from './auth/AuthModals';

interface HeaderProps {
  onCartClick?: () => void;
  onFavoritesClick?: () => void;
  onOrdersClick?: () => void;
  cartItemCount?: number;
}

export function Header({ onCartClick, onFavoritesClick, onOrdersClick, cartItemCount = 0 }: HeaderProps) {
  const { isAuthenticated, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  return (
    <>
      <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo e navegação existente */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[var(--color-cookite-blue)] to-[var(--color-cookite-yellow)] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[var(--color-cookite-blue)] to-[var(--color-cookite-yellow)] bg-clip-text text-transparent">
                Cookite
              </span>
            </div>
            
            {/* Navegação principal */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#home" className="text-gray-700 hover:text-[var(--color-cookite-blue)] transition-colors font-medium">
                Início
              </a>
              <a href="#products" className="text-gray-700 hover:text-[var(--color-cookite-blue)] transition-colors font-medium">
                Produtos
              </a>
              {isAuthenticated && (
                <button 
                  onClick={onOrdersClick}
                  className="text-gray-700 hover:text-[var(--color-cookite-blue)] transition-colors font-medium"
                >
                  Meus Pedidos
                </button>
              )}
              <a href="#about" className="text-gray-700 hover:text-[var(--color-cookite-blue)] transition-colors font-medium">
                Sobre
              </a>
              <a href="#contact" className="text-gray-700 hover:text-[var(--color-cookite-blue)] transition-colors font-medium">
                Contato
              </a>
            </nav>
          </div>

          {/* Menu do usuário e ações */}
          <div className="flex items-center gap-4">
            {/* Botões de ação */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onFavoritesClick}
              className="text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-full p-2 transition-all duration-300 hover:shadow-md"
            >
              <Heart className="h-5 w-5" />
              <span className="sr-only">Favoritos</span>
            </Button>

            {/* Carrinho */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onCartClick}
              className="text-gray-700 hover:text-[var(--color-cookite-blue)] hover:bg-blue-50 relative rounded-full p-2 transition-all duration-300 hover:shadow-md"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
              <span className="sr-only">Carrinho</span>
            </Button>

            {/* Separador */}
            <div className="w-px h-6 bg-gray-300"></div>

            {/* Sistema de Autenticação */}
            {!loading && (
              <>
                {isAuthenticated ? (
                  // Usuário logado - mostrar menu do usuário
                  <UserMenuButton 
                    onProfileClick={() => {
                      // Implementar navegação para perfil
                      console.log('Ir para perfil');
                    }}
                    onOrdersClick={onOrdersClick}
                    onFavoritesClick={() => {
                      // Implementar navegação para favoritos
                      console.log('Ir para favoritos');
                    }}
                  />
                ) : (
                  // Usuário não logado - mostrar botão de login
                  <Button
                    onClick={handleAuthClick}
                    size="sm"
                    className="bg-gradient-to-r from-[var(--color-cookite-blue)] to-[var(--color-cookite-yellow)] text-white hover:from-[var(--color-cookite-blue-hover)] hover:to-[var(--color-cookite-yellow)] transition-all duration-300 rounded-full px-6 py-2 font-semibold shadow-lg hover:shadow-xl"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Entrar
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Modal de Autenticação */}
      <AuthModals
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="login"
      />
    </>
  );
}
