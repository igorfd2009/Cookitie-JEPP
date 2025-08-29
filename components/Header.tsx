import { ShoppingCart, Package, Heart } from 'lucide-react'
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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100 shadow-sm">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo Cookitie */}
          <div 
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group"
            onClick={() => onNavigate('products')}
          >
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-200 to-yellow-200 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <span className="text-lg sm:text-2xl">🍪</span>
              </div>
              <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-yellow-300 to-pink-300 rounded-full animate-pulse"></div>
            </div>
            <div className="hidden xs:block sm:block">
              <h1 className="font-cookitie text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                Cookitie
              </h1>
              <p className="text-xs text-gray-500 font-medium hidden sm:block">Projeto JEPP</p>
            </div>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => onNavigate('products')}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                currentPage === 'products' 
                  ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Produtos
            </button>
            
            {isAuthenticated && (
              <button
                onClick={onGoToOrders}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                  currentPage === 'orders' 
                    ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 shadow-sm' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Package size={16} />
                Meus Pedidos
              </button>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Cart Button */}
            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 sm:p-3 text-gray-600 hover:text-blue-600 transition-colors bg-white hover:bg-blue-50 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md"
            >
              <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
              {totalItems > 0 && (
                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-bounce">
                  {totalItems}
                </div>
              )}
            </button>

            {/* Cart Total - Desktop Only */}
            {totalItems > 0 && (
              <div className="hidden lg:block">
                <button
                  onClick={onGoToCheckout}
                  className="btn-cookitie-secondary flex items-center gap-2 font-cookitie text-sm"
                >
                  <Heart size={14} className="text-red-400" />
                  R$ {totalPrice.toFixed(2)}
                </button>
              </div>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 sm:space-x-2 p-2 sm:p-3 text-gray-600 hover:text-blue-600 bg-white hover:bg-blue-50 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden lg:block font-medium font-cookitie text-sm">{user?.name}</span>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 font-cookitie">Olá, {user?.name}! 👋</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={onGoToOrders}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <Package size={16} className="mr-2" />
                      Meus Pedidos
                    </button>
                    <button
                      onClick={signOut}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <span className="mr-2">👋</span>
                      Sair
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={onShowAuth}
                className="btn-cookitie-primary font-cookitie text-sm px-3 py-2 sm:px-4 sm:py-2"
              >
                <span className="hidden sm:inline">Entrar 🍪</span>
                <span className="sm:hidden">🍪</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-3 flex justify-center space-x-2 overflow-x-auto">
          <button
            onClick={() => onNavigate('products')}
            className={`px-3 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
              currentPage === 'products' 
                ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            🍪 Produtos
          </button>
          {isAuthenticated && (
            <button
              onClick={onGoToOrders}
              className={`px-3 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                currentPage === 'orders' 
                  ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              📦 Meus Pedidos
            </button>
          )}
          {totalItems > 0 && (
            <button
              onClick={onGoToCheckout}
              className="px-3 py-2 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-800 whitespace-nowrap"
            >
              💳 R$ {totalPrice.toFixed(2)}
            </button>
          )}
        </div>
      </div>

      {/* Elementos decorativos */}
      <div className="absolute top-0 left-1/4 w-20 h-20 cookitie-blob pointer-events-none"></div>
      <div className="absolute top-0 right-1/3 w-16 h-16 cookitie-blob-2 pointer-events-none"></div>
    </header>
  )
}