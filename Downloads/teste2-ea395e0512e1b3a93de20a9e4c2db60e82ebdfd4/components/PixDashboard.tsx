import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Users,
  CreditCard,
  BarChart3,
  Download,
  RefreshCw,
  Eye,
  Trash2,

} from 'lucide-react'
import { pixSystem, type PixResponse } from '../utils/pixAdvanced'
import { toast } from 'sonner'

export const PixDashboard: React.FC = () => {
  const [payments, setPayments] = useState<PixResponse[]>([])
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalTransactions: 0,
    pendingCount: 0,
    paidCount: 0,
    expiredCount: 0,
    conversionRate: '0'
  })
  const [selectedPayment, setSelectedPayment] = useState<PixResponse | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'expired'>('all')
  const [isLoading, setIsLoading] = useState(false)

  // Carregar dados
  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setIsLoading(true)
    try {
      const allPayments = pixSystem.getAllPayments()
      const statistics = pixSystem.getStats()
      
      setPayments(allPayments.sort((a, b) => 
        new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime()
      ))
      setStats(statistics)
    } catch (error) {
      toast.error('Erro ao carregar dados')
    } finally {
      setIsLoading(false)
    }
  }

  // Filtrar pagamentos
  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true
    return payment.status === filter
  })

  // Confirmar pagamento manualmente
  const confirmPayment = (transactionId: string) => {
    const success = (pixSystem as any).confirmPayment(transactionId)
    if (success) {
      loadData()
      toast.success('Pagamento confirmado!')
    } else {
      toast.error('Erro ao confirmar pagamento')
    }
  }

  // Cancelar pagamento
  const cancelPayment = (transactionId: string) => {
    const success = pixSystem.cancelPayment(transactionId)
    if (success) {
      loadData()
      toast.success('Pagamento cancelado!')
    } else {
      toast.error('Erro ao cancelar pagamento')
    }
  }

  // Exportar dados
  const exportData = () => {
    const csvContent = [
      ['ID', 'Cliente', 'Email', 'Valor', 'Status', 'Data', 'Pedido'].join(','),
      ...payments.map(p => [
        p.transactionId,
        p.customer.name,
        p.customer.email,
        p.amount.toFixed(2),
        p.status,
        new Date(p.expiresAt).toLocaleString(),
        p.orderId
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cookite-pix-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Dados exportados!')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'paid': return 'bg-green-100 text-green-800 border-green-200'
      case 'expired': return 'bg-red-100 text-red-800 border-red-200'
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'paid': return <CheckCircle className="w-4 h-4" />
      case 'expired': return <AlertCircle className="w-4 h-4" />
      case 'cancelled': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard PIX</h1>
          <p className="text-gray-600">Gestão completa dos pagamentos PIX</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={loadData} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button variant="outline" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Faturado</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {stats.totalAmount.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.paidCount} pagamentos confirmados
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transações</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalTransactions}
            </div>
            <p className="text-xs text-muted-foreground">
              Todas as transações
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Aguardando pagamento
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.conversionRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              Pagamentos confirmados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Conteúdo */}
      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        {/* Lista de Transações */}
        <TabsContent value="transactions" className="space-y-4">
          {/* Filtros */}
          <div className="flex gap-4 items-center">
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                Todos ({payments.length})
              </Button>
              <Button
                variant={filter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('pending')}
              >
                Pendentes ({stats.pendingCount})
              </Button>
              <Button
                variant={filter === 'paid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('paid')}
              >
                Pagos ({stats.paidCount})
              </Button>
              <Button
                variant={filter === 'expired' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('expired')}
              >
                Expirados ({stats.expiredCount})
              </Button>
            </div>
          </div>

          {/* Lista de Pagamentos */}
          <div className="space-y-3">
            {filteredPayments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    Nenhuma transação encontrada
                  </h3>
                  <p className="text-gray-500">
                    {filter === 'all' 
                      ? 'Quando houver pagamentos PIX, eles aparecerão aqui.'
                      : `Nenhuma transação com status "${filter}".`
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredPayments.map((payment) => (
                <Card key={payment.transactionId} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{payment.customer.name}</h4>
                          <p className="text-sm text-gray-600">{payment.customer.email}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(payment.expiresAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <div className="text-xl font-bold">
                            R$ {payment.amount.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {payment.orderId}
                          </div>
                        </div>
                        
                        <Badge className={getStatusColor(payment.status)}>
                          {getStatusIcon(payment.status)}
                          <span className="ml-1 capitalize">{payment.status}</span>
                        </Badge>
                        
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPayment(payment)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          {payment.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => confirmPayment(payment.transactionId)}
                              className="text-green-600 hover:bg-green-50"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          
                          {(payment.status === 'pending' || payment.status === 'expired') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => cancelPayment(payment.transactionId)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Resumo de Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Taxa de Conversão:</span>
                  <span className="font-bold text-green-600">{stats.conversionRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Ticket Médio:</span>
                  <span className="font-bold">
                    R$ {stats.totalTransactions > 0 
                      ? (stats.totalAmount / stats.paidCount || 0).toFixed(2) 
                      : '0.00'
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total de Clientes:</span>
                  <span className="font-bold">{new Set(payments.map(p => p.customer.email)).size}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status dos Pagamentos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Confirmados</span>
                  </div>
                  <span className="font-bold">{stats.paidCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Pendentes</span>
                  </div>
                  <span className="font-bold">{stats.pendingCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Expirados</span>
                  </div>
                  <span className="font-bold">{stats.expiredCount}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configurações */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações PIX</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Chave PIX:</label>
                  <p className="text-lg font-mono bg-gray-100 p-2 rounded">42151999807</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Tipo:</label>
                  <p className="text-lg">CPF</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Empresa:</label>
                  <p className="text-lg">COOKITIE</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Cidade:</label>
                  <p className="text-lg">SAO PAULO</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Detalhes */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full m-4">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Detalhes da Transação</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedPayment(null)}
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">ID:</label>
                  <p className="font-mono text-sm">{selectedPayment.transactionId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status:</label>
                  <Badge className={getStatusColor(selectedPayment.status)}>
                    {getStatusIcon(selectedPayment.status)}
                    <span className="ml-1 capitalize">{selectedPayment.status}</span>
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Cliente:</label>
                  <p>{selectedPayment.customer.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email:</label>
                  <p>{selectedPayment.customer.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Telefone:</label>
                  <p>{selectedPayment.customer.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Valor:</label>
                  <p className="text-xl font-bold text-green-600">
                    R$ {selectedPayment.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Pedido:</label>
                  <p>{selectedPayment.orderId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Expira em:</label>
                  <p>{new Date(selectedPayment.expiresAt).toLocaleString()}</p>
                </div>
              </div>
              
              {selectedPayment.status === 'pending' && (
                <div className="text-center">
                  <img 
                    src={selectedPayment.qrCodeBase64} 
                    alt="QR Code" 
                    className="w-48 h-48 mx-auto border rounded"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
