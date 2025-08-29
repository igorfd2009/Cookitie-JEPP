import { ShoppingCart, User, Package } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

interface HeaderProps {
  currentPage: string
  onNavigate: (page: 'products' | 'cart' | 'checkout' | 'orders') => void
  onGoToCheckout: () => void
  onGoToOrders: () => void
  onShowAuth: () => void
}

export const Header = ({ currentPage, onNavigate, onGoToCheckout, onGoToOrders, onShowAuth }: HeaderProps) => {
  const { user, isAuthenticated, signOut } = useAuth()
  const { totalItems, totalPrice } = useCart()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="text-2xl font-bold text-purple-600 cursor-pointer"
            onClick={() => onNavigate('products')}
          >
            Cookitie JEPP
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => onNavigate('products')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentPage === 'products' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Produtos
            </button>
            
            {isAuthenticated && (
              <button
                onClick={onGoToOrders}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentPage === 'orders' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                Meus Pedidos
              </button>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Cart Total */}
            {totalItems > 0 && (
              <div className="hidden md:block">
                <button
                  onClick={onGoToCheckout}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  R$ {totalPrice.toFixed(2)}
                </button>
              </div>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-purple-600">
                  <User size={20} />
                  <span className="hidden md:block">{user?.name}</span>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="py-2">
                    <button
                      onClick={onGoToOrders}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <Package size={16} className="mr-2" />
                      Meus Pedidos
                    </button>
                    <button
                      onClick={signOut}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={onShowAuth}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}