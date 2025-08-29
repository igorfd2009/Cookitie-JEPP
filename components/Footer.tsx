import { Heart, Instagram, Mail, Phone, MapPin, Clock } from 'lucide-react'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative mt-20">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-1/4 w-32 h-32 cookitie-blob opacity-30"></div>
      <div className="absolute top-10 right-1/3 w-24 h-24 cookitie-blob-2 opacity-20"></div>
      
      <div className="relative z-10">
        {/* Seção principal do footer */}
        <div className="gradient-cookitie-mixed py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              
              {/* Logo e Descrição */}
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

              {/* Informações de Contato */}
              <div className="space-y-6">
                <h4 className="font-cookitie text-xl font-bold text-gray-800 mb-4">
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

              {/* Horários e Projeto JEPP */}
              <div className="space-y-6">
                <h4 className="font-cookitie text-xl font-bold text-gray-800 mb-4">
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

        {/* Barra inferior */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 py-6">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              
              <div className="flex items-center gap-6 text-white">
                <p className="text-sm">
                  © {currentYear} Cookitie. Todos os direitos reservados.
                </p>
                <div className="hidden md:flex items-center gap-2 text-blue-100">
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

        {/* Call-to-action flutuante */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-20">
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
      </div>
    </footer>
  )
}