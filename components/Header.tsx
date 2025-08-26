import { useAuth } from '../contexts/AuthContext';
import { UserMenuButton } from './user/UserMenuButton';
import { Button } from './ui/button';
import { LogIn, ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';
import { AuthModals } from './auth/AuthModals';

interface HeaderProps {
  onCartClick?: () => void;
  onFavoritesClick?: () => void;
  cartItemCount?: number;
}

export function Header({ onCartClick, onFavoritesClick, cartItemCount = 0 }: HeaderProps) {
  const { isAuthenticated, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo e navegação existente */}
          <div className="flex items-center gap-6">
            <img src="/logo.png" alt="Cookite" className="h-8" />
            
            {/* Navegação principal */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#home" className="text-gray-700 hover:text-[var(--color-cookite-blue)] transition-colors">
                Início
              </a>
              <a href="#products" className="text-gray-700 hover:text-[var(--color-cookite-blue)] transition-colors">
                Produtos
              </a>
              <a href="#about" className="text-gray-700 hover:text-[var(--color-cookite-blue)] transition-colors">
                Sobre
              </a>
              <a href="#contact" className="text-gray-700 hover:text-[var(--color-cookite-blue)] transition-colors">
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
              className="text-gray-700 hover:text-red-500 hover:bg-red-50"
            >
              <Heart className="h-5 w-5" />
              <span className="sr-only">Favoritos</span>
            </Button>

            {/* Carrinho */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onCartClick}
              className="text-gray-700 hover:text-[var(--color-cookite-blue)] hover:bg-blue-50 relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
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
                    onOrdersClick={() => {
                      // Implementar navegação para pedidos
                      console.log('Ir para pedidos');
                    }}
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
                    variant="outline"
                    className="text-[var(--color-cookite-blue)] border-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue)] hover:text-white transition-colors"
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
