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
  Package,
  Mail,
  User,
  Calendar
} from 'lucide-react'
import { toast } from 'sonner'

interface AdminProps {
  onBackToProducts: () => void
}

export const Admin = ({ onBackToProducts }: AdminProps) => {
  const { orders, loading, syncing, updateOrderStatus, getOrderStats, refreshOrders } = useAdminOrders()
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)
  const [filterStatus, setFilterStatus] = useState<AdminOrder['status'] | 'all'>('all')
  const [isAdminAuthed, setIsAdminAuthed] = useState<boolean>(() => {
    try { return localStorage.getItem('cookittie_admin_authed') === 'true' } catch { return false }
  })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim() === 'cookittie@adm' && password === 'cokittie2025') {
      try { localStorage.setItem('cookittie_admin_authed', 'true') } catch {}
      setIsAdminAuthed(true)
      return
    }
    try { toast.error('Credenciais inválidas') } catch {}
  }

  const handleAdminLogout = () => {
    try { localStorage.removeItem('cookittie_admin_authed') } catch {}
    setIsAdminAuthed(false)
  }

  if (!isAdminAuthed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FDFAF5' }}>
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Acesso do Administrador</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cookittie@adm"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="cokittie2025"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <Button type="button" variant="outline" onClick={onBackToProducts}>
                  Voltar
                </Button>
                <Button type="submit">
                  Entrar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
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
                onClick={handleAdminLogout}
                variant="outline"
                size="sm"
              >
                Sair Admin
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
                        <div className="flex flex-col gap-1 mt-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="h-4 w-4" />
                            <span className="font-medium">{order.userName || 'Cliente não identificado'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4" />
                            <span>{order.userEmail || 'Email não disponível'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(order.created)}</span>
                          </div>
                        </div>
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                      <div>
                        <p className="text-sm font-medium mb-1">Itens do Pedido:</p>
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <p key={idx} className="text-sm text-gray-600">
                              • {item.name} <span className="font-medium">({item.quantity}x)</span>
                            </p>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Total:</p>
                        <p className="text-xl text-green-600 font-bold">
                          {formatCurrency(order.total)}
                        </p>
                        {order.pickupCode && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500">Código de Retirada:</p>
                            <p className="text-sm font-mono font-semibold">{order.pickupCode}</p>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Ações:</p>
                        <div className="flex flex-col gap-1">
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
              <CardContent className="space-y-6">
                {/* Informações do Cliente */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Informações do Cliente
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 mt-0.5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Nome Completo</p>
                        <p className="font-medium">{selectedOrder.userName || 'Cliente não identificado'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 mt-0.5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium">{selectedOrder.userEmail || 'Email não disponível'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Package className="h-4 w-4 mt-0.5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">ID do Usuário</p>
                        <p className="font-mono text-sm">{selectedOrder.userId}</p>
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
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Método de Pagamento:</span>
                      <Badge variant="outline" className="uppercase">{selectedOrder.paymentMethod}</Badge>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-lg font-medium">Total:</span>
                      <span className="text-2xl font-bold text-green-600">{formatCurrency(selectedOrder.total)}</span>
                    </div>
                    {selectedOrder.pixCode && (
                      <div className="mt-3 p-2 bg-white rounded border">
                        <p className="text-xs text-gray-500 mb-1">Código PIX:</p>
                        <p className="font-mono text-sm break-all">{selectedOrder.pixCode}</p>
                      </div>
                    )}
                    {selectedOrder.pickupCode && (
                      <div className="mt-3 p-2 bg-white rounded border">
                        <p className="text-xs text-gray-500 mb-1">Código de Retirada:</p>
                        <p className="font-mono text-lg font-bold text-center">{selectedOrder.pickupCode}</p>
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
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
