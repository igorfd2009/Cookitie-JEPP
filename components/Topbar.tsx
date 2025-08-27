import { Button } from "./ui/button";
import { ShoppingCart, Sparkles, Clock, Gift, User, UserCheck, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

interface TopbarProps {
  onGoToCheckout?: () => void;
  onGoToOrders?: () => void;
  hasItemsInCart?: boolean;
}

export function Topbar({ onGoToCheckout, onGoToOrders, hasItemsInCart = false }: TopbarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { isAuthenticated, profile, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToReservation = () => {
    if (hasItemsInCart && onGoToCheckout) {
      onGoToCheckout();
    } else {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Main Topbar */}
      <div className="bg-gradient-to-r from-[var(--color-cookite-blue)] via-blue-400 to-[var(--color-cookite-blue)] text-white py-3 px-4 shadow-lg border-b border-white/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-center gap-2 text-sm md:text-base">
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="font-semibold">JEPP 2025</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-1">
                <Gift className="w-4 h-4 text-yellow-300" />
                <span className="hidden sm:inline">20% OFF</span>
                <span className="sm:hidden">OFF</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Até 10/09</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Indicador de Login */}
            {!loading && (
              <div className="flex items-center gap-2 text-xs">
                {isAuthenticated ? (
                  <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200">
                    <UserCheck className="w-3 h-3" />
                    <span className="hidden sm:inline font-medium">
                      {profile?.full_name?.split(' ')[0] || 'Logado'}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-full border border-gray-200">
                    <User className="w-3 h-3" />
                    <span className="hidden sm:inline">Não logado</span>
                  </div>
                )}
              </div>
            )}
            
                        <Button 
              onClick={isAuthenticated ? onGoToOrders : scrollToReservation}
              size="sm"
              className="group bg-white/90 hover:bg-white text-[var(--color-cookite-blue)] hover:text-[var(--color-cookite-blue-hover)] rounded-xl text-xs md:text-sm px-4 py-2 hidden sm:flex font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {isAuthenticated ? (
                <Package size={16} className="mr-2 group-hover:scale-110 transition-transform duration-200" />
              ) : (
                <ShoppingCart size={16} className="mr-2 group-hover:scale-110 transition-transform duration-200" />
              )}
              {isAuthenticated ? '📦 Meus Pedidos' : hasItemsInCart ? 'Ir ao Checkout' : 'Ver Produtos'}
            </Button>
            <Button 
              onClick={isAuthenticated ? onGoToOrders : scrollToReservation}
              size="sm"
              className="group bg-white/90 hover:bg-white text-[var(--color-cookite-blue)] hover:text-[var(--color-cookite-blue-hover)] rounded-xl p-2 sm:hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              aria-label={isAuthenticated ? "Meus Pedidos" : "Fazer Reserva"}
            >
              {isAuthenticated ? (
                <Package size={18} className="group-hover:scale-110 transition-transform duration-200" />
              ) : (
                <ShoppingCart size={18} className="group-hover:scale-110 transition-transform duration-200" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
}