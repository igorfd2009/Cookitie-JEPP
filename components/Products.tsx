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
        background: 'linear-gradient(135deg, #e0f0ff 0%, #fff5b8 100%)',
        border: '1px solid #b8e0ff',
        color: '#374151'
      }
    })
  }

  return (
    <div className="relative">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-20 left-10 w-32 h-32 cookitie-blob"></div>
      <div className="absolute top-40 right-20 w-24 h-24 cookitie-blob-2"></div>
      <div className="absolute bottom-20 left-1/3 w-28 h-28 cookitie-blob"></div>

      <div className="relative z-10 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-16">
          <div className="fade-in">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-yellow-100 px-6 py-3 rounded-full mb-6">
              <span className="text-2xl">🎓</span>
              <span className="font-cookitie text-blue-700 font-medium">Projeto JEPP • Sebrae</span>
            </div>
            
            <h1 className="font-cookitie text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
                Bem-vindos à
              </span>
              <br />
              <span className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300 bg-clip-text text-transparent cookitie-decoration">
                Cookitie
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Somos estudantes do 1º ano do ensino médio apaixonados por confeitaria! 
              <br />
              Criamos doces artesanais com muito amor e dedicação para adoçar o seu dia. 🍪✨
            </p>
          </div>

          <div className="slide-in-left">
            <div className="inline-flex items-center gap-2 text-gray-500">
              <Heart className="text-red-400" size={20} />
              <span className="font-medium">Feito com carinho por jovens empreendedores</span>
              <Heart className="text-red-400" size={20} />
            </div>
          </div>
        </section>

        {/* Produtos Principais */}
        <section className="space-y-12">
          <div className="text-center slide-in-right">
            <h2 className="font-cookitie text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                Nossos Queridinhos
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conheça os 4 produtos que conquistaram o coração de todos! 
              Cada um feito com ingredientes selecionados e técnicas artesanais.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {COOKITIE_PRODUCTS.map((product, index) => (
              <div
                key={product.id}
                className="cookitie-card p-6 group hover:scale-105 transition-all duration-300 relative overflow-hidden fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {product.popular && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star size={12} fill="currentColor" />
                    Popular
                  </div>
                )}

                <div className="text-center space-y-4">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute -top-2 -right-2 text-3xl bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                      {product.emoji}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-cookitie text-xl font-bold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-left">
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent font-cookitie">
                        R$ {product.price.toFixed(2)}
                      </span>
                      <p className="text-xs text-gray-500">unidade</p>
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="btn-cookitie-primary flex items-center gap-2 text-sm group-hover:scale-110 transition-transform"
                    >
                      <Plus size={16} />
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Seção Sobre o Projeto JEPP */}
        <section className="gradient-cookitie-mixed rounded-3xl p-12 text-center space-y-8 fade-in">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 bg-white/80 px-6 py-3 rounded-full">
              <span className="text-2xl">🚀</span>
              <span className="font-cookitie text-lg font-bold text-gray-800">Projeto JEPP • Sebrae</span>
            </div>
            
            <h2 className="font-cookitie text-3xl md:text-4xl font-bold text-gray-800">
              Jovens Empreendedores
            </h2>
            
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              A <strong>Cookitie</strong> nasceu como parte do programa JEPP (Jovens Empreendedores Primeiros Passos) do Sebrae. 
              Somos um grupo de estudantes determinados a transformar nossa paixão por doces em um negócio real, 
              aprendendo sobre empreendedorismo, trabalho em equipe e realização de sonhos! 🌟
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/60 rounded-2xl p-6 space-y-3">
              <div className="text-3xl">📚</div>
              <h3 className="font-cookitie text-lg font-bold text-gray-800">Aprendizado</h3>
              <p className="text-sm text-gray-700">Desenvolvendo habilidades empreendedoras na prática</p>
            </div>
            
            <div className="bg-white/60 rounded-2xl p-6 space-y-3">
              <div className="text-3xl">🤝</div>
              <h3 className="font-cookitie text-lg font-bold text-gray-800">Trabalho em Equipe</h3>
              <p className="text-sm text-gray-700">Colaboração e união para alcançar nossos objetivos</p>
            </div>
            
            <div className="bg-white/60 rounded-2xl p-6 space-y-3">
              <div className="text-3xl">💝</div>
              <h3 className="font-cookitie text-lg font-bold text-gray-800">Paixão</h3>
              <p className="text-sm text-gray-700">Amor pela confeitaria e dedicação em cada produto</p>
            </div>
          </div>

          <div className="bg-white/80 rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-gray-800 font-medium">
              💫 <em>"Cada doce que fazemos carrega nossos sonhos e aprendizados. 
              Obrigado por fazer parte desta jornada conosco!"</em>
            </p>
            <p className="text-sm text-gray-600 mt-2 font-cookitie">— Equipe Cookitie</p>
          </div>
        </section>
      </div>
    </div>
  )
}