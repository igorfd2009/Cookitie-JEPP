import { Heart, Instagram, MapPin } from 'lucide-react'

interface FooterProps {
  showFullContent?: boolean
}

export const Footer = ({ showFullContent = true }: FooterProps) => {

  return (
    <footer>
      {/* Seção principal do footer */}
      <div className={`${showFullContent ? 'py-12' : 'py-6'} px-4 sm:px-6`} style={{ backgroundColor: '#D1EAED' }}>
        <div className="max-w-6xl mx-auto">
          
          {/* Layout condicional */}
          {showFullContent ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Coluna 1: Cookittie (Sobre Nós) */}
              <div className="space-y-4 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <img 
                    src="/imagens/logo-2.png" 
                    alt="Cookittie Logo" 
                    className="h-12 w-auto"
                    onError={(e) => {
                      console.log('Erro ao carregar logo-2.png');
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div>
                    <h3 className="text-xl font-bold text-black font-cookitie">Cookittie</h3>
                    <p className="text-sm text-black">Projeto JEPP • Sebrae</p>
                  </div>
                </div>
                
                <p className="text-sm text-black leading-relaxed">
                  Somos jovens empreendedores do 1º ano do ensino médio, criando doces artesanais com muito amor e dedicação. Cada produto carrega nossos sonhos e aprendizados!
                </p>
                
                <div className="flex items-center justify-center lg:justify-start gap-2 text-black text-sm">
                  <Heart size={16} className="text-red-500" />
                  <span>Feito com amor pela equipe Cookittie</span>
                </div>
              </div>

              {/* Coluna 2: Fale Conosco */}
              <div className="space-y-4 text-center lg:text-left">
                <h4 className="text-lg font-bold text-black">Fale Conosco</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-center lg:justify-start gap-3 text-black">
                    <Instagram size={16} />
                    <span className="text-sm">@Cookittie_</span>
                  </div>
                  
                  <div className="flex items-center justify-center lg:justify-start gap-3 text-black">
                    <MapPin size={16} />
                    <span className="text-sm">Rua Amália Pessoa de Vasconcelos, 70, Colégio Alicerce</span>
                  </div>
                </div>
              </div>

              {/* Coluna 3: Sobre o Evento */}
              <div className="space-y-4 text-center lg:text-left">
                <h4 className="text-lg font-bold text-black">Sobre o Evento</h4>
                
                <p className="text-sm text-black leading-relaxed">
                  ✨ Jovens Empreendedores Primeiros Passos é um programa que incentiva e inspira o espírito empreendedor em estudantes do ensino fundamental e médio. Nosso evento será realizado em 25/10, em uma edição única e especial. Não deixe passar essa oportunidade: garanta seus produtos antecipadamente e aproveite descontos exclusivos de até 15%!
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Logo e Nome */}
              <div className="flex items-center gap-3">
                <img 
                  src="/imagens/logo-2.png" 
                  alt="Cookittie Logo" 
                  className="h-12 w-auto"
                  onError={(e) => {
                    console.log('Erro ao carregar logo-2.png');
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div>
                  <h3 className="text-xl font-bold text-black">Cookittie</h3>
                  <p className="text-sm text-gray-600">Projeto JEPP • Sebrae</p>
                </div>
              </div>

              {/* Fale Conosco */}
              <div className="text-center md:text-right">
                <h4 className="text-base font-bold text-black mb-2">Fale Conosco</h4>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-center md:justify-end gap-2 text-black">
                    <Instagram size={16} />
                    <span className="text-sm">@Cookittie_</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-end gap-2 text-black">
                    <MapPin size={16} />
                    <span className="text-sm">Rua Amália Pessoa de Vasconcelos, 70, Colégio Alicerce</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Barra inferior */}
      <div className="py-4 px-4 sm:px-6" style={{ backgroundColor: '#AAC5C8' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white text-sm">
            <div className="text-center md:text-left">
              @cookittie - Todos os direitos reservados
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <a 
                href="https://www.instagram.com/cookittie_/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded transition-colors"
              >
                <Instagram size={12} />
                Siga-nos
              </a>
              <span className="text-xs text-white">
                Feito com ❤️ em SP BR
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}