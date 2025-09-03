import { Minus, Plus, Trash2, ShoppingBag, Heart } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

interface CartProps {
  onGoToCheckout: () => void
}

export const Cart = ({ onGoToCheckout }: CartProps) => {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={48} className="text-blue-400" />
        </div>
        <h2 className="font-cookitie text-3xl font-bold text-gray-900 mb-3">
          Seu carrinho está vazio
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Adicione alguns cookies deliciosos para continuar! 🍪
        </p>
        <div className="inline-flex items-center gap-2 text-blue-500">
          <Heart size={20} className="text-red-400" />
          <span className="font-medium">Que tal experimentar nossos queridinhos?</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header do Carrinho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-cookitie text-4xl font-bold text-gray-900 mb-2">
            🛒 Seu Carrinho
          </h1>
          <p className="text-gray-600">
            {totalItems} {totalItems === 1 ? 'item delicioso' : 'itens deliciosos'} selecionados
          </p>
        </div>
        <button
          onClick={clearCart}
          className="flex items-center gap-2 px-4 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300"
        >
          <Trash2 size={16} />
          <span className="font-medium">Limpar carrinho</span>
        </button>
      </div>

      {/* Lista de Itens */}
      <div className="cookitie-card space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center p-6 border-b border-blue-100 last:border-b-0">
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-2xl shadow-sm"
            />
            
            <div className="flex-1 ml-6">
              <h3 className="font-cookitie text-xl font-semibold text-gray-900 mb-1">{item.name}</h3>
              <p className="text-blue-600 font-bold text-lg">
                R$ {item.price.toFixed(2)}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-blue-50 rounded-full p-1">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-white text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors shadow-sm"
                >
                  <Minus size={16} />
                </button>
                
                <span className="w-12 text-center font-bold text-gray-900 text-lg">
                  {item.quantity}
                </span>
                
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-white text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors shadow-sm"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="ml-6 text-right">
              <p className="font-bold text-gray-900 text-lg mb-2">
                R$ {(item.price * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Resumo e Finalizar */}
      <div className="cookitie-card p-8">
        <div className="flex items-center justify-between text-2xl font-bold mb-6">
          <span className="text-gray-800">Total do Pedido:</span>
          <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent font-cookitie text-3xl">
            R$ {totalPrice.toFixed(2)}
          </span>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-2xl p-4 mb-6">
          <p className="text-center text-gray-700">
            <span className="font-cookitie font-medium">🎉</span> Você está prestes a experimentar os melhores doces da Cookitie! 
            <span className="font-cookitie font-medium">✨</span>
          </p>
        </div>
        
        <button
          onClick={onGoToCheckout}
          className="w-full btn-cookitie-primary py-4 text-lg font-cookitie text-xl hover:scale-105 transition-transform duration-300"
        >
          🍪 Finalizar Pedido com PIX
        </button>
      </div>
    </div>
  )
}
