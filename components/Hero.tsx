import { Button } from "./ui/button";
import { ShoppingCart, Sparkles, Star, Clock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useEffect } from "react";

interface HeroProps {
  onGoToCheckout: () => void;
  hasItemsInCart?: boolean;
}

export function Hero({ onGoToCheckout, hasItemsInCart = false }: HeroProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToReservation = () => {
    // Se houver itens no carrinho, ir para checkout; senão, levar aos produtos
    if (hasItemsInCart) {
      onGoToCheckout();
    } else {
      scrollToProducts();
    }
  };

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-16 md:pt-20 lg:pt-24 pb-8 md:pb-12 lg:pb-16 px-3 sm:px-4 bg-gradient-to-br from-cookitie-blue-50 via-white to-cookitie-yellow-50 overflow-hidden min-h-[75vh] md:min-h-[85vh] flex items-center">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="cookitie-blob absolute -top-32 md:-top-40 -right-32 md:-right-40 w-60 md:w-80 h-60 md:h-80"></div>
        <div className="cookitie-blob-2 absolute -bottom-32 md:-bottom-40 -left-32 md:-left-40 w-56 md:w-72 h-56 md:h-72"></div>
        <div className="cookitie-blob-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 md:w-96 h-72 md:h-96"></div>
        
        {/* Floating particles - menores em mobile */}
        <div className="absolute top-16 md:top-20 left-8 md:left-10 w-2 md:w-3 h-2 md:h-3 bg-cookitie-yellow-300 rounded-full opacity-60 animate-ping"></div>
        <div className="absolute top-32 md:top-40 right-16 md:right-20 w-1 md:w-2 h-1 md:h-2 bg-cookitie-blue-300 rounded-full opacity-60 animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-24 md:bottom-32 left-16 md:left-20 w-3 md:w-4 h-3 md:h-4 bg-cookitie-purple-300 rounded-full opacity-60 animate-ping" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-16 md:bottom-20 right-8 md:right-10 w-1 md:w-2 h-1 md:h-2 bg-cookitie-pink-300 rounded-full opacity-60 animate-ping" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 xl:gap-16 items-center">
          <div className={`text-center lg:text-left transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Premium badge - otimizado para mobile */}
            <div className="inline-flex items-center gap-2 md:gap-3 cookitie-card-premium px-4 md:px-6 py-3 md:py-4 mb-6 md:mb-8 group cursor-pointer">
              <div className="w-6 md:w-8 h-6 md:h-8 bg-gradient-to-r from-cookitie-blue-400 to-cookitie-purple-400 rounded-full flex items-center justify-center animate-pulse group-hover:rotate-12 transition-transform duration-300">
                <Sparkles className="w-3 md:w-5 h-3 md:h-5 text-white" />
              </div>
              <span className="text-xs md:text-sm font-semibold text-gray-700">🎉 Evento JEPP Sebrae - Oferta Especial!</span>
            </div>

            <h1 className="mb-6 md:mb-8 lg:mb-10 text-gray-800 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl leading-tight font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-cookitie-blue-500 via-cookitie-purple-500 to-cookitie-yellow-500 bg-clip-text text-transparent animate-pulse font-display">
                Cookittie
              </span>
              <br />
              <span className="text-gray-800 relative font-display">
                Doces 
                <span className="relative mx-2 md:mx-4">
                  <span className="bg-gradient-to-r from-cookitie-yellow-500 to-cookitie-pink-500 bg-clip-text text-transparent">artesanais</span>
                  <svg className="absolute -bottom-2 md:-bottom-3 left-0 w-full h-3 md:h-4" viewBox="0 0 100 12" preserveAspectRatio="none">
                    <path d="M0,10 Q50,3 100,10" stroke="url(#gradient)" strokeWidth="3" fill="none" />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--cookitie-yellow-400)" />
                        <stop offset="50%" stopColor="var(--cookitie-pink-400)" />
                        <stop offset="100%" stopColor="var(--cookitie-purple-400)" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </span>
            </h1>
            
            <p className="mb-6 md:mb-8 lg:mb-10 text-gray-600 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-modern px-2">
              Palha italiana, cookie, cake pop e biscoito amantegado. 
              <span className="font-semibold text-cookitie-blue-600"> Reserve online e garanta 20% de desconto.</span>
            </p>

            {/* Features com design melhorado - responsivo */}
            <div className="flex flex-wrap gap-3 md:gap-4 mb-8 md:mb-10 justify-center lg:justify-start">
              <div className="flex items-center gap-2 md:gap-3 cookitie-card px-3 md:px-4 py-2 md:py-3 group cursor-pointer">
                <div className="w-5 md:w-6 h-5 md:h-6 bg-gradient-to-r from-cookitie-yellow-400 to-cookitie-yellow-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-3 md:w-4 h-3 md:h-4 text-white fill-current" />
                </div>
                <span className="text-xs md:text-sm font-semibold text-gray-700">Artesanal</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 cookitie-card px-3 md:px-4 py-2 md:py-3 group cursor-pointer">
                <div className="w-5 md:w-6 h-5 md:h-6 bg-gradient-to-r from-cookitie-blue-400 to-cookitie-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-3 md:w-4 h-3 md:h-4 text-white" />
                </div>
                <span className="text-xs md:text-sm font-semibold text-gray-700">Fresco</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 cookitie-card px-3 md:px-4 py-2 md:py-3 group cursor-pointer">
                <div className="w-5 md:w-6 h-5 md:h-6 bg-gradient-to-r from-cookitie-green-400 to-cookitie-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ShoppingCart className="w-3 md:w-4 h-3 md:h-4 text-white" />
                </div>
                <span className="text-xs md:text-sm font-semibold text-gray-700">PIX</span>
              </div>
            </div>

            <div className="flex justify-center lg:justify-start">
              <Button 
                onClick={scrollToReservation}
                size="lg"
                className="group btn-cookitie-primary text-base md:text-lg lg:text-xl font-bold py-4 md:py-5 lg:py-6 px-6 md:px-8 lg:px-10 rounded-2xl md:rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105"
              >
                <div className="w-6 md:w-8 h-6 md:h-8 bg-white/20 rounded-full flex items-center justify-center mr-3 md:mr-4 group-hover:rotate-12 transition-transform duration-300">
                  <ShoppingCart size={20} className="md:w-6 md:h-6 text-white" />
                </div>
                <span>{hasItemsInCart ? 'Ir para Checkout' : 'Escolher Produtos'}</span>
                <div className="ml-2 md:ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xl md:text-2xl">🚀</div>
              </Button>
            </div>
          </div>

          <div className={`flex justify-center lg:justify-end transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
              {/* Main image com design premium - responsivo */}
              <div className="relative group">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1587736797692-7f0c8ab97fc1?w=600&h=500&fit=crop&crop=center"
                  alt="Doces artesanais da Cookite - palha italiana, cookies, cake pops e biscoitos"
                  className="rounded-3xl md:rounded-4xl shadow-2xl w-full transform group-hover:scale-105 transition-transform duration-700"
                  width={600}
                  height={500}
                />
                
                {/* Premium discount badge - responsivo */}
                <div className="absolute -top-3 md:-top-4 lg:-top-6 -right-3 md:-right-4 lg:-right-6 cookitie-card-premium p-3 md:p-4 lg:p-6 rounded-full shadow-2xl animate-bounce border-2 border-white">
                  <div className="text-center">
                    <p className="text-xs md:text-sm lg:text-lg xl:text-xl font-bold text-cookitie-pink-500 font-cookitie">20%</p>
                    <p className="text-xs md:text-sm font-semibold text-gray-600">OFF</p>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cookitie-pink-400 to-cookitie-purple-400 opacity-20 animate-ping"></div>
                </div>

                {/* Status badge melhorado - responsivo */}
                <div className="absolute -bottom-3 md:-bottom-4 lg:-bottom-6 -left-3 md:-left-4 lg:-left-6 cookitie-card-premium p-2 md:p-3 lg:p-5 shadow-xl border border-white/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-3 md:w-4 lg:w-5 h-3 md:h-4 lg:h-5 bg-gradient-to-r from-cookitie-green-400 to-cookitie-green-500 rounded-full animate-pulse shadow-lg"></div>
                    <div>
                      <p className="text-xs md:text-sm lg:text-base font-bold text-gray-800">Disponível</p>
                      <p className="text-xs md:text-sm text-gray-500">Para reserva</p>
                    </div>
                  </div>
                </div>

                {/* Decorative floating elements - ocultos em mobile */}
                <div className="hidden md:block absolute top-1/4 -left-6 lg:-left-8 w-6 md:w-8 h-6 md:h-8 bg-gradient-to-r from-cookitie-yellow-400 to-cookitie-yellow-500 rounded-full opacity-70 animate-ping shadow-lg"></div>
                <div className="hidden md:block absolute bottom-1/4 -right-6 lg:-right-8 w-4 md:w-6 h-4 md:h-6 bg-gradient-to-r from-cookitie-blue-400 to-cookitie-purple-400 rounded-full opacity-70 animate-ping shadow-lg" style={{animationDelay: '1s'}}></div>
                <div className="hidden md:block absolute top-1/2 -right-12 lg:-right-16 w-5 md:w-7 h-5 md:h-7 bg-gradient-to-r from-cookitie-green-400 to-cookitie-blue-400 rounded-full opacity-70 animate-ping shadow-lg" style={{animationDelay: '2s'}}></div>
              </div>

              {/* Stats melhoradas - responsivas */}
              <div className="mt-6 md:mt-8 lg:mt-10 flex justify-center gap-3 md:gap-4 lg:gap-6">
                <div className="text-center cookitie-card-premium p-3 md:p-4 lg:p-5 shadow-lg border border-white/50">
                  <p className="text-lg md:text-xl lg:text-2xl font-bold text-cookitie-blue-500">4</p>
                  <p className="text-xs md:text-sm lg:text-base text-gray-600 font-medium">Sabores</p>
                </div>
                <div className="text-center cookitie-card-premium p-3 md:p-4 lg:p-5 shadow-lg border border-white/50">
                  <p className="text-lg md:text-xl lg:text-2xl font-bold text-cookitie-yellow-500">20%</p>
                  <p className="text-xs md:text-sm lg:text-base text-gray-600 font-medium">Desconto</p>
                </div>
                <div className="text-center cookitie-card-premium p-3 md:p-4 lg:p-5 shadow-lg border border-white/50">
                  <p className="text-lg md:text-xl lg:text-2xl font-bold text-cookitie-green-500">⚡</p>
                  <p className="text-xs md:text-sm lg:text-base text-gray-600 font-medium">PIX</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}