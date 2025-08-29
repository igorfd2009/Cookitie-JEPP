import { Package, Clock, CheckCircle, Truck } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'

interface Order {
  id: string
  userId: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
  total: number
  status: 'pending' | 'paid' | 'preparing' | 'ready' | 'completed'
  paymentMethod: 'pix'
  createdAt: string
}

export const MyOrders = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (user) {
      const allOrders = JSON.parse(localStorage.getItem('cookitie_orders') || '[]')
      const userOrders = allOrders.filter((order: Order) => order.userId === user.id)
      setOrders(userOrders.sort((a: Order, b: Order) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ))
    }
  }, [user])

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return { 
          label: 'Aguardando Pagamento', 
          color: 'bg-yellow-100 text-yellow-800',
          icon: Clock
        }
      case 'paid':
        return { 
          label: 'Pago - Preparando', 
          color: 'bg-blue-100 text-blue-800',
          icon: Package
        }
      case 'preparing':
        return { 
          label: 'Preparando', 
          color: 'bg-orange-100 text-orange-800',
          icon: Package
        }
      case 'ready':
        return { 
          label: 'Pronto para Entrega', 
          color: 'bg-purple-100 text-purple-800',
          icon: Truck
        }
      case 'completed':
        return { 
          label: 'Entregue', 
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle
        }
      default:
        return { 
          label: 'Desconhecido', 
          color: 'bg-gray-100 text-gray-800',
          icon: Package
        }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <Package size={64} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Nenhum pedido encontrado
        </h2>
        <p className="text-gray-600">
          Você ainda não fez nenhum pedido. Que tal experimentar nossos cookies?
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Meus Pedidos ({orders.length})
        </h1>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const statusInfo = getStatusInfo(order.status)
          const StatusIcon = statusInfo.icon

          return (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Pedido #{order.id.slice(-8)}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} mb-2`}>
                    <StatusIcon size={14} className="mr-1" />
                    {statusInfo.label}
                  </div>
                  <p className="text-lg font-bold text-purple-600">
                    R$ {order.total.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Itens do pedido:</h4>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-medium">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {order.status === 'ready' && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-purple-800 text-sm">
                    🎉 <strong>Seu pedido está pronto!</strong> Será entregue no evento JEPP.
                  </p>
                </div>
              )}

              {order.status === 'completed' && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-green-800 text-sm">
                    ✅ <strong>Pedido entregue!</strong> Esperamos que tenha gostado dos cookies!
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Info do evento */}
      <div className="bg-purple-50 rounded-lg p-6 text-center">
        <h2 className="text-xl font-bold text-purple-900 mb-2">
          Evento JEPP 2024
        </h2>
        <p className="text-purple-700">
          Todos os pedidos serão entregues fresquinhos no dia do evento!<br />
          Fique atento ao seu email para mais informações sobre local e horário.
        </p>
      </div>
    </div>
  )
}
