import { Heart, Instagram, Mail, Phone, MapPin, Clock } from 'lucide-react'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative mt-8 sm:mt-16 lg:mt-20">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-1/4 w-20 h-20 sm:w-32 sm:h-32 cookitie-blob opacity-30"></div>
      <div className="absolute top-4 sm:top-10 right-1/3 w-16 h-16 sm:w-24 sm:h-24 cookitie-blob-2 opacity-20"></div>
      
      <div className="relative z-10">
        {/* Call-to-action flutuante - Apenas Desktop */}
        <div className="hidden lg:block absolute -top-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-800 px-8 py-4 rounded-full shadow-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-bounce">🍪</span>
              <div className="text-center">
                <p className="font-cookitie font-bold">Experimente nossos doces!</p>
                <p className="text-sm opacity-90">Feitos com amor pelos jovens da Cookitie</p>
              </div>
              <span className="text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>✨</span>
            </div>
          </div>
        </div>

        {/* Seção principal do footer - Mobile First */}
        <div className="gradient-cookitie-mixed py-8 sm:py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            
            {/* Mobile: Layout empilhado */}
            <div className="space-y-8 lg:hidden">
              
              {/* Logo e Descrição - Mobile */}
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-xl">🍪</span>
                  </div>
                  <div>
                    <h3 className="font-cookitie text-xl font-bold text-gray-800">Cookitie</h3>
                    <p className="text-xs text-gray-600 font-medium">Projeto JEPP • Sebrae</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 leading-relaxed max-w-sm mx-auto">
                  Somos jovens empreendedores criando doces artesanais com muito amor e dedicação! 🌟
                </p>
              </div>

              {/* Contato - Mobile Grid 2x2 */}
              <div>
                <h4 className="font-cookitie text-lg font-bold text-gray-800 text-center mb-4">
                  📞 Fale Conosco
                </h4>
                
                <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto">
                  <div className="flex items-center gap-3 text-gray-700 bg-white/40 rounded-xl p-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone size={14} className="text-blue-600" />
                    </div>
                    <span className="text-sm">(11) 99999-9999</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-700 bg-white/40 rounded-xl p-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Instagram size={14} className="text-blue-600" />
                    </div>
                    <span className="text-sm">@cookitie_oficial</span>
                  </div>
                </div>
              </div>

              {/* Projeto JEPP - Mobile */}
              <div className="text-center">
                <h4 className="font-cookitie text-lg font-bold text-gray-800 mb-4">
                  🎓 Projeto JEPP
                </h4>
                
                <div className="bg-white/60 rounded-2xl p-4 max-w-sm mx-auto">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Clock size={14} className="text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">Pedidos</p>
                      <p className="text-xs text-gray-600">Seg-Sex, 8h-17h</p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Programa Sebrae de empreendedorismo para jovens estudantes.
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop: Layout 3 colunas */}
            <div className="hidden lg:grid lg:grid-cols-3 lg:gap-12">
              
              {/* Logo e Descrição - Desktop */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">🍪</span>
                  </div>
                  <div>
                    <h3 className="font-cookitie text-2xl font-bold text-gray-800">Cookitie</h3>
                    <p className="text-sm text-gray-600 font-medium">Projeto JEPP • Sebrae</p>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed">
                  Somos jovens empreendedores do 1º ano do ensino médio, criando doces artesanais 
                  com muito amor e dedicação. Cada produto carrega nossos sonhos e aprendizados! 🌟
                </p>
                
                <div className="flex items-center gap-2 text-gray-700">
                  <Heart size={16} className="text-red-400" />
                  <span className="text-sm font-medium">Feito com carinho pelos estudantes da Cookitie</span>
                </div>
              </div>

              {/* Informações de Contato - Desktop */}
              <div className="space-y-6">
                <h4 className="font-cookitie text-xl font-bold text-gray-800">
                  📞 Fale Conosco
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Phone size={16} className="text-blue-600" />
                    </div>
                    <span>(11) 99999-9999</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail size={16} className="text-blue-600" />
                    </div>
                    <span>contato@cookitie.com.br</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Instagram size={16} className="text-blue-600" />
                    </div>
                    <span>@cookitie_oficial</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <MapPin size={16} className="text-blue-600" />
                    </div>
                    <span>São Paulo, SP</span>
                  </div>
                </div>
              </div>

              {/* Horários e Projeto JEPP - Desktop */}
              <div className="space-y-6">
                <h4 className="font-cookitie text-xl font-bold text-gray-800">
                  🎓 Sobre o Projeto
                </h4>
                
                <div className="bg-white/60 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Clock size={16} className="text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Pedidos</p>
                      <p className="text-sm text-gray-600">Segunda à Sexta, 8h às 17h</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <h5 className="font-cookitie font-bold text-gray-800 mb-2">JEPP - Sebrae</h5>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Jovens Empreendedores Primeiros Passos é um programa que desperta 
                      o espírito empreendedor em estudantes do ensino fundamental e médio.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Barra inferior - Mobile First */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 py-4 sm:py-6">
          <div className="container mx-auto px-4 sm:px-6">
            
            {/* Mobile: Layout empilhado */}
            <div className="text-center space-y-3 sm:hidden">
              <p className="text-white text-xs">
                © {currentYear} Cookitie. Todos os direitos reservados.
              </p>
              
              <div className="flex items-center justify-center gap-2 text-blue-100">
                <span className="text-xs">Feito com</span>
                <Heart size={12} className="text-red-300 animate-pulse" />
                <span className="text-xs">em SP</span>
                <span>🇧🇷</span>
              </div>
              
              <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-white text-xs font-medium transition-all duration-300 flex items-center gap-2 mx-auto">
                <Instagram size={14} />
                <span>Siga-nos</span>
              </button>
            </div>

            {/* Desktop: Layout horizontal */}
            <div className="hidden sm:flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-white">
                <p className="text-sm">
                  © {currentYear} Cookitie. Todos os direitos reservados.
                </p>
                <div className="hidden lg:flex items-center gap-2 text-blue-100">
                  <span className="text-xs">Powered by</span>
                  <span className="font-cookitie font-bold">Jovens Empreendedores</span>
                  <span className="text-lg">🚀</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-white text-sm font-medium transition-all duration-300">
                  <Instagram size={16} />
                  <span>Siga-nos</span>
                </button>
                
                <div className="flex items-center gap-2 text-white text-sm">
                  <span>Feito com</span>
                  <Heart size={14} className="text-red-300 animate-pulse" />
                  <span>em SP</span>
                  <span className="text-lg">🇧🇷</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}