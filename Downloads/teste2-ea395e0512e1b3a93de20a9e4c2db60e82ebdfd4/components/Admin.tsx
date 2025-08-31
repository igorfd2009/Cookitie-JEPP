import { useState } from 'react'
import { 
  Package, 
  Users, 
  DollarSign, 
  Clock, 
  Eye,
  RefreshCw,
  Download,
  Search
} from 'lucide-react'
import { useOrders, Order } from '../hooks/useOrders'
import { toast } from 'sonner'

interface AdminProps {
  onBackToProducts: () => void
}

export const Admin = ({ onBackToProducts }: AdminProps) => {
  const { orders, loading, updateOrderStatus, refreshOrders } = useOrders()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filterStatus, setFilterStatus] = useState<Order['status'] | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'dashboard' | 'orders' | 'details'>('dashboard')

  // Estatísticas gerais
  const getAdminStats = () => {
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const pendingOrders = orders.filter(order => order.status === 'pending').length
    const paidOrders = orders.filter(order => order.status === 'paid').length
    const completedOrders = orders.filter(order => order.status === 'completed').length
    const uniqueUsers = new Set(orders.map(order => order.userId)).size

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      paidOrders,
      completedOrders,
      uniqueUsers,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
    }
  }

  // Filtrar pedidos
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesStatus && matchesSearch
  })

  // Atualizar status do pedido
  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      toast.success(`Status do pedido atualizado para ${newStatus}`)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast.error('Erro ao atualizar status do pedido')
    }
  }

  // Exportar dados
  const exportOrders = () => {
    const dataStr = JSON.stringify(orders, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `cookitie-orders-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const stats = getAdminStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados do admin...</p>
        </div>
      </div>
    )
  }

  if (viewMode === 'details' && selectedOrder) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 px-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-cookitie text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              📋 Detalhes do Pedido
            </h1>
            <p className="text-gray-600">
              Pedido #{selectedOrder.id.slice(-8).toUpperCase()}
            </p>
          </div>
          <button
            onClick={() => setViewMode('orders')}
            className="btn-cookitie-secondary"
          >
            Voltar aos Pedidos
          </button>
        </div>

        <div className="cookitie-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-cookitie text-lg font-bold text-gray-900 mb-4">
                Informações do Pedido
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">ID:</span>
                  <p className="font-mono text-sm">{selectedOrder.id}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Usuário ID:</span>
                  <p className="font-mono text-sm">{selectedOrder.userId}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    selectedOrder.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                    selectedOrder.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Total:</span>
                  <p className="text-lg font-bold text-green-600">
                    R$ {selectedOrder.total.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Criado em:</span>
                  <p className="text-sm">
                    {new Date(selectedOrder.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                {selectedOrder.updatedAt && (
                  <div>
                    <span className="text-sm text-gray-500">Atualizado em:</span>
                    <p className="text-sm">
                      {new Date(selectedOrder.updatedAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-cookitie text-lg font-bold text-gray-900 mb-4">
                Itens do Pedido
              </h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qtd: {item.quantity}</p>
                    </div>
                    <p className="font-bold">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {selectedOrder.pixCode && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-cookitie font-bold text-gray-900 mb-2">
                Código PIX
              </h4>
              <p className="font-mono text-sm break-all bg-white p-2 rounded border">
                {selectedOrder.pixCode}
              </p>
            </div>
          )}

          <div className="mt-6 flex gap-2">
            <button
              onClick={() => handleStatusUpdate(selectedOrder.id, 'paid')}
              className="btn-cookitie-primary"
            >
              Marcar como Pago
            </button>
            <button
              onClick={() => handleStatusUpdate(selectedOrder.id, 'completed')}
              className="btn-cookitie-secondary"
            >
              Marcar como Concluído
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (viewMode === 'orders') {
    return (
      <div className="max-w-6xl mx-auto space-y-6 px-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-cookitie text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              📦 Gerenciar Pedidos
            </h1>
            <p className="text-gray-600">
              {filteredOrders.length} de {orders.length} pedidos
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('dashboard')}
              className="btn-cookitie-secondary"
            >
              Dashboard
            </button>
            <button
              onClick={exportOrders}
              className="btn-cookitie-primary"
            >
              <Download size={16} />
              Exportar
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="cookitie-card p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Buscar por ID ou nome do produto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as Order['status'] | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Aguardando Pagamento</option>
              <option value="paid">Pago</option>
              <option value="preparing">Preparando</option>
              <option value="ready">Pronto</option>
              <option value="completed">Concluído</option>
            </select>
            <button
              onClick={refreshOrders}
              className="btn-cookitie-secondary"
            >
              <RefreshCw size={16} />
              Atualizar
            </button>
          </div>
        </div>

        {/* Lista de Pedidos */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="cookitie-card p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <h3 className="font-cookitie text-lg font-bold text-gray-900">
                      #{order.id.slice(-8).toUpperCase()}
                    </h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'itens'} • 
                    R$ {order.total.toFixed(2)} • 
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedOrder(order)
                      setViewMode('details')
                    }}
                    className="btn-cookitie-secondary"
                  >
                    <Eye size={16} />
                    Ver
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(order.id, 'paid')}
                    className="btn-cookitie-primary"
                  >
                    Pago
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(order.id, 'completed')}
                    className="btn-cookitie-secondary"
                  >
                    Concluído
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Dashboard principal
  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-cookitie text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            🎛️ Painel Administrativo
          </h1>
          <p className="text-gray-600">
            Gerencie pedidos e acompanhe as vendas da Cookitie
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('orders')}
            className="btn-cookitie-primary"
          >
            Gerenciar Pedidos
          </button>
          <button
            onClick={onBackToProducts}
            className="btn-cookitie-secondary"
          >
            Voltar ao Site
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cookitie-card p-4 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Package className="text-blue-600" size={24} />
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.totalOrders}</div>
          <div className="text-sm text-gray-600">Total de Pedidos</div>
        </div>

        <div className="cookitie-card p-4 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <DollarSign className="text-green-600" size={24} />
          </div>
          <div className="text-2xl font-bold text-green-600">
            R$ {stats.totalRevenue.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">Receita Total</div>
        </div>

        <div className="cookitie-card p-4 text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="text-yellow-600" size={24} />
          </div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
          <div className="text-sm text-gray-600">Aguardando Pagamento</div>
        </div>

        <div className="cookitie-card p-4 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users className="text-purple-600" size={24} />
          </div>
          <div className="text-2xl font-bold text-purple-600">{stats.uniqueUsers}</div>
          <div className="text-sm text-gray-600">Clientes Únicos</div>
        </div>
      </div>

      {/* Gráfico de Status */}
      <div className="cookitie-card p-6">
        <h2 className="font-cookitie text-xl font-bold text-gray-900 mb-4">
          📊 Status dos Pedidos
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
            <div className="text-sm text-gray-600">Aguardando</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.paidOrders}</div>
            <div className="text-sm text-gray-600">Pagos</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.completedOrders}</div>
            <div className="text-sm text-gray-600">Concluídos</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">
              R$ {stats.averageOrderValue.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Ticket Médio</div>
          </div>
          <div className="text-center p-3 bg-indigo-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">
              {stats.totalOrders > 0 ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(1) : '0'}%
            </div>
            <div className="text-sm text-gray-600">Taxa de Conclusão</div>
          </div>
        </div>
      </div>

      {/* Pedidos Recentes */}
      <div className="cookitie-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-cookitie text-xl font-bold text-gray-900">
            🕒 Pedidos Recentes
          </h2>
          <button
            onClick={() => setViewMode('orders')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Ver Todos →
          </button>
        </div>
        
        <div className="space-y-3">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">#{order.id.slice(-8).toUpperCase()}</p>
                <p className="text-sm text-gray-500">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'itens'} • R$ {order.total.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
                <button
                  onClick={() => {
                    setSelectedOrder(order)
                    setViewMode('details')
                  }}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
