import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

interface CartProps {
  onGoToCheckout: () => void
}

export const Cart = ({ onGoToCheckout }: CartProps) => {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Seu carrinho está vazio
        </h2>
        <p className="text-gray-600">
          Adicione alguns cookies deliciosos para continuar!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Carrinho ({totalItems} {totalItems === 1 ? 'item' : 'itens'})
        </h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 flex items-center gap-2"
        >
          <Trash2 size={16} />
          Limpar carrinho
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        {items.map((item) => (
          <div key={item.id} className="flex items-center p-4 border-b last:border-b-0">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            
            <div className="flex-1 ml-4">
              <h3 className="font-semibold text-gray-900">{item.name}</h3>
              <p className="text-purple-600 font-bold">
                R$ {item.price.toFixed(2)}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <Minus size={16} />
              </button>
              
              <span className="w-8 text-center font-semibold">
                {item.quantity}
              </span>
              
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="ml-4 text-right">
              <p className="font-bold text-gray-900">
                R$ {(item.price * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between text-xl font-bold">
          <span>Total:</span>
          <span className="text-purple-600">R$ {totalPrice.toFixed(2)}</span>
        </div>
        
        <button
          onClick={onGoToCheckout}
          className="w-full mt-4 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
        >
          Finalizar Pedido
        </button>
      </div>
    </div>
  )
}
