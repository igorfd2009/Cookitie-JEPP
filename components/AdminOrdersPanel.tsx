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
  Truck, 
  MapPin, 
  Calendar,
  Eye,
  Edit,
  DollarSign,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react'
import { useOrders, type Order } from '../hooks/useOrders'
import { formatCurrency } from '../utils/currency'
import { toast } from 'sonner'

export const AdminOrdersPanel: React.FC = () => {
  const { getAdminOrders, updateOrderStatus, getOrderStats } = useOrders()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [stats, setStats] = useState<any>(null)

  // Carregar dados
  const loadData = () => {
    setLoading(true)
    try {
      const adminOrders = getAdminOrders()
      setOrders(adminOrders)
      setStats(getOrderStats())
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
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Atualizar status do pedido
  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      const success = updateOrderStatus(orderId, newStatus, adminNotes)
      if (success) {
        toast.success(`Status do pedido ${orderId} atualizado para ${newStatus}`)
        loadData()
        setSelectedOrder(null)
        setAdminNotes('')
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
      preparing: { 
        label: 'Preparando', 
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: Package
      },
      ready: { 
        label: 'Pronto', 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle
      },
      delivered: { 
        label: 'Entregue', 
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: Truck
      },
      cancelled: { 
        label: 'Cancelado', 
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle
      }
    }
    return statusMap[status] || statusMap.pending
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-cookite-blue" />
          <span className="text-gray-600">Carregando pedidos...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Entregues</p>
                  <p className="text-2xl font-bold">{stats.delivered}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Receita</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por ID, nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-none shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cookite-blue focus:border-transparent"
              >
                <option value="all">Todos os status</option>
                <option value="pending">Pendente</option>
                <option value="confirmed">Confirmado</option>
                <option value="preparing">Preparando</option>
                <option value="ready">Pronto</option>
                <option value="delivered">Entregue</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
            <Button
              onClick={loadData}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pedidos */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Nenhum pedido encontrado
              </h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Ainda não há pedidos registrados'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status)
            const StatusIcon = statusInfo.icon
            
            return (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className={`${statusInfo.color} border`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                        <span className="text-sm text-gray-500">#{order.id}</span>
                        <span className="text-lg font-bold text-cookite-blue">
                          {formatCurrency(order.total)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Cliente</h4>
                          <p className="text-sm text-gray-600">{order.customer.name}</p>
                          <p className="text-sm text-gray-500">{order.customer.email}</p>
                          <p className="text-sm text-gray-500">{order.customer.phone}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Entrega</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.pickup_date).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            {order.pickup_location}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Produtos</h4>
                        <div className="space-y-1">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">
                                {item.quantity}x {item.name}
                              </span>
                              <span className="text-gray-800 font-medium">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {order.admin_notes && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <h4 className="font-semibold text-yellow-800 mb-1">Notas do Admin</h4>
                          <p className="text-sm text-yellow-700">{order.admin_notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        onClick={() => setSelectedOrder(order)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalhes
                      </Button>
                      
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <Button
                          onClick={() => setSelectedOrder(order)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Atualizar Status
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Modal de Detalhes/Atualização */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Pedido #{selectedOrder.id}</span>
                <Button
                  onClick={() => setSelectedOrder(null)}
                  variant="outline"
                  size="sm"
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informações do Cliente */}
              <div>
                <h3 className="font-semibold mb-3">Informações do Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Nome</p>
                    <p className="font-medium">{selectedOrder.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedOrder.customer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Telefone</p>
                    <p className="font-medium">{selectedOrder.customer.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status do Pagamento</p>
                    <Badge className={selectedOrder.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {selectedOrder.payment_status === 'paid' ? 'Pago' : 'Pendente'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Produtos */}
              <div>
                <h3 className="font-semibold mb-3">Produtos</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Qtd: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-cookite-blue bg-opacity-10 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total:</span>
                    <span className="text-xl font-bold text-cookite-blue">
                      {formatCurrency(selectedOrder.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Atualização de Status */}
              <div>
                <h3 className="font-semibold mb-3">Atualizar Status</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Status Atual</label>
                    <Badge className={`${getStatusInfo(selectedOrder.status).color} border`}>
                      {React.createElement(getStatusInfo(selectedOrder.status).icon, { className: "w-3 h-3 mr-1" })}
                      {getStatusInfo(selectedOrder.status).label}
                    </Badge>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Novo Status</label>
                    <select
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cookite-blue focus:border-transparent"
                      onChange={(e) => {
                        const newStatus = e.target.value as Order['status']
                        handleStatusUpdate(selectedOrder.id, newStatus)
                      }}
                    >
                      <option value="pending">Pendente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="preparing">Preparando</option>
                      <option value="ready">Pronto</option>
                      <option value="delivered">Entregue</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Notas do Admin (opcional)</label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Adicione observações sobre o pedido..."
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cookite-blue focus:border-transparent"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
