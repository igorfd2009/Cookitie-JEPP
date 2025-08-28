import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Calendar,
  Eye,
  DollarSign,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react'
import { useOrders, type Order } from '../hooks/useOrders'
import { formatCurrency } from '../utils/currency'
import { toast } from 'sonner'

export const AdminOrdersPanel: React.FC = () => {
  const { orders, updateOrderStatus, loadOrders } = useOrders()
  const [loading, setLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')


  // Carregar dados
  const loadData = async () => {
    setLoading(true)
    try {
      await loadOrders()
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Filtrar pedidos
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesSearch = searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesStatus && matchesSearch
  })

  // Atualizar status do pedido
  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      const success = await updateOrderStatus(orderId, newStatus)
      if (success) {
        toast.success(`Status do pedido ${orderId} atualizado para ${newStatus}`)
        await loadData()
        setSelectedOrder(null)
      } else {
        toast.error('Erro ao atualizar status')
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast.error('Erro ao atualizar status')
    }
  }

  const getStatusInfo = (status: Order['status']) => {
    const statusMap = {
      pending: { 
        label: 'Pendente', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock
      },
      confirmed: { 
        label: 'Confirmado', 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: CheckCircle
      },
      completed: { 
        label: 'Completo', 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle
      },
      cancelled: { 
        label: 'Cancelado', 
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle
      }
    }
    return statusMap[status] || statusMap.pending
  }

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter((o: Order) => o.status === 'pending').length,
      confirmed: orders.filter((o: Order) => o.status === 'confirmed').length,
      completed: orders.filter((o: Order) => o.status === 'completed').length,
      cancelled: orders.filter((o: Order) => o.status === 'cancelled').length,
      totalRevenue: orders.reduce((sum: number, o: Order) => sum + o.total, 0)
    }
    return stats
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
  }

  const stats = getOrderStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando pedidos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel de Pedidos</h1>
          <p className="text-gray-600">Gerencie todos os pedidos do sistema</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Confirmados</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Completos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Cancelados</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Receita</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por ID ou produto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os status</option>
                <option value="pending">Pendente</option>
                <option value="confirmed">Confirmado</option>
                <option value="completed">Completo</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
            <Button
              onClick={loadData}
              variant="outline"
              className="flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Orders List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status)
            const StatusIcon = statusInfo.icon

            return (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-gray-800">
                      Pedido #{order.id.slice(-8)}
                    </CardTitle>
                    <Button
                      onClick={() => setSelectedOrder(order)}
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={statusInfo.color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusInfo.label}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Items preview */}
                  <div className="space-y-2">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.quantity}x {formatCurrency(item.price)}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-xs text-gray-500 pl-13">
                        +{order.items.length - 2} item(s) a mais
                      </p>
                    )}
                  </div>

                  {/* Order info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(order.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">Retirada no evento</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Total:</span>
                      <span className="text-lg font-bold text-blue-600">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => setSelectedOrder(order)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Ver Detalhes
                    </Button>
                    {order.status === 'pending' && (
                      <Button
                        onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Confirmar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Pedido #{selectedOrder.id.slice(-8)}
                  </h2>
                  <Button
                    onClick={() => setSelectedOrder(null)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-5 h-5" />
                  </Button>
                </div>

                {/* Status */}
                <div className="flex gap-3 mb-6">
                  {(() => {
                    const statusInfo = getStatusInfo(selectedOrder.status)
                    const StatusIcon = statusInfo.icon
                    
                    return (
                      <Badge className={statusInfo.color}>
                        <StatusIcon className="w-4 h-4 mr-2" />
                        {statusInfo.label}
                      </Badge>
                    )
                  })()}
                </div>

                {/* Items */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Itens do Pedido</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 bg-gray-50 rounded-lg p-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            {item.quantity}x {formatCurrency(item.price)} = {formatCurrency(item.quantity * item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800">Informações do Pedido</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Criado em: {formatDate(selectedOrder.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>Local: Retirada no evento</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800">Pagamento</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Método: </span>
                        <span className="font-medium">{selectedOrder.payment_method}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total: </span>
                        <span className="font-bold text-blue-600 text-lg">
                          {formatCurrency(selectedOrder.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Atualizar Status</h3>
                  <div className="flex gap-2 flex-wrap">
                    {selectedOrder.status !== 'pending' && (
                      <Button
                        onClick={() => handleStatusUpdate(selectedOrder.id, 'pending')}
                        variant="outline"
                        size="sm"
                        className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Pendente
                      </Button>
                    )}
                    {selectedOrder.status !== 'confirmed' && (
                      <Button
                        onClick={() => handleStatusUpdate(selectedOrder.id, 'confirmed')}
                        variant="outline"
                        size="sm"
                        className="bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirmado
                      </Button>
                    )}
                    {selectedOrder.status !== 'completed' && (
                      <Button
                        onClick={() => handleStatusUpdate(selectedOrder.id, 'completed')}
                        variant="outline"
                        size="sm"
                        className="bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completo
                      </Button>
                    )}
                    {selectedOrder.status !== 'cancelled' && (
                      <Button
                        onClick={() => handleStatusUpdate(selectedOrder.id, 'cancelled')}
                        variant="outline"
                        size="sm"
                        className="bg-red-100 text-red-800 border-red-300 hover:bg-red-200"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancelado
                      </Button>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setSelectedOrder(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'Nenhum pedido encontrado' : 'Nenhum pedido ainda'}
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca.' 
                : 'Os pedidos aparecerão aqui quando os clientes fizerem compras.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
