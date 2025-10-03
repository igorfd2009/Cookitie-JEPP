interface HeroProps {
  onGoToCheckout: () => void;
  hasItemsInCart?: boolean;
}

export function Hero({}: HeroProps) {

  return (
    <section className="relative px-4 overflow-hidden py-2 sm:pt-12 sm:pb-8 md:pt-16" style={{ backgroundColor: '#FDFAF5' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center">
          
          {/* Gato mascote centralizado */}
          <div className="flex-shrink-0 px-2 sm:px-8 w-full flex justify-center">
                 <img 
                   src="/imagens/imagem-inicial.PNG" 
                   alt="Gato mascote Cookittie" 
                   className="w-full h-[340px] sm:h-[560px] lg:h-[640px] object-contain mx-auto"
                   onError={(e) => {
                     console.log('Erro ao carregar imagem-inicial.PNG');
                     e.currentTarget.style.display = 'none';
                   }}
                 />
          </div>
        </div>

        {/* Textos centralizados */}
        <div className="text-center mt-2 sm:mt-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4">
            Bem-vindos ao Cookittie! Veja nossos produtos e aproveite os descontos!
          </h1>

          {/* Barra decorativa em gradiente */}
          <div 
            className="mx-auto rounded-full"
            style={{
              background: 'linear-gradient(to right, #FDF1C3, #DAE8FF)',
              width: '1295px',
              height: '41px',
              maxWidth: '100%'
            }}
          ></div>
        </div>
      </div>
    </section>
  );
}