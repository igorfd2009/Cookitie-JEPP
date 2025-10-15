import { useState, useMemo } from 'react'
import { useAdminOrders, type AdminOrder } from '../hooks/useAdminOrders'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'
import { Input } from './ui/input'
import { 
  ShoppingCart, 
  DollarSign, 
  Users, 
  Clock, 
  CheckCircle,
  RefreshCw,
  Eye,
  Package,
  Mail,
  User,
  Calendar,
  Search,
  Download,
  CreditCard,
  TrendingUp,
  Filter,
  X
} from 'lucide-react'
import { toast } from 'sonner'

interface AdminProps {
  onBackToProducts: () => void
}

interface ClientData {
  userId: string
  userName: string
  userEmail: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: string
  orders: AdminOrder[]
}

export const Admin = ({ onBackToProducts }: AdminProps) => {
  const { orders, loading, syncing, updateOrderStatus, getOrderStats, refreshOrders } = useAdminOrders()
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null)
  const [filterStatus, setFilterStatus] = useState<AdminOrder['status'] | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('pedidos')

  const stats = getOrderStats()

  // Agrupar pedidos por cliente
  const clientsData = useMemo(() => {
    const clientsMap = new Map<string, ClientData>()

    orders.forEach(order => {
      const existing = clientsMap.get(order.userId)
      
      if (existing) {
        existing.totalOrders++
        existing.totalSpent += order.total
        existing.orders.push(order)
        if (new Date(order.created) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = order.created
        }
      } else {
        clientsMap.set(order.userId, {
          userId: order.userId,
          userName: order.userName || 'Cliente não identificado',
          userEmail: order.userEmail || 'Email não disponível',
          totalOrders: 1,
          totalSpent: order.total,
          lastOrderDate: order.created,
          orders: [order]
        })
      }
    })

    return Array.from(clientsMap.values()).sort((a, b) => b.totalSpent - a.totalSpent)
  }, [orders])

  // Filtrar pedidos
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchStatus = filterStatus === 'all' || order.status === filterStatus
      const matchSearch = searchTerm === '' || 
        order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.pickupCode?.toLowerCase().includes(searchTerm.toLowerCase())
      
      return matchStatus && matchSearch
    })
  }, [orders, filterStatus, searchTerm])

  // Filtrar clientes
  const filteredClients = useMemo(() => {
    return clientsData.filter(client => 
      searchTerm === '' ||
      client.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.userId.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [clientsData, searchTerm])

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

  // Exportar dados para CSV
  const exportToCSV = () => {
    const headers = ['ID Pedido', 'Cliente', 'Email', 'Total', 'Status', 'Data', 'Código Retirada']
    const rows = filteredOrders.map(order => [
      order.id,
      order.userName || '',
      order.userEmail || '',
      order.total.toFixed(2),
      order.status,
      formatDate(order.created),
      order.pickupCode || ''
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `pedidos_cookittie_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    toast.success('Dados exportados com sucesso!')
  }

  // Exportar dados dos clientes para CSV
  const exportClientsToCSV = () => {
    const headers = ['ID Cliente', 'Nome', 'Email', 'Total de Pedidos', 'Total Gasto', 'Último Pedido']
    const rows = filteredClients.map(client => [
      client.userId,
      client.userName,
      client.userEmail,
      client.totalOrders.toString(),
      client.totalSpent.toFixed(2),
      formatDate(client.lastOrderDate)
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `clientes_cookittie_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    toast.success('Dados dos clientes exportados com sucesso!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
              <CardTitle className="text-sm font-medium">Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.uniqueUsers}</div>
              <p className="text-xs text-muted-foreground">únicos</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.averageOrderValue)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">aguardando</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs para Pedidos e Clientes */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pedidos">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Pedidos ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="clientes">
              <Users className="h-4 w-4 mr-2" />
              Clientes ({clientsData.length})
            </TabsTrigger>
          </TabsList>

          {/* Tab de Pedidos */}
          <TabsContent value="pedidos" className="space-y-6 mt-6">
            {/* Barra de Pesquisa e Exportar */}
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, email, código ou ID do pedido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              <Button onClick={exportToCSV} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>

            {/* Filtros por Status */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
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
                <CardTitle>Pedidos ({filteredOrders.length})</CardTitle>
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
                      <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">Pedido #{order.id.slice(-8)}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User className="h-4 w-4 flex-shrink-0" />
                                <span className="font-medium">{order.userName || 'Cliente não identificado'}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">{order.userEmail || 'Email não disponível'}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4 flex-shrink-0" />
                                <span>{formatDate(order.created)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CreditCard className="h-4 w-4 flex-shrink-0" />
                                <span className="uppercase">{order.paymentMethod}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 ml-4">
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
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                          <div>
                            <p className="text-sm font-medium mb-2">Itens do Pedido:</p>
                            <div className="space-y-1 bg-gray-50 p-3 rounded-lg">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span className="text-gray-700">• {item.name} <span className="font-medium">({item.quantity}x)</span></span>
                                  <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-2">Informações de Pagamento:</p>
                            <div className="bg-green-50 p-3 rounded-lg">
                              <p className="text-2xl text-green-600 font-bold">
                                {formatCurrency(order.total)}
                              </p>
                              {order.pickupCode && (
                                <div className="mt-2">
                                  <p className="text-xs text-gray-500">Código de Retirada:</p>
                                  <p className="text-lg font-mono font-bold text-purple-600">{order.pickupCode}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-2">Ações Rápidas:</p>
                            <div className="flex flex-col gap-2">
                              {order.status === 'pending' && (
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusUpdate(order.id, 'paid')}
                                  className="w-full"
                                >
                                  <DollarSign className="h-4 w-4 mr-1" />
                                  Marcar Pago
                                </Button>
                              )}
                              {order.status === 'paid' && (
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusUpdate(order.id, 'preparing')}
                                  className="w-full"
                                >
                                  <Package className="h-4 w-4 mr-1" />
                                  Preparar
                                </Button>
                              )}
                              {order.status === 'preparing' && (
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusUpdate(order.id, 'ready')}
                                  className="w-full"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Pronto
                                </Button>
                              )}
                              {order.status === 'ready' && (
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusUpdate(order.id, 'completed')}
                                  className="w-full"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
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
          </TabsContent>

          {/* Tab de Clientes */}
          <TabsContent value="clientes" className="space-y-6 mt-6">
            {/* Barra de Pesquisa e Exportar */}
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar cliente por nome, email ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              <Button onClick={exportClientsToCSV} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>

            {/* Lista de Clientes */}
            <Card>
              <CardHeader>
                <CardTitle>Clientes ({filteredClients.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Carregando clientes...</p>
                  </div>
                ) : filteredClients.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Nenhum cliente encontrado</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredClients.map((client) => (
                      <div key={client.userId} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                              <User className="h-5 w-5 text-purple-600" />
                              {client.userName}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">{client.userEmail}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4 flex-shrink-0" />
                                <span>Último pedido: {formatDate(client.lastOrderDate)}</span>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500 font-mono">
                              ID: {client.userId}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedClient(client)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                          <div className="bg-blue-50 p-3 rounded-lg text-center">
                            <p className="text-xs text-gray-600 mb-1">Total de Pedidos</p>
                            <p className="text-2xl font-bold text-blue-600">{client.totalOrders}</p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg text-center">
                            <p className="text-xs text-gray-600 mb-1">Total Gasto</p>
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(client.totalSpent)}</p>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-lg text-center">
                            <p className="text-xs text-gray-600 mb-1">Ticket Médio</p>
                            <p className="text-2xl font-bold text-purple-600">
                              {formatCurrency(client.totalSpent / client.totalOrders)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal de Detalhes do Pedido */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Detalhes do Pedido #{selectedOrder.id.slice(-8)}</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedOrder(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Informações do Cliente */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Informações do Cliente
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 mt-0.5 text-gray-600" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Nome Completo</p>
                        <p className="font-medium">{selectedOrder.userName || 'Cliente não identificado'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 mt-0.5 text-gray-600" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium break-all">{selectedOrder.userEmail || 'Email não disponível'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Package className="h-4 w-4 mt-0.5 text-gray-600" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">ID do Usuário</p>
                        <p className="font-mono text-sm break-all">{selectedOrder.userId}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Itens do Pedido */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-purple-600" />
                    Itens do Pedido
                  </h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">Quantidade: {item.quantity}x</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{formatCurrency(item.price * item.quantity)}</p>
                          <p className="text-xs text-gray-500">{formatCurrency(item.price)} cada</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Informações de Pagamento */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Informações de Pagamento
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Método de Pagamento:</span>
                      <Badge variant="outline" className="uppercase">{selectedOrder.paymentMethod}</Badge>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-lg font-medium">Total:</span>
                      <span className="text-2xl font-bold text-green-600">{formatCurrency(selectedOrder.total)}</span>
                    </div>
                    {selectedOrder.pixCode && (
                      <div className="mt-3 p-3 bg-white rounded border">
                        <p className="text-xs text-gray-500 mb-1">Código PIX:</p>
                        <p className="font-mono text-sm break-all">{selectedOrder.pixCode}</p>
                      </div>
                    )}
                    {selectedOrder.pickupCode && (
                      <div className="mt-3 p-3 bg-white rounded border">
                        <p className="text-xs text-gray-500 mb-1 text-center">Código de Retirada:</p>
                        <p className="font-mono text-2xl font-bold text-center text-purple-600">{selectedOrder.pickupCode}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Status e Datas */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    Status e Histórico
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Status Atual:</span>
                      <Badge className={getStatusColor(selectedOrder.status)}>
                        {getStatusIcon(selectedOrder.status)}
                        <span className="ml-1 capitalize">{selectedOrder.status}</span>
                      </Badge>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="h-4 w-4 mt-0.5 text-gray-600" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Criado em</p>
                        <p className="font-medium">{formatDate(selectedOrder.created)}</p>
                      </div>
                    </div>
                    {selectedOrder.updated && (
                      <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                        <RefreshCw className="h-4 w-4 mt-0.5 text-gray-600" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Última atualização</p>
                          <p className="font-medium">{formatDate(selectedOrder.updated)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ações de Atualização de Status */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg mb-3">Atualizar Status</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedOrder.status !== 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(selectedOrder.id, 'pending')}
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        Pendente
                      </Button>
                    )}
                    {selectedOrder.status !== 'paid' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(selectedOrder.id, 'paid')}
                      >
                        <DollarSign className="h-4 w-4 mr-1" />
                        Pago
                      </Button>
                    )}
                    {selectedOrder.status !== 'preparing' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(selectedOrder.id, 'preparing')}
                      >
                        <Package className="h-4 w-4 mr-1" />
                        Preparando
                      </Button>
                    )}
                    {selectedOrder.status !== 'ready' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(selectedOrder.id, 'ready')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Pronto
                      </Button>
                    )}
                    {selectedOrder.status !== 'completed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(selectedOrder.id, 'completed')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Concluído
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal de Detalhes do Cliente */}
        {selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-6 w-6 text-purple-600" />
                    Perfil do Cliente
                  </CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedClient(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Informações Gerais */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4">{selectedClient.userName}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium break-all">{selectedClient.userEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-500">ID do Cliente</p>
                        <p className="font-mono text-sm break-all">{selectedClient.userId}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estatísticas do Cliente */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-blue-50">
                    <CardContent className="pt-6 text-center">
                      <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <p className="text-sm text-gray-600">Total de Pedidos</p>
                      <p className="text-3xl font-bold text-blue-600">{selectedClient.totalOrders}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50">
                    <CardContent className="pt-6 text-center">
                      <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <p className="text-sm text-gray-600">Total Gasto</p>
                      <p className="text-3xl font-bold text-green-600">{formatCurrency(selectedClient.totalSpent)}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-50">
                    <CardContent className="pt-6 text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <p className="text-sm text-gray-600">Ticket Médio</p>
                      <p className="text-3xl font-bold text-purple-600">
                        {formatCurrency(selectedClient.totalSpent / selectedClient.totalOrders)}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Histórico de Pedidos do Cliente */}
                <div>
                  <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    Histórico de Pedidos ({selectedClient.orders.length})
                  </h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedClient.orders
                      .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
                      .map((order) => (
                        <div key={order.id} className="border rounded-lg p-4 bg-white hover:bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold">Pedido #{order.id.slice(-8)}</p>
                              <p className="text-sm text-gray-500">{formatDate(order.created)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(order.status)}>
                                {getStatusIcon(order.status)}
                                <span className="ml-1 capitalize">{order.status}</span>
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedClient(null)
                                  setSelectedOrder(order)
                                }}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t">
                            <div className="text-sm text-gray-600">
                              {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                            </div>
                            <div className="font-bold text-green-600">{formatCurrency(order.total)}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
