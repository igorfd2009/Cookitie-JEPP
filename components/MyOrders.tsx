import { Package, ArrowLeft, Box } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { usePocketBaseOrders as useOrders } from '../hooks/usePocketBaseOrders'

interface MyOrdersProps {
  onBackToProducts: () => void
}

export const MyOrders = ({ onBackToProducts }: MyOrdersProps) => {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { orders, loading } = useOrders()


  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seus pedidos...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to.yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package size={40} className="text-blue-400" />
        </div>
        <h2 className="font-cookitie text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Faça login para ver seus pedidos
        </h2>
        <p className="text-gray-600 mb-6">
          Você precisa estar autenticado para acessar seus pedidos da Cookitie.
        </p>
        <button
          onClick={onBackToProducts}
          className="btn-cookitie-primary py-3 px-6 font-cookitie"
        >
          Voltar para Produtos 🍪
        </button>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to.yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package size={40} className="text-blue-400" />
        </div>
        <h2 className="font-cookitie text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Você ainda não fez nenhum pedido
        </h2>
        <p className="text-gray-600 mb-6">
          Que tal experimentar nossos deliciosos cookies artesanais?
        </p>
        <button
          onClick={onBackToProducts}
          className="btn-cookitie-primary py-3 px-6 font-cookitie"
        >
          Ver Produtos 🍪
        </button>
      </div>
    )
  }


  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 pt-8 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-cookitie text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Box size={24} className="text-black" />
            Meus Pedidos
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-gray-600">
              {orders.length} {orders.length === 1 ? 'pedido encontrado' : 'pedidos encontrados'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToProducts}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Voltar para Produtos</span>
            <span className="sm:hidden">Voltar</span>
          </button>
        </div>
      </div>


      <div className="space-y-4">
        {orders.map((order) => {
          return (
             <div key={order.id} className="p-4 sm:p-6 rounded-2xl shadow-lg" style={{ backgroundColor: '#F4F4F4' }}>
              <div className="mb-4">
                <h3 className="font-cookitie text-xl sm:text-2xl font-bold text-gray-900">
                  Pedido #{order.id.slice(-8).toUpperCase()}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(order.created).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div className="grid gap-2 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 xs:grid-cols-[1fr_auto] gap-2 py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                      <span className="text-sm sm:text-base font-medium truncate">{item.name}</span>
                      <span className="text-blue-600 text-sm flex-shrink-0">x{item.quantity}</span>
                    </div>
                    <span className="font-bold text-sm sm:text-base text-right xs:text-left">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-3 border-t-2 border-blue-200">
                <span className="font-bold text-gray-800">Total:</span>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent font-cookitie">
                  R$ {order.total.toFixed(2)}
                </span>
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}