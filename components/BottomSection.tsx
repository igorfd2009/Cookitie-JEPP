export const BottomSection = () => {
  return (
    <section className="relative px-4 overflow-hidden py-1 lg:py-16 pb-4 lg:pb-16" style={{ backgroundColor: '#FDFAF5' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          
          {/* Imagem do gato com texto já integrado */}
          <div className="flex-shrink-0">
                 <img 
                   src="/imagens/imagem-inicial-secundaria.webp" 
                   alt="Gato mascote Cookittie" 
                   className="object-contain lg:scale-90"
                   style={{ 
                     width: '1214px', 
                     height: '740px', 
                     maxWidth: '100%', 
                     maxHeight: '600px',
                     transform: 'scale(1.1)',
                     marginTop: '-50px',
                     marginBottom: '-30px'
                   }}
                   onError={(e) => {
                     console.log('Erro ao carregar imagem-inicial-secundaria.webp');
                     e.currentTarget.style.display = 'none';
                   }}
                 />
          </div>
        </div>
      </div>
    </section>
  );
};
