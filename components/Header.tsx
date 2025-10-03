import { ShoppingCart, Package } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { usePocketBaseOrders } from '../hooks/usePocketBaseOrders'

interface HeaderProps {
  currentPage: string
  onNavigate: (page: 'products' | 'cart' | 'checkout' | 'orders' | 'flavors') => void
  onGoToOrders: () => void
  onShowAuth: () => void
}

export const Header = ({ onNavigate, onShowAuth }: HeaderProps) => {
  const { user, profile, isAuthenticated, signOut } = useAuth()
  const { totalItems } = useCart()
  const { orders } = usePocketBaseOrders()

  return (
    <header className="py-3 sm:py-4 flex items-center justify-between px-4 sm:px-6" style={{ backgroundColor: '#D1EAED', borderBottom: currentPage === 'products' ? 'none' : '3px solid #FDF1C3' }}>
        {/* Logo Cookittie */}
        <button 
          onClick={() => onNavigate('products')} 
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          title="Voltar à página inicial"
        >
          <img 
            src="/imagens/logo-1.png" 
            alt="Cookittie Logo" 
            className="h-12 sm:h-16 w-auto"
            onError={(e) => {
              console.log('Erro ao carregar logo-1.png');
              e.currentTarget.style.display = 'none';
            }}
          />
        </button>

        {/* Ações do lado direito */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Meus Pedidos - só aparece se o usuário tiver pedidos */}
          {isAuthenticated && orders.length > 0 && (
            <button 
              onClick={() => onNavigate('orders')} 
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-700 hover:text-blue-600 transition-all duration-300 ease-in-out touch-target px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-100"
              style={{ minHeight: '44px' }}
            >
              <Package size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Meus Pedidos</span>
              <span className="sm:hidden">Pedidos</span>
            </button>
          )}

          {/* Carrinho */}
          <button 
            onClick={() => onNavigate('cart')} 
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-in-out touch-target"
            style={{ minHeight: '44px', minWidth: '44px' }}
            aria-label="Abrir carrinho"
          >
            <ShoppingCart size={18} className="text-gray-700 sm:w-5 sm:h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* Botão Entrar */}
          {isAuthenticated ? (
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Avatar com iniciais */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-600 text-white rounded-lg flex items-center justify-center text-xs sm:text-sm font-semibold">
                {(() => {
                  const name = profile?.name || user?.email || 'Minha conta';
                  if (name === 'igor freitas dias') {
                    return 'IF';
                  }
                  const words = name.split(' ');
                  if (words.length >= 2) {
                    return (words[0][0] + words[1][0]).toUpperCase();
                  }
                  return name[0]?.toUpperCase() || 'U';
                })()}
              </div>
              <button onClick={signOut} className="text-xs sm:text-sm text-gray-600 hover:text-red-600 transition-all duration-300 ease-in-out touch-target" style={{ minHeight: '44px' }}>
                Sair
              </button>
            </div>
          ) : (
            <button 
              onClick={onShowAuth} 
              className="bg-black text-white text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-800 transition-all duration-300 ease-in-out touch-target"
              style={{ minHeight: '44px' }}
            >
              Entrar
            </button>
          )}
        </div>
    </header>
  )
}