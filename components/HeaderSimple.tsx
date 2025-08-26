import { useAuth } from '../contexts/AuthContext';
import { UserMenuButton } from './user/UserMenuButton';
import { Button } from './ui/button';
import { LogIn } from 'lucide-react';
import { useState } from 'react';
import { AuthModals } from './auth/AuthModals';

export function Header() {
  const { isAuthenticated, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          {/* Logo e navegação existente */}
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Cookite" className="h-8" />
            {/* Sua navegação atual */}
          </div>

          {/* Adicionar menu do usuário aqui */}
          <div className="flex items-center gap-4">
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
            {/* Seus outros botões (carrinho, etc.) */}
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
