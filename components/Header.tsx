import { ShoppingCart, Package } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

interface HeaderProps {
  currentPage: string
  onNavigate: (page: 'products' | 'cart' | 'checkout' | 'orders') => void
  onGoToCheckout: () => void
  onGoToOrders: () => void
  onShowAuth: () => void
}

export const Header = ({ currentPage, onNavigate, onGoToOrders, onShowAuth }: HeaderProps) => {
  const { user, profile, isAuthenticated, signOut } = useAuth()
  const { totalItems } = useCart()

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="container mx-auto px-3 py-3 flex items-center justify-between">
        {/* Logo / Marca */}
        <button onClick={() => onNavigate('products')} className="font-cookitie text-lg sm:text-xl">
          Cookitie
        </button>

        {/* Ações principais (mobile-first) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Carrinho simples (vai para página de carrinho) */}
          <button onClick={() => onNavigate('cart')} className={`relative p-2 rounded-xl border ${currentPage==='cart' ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`} aria-label="Abrir carrinho">
            <ShoppingCart size={18} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] leading-4 px-1 rounded">
                {totalItems}
              </span>
            )}
          </button>

          {/* Meus pedidos (somente autenticado) */}
          {isAuthenticated && (
            <button onClick={onGoToOrders} className={`hidden sm:inline-flex items-center gap-1 text-sm ${currentPage==='orders' ? 'text-blue-600' : 'text-gray-600'}`}>
              <Package size={16} /> Pedidos
            </button>
          )}

          {/* Login / Conta */}
          {isAuthenticated ? (
            <div className="relative">
              <button className="px-3 py-1.5 rounded-xl border border-gray-200 text-sm">
                {profile?.name || user?.email || 'Minha conta'}
              </button>
              {/* Para mobile-first mantemos simples; menu dropdown pode ser adicionado depois */}
              <button onClick={signOut} className="ml-2 text-sm text-gray-600 hover:text-red-600">
                Sair
              </button>
            </div>
          ) : (
            <button onClick={onShowAuth} className="btn-cookitie-primary text-sm px-3 py-1.5">
              Entrar 🍪
            </button>
          )}
        </div>
      </div>
    </header>
  )
}