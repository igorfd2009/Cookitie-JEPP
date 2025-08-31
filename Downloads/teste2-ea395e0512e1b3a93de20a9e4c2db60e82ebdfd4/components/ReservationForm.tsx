import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import { Badge } from "./ui/badge";
import { ShoppingCart, Plus, Minus, CheckCircle, Instagram, Copy, CreditCard, ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";
import { useReservations } from "../hooks/useReservations";
import { useValidation } from "../hooks/useValidation";




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

interface ReservationFormProps {
  cartItems?: CartItem[];
  onClearCart?: () => void;
}

export function ReservationForm({ cartItems = [], onClearCart }: ReservationFormProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [pendingReservationDetails, setPendingReservationDetails] = useState<ConfirmedOrderDetails | null>(null);
  const [confirmedOrderDetails, setConfirmedOrderDetails] = useState<ConfirmedOrderDetails | null>(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [_validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [_showPayment, setShowPayment] = useState(false);
  const [_reservationResult, setReservationResult] = useState<string | null>(null);
  const [_error, _setError] = useState<string | null>(null);
  
  const { createReservation } = useReservations();
  const { validateLocal } = useValidation();

  // Initialize quantities from cart items
  useEffect(() => {
    if (cartItems.length > 0) {
      const initialQuantities: Record<string, number> = {};
      cartItems.forEach(item => {
        initialQuantities[item.id] = item.quantity;
      });
      setQuantities(initialQuantities);
    }
  }, [cartItems]);

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

  // Debounced validation
  useEffect(() => {
    if (!hasAttemptedSubmit) return;
    
    const timeoutId = setTimeout(() => {
      const errors = validateLocal(customerInfo);
      const errorMap: Record<string, string> = {};
      
      (errors.errors as unknown as any[]).forEach((error: any) => {
        errorMap[error.field] = error.message;
      });
      
      setValidationErrors(errorMap);
    }, 300); // Debounce validation

    return () => clearTimeout(timeoutId);
  }, [customerInfo, hasAttemptedSubmit, validateLocal]);

  // Optimized quantity update with debouncing for rapid clicks
  const updateQuantity = useCallback((productId: string, delta: number) => {
    setQuantities(prev => {
      const newValue = Math.max(0, (prev[productId] || 0) + delta);
      return { ...prev, [productId]: newValue };
    });
  }, []);

  // Format phone number automatically with debouncing - função comentada pois não está sendo usada
  // const handlePhoneChange = useCallback((value: string) => {
  //   const formatted = formatPhone(value);
  //   setCustomerInfo(prev => ({ ...prev, phone: formatted }));
  // }, [formatPhone]);

  // Enhanced field validation with caching
  const [_validationCache, setValidationCache] = useState<Record<string, boolean>>({});
  
  // Função comentada - handleFieldBlur não está sendo usada
  // const handleFieldBlur = useCallback(async (field: 'email' | 'phone') => {
  //   const value = customerInfo[field];
  //   if (!value.trim()) return;
  //   
  //   // Check cache first
  //   const cacheKey = `${field}:${value}`;
  //   if (validationCache[cacheKey] !== undefined) {
  //     return;
  //   }
  //   
  //   if (field === 'email' && customerInfo.email) {
  //     try {
  //       const result = await validateWithServer(customerInfo.email, customerInfo.phone);
  //       
  //       // Cache result
  //       setValidationCache(prev => ({ ...prev, [cacheKey]: result.valid }));
  //       
  //       if (!result.valid) {
  //         const emailError = result.errors.find(e => e.field === 'email');
  //         if (emailError) {
  //           setValidationErrors(prev => ({ ...prev, email: emailError.message }));
  //         }
  //       } else {
  //         setValidationErrors(prev => ({ ...prev, email: '' }));
  //       }
  //     } catch (error) {
  //       console.error('Email validation failed:', error);
  //     }
  //   }
  //   
  //   if (field === 'phone' && customerInfo.phone) {
  //     try {
  //       const result = await validateWithServer('', customerInfo.phone);
  //       
  //       // Cache result
  //       setValidationCache(prev => ({ ...prev, [cacheKey]: result.valid }));
  //       
  //       if (!result.valid) {
  //         const phoneError = result.errors.find(e => e.field === 'phone');
  //         if (phoneError) {
  //           setValidationErrors(prev => ({ ...prev, phone: phoneError.message }));
  //         }
  //       } else {
  //         setValidationErrors(prev => ({ ...prev, phone: '' }));
  //       }
  //     } catch (error) {
  //       console.error('Phone validation failed:', error);
  //     }
  //   }
  // }, [customerInfo.email, customerInfo.phone, validateWithServer, validationCache]);

  const copyReservationId = useCallback(async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success("ID da reserva copiado!");
    } catch (err) {
      toast.error("Erro ao copiar ID");
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateLocal(customerInfo);
    if ((errors.errors as unknown as any[]).length > 0) {
      setHasAttemptedSubmit(true);
      const errorMap: Record<string, string> = {};
      (errors.errors as unknown as any[]).forEach((error: any) => {
        errorMap[error.field] = error.message;
      });
      setValidationErrors(errorMap);
      return;
    }

    // Check if any products selected
    const selectedProducts = cartItems.filter(item => quantities[item.id] > 0);
    if (selectedProducts.length === 0) {
      toast.error("Selecione pelo menos um produto");
      return;
    }

    const reservationData = {
      name: customerInfo.name.trim(),
      email: customerInfo.email.trim().toLowerCase(),
      phone: customerInfo.phone.trim(),
      products: selectedProducts.map(item => ({
        id: item.id,
        name: item.name,
        quantity: quantities[item.id],
        price: item.price
      })),
      totalAmount: calculations.total,
      discountApplied: true,
      notes: customerInfo.notes.trim(),
      paymentStatus: 'pending' as const
    };

    try {
      const result = await createReservation(reservationData);
      
      if (result.success && (result as any).payment) {
        toast.success("Reserva criada! Complete o pagamento PIX");

        setPaymentData({
          transactionId: (result as any).payment.transactionId,
          qrCode: (result as any).payment.qrCode,
          pixCode: (result as any).payment.pixCode,
          amount: (result as any).payment.amount,
          expiresAt: (result as any).payment.expiresAt
        });

        setPendingReservationDetails({
          id: (result as any).payment.transactionId,
          name: reservationData.name,
          email: reservationData.email,
          phone: reservationData.phone,
          products: reservationData.products,
          totalAmount: reservationData.totalAmount,
          discountApplied: reservationData.discountApplied,
          notes: reservationData.notes,
          createdAt: new Date().toISOString(),
          paymentStatus: 'pending',
        });

        setShowPayment(true);
        
        // Clear cart after successful reservation creation
        if (onClearCart) {
          onClearCart();
        }
      } else {
        toast.error(result.error || "Erro ao processar reserva");
      }
    } catch (err) {
      console.error('Error submitting reservation:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro inesperado';
      toast.error(`Erro: ${errorMessage}. Tente novamente.`);
    }
  }, [calculations, customerInfo, quantities, validateLocal, createReservation, cartItems, onClearCart]);

  // const handlePaymentConfirmed = useCallback(() => {
    setShowPayment(false);
    
    if (pendingReservationDetails && paymentData) {
      setConfirmedOrderDetails({
        ...pendingReservationDetails,
        paymentStatus: 'paid',
        totalAmount: paymentData.amount, // Usa o valor real do pagamento confirmado
      });
      setPendingReservationDetails(null);
    }

    setReservationResult(paymentData?.transactionId || 'CONFIRMED');
    
    // Reset form state
    setQuantities({});
    setCustomerInfo({ name: '', phone: '', email: '', notes: '' });
    setValidationErrors({});
    setValidationCache({});
    setHasAttemptedSubmit(false);
    setPaymentData(null);
    
    // Smooth scroll to success message
    setTimeout(() => {
      const element = document.getElementById('reservation-success');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  // }, [paymentData, customerInfo, quantities, pendingReservationDetails]);

  // Função comentada - handlePaymentClosed não está sendo usada
  // const handlePaymentClosed = useCallback(() => {
  //   setShowPayment(false);
  //   // Não limpar os dados da reserva para permitir tentar novamente
  // }, []);

  // Reset reservation result
  const handleNewReservation = useCallback(() => {
    setReservationResult(null);
    setPaymentData(null);
    setConfirmedOrderDetails(null);
    // Scroll to top of form
    document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Show success message if reservation was created and paid
  if (confirmedOrderDetails) {
    return (
      <section id="reservation-success" className="py-12 md:py-16 px-4 bg-[var(--color-cookite-gray)]">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg border-2 border-green-200">
            <CardContent className="p-6 md:p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <h2 className="mb-4 text-green-800 text-xl md:text-2xl">Pagamento Confirmado! 🎉</h2>
              <p className="mb-6 text-gray-600">
                Sua reserva foi paga com sucesso. As informações detalhadas estão abaixo.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-xl mb-6 flex items-center justify-center gap-3">
                <code className="text-xl md:text-2xl font-bold text-[var(--color-cookite-blue)]">
                  {confirmedOrderDetails.id}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyReservationId(confirmedOrderDetails.id)}
                  className="rounded-lg"
                >
                  <Copy size={16} />
                </Button>
              </div>

              <p className="mb-6 text-green-700 font-semibold">Mantenha o ID da reserva acima para a retirada!</p>

              <div className="text-left space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Detalhes da sua Reserva:</h3>
                <ul className="text-gray-600 space-y-2">
                  <li><strong>Nome:</strong> {confirmedOrderDetails.name}</li>
                  <li><strong>Email:</strong> {confirmedOrderDetails.email}</li>
                  <li><strong>Telefone:</strong> {confirmedOrderDetails.phone}</li>
                  {confirmedOrderDetails.notes && <li><strong>Observações:</strong> {confirmedOrderDetails.notes}</li>}
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mt-4">Produtos:</h3>
                <ul className="text-gray-600 space-y-1">
                  {confirmedOrderDetails.products.map(product => (
                    <li key={product.id}>- {product.name} ({product.quantity}x) - R$ {product.price.toFixed(2).replace('.', ',')} cada</li>
                  ))}
                </ul>
                <p className="text-lg font-bold text-gray-800 mt-4">Total Pago: R$ {confirmedOrderDetails.totalAmount.toFixed(2).replace('.', ',')}</p>
              </div>

              <div className="space-y-3 text-sm md:text-base text-gray-600 mb-6">
                <p>📍 <strong>Retirada:</strong> 12/09/2025 das 09:00 às 16:00</p>
                <p>📍 <strong>Local:</strong> Evento JEPP Sebrae - Stand da Cookite</p>
                <p>✅ <strong>Pagamento:</strong> Confirmado via PIX</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={handleNewReservation}
                  className="bg-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue-hover)] text-white rounded-2xl"
                >
                  <ShoppingCart size={20} className="mr-2" />
                  Fazer Nova Reserva
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  className="border-[var(--color-cookite-blue)] text-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue)] hover:text-white rounded-2xl"
                >
                  <a 
                    href="https://instagram.com/cookite_oficial" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Instagram size={20} />
                    Seguir no Instagram
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="reservation" className="py-12 md:py-16 px-4 bg-[var(--color-cookite-gray)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="mb-3 md:mb-4 text-gray-800 text-2xl md:text-3xl">Seu Carrinho</h2>
            <p className="text-gray-600 text-sm md:text-base mb-4">
              Visualize os produtos selecionados
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Badge className="bg-[var(--color-cookite-yellow)] text-gray-800 px-3 md:px-4 py-2 text-xs md:text-sm whitespace-nowrap">
                ✨ Desconto automático de 20%
              </Badge>
              <Badge className="bg-[var(--color-cookite-blue)] text-white px-3 md:px-4 py-2 text-xs md:text-sm whitespace-nowrap">
                🛒 Visualização do carrinho
              </Badge>
            </div>
          </div>

          {_error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-xl text-red-700 text-sm">
              <strong>Erro:</strong> {_error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            {/* Products Selection */}
            <Card className="shadow-lg">
              <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <ShoppingCart size={24} />
                Produtos no Carrinho
              </CardTitle>
              </CardHeader>
              <CardContent>
                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum produto selecionado</h3>
                    <p className="text-gray-500 mb-4">Adicione produtos ao carrinho para continuar</p>
                    <Button 
                      type="button"
                      onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                      className="bg-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue-hover)]"
                    >
                      <ArrowLeft size={16} className="mr-2" />
                      Voltar aos Produtos
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-[var(--color-cookite-blue)] transition-colors">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg flex-shrink-0"
                          width={80}
                          height={80}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm md:text-base text-gray-800 font-medium mb-2">{item.name}</h4>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500 line-through">
                              R$ {item.originalPrice.toFixed(2).replace('.', ',')}
                            </p>
                            <p className="text-sm md:text-base text-[var(--color-cookite-blue)] font-bold">
                              R$ {item.price.toFixed(2).replace('.', ',')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={!quantities[item.id]}
                            className="w-8 h-8 p-0 rounded-full hover:bg-red-50 hover:border-red-300 transition-colors"
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="w-8 text-center text-sm md:text-base font-medium">
                            {quantities[item.id] || 0}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 p-0 rounded-full hover:bg-green-50 hover:border-green-300 transition-colors"
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>





            {/* Botão para ir ao checkout */}
            {calculations.totalItems > 0 && (
              <div className="text-center space-y-4">
                <Button
                  type="button"
                  size="lg"
                  onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full md:w-auto bg-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue-hover)] text-white rounded-2xl px-8 py-3 text-base md:text-lg"
                >
                  <CreditCard size={20} className="mr-2" />
                  Ir para Checkout
                </Button>
                
                <div className="text-xs md:text-sm text-gray-600">
                  <p className="mb-2">🛒 Visualize seus produtos selecionados</p>
                  <p className="mb-2">Ou prefere pedir pelo Instagram?</p>
                  <Button 
                    type="button"
                    variant="outline"
                    asChild
                    className="border-[var(--color-cookite-blue)] text-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue)] hover:text-white rounded-xl"
                  >
                    <a 
                      href="https://instagram.com/cookite_oficial" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Instagram size={16} />
                      @cookite_oficial
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>


    </>
  );
}