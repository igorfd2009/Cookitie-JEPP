import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { ShoppingCart, Clock } from "lucide-react";

interface StickyMobileCTAProps {
  currentPage?: string;
  onGoToCheckout: () => void;
}

export function StickyMobileCTA({ currentPage = 'products', onGoToCheckout }: StickyMobileCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Não mostrar em páginas onde não faz sentido
  const shouldHide = currentPage === 'checkout' || currentPage === 'pix-dashboard';
  
  useEffect(() => {
    if (shouldHide) {
      setIsVisible(false);
      return;
    }

    const handleScroll = () => {
      // Mostrar o CTA quando o usuário rolar para baixo (após o hero)
      const scrolled = window.scrollY > 400;
      setIsVisible(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shouldHide]);

  const scrollToReservation = () => {
    // Ir para a página de checkout
    onGoToCheckout();
  };

  if (!isVisible || shouldHide) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-3 bg-white border-t-2 border-[var(--color-cookite-blue)] shadow-lg">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-600 mb-1">
          <Clock size={14} className="text-[var(--color-cookite-blue)]" />
          <span>20% OFF até 10/09 - Reserve já!</span>
        </div>
        <Button 
          onClick={scrollToReservation}
          size="lg"
          className="w-full bg-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue-hover)] text-white rounded-2xl py-3 text-base animate-pulse-glow"
        >
          <ShoppingCart size={20} className="mr-2" />
          Fazer Reserva Online
        </Button>
      </div>
    </div>
  );
}