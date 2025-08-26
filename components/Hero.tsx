import { Button } from "./ui/button";
import { ShoppingCart, ArrowDown, Sparkles, Star, Clock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useEffect } from "react";

interface HeroProps {
  onGoToCheckout: () => void;
}

export function Hero({ onGoToCheckout }: HeroProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToReservation = () => {
    // Ir para a página de checkout
    onGoToCheckout();
  };

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-14 md:pt-16 pb-8 md:pb-12 px-4 bg-gradient-to-br from-[var(--color-cookite-gray)] via-white to-[var(--color-cookite-blue)] overflow-hidden">
      {/* Background subtle elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-64 h-64 bg-[var(--color-cookite-yellow)] rounded-full opacity-10 blur-2xl"></div>
        <div className="absolute -bottom-40 -left-40 w-64 h-64 bg-[var(--color-cookite-blue)] rounded-full opacity-10 blur-2xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
          <div className={`text-center lg:text-left transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Badge de destaque */}
            <div className="inline-flex items-center gap-2 bg-white/80 border border-[var(--color-cookite-yellow)] rounded-full px-4 py-2 mb-6 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="w-6 h-6 bg-[var(--color-cookite-blue)] rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Evento JEPP Sebrae</span>
            </div>

            <h1 className="mb-6 md:mb-8 text-gray-800 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight font-bold">
              <span className="bg-gradient-to-r from-[var(--color-cookite-blue)] to-[var(--color-cookite-yellow)] bg-clip-text text-transparent">
                Cookite
              </span>
              <br />
              <span className="text-gray-800">Doces artesanais</span>
            </h1>
            
            <p className="mb-8 md:mb-10 text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0">
              Palha italiana, cookie, cake pop e biscoito amantegado. 
              <span className="font-semibold text-[var(--color-cookite-blue)]"> Reserve online e garanta 20% de desconto.</span>
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-3 mb-8 justify-center lg:justify-start">
              <div className="flex items-center gap-2 bg-white/70 rounded-full px-3 py-1.5 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-5 h-5 bg-[var(--color-cookite-yellow)] rounded-full flex items-center justify-center">
                  <Star className="w-3 h-3 text-white fill-current" />
                </div>
                <span className="text-sm font-medium text-gray-700">Artesanal</span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 rounded-full px-3 py-1.5 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-5 h-5 bg-[var(--color-cookite-blue)] rounded-full flex items-center justify-center">
                  <Clock className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Fresco</span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 rounded-full px-3 py-1.5 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">PIX</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button 
                onClick={scrollToReservation}
                size="lg"
                className="group bg-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue-hover)] text-white rounded-xl py-2.5 sm:py-3 md:py-4 text-base sm:text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-full flex items-center justify-center mr-2">
                  <ShoppingCart size={16} className="sm:w-[18px] sm:h-[18px] text-white" />
                </div>
                <span className="text-sm sm:text-base">Fazer Reserva Online</span>
              </Button>
              <Button 
                onClick={scrollToProducts}
                variant="outline"
                size="lg"
                className="group bg-white border-2 border-[var(--color-cookite-yellow)] text-gray-700 hover:bg-[var(--color-cookite-yellow)] hover:border-[var(--color-cookite-yellow)] rounded-xl py-2.5 sm:py-3 md:py-4 text-base sm:text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[var(--color-cookite-yellow)] rounded-full flex items-center justify-center mr-2">
                  <ArrowDown size={16} className="sm:w-[18px] sm:h-[18px] text-white" />
                </div>
                <span className="text-sm sm:text-base">Ver Produtos</span>
              </Button>
            </div>
          </div>

          <div className={`flex justify-center lg:justify-end transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              {/* Main image with enhanced styling */}
              <div className="relative group">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1587736797692-7f0c8ab97fc1?w=500&h=400&fit=crop&crop=center"
                  alt="Doces artesanais da Cookite - palha italiana, cookies, cake pops e biscoitos"
                  className="rounded-3xl shadow-2xl w-full transform group-hover:scale-105 transition-transform duration-500"
                  width={500}
                  height={400}
                />
                
                {/* Floating discount badge */}
                <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white p-2 sm:p-3 md:p-4 rounded-full shadow-xl animate-bounce border-2 border-white">
                  <div className="text-center">
                    <p className="text-xs sm:text-sm md:text-base font-bold">20%</p>
                    <p className="text-xs font-medium">OFF</p>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 opacity-20 animate-ping"></div>
                </div>

                {/* Floating elements */}
                <div className="absolute -bottom-3 -left-3 sm:-bottom-6 sm:-left-6 bg-gradient-to-r from-white to-slate-50 rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-xl border border-gray-200 backdrop-blur-sm">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-800">Disponível</p>
                      <p className="text-xs text-gray-500">Para reserva</p>
                    </div>
                  </div>
                </div>

                {/* Decorative floating elements - hidden on mobile */}
                <div className="hidden sm:block absolute top-1/4 -left-8 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-60 animate-ping shadow-lg"></div>
                <div className="hidden sm:block absolute bottom-1/4 -right-6 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-60 animate-ping shadow-lg" style={{animationDelay: '1s'}}></div>
                <div className="hidden sm:block absolute top-1/2 -right-12 w-5 h-5 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-60 animate-ping shadow-lg" style={{animationDelay: '2s'}}></div>
              </div>

              {/* Bottom stats */}
              <div className="mt-6 sm:mt-8 flex justify-center gap-2 sm:gap-4">
                <div className="text-center bg-white/80 rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-md border border-gray-200">
                  <p className="text-lg sm:text-xl font-bold text-[var(--color-cookite-blue)]">4</p>
                  <p className="text-xs sm:text-sm text-gray-600">Sabores</p>
                </div>
                <div className="text-center bg-white/80 rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-md border border-gray-200">
                  <p className="text-lg sm:text-xl font-bold text-[var(--color-cookite-yellow)]">20%</p>
                  <p className="text-xs sm:text-sm text-gray-600">Desconto</p>
                </div>
                <div className="text-center bg-white/80 rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-md border border-gray-200">
                  <p className="text-lg sm:text-xl font-bold text-green-500">⚡</p>
                  <p className="text-xs sm:text-sm text-gray-600">PIX</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}