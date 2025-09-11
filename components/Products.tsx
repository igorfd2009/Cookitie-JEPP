import { Plus, Star, Heart } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { toast } from 'sonner'

const COOKITIE_PRODUCTS = [
  {
    id: '1',
    name: 'Cake Pop',
    price: 8.50,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
    description: 'Bolinhos no palito cobertos com chocolate, perfeitos para qualquer ocasião!',
    emoji: '🍭',
    popular: true
  },
  {
    id: '2',
    name: 'Cookie Artesanal',
    price: 6.50,
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop',
    description: 'Cookies crocantes por fora e macios por dentro, feitos com muito carinho.',
    emoji: '🍪',
    popular: true
  },
  {
    id: '3',
    name: 'Palha Italiana',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=400&h=400&fit=crop',
    description: 'Doce tradicional brasileiro com biscoito triturado e chocolate cremoso.',
    emoji: '🍫',
    popular: false
  },
  {
    id: '4',
    name: 'Biscoito Amanteigado',
    price: 9.00,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop',
    description: 'Biscoitos delicados e derretendo na boca, com sabor caseiro inconfundível.',
    emoji: '🥨',
    popular: false
  }
]

export const Products = () => {
  const { addItem } = useCart()

  const handleAddToCart = (product: typeof COOKITIE_PRODUCTS[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    })
    toast.success(`${product.name} adicionado ao carrinho! 🎉`, {
      duration: 2000,
      style: {
        background: 'linear-gradient(135deg, var(--cookitie-blue-100) 0%, var(--cookitie-yellow-100) 100%)',
        border: '1px solid var(--cookitie-blue-200)',
        color: '#4a5568'
      }
    })
  }

  return (
    <div className="relative">
      {/* Elementos decorativos de fundo melhorados - responsivos */}
      <div className="absolute top-16 md:top-20 left-8 md:left-10 w-32 md:w-40 h-32 md:h-40 cookitie-blob"></div>
      <div className="absolute top-32 md:top-40 right-16 md:right-20 w-24 md:w-32 h-24 md:h-32 cookitie-blob-2"></div>
      <div className="absolute bottom-16 md:bottom-20 left-1/3 w-28 md:w-36 h-28 md:h-36 cookitie-blob-3"></div>
      <div className="absolute top-48 md:top-60 left-1/2 w-20 md:w-28 h-20 md:h-28 cookitie-blob"></div>

      <div className="relative z-10 space-y-16 md:space-y-20">
        {/* Hero Section reformulada - mobile otimizada */}
        <section className="text-center space-y-4 md:space-y-6 lg:space-y-8 py-8 md:py-12 lg:py-16 xl:py-20 px-3 md:px-4">
          <div className="fade-in">
            <div className="inline-flex items-center gap-2 md:gap-3 cookitie-card-premium px-4 md:px-6 py-3 md:py-4 mb-6 md:mb-8 group cursor-pointer">
              <span className="text-xl md:text-2xl">🎓</span>
              <span className="font-semibold text-cookitie-blue-600 text-sm md:text-base">Projeto JEPP • Sebrae</span>
            </div>
            
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 lg:mb-8">
              <span className="bg-gradient-to-r from-cookitie-blue-500 via-cookitie-purple-500 to-cookitie-blue-600 bg-clip-text text-transparent">
                Bem-vindos à
              </span>
              <br />
              <span className="bg-gradient-to-r from-cookitie-yellow-500 via-cookitie-yellow-400 to-cookitie-pink-500 bg-clip-text text-transparent cookitie-decoration">
                Cookittie
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-2 md:px-4 font-modern">
              Somos estudantes do 1º ano do ensino médio apaixonados por confeitaria! 
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>Criamos doces artesanais com muito amor e dedicação para adoçar o seu dia. 🍪✨
            </p>
          </div>

          <div className="slide-in-left">
            <div className="inline-flex items-center gap-2 md:gap-3 cookitie-card px-4 md:px-6 py-2 md:py-3">
              <Heart className="text-cookitie-pink-400" size={16} />
              <span className="font-medium text-gray-700 text-sm md:text-base">Feito com carinho por jovens empreendedores</span>
              <Heart className="text-cookitie-pink-400" size={16} />
            </div>
          </div>
        </section>

        {/* Produtos Principais reformulados - mobile otimizada */}
        <section className="space-y-8 md:space-y-12 lg:space-y-16 px-3 md:px-4">
          <div className="text-center slide-in-right">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 lg:mb-8">
              <span className="bg-gradient-to-r from-cookitie-blue-500 to-cookitie-purple-500 bg-clip-text text-transparent">
                Nossos Queridinhos
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2 md:px-4 font-medium">
              Conheça os 4 produtos que conquistaram o coração de todos! 
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>Cada um feito com ingredientes selecionados e técnicas artesanais.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 xl:gap-10 max-w-8xl mx-auto">
            {COOKITIE_PRODUCTS.map((product, index) => (
              <div
                key={product.id}
                className="cookitie-card-premium p-4 md:p-6 lg:p-8 group hover:scale-105 transition-all duration-500 relative overflow-hidden fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {product.popular && (
                  <div className="absolute top-4 md:top-6 right-4 md:right-6 cookitie-card-premium px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold flex items-center gap-1 md:gap-2 bg-gradient-to-r from-cookitie-yellow-400 to-cookitie-yellow-500 text-white">
                    <Star size={12} fill="currentColor" />
                    Popular
                  </div>
                )}

                <div className="text-center space-y-4 md:space-y-6">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 md:h-48 lg:h-56 object-cover rounded-xl md:rounded-2xl lg:rounded-3xl group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute -top-1 md:-top-2 lg:-top-3 -right-1 md:-right-2 lg:-right-3 text-2xl md:text-3xl lg:text-4xl cookitie-card-premium w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 flex items-center justify-center shadow-xl">
                      {product.emoji}
                    </div>
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <h3 className="font-semibold text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-xs md:text-sm lg:text-base text-gray-600 leading-relaxed px-1 md:px-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between pt-3 md:pt-4 space-y-3 md:space-y-4 sm:space-y-0">
                    <div className="text-center sm:text-left">
                      <span className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cookitie-blue-500 to-cookitie-purple-500 bg-clip-text text-transparent">
                        R$ {product.price.toFixed(2)}
                      </span>
                      <p className="text-xs md:text-sm text-gray-500 font-medium">unidade</p>
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="btn-cookitie-primary flex items-center gap-2 md:gap-3 text-xs md:text-sm lg:text-base group-hover:scale-110 transition-transform w-full sm:w-auto justify-center py-2 md:py-3 px-4 md:px-6"
                    >
                      <Plus size={14} />
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Seção Sobre o Projeto JEPP reformulada - mobile otimizada */}
        <section className="cookitie-card-premium rounded-2xl md:rounded-3xl lg:rounded-4xl p-6 md:p-8 lg:p-12 xl:p-16 text-center space-y-6 md:space-y-8 lg:space-y-12 fade-in mx-2 md:mx-4">
          <div className="space-y-4 md:space-y-6 lg:space-y-8">
            <div className="inline-flex items-center gap-2 md:gap-3 cookitie-card-premium px-4 md:px-6 py-3 md:py-4">
              <span className="text-xl md:text-2xl lg:text-3xl">🚀</span>
              <span className="font-semibold text-base md:text-lg lg:text-xl font-bold text-gray-800">Projeto JEPP • Sebrae</span>
            </div>
            
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800">
              Jovens Empreendedores
            </h2>
            
            <p className="text-sm md:text-base lg:text-lg xl:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed px-2 md:px-4 font-medium">
              A <strong className="text-cookitie-blue-600">Cookitie</strong> nasceu como parte do programa JEPP (Jovens Empreendedores Primeiros Passos) do Sebrae. 
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>Somos um grupo de estudantes determinados a transformar nossa paixão por doces em um negócio real, 
              aprendendo sobre empreendedorismo, trabalho em equipe e realização de sonhos! 🌟
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-5xl mx-auto">
            <div className="cookitie-card-premium p-4 md:p-6 lg:p-8 space-y-3 md:space-y-4 lg:space-y-6">
              <div className="text-2xl md:text-3xl lg:text-4xl">📚</div>
              <h3 className="font-semibold text-base md:text-lg lg:text-xl font-bold text-gray-800">Aprendizado</h3>
              <p className="text-xs md:text-sm lg:text-base text-gray-700 font-medium">Desenvolvendo habilidades empreendedoras na prática</p>
            </div>
            
            <div className="cookitie-card-premium p-4 md:p-6 lg:p-8 space-y-3 md:space-y-4 lg:space-y-6">
              <div className="text-2xl md:text-3xl lg:text-4xl">🤝</div>
              <h3 className="font-semibold text-base md:text-lg lg:text-xl font-bold text-gray-800">Trabalho em Equipe</h3>
              <p className="text-xs md:text-sm lg:text-base text-gray-700 font-medium">Colaboração e união para alcançar nossos objetivos</p>
            </div>
            
            <div className="cookitie-card-premium p-4 md:p-6 lg:p-8 space-y-3 md:space-y-4 lg:space-y-6">
              <div className="text-2xl md:text-3xl lg:text-4xl">💝</div>
              <h3 className="font-semibold text-base md:text-lg lg:text-xl font-bold text-gray-800">Paixão</h3>
              <p className="text-xs md:text-sm lg:text-base text-gray-700 font-medium">Amor pela confeitaria e dedicação em cada produto</p>
            </div>
          </div>

          <div className="cookitie-card-premium p-4 md:p-6 lg:p-8 max-w-3xl mx-auto">
            <p className="text-gray-800 font-semibold text-sm md:text-base lg:text-lg">
              💫 <em>"Cada doce que fazemos carrega nossos sonhos e aprendizados. 
              Obrigado por fazer parte desta jornada conosco!"</em>
            </p>
            <p className="text-xs md:text-sm lg:text-base text-gray-600 mt-2 md:mt-3">— Equipe Cookittie</p>
          </div>
        </section>
      </div>
    </div>
  )
}