import { useState, useEffect } from 'react'
import { Package, Clock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  user_id: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'paid' | 'preparing' | 'ready' | 'completed'
  payment_method: string
  pix_code?: string
  created_at: string
  updated_at?: string
}

interface MyOrdersProps {
  onBackToProducts: () => void
}

export const MyOrders = ({ onBackToProducts }: MyOrdersProps) => {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !user) {
        setOrders([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        if (supabase) {
          // Buscar pedidos no Supabase
          console.log('Buscando pedidos do usuário:', user.id)
          
          const { data, error: supabaseError } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

          if (supabaseError) {
            console.error('Erro ao buscar pedidos no Supabase:', supabaseError)
            setError('Erro ao carregar pedidos do servidor')
          } else {
            console.log('Pedidos encontrados no Supabase:', data?.length || 0)
            setOrders(data || [])
            
            // Salvar no localStorage como backup (mesmo se vazio)
            localStorage.setItem(`user_orders_${user.id}`, JSON.stringify(data || []))
          }
        } else {
          console.log('Supabase não configurado, buscando no localStorage')
          // Fallback para localStorage se Supabase não estiver configurado
          const storedOrders = localStorage.getItem(`user_orders_${user.id}`)
          if (storedOrders) {
            const parsedOrders = JSON.parse(storedOrders)
            setOrders(parsedOrders)
          }
        }
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error)
        setError('Erro inesperado ao carregar pedidos')
        
        // Tentar carregar do localStorage como fallback
        try {
          const storedOrders = localStorage.getItem(`user_orders_${user.id}`)
          if (storedOrders) {
            const parsedOrders = JSON.parse(storedOrders)
            setOrders(parsedOrders)
            setError(null) // Limpar erro se conseguiu carregar do localStorage
          }
        } catch (localError) {
          console.error('Erro ao carregar do localStorage:', localError)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [isAuthenticated, user])

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return { 
          label: 'Aguardando Pagamento', 
          color: 'text-yellow-600 bg-yellow-50 border-yellow-200', 
          icon: Clock 
        }
      case 'paid':
        return { 
          label: 'Pago - Preparando', 
          color: 'text-blue-600 bg-blue-50 border-blue-200', 
          icon: Package 
        }
      case 'preparing':
        return { 
          label: 'Preparando', 
          color: 'text-blue-600 bg-blue-50 border-blue-200', 
          icon: Package 
        }
      case 'ready':
        return { 
          label: 'Pronto para Entrega', 
          color: 'text-green-600 bg-green-50 border-green-200', 
          icon: CheckCircle 
        }
      case 'completed':
        return { 
          label: 'Entregue', 
          color: 'text-green-600 bg-green-50 border-green-200', 
          icon: CheckCircle 
        }
      default:
        return { 
          label: 'Status Desconhecido', 
          color: 'text-gray-600 bg-gray-50 border-gray-200', 
          icon: XCircle 
        }
    }
  }

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
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
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

  if (error) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={40} className="text-red-500" />
        </div>
        <h2 className="font-cookitie text-2xl font-bold text-gray-900 mb-3">
          Erro ao carregar pedidos
        </h2>
        <p className="text-red-600 mb-6">{error}</p>
        <button
          onClick={onBackToProducts}
          className="btn-cookitie-primary py-3 px-6 font-cookitie"
        >
          Voltar para Produtos
        </button>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
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
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-cookitie text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            📦 Meus Pedidos
          </h1>
          <p className="text-gray-600">
            {orders.length} {orders.length === 1 ? 'pedido encontrado' : 'pedidos encontrados'}
          </p>
        </div>
        <button
          onClick={onBackToProducts}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Voltar para Produtos</span>
          <span className="sm:hidden">Voltar</span>
        </button>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const statusInfo = getStatusInfo(order.status)
          const StatusIcon = statusInfo.icon

          return (
            <div key={order.id} className="cookitie-card p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-cookitie text-lg font-bold text-gray-900">
                    Pedido #{order.id.slice(-8).toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border ${statusInfo.color}`}>
                  <StatusIcon size={16} />
                  {statusInfo.label}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-sm sm:text-base font-medium">{item.name}</span>
                      <span className="text-blue-600 text-sm">x{item.quantity}</span>
                    </div>
                    <span className="font-bold text-sm sm:text-base">
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

              {order.status === 'pending' && order.pix_code && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-sm text-yellow-800">
                    <strong>⏰ Aguardando pagamento:</strong> Use o código PIX gerado para finalizar seu pedido.
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}