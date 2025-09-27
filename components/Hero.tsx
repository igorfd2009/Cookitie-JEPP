interface HeroProps {
  onGoToCheckout: () => void;
  hasItemsInCart?: boolean;
}

export function Hero({}: HeroProps) {

  return (
    <section className="relative px-4 overflow-hidden -mt-2 -mb-2" style={{ backgroundColor: '#FDFAF5' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center">
          
          {/* Gato mascote centralizado */}
          <div className="flex-shrink-0">
                 <img 
                   src="/imagens/imagem-inicial.PNG" 
                   alt="Gato mascote Cookittie" 
                   className="object-contain sm:object-contain"
                   style={{ width: '100%', height: 'auto', maxWidth: 'none', minHeight: '500px' }}
                   onError={(e) => {
                     console.log('Erro ao carregar imagem-inicial.PNG');
                     e.currentTarget.style.display = 'none';
                   }}
                 />
          </div>
        </div>

        {/* Textos centralizados */}
        <div className="text-center mt-4 sm:mt-12">
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