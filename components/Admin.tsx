import { useState } from 'react'
import { useAdminOrders, type AdminOrder } from '../hooks/useAdminOrders'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { 
  ShoppingCart, 
  DollarSign, 
  Users, 
  Clock, 
  CheckCircle,
  RefreshCw,
  Eye,
  Package
} from 'lucide-react'
import { toast } from 'sonner'

interface AdminProps {
  onBackToProducts: () => void
}

export const Admin = ({ onBackToProducts }: AdminProps) => {
  const { orders, loading, syncing, updateOrderStatus, getOrderStats, refreshOrders } = useAdminOrders()
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)
  const [filterStatus, setFilterStatus] = useState<AdminOrder['status'] | 'all'>('all')

  const stats = getOrderStats()

  // Filtrar pedidos
  const filteredOrders = orders.filter(order => {
    return filterStatus === 'all' || order.status === filterStatus
  })

  // Atualizar status do pedido
  const handleStatusUpdate = async (orderId: string, newStatus: AdminOrder['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      toast.success(`Status do pedido atualizado para ${newStatus}`)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast.error('Erro ao atualizar status do pedido')
    }
  }

  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  // Formatar valor
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  // Obter cor do status
  const getStatusColor = (status: AdminOrder['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'paid': return 'bg-blue-100 text-blue-800'
      case 'preparing': return 'bg-orange-100 text-orange-800'
      case 'ready': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Obter ícone do status
  const getStatusIcon = (status: AdminOrder['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'paid': return <DollarSign className="h-4 w-4" />
      case 'preparing': return <Package className="h-4 w-4" />
      case 'ready': return <CheckCircle className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <h1 className="font-cookitie text-xl font-bold text-gray-900">
                🎛️ Admin Cookittie
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={refreshOrders}
                disabled={syncing}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button
                onClick={onBackToProducts}
                variant="outline"
              >
                Voltar ao Site
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Únicos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.uniqueUsers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.averageOrderValue)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros por Status */}
        <div className="mb-6">
          <Tabs value={filterStatus} onValueChange={(value) => setFilterStatus(value as AdminOrder['status'] | 'all')}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">Todos ({stats.totalOrders})</TabsTrigger>
              <TabsTrigger value="pending">Pendentes ({stats.pendingOrders})</TabsTrigger>
              <TabsTrigger value="paid">Pagos ({stats.paidOrders})</TabsTrigger>
              <TabsTrigger value="preparing">Preparando ({stats.preparingOrders})</TabsTrigger>
              <TabsTrigger value="ready">Prontos ({stats.readyOrders})</TabsTrigger>
              <TabsTrigger value="completed">Concluídos ({stats.completedOrders})</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Lista de Pedidos */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Carregando pedidos...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Nenhum pedido encontrado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">Pedido #{order.id.slice(-8)}</h3>
                        <p className="text-sm text-gray-600">
                          {order.userName || 'Cliente'} • {formatDate(order.created)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium">Itens:</p>
                        <p className="text-sm text-gray-600">
                          {order.items.map(item => `${item.name} (${item.quantity}x)`).join(', ')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Total:</p>
                        <p className="text-sm text-gray-600 font-semibold">
                          {formatCurrency(order.total)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Ações:</p>
                        <div className="flex gap-1">
                          {order.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(order.id, 'paid')}
                            >
                              Marcar Pago
                            </Button>
                          )}
                          {order.status === 'paid' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(order.id, 'preparing')}
                            >
                              Preparar
                            </Button>
                          )}
                          {order.status === 'preparing' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(order.id, 'ready')}
                            >
                              Pronto
                            </Button>
                          )}
                          {order.status === 'ready' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(order.id, 'completed')}
                            >
                              Entregue
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de Detalhes do Pedido */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Detalhes do Pedido #{selectedOrder.id.slice(-8)}</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Fechar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Informações do Cliente</h4>
                  <p><strong>Nome:</strong> {selectedOrder.userName || 'N/A'}</p>
                  <p><strong>Email:</strong> {selectedOrder.userEmail || 'N/A'}</p>
                  <p><strong>ID do Usuário:</strong> {selectedOrder.userId}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Itens do Pedido</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>{item.name}</span>
                        <span>{item.quantity}x {formatCurrency(item.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Informações de Pagamento</h4>
                  <p><strong>Método:</strong> {selectedOrder.paymentMethod}</p>
                  <p><strong>Total:</strong> {formatCurrency(selectedOrder.total)}</p>
                  {selectedOrder.pixCode && (
                    <p><strong>Código PIX:</strong> {selectedOrder.pixCode}</p>
                  )}
                  {selectedOrder.pickupCode && (
                    <p><strong>Código de Retirada:</strong> {selectedOrder.pickupCode}</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Status e Datas</h4>
                  <p><strong>Status:</strong> 
                    <Badge className={`ml-2 ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)}
                      <span className="ml-1 capitalize">{selectedOrder.status}</span>
                    </Badge>
                  </p>
                  <p><strong>Criado em:</strong> {formatDate(selectedOrder.created)}</p>
                  {selectedOrder.updated && (
                    <p><strong>Atualizado em:</strong> {formatDate(selectedOrder.updated)}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
