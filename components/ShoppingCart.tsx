import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { 
  ShoppingCart, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  Tag, 
  CheckCircle, 
  CreditCard,
  ArrowRight,
  Sparkles,
  LogIn,
  UserCheck,
  Gift
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";

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

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ShoppingCartModal({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  isOpen,
  onClose
}: ShoppingCartProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  
  // Sistema de Autenticação
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated, profile, loading: authLoading } = useAuth();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalSubtotal = items.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
  
  // Cupom de desconto (simulado)
  const couponDiscount = appliedCoupon === 'JEPP2025' ? subtotal * 0.05 : 0; // 5% adicional
  const totalDiscount = originalSubtotal - subtotal + couponDiscount;
  const finalTotal = subtotal - couponDiscount;

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Digite um código de cupom');
      return;
    }

    setIsApplyingCoupon(true);
    
    // Simular verificação de cupom
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (couponCode.toUpperCase() === 'JEPP2025') {
      setAppliedCoupon(couponCode.toUpperCase());
      toast.success('Cupom aplicado! 5% de desconto adicional');
    } else {
      toast.error('Cupom inválido');
    }
    
    setIsApplyingCoupon(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info('Cupom removido');
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Adicione itens ao carrinho');
      return;
    }
    onCheckout();
  };

  // Animações de entrada
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl mx-2 sm:mx-4 max-h-[90vh] overflow-hidden bg-white rounded-2xl sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-[var(--color-cookite-blue)] to-[var(--color-cookite-blue-hover)] text-white">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Seu Carrinho</h2>
              <p className="text-xs sm:text-sm text-white/80">{totalItems} {totalItems === 1 ? 'item' : 'itens'}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>

        <div className="h-[calc(90vh-80px)] overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">Carrinho vazio</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">Adicione alguns doces deliciosos ao seu carrinho!</p>
              <Button onClick={onClose} className="bg-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue-hover)]">
                Continuar Comprando
              </Button>
            </div>
          ) : (
            <div className="p-3 sm:p-4 md:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Items List */}
                <div className="lg:col-span-2">
                  <div className="space-y-2">
                    {items.map((item) => (
                      <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 border border-gray-100">
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex items-center gap-3 sm:gap-4">
                            {/* Image with Badge */}
                            <div className="relative flex-shrink-0">
                              <ImageWithFallback
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 object-cover rounded-lg shadow-sm"
                                width={80}
                                height={80}
                              />
                              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-medium px-2 py-1">
                                -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                              </Badge>
                            </div>

                            {/* Item Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1">{item.name}</h3>
                              <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600">
                                <span>Estoque: {item.maxStock}</span>
                                <span className="text-[var(--color-cookite-blue)] font-semibold">
                                  R$ {item.price.toFixed(2).replace('.', ',')}
                                </span>
                                <span className="text-gray-400 line-through">
                                  R$ {item.originalPrice.toFixed(2).replace('.', ',')}
                                </span>
                              </div>
                              <div className="text-xs sm:text-sm text-gray-700 mt-1">
                                <span className="font-medium">Total: </span>
                                <span className="font-bold text-[var(--color-cookite-blue)]">
                                  R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                                </span>
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                  disabled={item.quantity <= 1}
                                  className="w-6 h-6 sm:w-7 sm:h-7 p-0 rounded-full hover:bg-red-50 hover:border-red-300 transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="w-6 text-center font-bold text-gray-900 text-sm">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onUpdateQuantity(item.id, Math.min(item.maxStock, item.quantity + 1))}
                                  disabled={item.quantity >= item.maxStock}
                                  className="w-6 h-6 sm:w-7 sm:h-7 p-0 rounded-full hover:bg-green-50 hover:border-green-300 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                              
                              {/* Remove Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onRemoveItem(item.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full w-6 h-6 sm:w-7 sm:h-7 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                title="Remover item"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <Card className="bg-white shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Resumo do Pedido
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Coupon Section */}
                      <div className="space-y-2">
                        <Label htmlFor="coupon" className="text-sm font-medium">Cupom de Desconto</Label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Input
                            id="coupon"
                            placeholder="Ex: JEPP2025"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            disabled={!!appliedCoupon}
                            className="flex-1"
                          />
                          {!appliedCoupon ? (
                            <Button
                              onClick={applyCoupon}
                              disabled={isApplyingCoupon || !couponCode.trim()}
                              size="sm"
                              className="bg-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue-hover)]"
                            >
                              {isApplyingCoupon ? '...' : 'Aplicar'}
                            </Button>
                          ) : (
                            <Button
                              onClick={removeCoupon}
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Aplicado
                            </Button>
                          )}
                        </div>
                        {appliedCoupon && (
                          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                            <Tag className="w-4 h-4" />
                            <span>Cupom {appliedCoupon} aplicado! +5% de desconto</span>
                          </div>
                        )}
                      </div>

                      {/* Price Breakdown */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'itens'})</span>
                          <span>R$ {originalSubtotal.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                          <span>Desconto (20%)</span>
                          <span>-R$ {(originalSubtotal - subtotal).toFixed(2).replace('.', ',')}</span>
                        </div>
                        {couponDiscount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Cupom {appliedCoupon}</span>
                            <span>-R$ {couponDiscount.toFixed(2).replace('.', ',')}</span>
                          </div>
                        )}
                        <div className="border-t pt-2 flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span className="text-[var(--color-cookite-blue)]">
                            R$ {finalTotal.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>

                      {/* Savings Info */}
                      {totalDiscount > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-green-700">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Você economizou R$ {totalDiscount.toFixed(2).replace('.', ',')}!
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Sugestão de Login */}
                      {!authLoading && (
                        <>
                          {!isAuthenticated ? (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                  <Gift className="w-5 h-5 text-blue-600 mt-0.5" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-medium text-blue-800 mb-2">
                                    🎉 Quer agilizar seu próximo pedido?
                                  </h3>
                                  <p className="text-sm text-blue-600 mb-3">
                                    Faça login e seus dados ficam salvos para pedidos futuros!
                                  </p>
                                  <Button 
                                    size="sm" 
                                    onClick={() => setShowAuthModal(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    <LogIn className="w-4 h-4 mr-2" />
                                    Criar conta grátis
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                  <UserCheck className="w-5 h-5 text-green-600 mt-0.5" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-green-800">
                                    Olá, <strong>{profile?.full_name?.split(' ')[0] || 'Usuário'}</strong>! 
                                    {profile?.primeiro_pedido ? ' 🎉 Seu primeiro pedido!' : ` Este é seu ${(profile?.total_pedidos || 0) + 1}º pedido.`}
                                  </p>
                                  {profile?.total_pedidos && profile.total_pedidos > 0 && (
                                    <p className="text-sm text-green-700 mt-1">
                                      Total gasto: R$ {(profile.total_gasto || 0).toFixed(2).replace('.', ',')}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {/* Action Buttons */}
                      <div className="space-y-3 pt-2 sm:pt-4">
                        <Button
                          onClick={handleCheckout}
                          disabled={items.length === 0}
                          className="w-full bg-gradient-to-r from-[var(--color-cookite-blue)] to-[var(--color-cookite-blue-hover)] hover:from-[var(--color-cookite-blue-hover)] hover:to-[var(--color-cookite-blue)] text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                          <CreditCard className="w-5 h-5 mr-2" />
                          Finalizar Pedido
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        
                        {items.length > 0 && (
                          <Button
                            onClick={onClearCart}
                            variant="outline"
                            className="w-full text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Limpar Carrinho
                          </Button>
                        )}
                      </div>

                      {/* Additional Info */}
                      <div className="text-xs text-gray-500 space-y-1 text-center sm:text-left">
                        <p>• Pagamento via PIX instantâneo</p>
                        <p>• Confirmação automática</p>
                        <p>• Retirada no evento JEPP</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
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

// Floating Cart Button Component
interface FloatingCartButtonProps {
  itemCount: number;
  onClick: () => void;
  totalPrice: number;
  currentPage?: string;
}

export function FloatingCartButton({ itemCount, onClick, totalPrice, currentPage = 'products' }: FloatingCartButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Não mostrar em páginas onde não faz sentido
  const shouldHide = currentPage === 'checkout' || currentPage === 'pix-dashboard';

  useEffect(() => {
    if (shouldHide) {
      setIsVisible(false);
      return undefined;
    }

    if (itemCount > 0) {
      setIsVisible(true);
      return undefined;
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [itemCount, shouldHide]);

  if (!isVisible || shouldHide) return null;

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40">
      <Button
        onClick={onClick}
        className="group bg-gradient-to-r from-[var(--color-cookite-blue)] to-[var(--color-cookite-blue-hover)] hover:from-[var(--color-cookite-blue-hover)] hover:to-[var(--color-cookite-blue)] text-white rounded-full w-14 h-14 sm:w-16 sm:h-16 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110"
      >
        <div className="relative">
          <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 rounded-full animate-bounce">
              {itemCount > 99 ? '99+' : itemCount}
            </Badge>
          )}
        </div>
      </Button>
      
      {/* Price Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg p-2 border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none hidden sm:block">
        <p className="text-sm font-semibold text-gray-800 whitespace-nowrap">
          R$ {totalPrice.toFixed(2).replace('.', ',')}
        </p>
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
      </div>
    </div>
  );
}
