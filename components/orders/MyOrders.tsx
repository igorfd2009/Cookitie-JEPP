import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Calendar,
  Eye,
  Star,
  ShoppingBag,
  ArrowLeft,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { AuthModals } from '../auth/AuthModals';
import { useOrders, type Order } from '../../hooks/useOrders';





interface MyOrdersProps {
  onBackToProducts: () => void;
}

export function MyOrders({ onBackToProducts }: MyOrdersProps) {
  const { isAuthenticated, profile } = useAuth();
  const { orders, loading, loadOrders } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const getStatusInfo = (status: Order['status']) => {
    const statusMap = {
      pending: { 
        label: 'Pendente', 
        color: 'bg-yellow-500', 
        icon: Clock,
        description: 'Aguardando confirmação'
      },
      confirmed: { 
        label: 'Confirmado', 
        color: 'bg-blue-500', 
        icon: CheckCircle,
        description: 'Pedido confirmado'
      },
      completed: { 
        label: 'Completo', 
        color: 'bg-green-500', 
        icon: CheckCircle,
        description: 'Pedido completo'
      },
      cancelled: { 
        label: 'Cancelado', 
        color: 'bg-red-500', 
        icon: XCircle,
        description: 'Pedido cancelado'
      }
    };
    return statusMap[status];
  };

  const getPaymentStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: 'Pendente', color: 'bg-yellow-500' },
      paid: { label: 'Pago', color: 'bg-green-500' },
      failed: { label: 'Falhou', color: 'bg-red-500' }
    };
    return statusMap[status] || statusMap.pending;
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-cookite-gray)] to-white py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-[var(--color-cookite-blue)]" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Faça login para ver seus pedidos
            </h2>
            <p className="text-gray-600 mb-6">
              Acesse sua conta para visualizar o histórico de pedidos e acompanhar o status das suas encomendas.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="bg-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue-hover)] text-white"
              >
                Entrar para ver pedidos
              </Button>
              <Button 
                onClick={onBackToProducts}
                variant="outline"
                className="border-[var(--color-cookite-blue)] text-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue)] hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar aos Produtos
              </Button>
            </div>
          </div>
        </div>
        <AuthModals isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} defaultTab="login" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-cookite-gray)] to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              onClick={onBackToProducts}
              variant="outline"
              size="sm"
              className="text-[var(--color-cookite-blue)] border-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue)] hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Meus Pedidos</h1>
              <p className="text-gray-600">
                Olá, {profile?.name?.trim() || profile?.email?.split('@')[0] || 'Usuário'}! Aqui estão seus pedidos.
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por ID ou produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 border-none outline-none text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-cookite-blue)] focus:border-transparent"
              >
                <option value="all">Todos os status</option>
                <option value="pending">Pendente</option>
                <option value="confirmed">Confirmado</option>
                                 <option value="completed">Completo</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
            <Button
              onClick={loadOrders}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg">
              <div className="w-5 h-5 border-2 border-[var(--color-cookite-blue)] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">Carregando seus pedidos...</span>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {searchTerm || statusFilter !== 'all' ? 'Nenhum pedido encontrado' : 'Você ainda não fez nenhum pedido'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Tente ajustar os filtros de busca.' 
                  : 'Que tal experimentar nossos deliciosos doces artesanais?'
                }
              </p>
              <Button 
                onClick={onBackToProducts}
                className="bg-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue-hover)] text-white"
              >
                Ver Produtos
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
               const paymentInfo = getPaymentStatusInfo('pending');
              const StatusIcon = statusInfo.icon;

              return (
                <Card key={order.id} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-gray-800">
                        Pedido #{order.id}
                      </CardTitle>
                      <Button
                        onClick={() => setSelectedOrder(order)}
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${statusInfo.color} text-white text-xs px-2 py-1`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                      <Badge className={`${paymentInfo.color} text-white text-xs px-2 py-1`}>
                        {paymentInfo.label}
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
                        <span className="text-lg font-bold text-[var(--color-cookite-blue)]">
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
                        className="flex-1 text-[var(--color-cookite-blue)] border-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue)] hover:text-white"
                      >
                        Ver Detalhes
                      </Button>
                                             {order.status === 'completed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                        >
                          <Star className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Pedido #{selectedOrder.id}
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

                {/* Status and Payment */}
                <div className="flex gap-3 mb-6">
                  {(() => {
                    const statusInfo = getStatusInfo(selectedOrder.status);
                                         const paymentInfo = getPaymentStatusInfo('pending');
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <>
                        <Badge className={`${statusInfo.color} text-white px-3 py-2`}>
                          <StatusIcon className="w-4 h-4 mr-2" />
                          {statusInfo.label}
                        </Badge>
                        <Badge className={`${paymentInfo.color} text-white px-3 py-2`}>
                          {paymentInfo.label}
                        </Badge>
                      </>
                    );
                  })()}
                </div>

                {/* Items */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Itens do Pedido</h3>
                  <div className="space-y-3">
                                         {selectedOrder.items.map((item: any) => (
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
                        <Clock className="w-4 h-4 text-gray-400" />
                                                 <span>Retirada: {formatDate(selectedOrder.created_at)}</span>
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
                        <span className="font-bold text-[var(--color-cookite-blue)] text-lg">
                          {formatCurrency(selectedOrder.total)}
                        </span>
                      </div>
                    </div>
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
                                     {selectedOrder.status === 'completed' && (
                     <Button className="bg-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue-hover)] text-white">
                       <Star className="w-4 h-4 mr-2" />
                       Avaliar
                     </Button>
                   )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
