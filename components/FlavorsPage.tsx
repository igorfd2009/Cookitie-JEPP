import { ArrowLeft } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { CategoryRow } from './CategoryRow'
import { toast } from 'sonner'

interface FlavorsPageProps {
  onBackToProducts: () => void
}

const FLAVORS_PRODUCTS = [
  // Brigadeiros (3 tipos)
  {
    id: 'brigadeiro-classico',
    name: 'Brigadeiro Clássico',
    price: 8.50,
    image: '/imagens/imagens-produtos/Brigadeiro.webp',
    description: 'Brigadeiro tradicional com granulado de chocolate, no formato de espetinho.',
    emoji: '🍫',
    category: 'brigadeiro',
    customizable: true,
    popular: true
  },
  {
    id: 'brigadeiro-morango',
    name: 'Brigadeiro Morango',
    price: 8.50,
    image: '/imagens/imagens-produtos/Brigadeiro.webp',
    description: 'Brigadeiro com sabor de morango, coberto com granulado colorido.',
    emoji: '🍓',
    category: 'brigadeiro',
    customizable: true,
    popular: true
  },
  {
    id: 'brigadeiro-coco',
    name: 'Brigadeiro Coco',
    price: 8.50,
    image: '/imagens/imagens-produtos/Brigadeiro.webp',
    description: 'Brigadeiro com sabor de coco, coberto com coco ralado.',
    emoji: '🥥',
    category: 'brigadeiro',
    customizable: true,
    popular: false
  },
  // Cookies (2 tipos)
  {
    id: 'cookie-chocolate',
    name: 'Cookie de Chocolate',
    price: 8.50,
    image: '/imagens/imagens-produtos/Cookie.webp',
    description: 'Cookie crocante com gotas de chocolate, perfeito para acompanhar um café.',
    emoji: '🍪',
    category: 'cookie',
    customizable: false,
    popular: true
  },
  {
    id: 'cookie-aveia',
    name: 'Cookie Aveia Mel',
    price: 8.50,
    image: '/imagens/imagens-produtos/Cookie.webp',
    description: 'Cookie saudável com aveia e mel, uma opção mais leve e nutritiva.',
    emoji: '🌾',
    category: 'cookie',
    customizable: false,
    popular: false
  },
  // Biscoitos Amanteigados (2 tipos)
  {
    id: 'biscoito-estrela',
    name: 'Biscoito Estrela',
    price: 8.50,
    image: '/imagens/imagens-produtos/Biscoito amanteigado.webp',
    description: 'Biscoito delicado em formato de estrela, derretendo na boca.',
    emoji: '⭐',
    category: 'biscoito',
    customizable: false,
    popular: true
  },
  {
    id: 'biscoito-coracao',
    name: 'Biscoito Coração',
    price: 8.50,
    image: '/imagens/imagens-produtos/Biscoito amanteigado.webp',
    description: 'Biscoito romântico em formato de coração, perfeito para presentear.',
    emoji: '❤️',
    category: 'biscoito',
    customizable: false,
    popular: false
  },
  // Palha Italiana (1 tipo)
  {
    id: 'palha-italiana',
    name: 'Palha Italiana',
    price: 8.50,
    image: '/imagens/imagens-produtos/Palha italiana.webp',
    description: 'Doce tradicional brasileiro com biscoito triturado e chocolate cremoso.',
    emoji: '🍫',
    category: 'palha',
    customizable: false,
    popular: true
  }
]

export const FlavorsPage = ({ onBackToProducts }: FlavorsPageProps) => {
  const { addItem } = useCart()

  // Agrupar produtos por categoria
  const productsByCategory = {
    brigadeiro: FLAVORS_PRODUCTS.filter(p => p.category === 'brigadeiro'),
    cookie: FLAVORS_PRODUCTS.filter(p => p.category === 'cookie'),
    biscoito: FLAVORS_PRODUCTS.filter(p => p.category === 'biscoito'),
    palha: FLAVORS_PRODUCTS.filter(p => p.category === 'palha')
  }

  const handleAddToCart = (product: typeof FLAVORS_PRODUCTS[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    })
    toast.success(`${product.name} adicionado ao carrinho! 🎉`, {
      duration: 2000,
      style: {
        background: 'linear-gradient(135deg, #fdf1c3 0%, #d1eaed 100%)',
        border: '1px solid #d1eaed',
        color: '#4a5568'
      }
    })
  }


  return (
    <div 
      className="min-h-screen" 
      style={{
        backgroundImage: 'linear-gradient(rgba(253, 250, 245, 0.8), rgba(253, 250, 245, 0.8)), url(/imagens/fundo-patas.jpeg)',
        backgroundSize: '500px 500px',
        backgroundRepeat: 'repeat',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundColor: '#FDFAF5'
      }}
    >

      {/* Conteúdo Principal */}
      <div className="max-w-full px-4 py-6 pb-16">
        {/* Botão Voltar */}
        <button
          onClick={onBackToProducts}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Voltar</span>
        </button>

        {/* Categorias de Produtos */}
        <div className="space-y-12">
          {/* Brigadeiros */}
          {productsByCategory.brigadeiro.length > 0 && (
            <CategoryRow 
              title="Brigadeiro"
              products={productsByCategory.brigadeiro}
              onAddToCart={handleAddToCart}
            />
          )}

          {/* Cookies */}
          {productsByCategory.cookie.length > 0 && (
            <CategoryRow 
              title="Cookie"
              products={productsByCategory.cookie}
              onAddToCart={handleAddToCart}
            />
          )}

          {/* Biscoitos Amanteigados */}
          {productsByCategory.biscoito.length > 0 && (
            <CategoryRow 
              title="Biscoito amanteigado"
              products={productsByCategory.biscoito}
              onAddToCart={handleAddToCart}
            />
          )}

          {/* Palha Italiana */}
          {productsByCategory.palha.length > 0 && (
            <CategoryRow 
              title="Palha italiana"
              products={productsByCategory.palha}
              onAddToCart={handleAddToCart}
            />
          )}
        </div>
      </div>
    </div>
  )
}
