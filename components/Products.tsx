import { useCart } from '../contexts/CartContext'
import { toast } from 'sonner'
import { ProductCustomizer } from './ProductCustomizer'
import { useState } from 'react'

interface ProductsProps {
  onNavigateToFlavors?: () => void
}

const COOKITIE_PRODUCTS = [
  {
    id: '1',
    name: 'Brigadeiro',
    price: 8.50,
    image: '/imagens/imagens-produtos/espetinho de brogadeiro.jpg',
    description: 'Doce brasileiro tradicional coberto com granulado de chocolate, feito com muito amor!',
    emoji: '🍫',
    popular: true,
    flavors: [
      {
        id: 'classico',
        name: 'Clássico',
        emoji: '🍫',
        description: 'Brigadeiro tradicional com granulado de chocolate'
      },
      {
        id: 'morango',
        name: 'Morango',
        emoji: '🍓',
        description: 'Brigadeiro com sabor de morango e granulado colorido'
      },
      {
        id: 'coco',
        name: 'Coco',
        emoji: '🥥',
        description: 'Brigadeiro com sabor de coco e coco ralado'
      },
      {
        id: 'beijinho',
        name: 'Beijinho',
        emoji: '🤍',
        description: 'Brigadeiro de coco com açúcar cristal'
      }
    ]
  },
  {
    id: '2',
    name: 'Palha Italiana',
    price: 8.50,
    image: '/imagens/imagens-produtos/Palha italiana.webp',
    description: 'Doce tradicional brasileiro com biscoito triturado e chocolate cremoso, coberto com açúcar de confeiteiro.',
    emoji: '🍫',
    popular: true,
    flavors: [
      {
        id: 'tradicional',
        name: 'Tradicional',
        emoji: '🍫',
        description: 'Palha italiana clássica com chocolate e biscoito'
      },
      {
        id: 'chocolate-branco',
        name: 'Chocolate Branco',
        emoji: '🤍',
        description: 'Palha italiana com chocolate branco'
      }
    ]
  },
  {
    id: '3',
    name: 'Cookie',
    price: 8.50,
    image: '/imagens/imagens-produtos/cookie-padrao.jpg',
    description: 'Cookies crocantes por fora e macios por dentro, com gotas de chocolate, feitos com muito carinho.',
    emoji: '🍪',
    popular: false,
    flavors: [
      {
        id: 'chocolate',
        name: 'Chocolate',
        emoji: '🍫',
        description: 'Cookie com gotas de chocolate'
      },
      {
        id: 'aveia-mel',
        name: 'Aveia e Mel',
        emoji: '🌾',
        description: 'Cookie saudável com aveia e mel'
      },
      {
        id: 'baunilha',
        name: 'Baunilha',
        emoji: '🤍',
        description: 'Cookie clássico de baunilha'
      }
    ]
  },
  {
    id: '4',
    name: 'Biscoito Amanteigado',
    price: 8.50,
    image: '/imagens/imagens-produtos/Bisc-amant-glace.jpeg',
    description: 'Biscoitos delicados em formatos variados (estrela, boneco, coração), derretendo na boca.',
    emoji: '🥨',
    popular: false,
    flavors: [
      {
        id: 'estrela',
        name: 'Estrela',
        emoji: '⭐',
        description: 'Biscoito em formato de estrela'
      },
      {
        id: 'coracao',
        name: 'Coração',
        emoji: '❤️',
        description: 'Biscoito em formato de coração'
      },
      {
        id: 'boneco',
        name: 'Boneco',
        emoji: '🧸',
        description: 'Biscoito em formato de boneco'
      }
    ]
  }
]

export const Products = ({ onNavigateToFlavors }: ProductsProps) => {
  const { addItem } = useCart()
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<typeof COOKITIE_PRODUCTS[0] | null>(null)

  const handleAddToCart = (product: typeof COOKITIE_PRODUCTS[0]) => {
    setSelectedProduct(product)
    setShowCustomizer(true)
  }

  const handleCustomProduct = (customProduct: any) => {
    addItem(customProduct)
  }

  return (
    <div className="py-8 px-4 lg:py-16" style={{ backgroundColor: '#FDFAF5' }}>
      <div className="max-w-6xl mx-auto">
             {/* Grid de Produtos */}
             <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
               {COOKITIE_PRODUCTS.map((product) => (
                 <div key={product.id} className="rounded-2xl overflow-hidden" style={{
                   backgroundColor: '#F4F4F4',
                   boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)'
                 }}>
                   {/* Imagem do produto */}
                   <div className="relative h-56 overflow-hidden rounded-t-2xl">
                     <img
                       src={product.image}
                       alt={product.name}
                       className="w-full h-full object-cover rounded-t-2xl transition-transform duration-300 ease-in-out"
                       loading="lazy"
                       decoding="async"
                       onMouseEnter={(e) => {
                         e.currentTarget.style.transform = 'scale(1.05)';
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.transform = 'scale(1)';
                       }}
                     />
                   </div>
                   
                   {/* Conteúdo do card */}
                   <div className="p-6 text-center">
                     <h3 className="text-lg font-bold text-black mb-2" style={{ fontWeight: '700' }}>
                       {product.name}
                     </h3>
                     
                     <div className="text-2xl mb-4" style={{ color: '#A27CBD', fontFamily: 'Inter, sans-serif', fontWeight: '700' }}>
                       R$ {product.price.toFixed(2)}
                     </div>
                     
                     {/* Botão Adicionar */}
                     <button
                       onClick={() => handleAddToCart(product)}
                       className="w-full text-white flex items-center justify-center py-3 px-4 transition-all duration-300 ease-in-out touch-target"
                       style={{ 
                         backgroundColor: '#E4B7CB',
                         borderRadius: '25px',
                         fontFamily: 'Inter, sans-serif',
                         fontWeight: '700',
                         gap: '8px',
                         letterSpacing: '0.5px',
                         minHeight: '44px'
                       }}
                       onMouseEnter={(e) => {
                         e.currentTarget.style.backgroundColor = '#D4A5B8';
                         e.currentTarget.style.transform = 'translateY(-2px)';
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.backgroundColor = '#E4B7CB';
                         e.currentTarget.style.transform = 'translateY(0)';
                       }}
                     >
                       <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: '700' }}>+</span>
                       Adicionar
                     </button>
                   </div>
                 </div>
               ))}
             </div>
        
      </div>
      
      {/* Modal de Personalização de Produtos */}
      {selectedProduct && (
        <ProductCustomizer
          isOpen={showCustomizer}
          onClose={() => {
            setShowCustomizer(false)
            setSelectedProduct(null)
          }}
          onAddToCart={handleCustomProduct}
          product={selectedProduct}
        />
      )}
    </div>
  )
}