import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Eye, X, Users, DollarSign, Package, TrendingUp, Search, RefreshCw, Phone, Calendar, CreditCard, Clock, CheckCircle, AlertCircle, QrCode, UserCheck, TrendingDown } from "lucide-react";
import { PixDashboard } from './PixDashboard';
import { AdminOrdersPanel } from './AdminOrdersPanel';
import { useReservations } from "../hooks/useReservations";
import { toast } from "sonner";

// Sistema de Autenticação e Supabase
import { supabase } from '../lib/supabase';

export function AdminDashboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [_adminReservations, setAdminReservations] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<any[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentSearchTerm, setPaymentSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  
  const { reservations, isLoading } = useReservations();

  const loadData = async () => {
    if (isInitializing) return; // Evitar múltiplas chamadas
    
    try {
      setError(null);
      setIsInitializing(true);
      
      // Carregar reservas
      try {
        const reservationsResult = reservations;
        if (reservationsResult && Array.isArray(reservationsResult)) {
          setAdminReservations(reservationsResult);
          setFilteredReservations(reservationsResult);
        } else if (reservationsResult && typeof reservationsResult === 'object' && 'reservations' in reservationsResult && Array.isArray((reservationsResult as any).reservations)) {
          setAdminReservations((reservationsResult as any).reservations);
          setFilteredReservations((reservationsResult as any).reservations);
        } else {
          setAdminReservations([]);
          setFilteredReservations([]);
        }
      } catch (reservationError) {
        if (import.meta.env.DEV) {
          console.error('Error loading reservations:', reservationError);
        }
        setAdminReservations([]);
        setFilteredReservations([]);
      }

      // Carregar pagamentos
      try {
        const paymentsResult = reservations.filter(r => r.paymentStatus === 'paid' || r.paymentStatus === 'pending');
        if (paymentsResult && Array.isArray(paymentsResult)) {
          setPayments(paymentsResult);
          setFilteredPayments(paymentsResult);
        } else if (paymentsResult && typeof paymentsResult === 'object' && 'payments' in paymentsResult && Array.isArray((paymentsResult as any).payments)) {
          setPayments((paymentsResult as any).payments);
          setFilteredPayments((paymentsResult as any).payments);
        } else {
          setPayments([]);
          setFilteredPayments([]);
        }
      } catch (paymentError) {
        if (import.meta.env.DEV) {
          console.error('Error loading payments:', paymentError);
        }
        setPayments([]);
        setFilteredPayments([]);
      }

      // Carregar estatísticas
      try {
        const statsResult = { total: reservations.length, paid: reservations.filter(r => r.paymentStatus === 'paid').length, pending: reservations.filter(r => r.paymentStatus === 'pending').length };
        if (statsResult && typeof statsResult === 'object') {
          setStats(statsResult);
        } else {
          setStats(null);
        }
      } catch (statsError) {
        if (import.meta.env.DEV) {
          console.error('Error loading stats:', statsError);
        }
        setStats(null);
      }

      // Carregar estatísticas de usuários
      try {
        await loadUserStats();
      } catch (userStatsError) {
        if (import.meta.env.DEV) {
          console.error('Error loading user stats:', userStatsError);
        }
        setUserStats(null);
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      if (import.meta.env.DEV) {
        console.error('Error loading admin data:', error);
      }
      toast.error(`Erro ao carregar dados: ${errorMessage}`);
    } finally {
      setIsInitializing(false);
    }
  };

  // Função para carregar estatísticas de usuários
  const loadUserStats = async () => {
    try {
      if (!supabase) {
        console.warn('Supabase não está disponível');
        return;
      }
      const { data: users, error } = await supabase
        .from('user_profiles')
        .select('total_pedidos, total_gasto, data_criacao, primeiro_pedido');
      
      if (error) {
        console.error('Error loading user stats:', error);
        return;
      }
      
      const stats = {
        totalUsuarios: users?.length || 0,
        usuariosAtivos: users?.filter(u => u.total_pedidos > 0).length || 0,
        receitaTotal: users?.reduce((sum, u) => sum + (u.total_gasto || 0), 0) || 0,
        novosCadastros: users?.filter(u => 
          new Date(u.data_criacao) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length || 0,
        primeiroPedido: users?.filter(u => u.primeiro_pedido).length || 0,
        mediaPedidos: users?.length > 0 
          ? (users?.reduce((sum, u) => sum + (u.total_pedidos || 0), 0) || 0) / users.length
          : 0,
        mediaGasto: users?.length > 0 
          ? (users?.reduce((sum, u) => sum + (u.total_gasto || 0), 0) || 0) / users.length
          : 0,
      };
      
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
      setUserStats(null);
    }
  };

  useEffect(() => {
    if (isVisible && !isInitializing) {
      loadData();
    }
  }, [isVisible]); // Removido loadData das dependências

  useEffect(() => {
    let filtered = reservations;
    if (searchTerm) {
      filtered = filtered.filter(reservation =>
        reservation && 
        reservation.name && 
        reservation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation && 
        reservation.phone && 
        reservation.phone.includes(searchTerm) ||
        reservation && 
        reservation.email && 
        reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation && 
        reservation.id && 
        reservation.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredReservations(filtered);
  }, [searchTerm, reservations]);

  useEffect(() => {
    let filtered = payments;
    if (paymentSearchTerm) {
      filtered = filtered.filter(payment =>
        payment && 
        payment.transactionId && 
        payment.transactionId.toLowerCase().includes(paymentSearchTerm.toLowerCase()) ||
        payment && 
        payment.description && 
        payment.description.toLowerCase().includes(paymentSearchTerm.toLowerCase())
      );
    }
    setFilteredPayments(filtered);
  }, [paymentSearchTerm, payments]);

  const formatDate = (dateString: string): string => {
    try {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  const formatCurrency = (value: number): string => {
    try {
      if (typeof value !== 'number' || isNaN(value)) return 'R$ 0,00';
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    } catch {
      return 'R$ 0,00';
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    if (!status) return <Badge variant="outline">Desconhecido</Badge>;
    
    switch (status.toLowerCase()) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle size={12} className="mr-1" />Pago</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock size={12} className="mr-1" />Pendente</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle size={12} className="mr-1" />Expirado</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800"><X size={12} className="mr-1" />Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          className="bg-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue-hover)] text-gray-800 rounded-full w-14 h-14 p-0 shadow-lg animate-pulse-glow"
          title="Painel Administrativo"
        >
          <Eye size={24} />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-[var(--color-cookite-blue)] to-[var(--color-cookite-yellow)]">
          <div>
            <h2 className="text-2xl text-gray-800 mb-1">Painel Administrativo</h2>
            <p className="text-sm text-gray-600">Cookite - JEPP 2025 • Pagamentos PIX</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={loadData}
              variant="outline"
              size="sm"
              className="bg-white border-gray-300"
              disabled={isLoading || isInitializing}
            >
              <RefreshCw size={16} className={(isLoading || isInitializing) ? 'animate-spin' : ''} />
              {isInitializing ? 'Inicializando...' : 'Atualizar'}
            </Button>
            <Button
              onClick={() => setIsVisible(false)}
              variant="outline"
              size="sm"
              className="bg-white border-gray-300"
            >
              <X size={16} />
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-100px)] p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle size={20} />
                <span className="font-medium">Erro ao carregar dados:</span>
                <span>{error}</span>
              </div>
              <Button
                onClick={loadData}
                variant="outline"
                size="sm"
                className="mt-2 border-red-300 text-red-700 hover:bg-red-100"
              >
                Tentar novamente
              </Button>
            </div>
          )}
          
          {isInitializing ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-[var(--color-cookite-blue)] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Inicializando painel administrativo...</p>
            </div>
          ) : (
            <>
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[var(--color-cookite-blue)] rounded-xl flex items-center justify-center">
                          <Users className="text-gray-800" size={24} />
                        </div>
                        <div>
                          <p className="text-2xl text-gray-800">{stats.totalReservations || 0}</p>
                          <p className="text-sm text-gray-600">Total Reservas</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <CheckCircle className="text-green-600" size={24} />
                        </div>
                        <div>
                          <p className="text-2xl text-gray-800">{stats.paidReservations || 0}</p>
                          <p className="text-sm text-gray-600">Reservas Pagas</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                          <Clock className="text-yellow-600" size={24} />
                        </div>
                        <div>
                          <p className="text-2xl text-gray-800">{stats.pendingPayments || 0}</p>
                          <p className="text-sm text-gray-600">Pendentes</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[var(--color-cookite-yellow)] rounded-xl flex items-center justify-center">
                          <DollarSign className="text-gray-800" size={24} />
                        </div>
                        <div>
                          <p className="text-2xl text-gray-800">{formatCurrency(stats.totalRevenue || 0)}</p>
                          <p className="text-sm text-gray-600">Receita Total</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[var(--color-cookite-blue)] rounded-xl flex items-center justify-center">
                          <TrendingUp className="text-gray-800" size={24} />
                        </div>
                        <div>
                          <p className="text-2xl text-gray-800">{stats.conversionRate || '0%'}</p>
                          <p className="text-sm text-gray-600">Conversão</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Estatísticas de Usuários */}
              {userStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <UserCheck className="text-blue-600" size={24} />
                        </div>
                        <div>
                          <p className="text-2xl text-gray-800">{userStats.totalUsuarios}</p>
                          <p className="text-sm text-gray-600">Total Usuários</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <TrendingUp className="text-green-600" size={24} />
                        </div>
                        <div>
                          <p className="text-2xl text-gray-800">{userStats.usuariosAtivos}</p>
                          <p className="text-sm text-gray-600">Usuários Ativos</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <DollarSign className="text-purple-600" size={24} />
                        </div>
                        <div>
                          <p className="text-2xl text-gray-800">{formatCurrency(userStats.receitaTotal)}</p>
                          <p className="text-sm text-gray-600">Receita Total</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                          <TrendingDown className="text-orange-600" size={24} />
                        </div>
                        <div>
                          <p className="text-2xl text-gray-800">{userStats.novosCadastros}</p>
                          <p className="text-sm text-gray-600">Novos (7d)</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Estatísticas Detalhadas de Usuários */}
              {userStats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-blue-600">{userStats.primeiroPedido}</p>
                        <p className="text-sm text-gray-600">Primeiro Pedido</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {userStats.totalUsuarios > 0 
                            ? `${((userStats.primeiroPedido / userStats.totalUsuarios) * 100).toFixed(1)}% dos usuários`
                            : '0% dos usuários'
                          }
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-green-600">{userStats.mediaPedidos.toFixed(1)}</p>
                        <p className="text-sm text-gray-600">Média de Pedidos</p>
                        <p className="text-xs text-gray-500 mt-1">Por usuário</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-600">{formatCurrency(userStats.mediaGasto)}</p>
                        <p className="text-sm text-gray-600">Média de Gasto</p>
                        <p className="text-xs text-gray-500 mt-1">Por usuário</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <Tabs defaultValue="orders" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="orders" className="flex items-center gap-2">
                    <Package size={16} />
                    Pedidos
                  </TabsTrigger>
                  <TabsTrigger value="reservations" className="flex items-center gap-2">
                    <Calendar size={16} />
                    Reservas ({reservations.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="payments" className="flex items-center gap-2">
                    <CreditCard size={16} />
                    Pagamentos PIX ({payments.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="pix-dashboard" className="flex items-center gap-2">
                    <QrCode size={16} />
                    Dashboard PIX
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="orders" className="space-y-4">
                  <AdminOrdersPanel />
                </TabsContent>

                <TabsContent value="reservations" className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar reservas por nome, telefone, email ou ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin w-8 h-8 border-4 border-[var(--color-cookite-blue)] border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-600">Carregando reservas...</p>
                    </div>
                  ) : filteredReservations.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Package className="mx-auto mb-4 text-gray-400" size={48} />
                        <p className="text-gray-600 mb-2">Nenhuma reserva encontrada</p>
                        <p className="text-sm text-gray-500">
                          {reservations.length === 0 ? 'Não há reservas no sistema' : 'Nenhuma reserva corresponde à busca'}
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        {filteredReservations.length} reserva{filteredReservations.length !== 1 ? 's' : ''} encontrada{filteredReservations.length !== 1 ? 's' : ''}
                      </p>
                      
                      {filteredReservations.map((reservation, index) => (
                        <Card key={reservation?.id || index} className="shadow-sm hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg mb-1">{reservation?.name || 'Nome não informado'}</CardTitle>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Phone size={14} />
                                    {reservation?.phone || 'Telefone não informado'}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    {formatDate(reservation?.createdAt)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={reservation?.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                  {reservation?.status === 'paid' ? 'Pago' : 'Pendente'}
                                </Badge>
                                <Badge variant="outline">
                                  {reservation?.id || 'ID não disponível'}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pt-0">
                            <div className="space-y-3">
                              <div>
                                <h4 className="text-sm mb-2 text-gray-800">Itens do Pedido:</h4>
                                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                                  {reservation?.products && Array.isArray(reservation.products) && reservation.products.length > 0 ? (
                                    reservation.products.map((item: any, itemIndex: number) => (
                                      <div key={itemIndex} className="flex justify-between text-sm">
                                        <span className="text-gray-700">
                                          {item?.quantity || 0}x {item?.name || 'Produto não identificado'}
                                        </span>
                                        <span className="text-gray-800">
                                          {formatCurrency((item?.quantity || 0) * (item?.price || 0))}
                                        </span>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-gray-500 text-sm">Nenhum produto encontrado</p>
                                  )}
                                  
                                  <div className="border-t pt-2 mt-2 space-y-1">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600">Total:</span>
                                      <span>{formatCurrency(reservation?.totalAmount || 0)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {reservation?.notes && (
                                <div>
                                  <h4 className="text-sm mb-1 text-gray-800">Observações:</h4>
                                  <p className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                                    {reservation.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="payments" className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar pagamentos por ID da transação..."
                        value={paymentSearchTerm}
                        onChange={(e) => setPaymentSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin w-8 h-8 border-4 border-[var(--color-cookite-blue)] border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-600">Carregando pagamentos...</p>
                    </div>
                  ) : filteredPayments.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <QrCode className="mx-auto mb-4 text-gray-400" size={48} />
                        <p className="text-gray-600 mb-2">Nenhum pagamento encontrado</p>
                        <p className="text-sm text-gray-500">
                          {payments.length === 0 ? 'Não há pagamentos no sistema' : 'Nenhum pagamento corresponde à busca'}
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        {filteredPayments.length} pagamento{filteredPayments.length !== 1 ? 's' : ''} encontrado{filteredPayments.length !== 1 ? 's' : ''}
                      </p>
                      
                      {filteredPayments.map((payment, index) => (
                        <Card key={payment?.transactionId || index} className="shadow-sm hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg mb-1 font-mono">{payment?.transactionId || 'ID não disponível'}</CardTitle>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <span>PIX • {payment?.description || 'Sem descrição'}</span>
                                  <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    Expira: {payment?.expiresAt ? formatDate(payment.expiresAt) : 'N/A'}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getPaymentStatusBadge(payment?.status)}
                                <div className="text-right">
                                  <p className="text-lg font-bold text-gray-800">{formatCurrency(payment?.amount || 0)}</p>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="text-sm">
                                  <span className="text-gray-600">Status:</span>
                                  <span className="ml-2">{payment?.status || 'Desconhecido'}</span>
                                </div>
                                <div className="text-sm">
                                  <span className="text-gray-600">Valor:</span>
                                  <span className="ml-2 font-medium">{formatCurrency(payment?.amount || 0)}</span>
                                </div>
                                <div className="text-sm">
                                  <span className="text-gray-600">Descrição:</span>
                                  <span className="ml-2">{payment?.description || 'Sem descrição'}</span>
                                </div>
                              </div>
                              
                              {payment?.status === 'pending' && payment?.pixCode && (
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <h4 className="text-sm font-medium text-gray-800 mb-2">Código PIX:</h4>
                                  <div className="text-xs font-mono bg-white p-2 rounded border break-all">
                                    {payment.pixCode}
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="pix-dashboard" className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 text-blue-800">
                      <QrCode size={20} />
                      <span className="font-medium">Dashboard PIX - Administrativo</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      Gerencie pagamentos PIX, monitore transações e visualize estatísticas em tempo real.
                    </p>
                  </div>
                  
                  <PixDashboard />
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
}