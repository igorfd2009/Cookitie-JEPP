import { useState, useEffect, useMemo } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  User, 
 
  CheckCircle, 
 
  CreditCard, 
  ArrowLeft,
  MapPin,
  Clock,
  Shield,
  Truck,
  CreditCard as CreditCardIcon,
  QrCode,
  Calendar,
  Star,
  Info as InfoIcon,
  Trash2,
  LogIn,
  UserCheck
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";
import { useReservations } from "../hooks/useReservations";
import { useValidation } from "../hooks/useValidation";
import { PaymentModal } from "./PaymentModal";
import { pixSystem } from "../utils/pixAdvanced";
import { emailSystem } from "../utils/emailAdvanced";

// Sistema de Autenticação
import { useAuth } from '../contexts/AuthContext';
import { AuthModals } from './auth/AuthModals';



interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
  maxStock: number;
}

interface PaymentData {
  transactionId: string;
  qrCode: string;
  pixCode: string;
  amount: number;
  expiresAt: string;
}

interface ConfirmedOrderDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  products: Array<{ id: string; name: string; quantity: number; price: number }>;
  totalAmount: number;
  discountApplied: boolean;
  notes: string;
  createdAt: string;
  paymentStatus: 'paid' | 'pending' | 'expired' | 'cancelled';
}

interface CheckoutPageProps {
  cartItems: CartItem[];
  onClearCart: () => void;
  onBackToProducts: () => void;
}

export function CheckoutPage({ cartItems, onClearCart, onBackToProducts }: CheckoutPageProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [pendingReservationDetails, setPendingReservationDetails] = useState<ConfirmedOrderDetails | null>(null);
  const [confirmedOrderDetails, setConfirmedOrderDetails] = useState<ConfirmedOrderDetails | null>(null);
  const [currentStep, setCurrentStep] = useState<'review' | 'customer-info' | 'payment' | 'confirmation'>('review');
  const [hasStartedCheckout, setHasStartedCheckout] = useState(false);
  
  // Sistema de Autenticação
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated, user, profile, loading: authLoading } = useAuth();
  
  const { createReservation, isLoading, updatePaymentStatus } = useReservations();
  const { formatPhone, validateWithServer, isValidEmail, isValidBrazilianPhone, isValidating } = useValidation();

  // Initialize quantities from cart items
  useEffect(() => {
    if (cartItems.length > 0) {
      const initialQuantities: Record<string, number> = {};
      cartItems.forEach(item => {
        initialQuantities[item.id] = item.quantity;
      });
      setQuantities(initialQuantities);
      setHasStartedCheckout(true);
    } else {
      // Se não há itens no carrinho, voltar para produtos
      setHasStartedCheckout(false);
      setCurrentStep('review');
    }
  }, [cartItems]);

  // Preencher dados do usuário quando estiver logado
  useEffect(() => {
    if (isAuthenticated && profile && !authLoading) {
      setCustomerInfo(prev => ({
        ...prev,
        name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || ''
      }));
    }
  }, [isAuthenticated, profile, authLoading]);

  // Reset checkout state when cart becomes empty
  useEffect(() => {
    if (cartItems.length === 0 && hasStartedCheckout) {
      setHasStartedCheckout(false);
      setCurrentStep('review');
      setCustomerInfo({ name: '', phone: '', email: '', notes: '' });
      setValidationErrors({});
      setShowPayment(false);
      setPaymentData(null);
      setPendingReservationDetails(null);
      setConfirmedOrderDetails(null);
    }
  }, [cartItems.length, hasStartedCheckout]);

  // Memoized calculations for better performance
  const calculations = useMemo(() => {
    const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
    const subtotal = cartItems.reduce((sum, item) => {
      const qty = quantities[item.id] || 0;
      return sum + (item.price * qty);
    }, 0);
    const discount = subtotal * 0.2; // 20% discount
    const total = subtotal - discount;

    return { totalItems, subtotal, discount, total };
  }, [quantities, cartItems]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    const item = cartItems.find(item => item.id === id);
    if (item && newQuantity > item.maxStock) return;
    
    setQuantities(prev => ({
      ...prev,
      [id]: newQuantity
    }));
  };

  const removeItem = (id: string) => {
    setQuantities(prev => {
      const newQuantities = { ...prev };
      delete newQuantities[id];
      return newQuantities;
    });
  };

  const handleCustomerInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setHasAttemptedSubmit(true);

    // Validações locais
    const localErrors: Record<string, string> = {};
    
    if (!customerInfo.name.trim()) {
      localErrors.name = 'Nome é obrigatório';
    }
    
    if (!customerInfo.phone.trim()) {
      localErrors.phone = 'Telefone é obrigatório';
    } else if (!isValidBrazilianPhone(customerInfo.phone)) {
      localErrors.phone = 'Telefone inválido';
    }
    
    if (!customerInfo.email.trim()) {
      localErrors.email = 'Email é obrigatório';
    } else if (!isValidEmail(customerInfo.email)) {
      localErrors.email = 'Email inválido';
    }

    if (Object.keys(localErrors).length > 0) {
      setValidationErrors(localErrors);
      return;
    }

    // Validação no servidor
    try {
      const serverValidation = await validateWithServer(customerInfo.email, customerInfo.phone);
      if (!serverValidation.valid) {
        // Converter ValidationError[] para Record<string, string>
        const errorMap: Record<string, string> = {};
        serverValidation.errors.forEach(error => {
          errorMap[error.field] = error.message;
        });
        setValidationErrors(errorMap);
        return;
      }
    } catch (error) {
      console.error('Erro na validação do servidor:', error);
      toast.error('Erro na validação. Tente novamente.');
      return;
    }

    setValidationErrors({});
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = async () => {
    if (calculations.totalItems === 0) {
      toast.error('Adicione produtos ao carrinho');
      return;
    }

    try {
      const products = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: quantities[item.id] || 0,
        price: item.price
      })).filter(product => product.quantity > 0);

      if (products.length === 0) {
        toast.error('Nenhum produto selecionado');
        return;
      }

      // Lógica de autenticação para dados do cliente
      let emailCliente = '';
      let nomeCliente = '';
      let telefoneCliente = '';

      if (isAuthenticated && user && profile) {
        // Cliente logado - usa dados do perfil
        emailCliente = user.email!;
        nomeCliente = profile.full_name || customerInfo.name.trim();
        telefoneCliente = profile.phone || customerInfo.phone.trim();
        
        // Aqui você pode atualizar estatísticas do usuário se necessário
        // await updateProfile({
        //   total_pedidos: (profile.total_pedidos || 0) + 1,
        //   total_gasto: (profile.total_gasto || 0) + calculations.total,
        //   primeiro_pedido: false,
        // });
      } else {
        // Cliente não logado - usa dados do formulário
        emailCliente = customerInfo.email.toLowerCase().trim();
        nomeCliente = customerInfo.name.trim();
        telefoneCliente = customerInfo.phone.trim();
      }

      const reservationData = {
        name: nomeCliente,
        email: emailCliente,
        phone: telefoneCliente,
        products,
        totalAmount: calculations.total,
        discountApplied: true,
        notes: customerInfo.notes.trim(),
        user_id: user?.id || null, // Vincula ao usuário se logado
        is_authenticated: isAuthenticated,
        paymentStatus: 'pending' as const
      };

      const result = await createReservation(reservationData);

      if (result?.success) {
        setPendingReservationDetails({
          id: result.reservationId || 'N/A',
          name: nomeCliente,
          email: emailCliente,
          phone: telefoneCliente,
          products,
          totalAmount: calculations.total,
          discountApplied: true,
          notes: customerInfo.notes,
          createdAt: new Date().toISOString(),
          paymentStatus: 'pending'
        });

        // Criar pagamento PIX usando o sistema avançado
        const pixPayment = await pixSystem.createPayment({
          amount: calculations.total,
          description: `Reserva Cookite JEPP - ${products.map(p => p.name).join(', ')}`,
          orderId: result.reservationId || `order_${Date.now()}`,
          customer: {
            name: nomeCliente,
            email: emailCliente,
            phone: telefoneCliente
          },
          expiresInMinutes: 30
        });

        if (pixPayment.success) {
          setPaymentData({
            transactionId: pixPayment.transactionId,
            qrCode: pixPayment.qrCodeBase64,
            pixCode: pixPayment.pixCode,
            amount: pixPayment.amount,
            expiresAt: pixPayment.expiresAt
          });
          setShowPayment(true);
        } else {
          toast.error('Erro ao gerar PIX: ' + pixPayment.error);
        }

        setCurrentStep('confirmation');
        toast.success('Reserva criada com sucesso!');
      } else {
        toast.error(result?.error || 'Erro ao criar reserva');
      }
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      toast.error('Erro ao criar reserva. Tente novamente.');
    }
  };

  const handleBackToProducts = () => {
    // Limpar todos os estados e voltar para produtos
    setCurrentStep('review');
    setCustomerInfo({ name: '', phone: '', email: '', notes: '' });
    setValidationErrors({});
    setShowPayment(false);
    setPaymentData(null);
    setPendingReservationDetails(null);
    setConfirmedOrderDetails(null);
    setHasStartedCheckout(false);
    onClearCart(); // Limpar o carrinho
    onBackToProducts(); // Voltar para a página de produtos
  };

  const handlePaymentClose = () => {
    // Quando o usuário fecha o pagamento, mostrar opções
    if (confirm('Deseja sair do pagamento? Sua reserva será mantida e você poderá retornar depois.')) {
      setShowPayment(false);
      setCurrentStep('payment');
      toast.info('Pagamento pausado. Você pode retomar a qualquer momento.');
    }
  };



  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (currentStep === 'confirmation' && confirmedOrderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[var(--color-cookite-gray)] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
                             <CardTitle className="text-xl sm:text-2xl text-green-800">Pedido Confirmado!</CardTitle>
              <p className="text-green-600">Seu pedido foi processado com sucesso</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Detalhes do Pedido</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                  <div>
                    <span className="font-medium">ID do Pedido:</span>
                    <p className="text-gray-600">{confirmedOrderDetails.id}</p>
                  </div>
                  <div>
                    <span className="font-medium">Data:</span>
                    <p className="text-gray-600">{formatDate(confirmedOrderDetails.createdAt)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Nome:</span>
                    <p className="text-gray-600">{confirmedOrderDetails.name}</p>
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>
                    <p className="text-gray-600">{confirmedOrderDetails.email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Produtos</h3>
                <div className="space-y-3">
                  {confirmedOrderDetails.products.map((product, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600">{product.quantity}x</span>
                        <span className="font-medium">{product.name}</span>
                      </div>
                      <span className="font-semibold">{formatCurrency(product.price * product.quantity)}</span>
                    </div>
                  ))}
                  <div className="pt-2">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-[var(--color-cookite-blue)]">{formatCurrency(confirmedOrderDetails.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-semibold mb-4 text-blue-800">Próximos Passos</h3>
                <div className="space-y-3 text-sm text-blue-700">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Seu pedido será preparado em até 30 minutos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Retire no stand da Cookite no evento JEPP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4" />
                    <span>Apresente o código de confirmação na retirada</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={onBackToProducts}
                  className="flex-1 bg-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue-hover)]"
                >
                  Fazer Nova Reserva
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.print()}
                  className="flex-1"
                >
                  Imprimir Comprovante
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentStep === 'confirmation' && showPayment && paymentData && pendingReservationDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[var(--color-cookite-gray)] py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header informativo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-[var(--color-cookite-blue)] text-white px-4 py-2 rounded-full mb-4">
              <QrCode className="w-4 h-4" />
              <span className="text-sm font-medium">Pagamento PIX</span>
            </div>
                         <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Finalizar Pedido
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Complete o pagamento PIX para confirmar sua reserva. Após o pagamento, você receberá um email de confirmação.
            </p>
          </div>

          {/* Resumo da reserva */}
          <Card className="mb-6 border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Resumo da Reserva
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Cliente:</span>
                  <p className="text-gray-900">{pendingReservationDetails.name}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Total:</span>
                  <p className="text-gray-900 font-semibold">{formatCurrency(paymentData.amount)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Produtos:</span>
                  <p className="text-gray-900">{pendingReservationDetails.products.length} item(s)</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Aguardando Pagamento</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modal de pagamento PIX */}
          <PaymentModal
            isOpen={true}
            onClose={handlePaymentClose}
            paymentData={{
              amount: paymentData.amount,
              pixCode: paymentData.pixCode,
              qrCode: paymentData.qrCode,
              transactionId: paymentData.transactionId,
              expiresAt: paymentData.expiresAt
            }}
            onPaymentConfirmed={(transactionId: string) => {
              // Confirmar pedido e enviar email
              if (pendingReservationDetails) {
                const confirmedOrder = {
                  ...pendingReservationDetails,
                  paymentStatus: 'paid' as const,
                  transactionId
                };
                
                setConfirmedOrderDetails(confirmedOrder);
                
                // Persistir status de pagamento
                updatePaymentStatus(pendingReservationDetails.id, 'paid', transactionId);
                
                // Salvar pedido no localStorage para "Meus Pedidos"
                try {
                  const existingOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
                  const orderForStorage = {
                    id: pendingReservationDetails.id,
                    status: 'delivered',
                    items: pendingReservationDetails.products.map(p => ({
                      id: p.id,
                      name: p.name,
                      quantity: p.quantity,
                      price: p.price,
                      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&h=100&fit=crop'
                    })),
                    total: pendingReservationDetails.totalAmount,
                    created_at: pendingReservationDetails.createdAt,
                    pickup_date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 horas a partir de agora
                    pickup_location: 'Stand JEPP - Sebrae',
                    payment_method: 'PIX',
                    payment_status: 'paid',
                    customer: {
                      name: pendingReservationDetails.name,
                      email: pendingReservationDetails.email,
                      phone: pendingReservationDetails.phone
                    },
                    notes: pendingReservationDetails.notes,
                    transactionId
                  };
                  
                  existingOrders.unshift(orderForStorage);
                  localStorage.setItem('user_orders', JSON.stringify(existingOrders));
                } catch (error) {
                  console.error('Erro ao salvar pedido:', error);
                }
                
                // Enviar email de confirmação (simulado)
                try {
                  console.log('📧 Enviando email de confirmação...');
                  emailSystem.sendPaymentConfirmation({
                    customer: {
                      name: pendingReservationDetails.name,
                      email: pendingReservationDetails.email,
                      phone: pendingReservationDetails.phone
                    },
                    transaction: {
                      id: transactionId,
                      amount: paymentData.amount,
                      status: 'paid',
                      orderId: pendingReservationDetails.id
                    },
                    products: pendingReservationDetails.products,
                    pickupCode: `CKJP${Date.now().toString().slice(-6)}`,
                    eventInfo: {
                      name: 'JEPP 2025',
                      date: '12/09/2025',
                      location: 'Stand JEPP - Sebrae'
                    }
                  });
                } catch (error) {
                  console.warn('Email não configurado, mas pedido foi salvo:', error);
                }
                
                // Limpar carrinho após confirmação
                onClearCart();
              }
              
              setShowPayment(false);
              toast.success('🎉 Pagamento confirmado! Pedido salvo em "Meus Pedidos"');
            }}
          />
          
          {/* Botões de ação */}
          <div className="text-center mt-6 space-y-3">
            <Button
              variant="outline"
              onClick={handlePaymentClose}
              className="text-[var(--color-cookite-blue)] border-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue)]/5"
            >
              Voltar ao Resumo da Reserva
            </Button>
            <p className="text-xs text-gray-500">
              💡 Dica: Após realizar o pagamento PIX, clique em "Confirmar Pedido" no modal acima
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Validação de segurança: se não há produtos e não estamos em confirmação, voltar para produtos
  if (cartItems.length === 0 && !confirmedOrderDetails && !showPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[var(--color-cookite-gray)] py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-8 h-8 text-orange-600" />
              </div>
                             <CardTitle className="text-xl sm:text-2xl text-orange-800">Carrinho Vazio</CardTitle>
              <p className="text-orange-600">Seu carrinho está vazio. Adicione produtos para continuar.</p>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleBackToProducts}
                className="bg-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue-hover)]"
              >
                Voltar aos Produtos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[var(--color-cookite-gray)] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBackToProducts}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Produtos
          </Button>
                     <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Finalizar Pedido
          </h1>
                     <p className="text-gray-600 text-base sm:text-lg">
            Revise seus produtos e complete suas informações
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Coluna Principal - Formulário */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            {/* Step 1: Revisão do Carrinho */}
            {currentStep === 'review' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Revisar Produtos ({calculations.totalItems})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => {
                    const quantity = quantities[item.id] || 0;
                    if (quantity === 0) return null;
                    
                    return (
                      <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg">
                        {/* Imagem */}
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0 mx-auto sm:mx-0"
                          width={64}
                          height={64}
                        />
                        
                        {/* Informações do produto */}
                        <div className="flex-1 min-w-0 text-center sm:text-left">
                          <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(item.price)} cada
                          </p>
                        </div>
                        
                        {/* Controles de quantidade */}
                        <div className="flex items-center gap-2 flex-shrink-0 mx-auto sm:mx-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, quantity - 1)}
                            disabled={quantity <= 1}
                            className="w-8 h-8 p-0 rounded-full hover:bg-red-50 hover:border-red-300"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-10 text-center font-medium text-gray-900">{quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, quantity + 1)}
                            disabled={quantity >= item.maxStock}
                            className="w-8 h-8 p-0 rounded-full hover:bg-green-50 hover:border-green-300"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {/* Preço total e botão remover */}
                        <div className="text-center sm:text-right flex-shrink-0 w-full sm:w-auto">
                          <p className="font-semibold text-[var(--color-cookite-blue)] mb-2">
                            {formatCurrency(item.price * quantity)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs px-3 py-1 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Remover
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  
                                     {calculations.totalItems === 0 && (
                     <div className="text-center py-8 text-gray-500">
                       <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                       <p>Seu carrinho está vazio</p>
                       <Button 
                         onClick={handleBackToProducts}
                         className="mt-4"
                       >
                         Adicionar Produtos
                       </Button>
                     </div>
                   )}
                </CardContent>
              </Card>
            )}

            {/* Step 2: Informações do Cliente */}
            {currentStep === 'customer-info' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Suas Informações
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Preencha seus dados para finalizar a reserva
                  </p>
                  
                  {/* Status de Autenticação */}
                  {!authLoading && (
                    <div className="mt-4 p-3 rounded-lg border">
                      {isAuthenticated ? (
                        <div className="flex items-center gap-2 text-green-700 bg-green-50 p-2 rounded">
                          <UserCheck className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Logado como {profile?.full_name || user?.email}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAuthModal(true)}
                            className="ml-auto text-xs text-green-600 hover:text-green-800"
                          >
                            Trocar Conta
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-blue-700 bg-blue-50 p-2 rounded">
                          <div className="flex items-center gap-2">
                            <LogIn className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Faça login para salvar seus dados e acompanhar pedidos
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAuthModal(true)}
                            className="text-xs"
                          >
                            Entrar
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCustomerInfoSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label htmlFor="name">Nome Completo *</Label>
                        <Input
                          id="name"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Seu nome completo"
                          className={validationErrors.name ? 'border-red-500' : ''}
                        />
                        {validationErrors.name && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input
                          id="phone"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                          onBlur={(e) => {
                            const formatted = formatPhone(e.target.value);
                            setCustomerInfo(prev => ({ ...prev, phone: formatted }));
                          }}
                          placeholder="(11) 99999-9999"
                          className={validationErrors.phone ? 'border-red-500' : ''}
                        />
                        {validationErrors.phone && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="seu@email.com"
                        className={validationErrors.email ? 'border-red-500' : ''}
                      />
                      {validationErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Observações (opcional)</Label>
                      <Textarea
                        id="notes"
                        value={customerInfo.notes}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Alguma observação especial sobre seu pedido?"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep('review')}
                        className="flex-1"
                      >
                        Voltar
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue-hover)]"
                        disabled={isValidating}
                      >
                        {isValidating ? 'Validando...' : 'Continuar para Pagamento'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Pagamento */}
            {currentStep === 'payment' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCardIcon className="w-5 h-5" />
                    Finalizar Reserva
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Confirme os detalhes e finalize sua reserva
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Resumo do Cliente */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <User className="w-4 h-4 text-[var(--color-cookite-blue)]" />
                      Informações do Cliente
                    </h3>
                                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Nome:</span>
                        <p className="text-gray-900">{customerInfo.name}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Telefone:</span>
                        <p className="text-gray-900">{customerInfo.phone}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Email:</span>
                        <p className="text-gray-900">{customerInfo.email}</p>
                      </div>
                      {customerInfo.notes && (
                        <div className="sm:col-span-2">
                          <span className="font-medium text-gray-700">Observações:</span>
                          <p className="text-gray-900">{customerInfo.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Resumo dos Produtos */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-[var(--color-cookite-blue)]" />
                      Produtos Selecionados
                    </h3>
                    <div className="space-y-3">
                      {cartItems.map((item) => {
                        const quantity = quantities[item.id] || 0;
                        if (quantity === 0) return null;
                        
                        return (
                          <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm py-2 border-b border-gray-100 last:border-b-0 gap-2 sm:gap-0">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <ImageWithFallback
                                src={item.image}
                                alt={item.name}
                                className="w-8 h-8 rounded object-cover"
                                width={32}
                                height={32}
                              />
                              <span className="font-medium">{item.name}</span>
                            </div>
                            <div className="text-left sm:text-right">
                              <span className="text-gray-600">{quantity}x</span>
                              <p className="font-semibold text-[var(--color-cookite-blue)]">{formatCurrency(item.price * quantity)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Resumo Financeiro */}
                  <div className="bg-gradient-to-r from-[var(--color-cookite-blue)] to-[var(--color-cookite-blue-hover)] text-white rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Resumo Financeiro
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(calculations.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-yellow-200">
                        <span>Desconto (20%):</span>
                        <span>-{formatCurrency(calculations.discount)}</span>
                      </div>
                      <Separator className="bg-white/20" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>{formatCurrency(calculations.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Informações importantes */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-2 text-blue-700">
                      <InfoIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium mb-1">Próximos passos:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Clique em "Finalizar Reserva" para gerar o PIX</li>
                          <li>• Realize o pagamento no seu app bancário</li>
                          <li>• Confirme manualmente após o pagamento</li>
                          <li>• Receba o email de confirmação</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('customer-info')}
                      className="flex-1"
                    >
                      Voltar
                    </Button>
                    <Button
                      onClick={handlePaymentSubmit}
                      className="flex-1 bg-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue-hover)] text-white font-semibold py-3"
                      disabled={isLoading || calculations.totalItems === 0}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processando...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Finalizar Reserva
                        </div>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Resumo e Informações */}
          <div className="space-y-6">
            {/* Resumo do Pedido */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cartItems.map((item) => {
                    const quantity = quantities[item.id] || 0;
                    if (quantity === 0) return null;
                    
                    return (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-8 h-8 rounded object-cover"
                            width={32}
                            height={32}
                          />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <span className="text-gray-600">{quantity}x</span>
                      </div>
                    );
                  })}
                </div>
                
                <Separator />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(calculations.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Desconto (20%):</span>
                    <span>-{formatCurrency(calculations.discount)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold text-[var(--color-cookite-blue)]">
                    <span>Total:</span>
                    <span>{formatCurrency(calculations.total)}</span>
                  </div>
                </div>

                                 {currentStep === 'review' && calculations.totalItems > 0 && (
                   <Button
                     onClick={() => setCurrentStep('customer-info')}
                     className="w-full bg-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue-hover)]"
                   >
                     Continuar para Checkout
                   </Button>
                 )}

                 {/* Mostrar mensagem quando não há produtos */}
                 {calculations.totalItems === 0 && (
                   <div className="text-center py-4 text-gray-500 text-sm">
                     <p>Adicione produtos ao carrinho para continuar</p>
                   </div>
                 )}
              </CardContent>
            </Card>

            {/* Informações Importantes */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800 text-lg flex items-center gap-2">
                  <InfoIcon className="w-5 h-5" />
                  Informações Importantes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-blue-700">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Pedidos são preparados em até 30 minutos</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Retirada no stand da Cookite no evento JEPP</span>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Evento: 12 de Setembro de 2025</span>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Pagamento seguro via PIX</span>
                </div>
              </CardContent>
            </Card>

            {/* Garantias */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 text-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Nossas Garantias
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-green-700">
                <div className="flex items-start gap-2">
                  <Star className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Produtos frescos e de qualidade</span>
                </div>
                <div className="flex items-start gap-2">
                  <Truck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Preparação no momento da retirada</span>
                </div>
                <div className="flex items-start gap-2">
                  <CreditCard className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Pagamento seguro e confiável</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de Autenticação */}
      <AuthModals
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="login"
      />
    </div>
  );
}
