import { useCart } from '../contexts/CartContext'
import { toast } from 'sonner'

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
    popular: true
  },
  {
    id: '2',
    name: 'Palha Italiana',
    price: 8.50,
    image: '/imagens/imagens-produtos/Palha italiana.webp',
    description: 'Doce tradicional brasileiro com biscoito triturado e chocolate cremoso, coberto com açúcar de confeiteiro.',
    emoji: '🍫',
    popular: true
  },
  {
    id: '3',
    name: 'Cookie',
    price: 8.50,
    image: '/imagens/imagens-produtos/cookie-padrao.jpg',
    description: 'Cookies crocantes por fora e macios por dentro, com gotas de chocolate, feitos com muito carinho.',
    emoji: '🍪',
    popular: false
  },
  {
    id: '4',
    name: 'Biscoito Amanteigado',
    price: 8.50,
    image: '/imagens/imagens-produtos/Bisc-amant-glace.jpeg',
    description: 'Biscoitos delicados em formatos variados (estrela, boneco, coração), derretendo na boca.',
    emoji: '🥨',
    popular: false
  }
]

export const Products = ({ onNavigateToFlavors }: ProductsProps) => {
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
        background: 'linear-gradient(135deg, #fdf1c3 0%, #d1eaed 100%)',
        border: '1px solid #d1eaed',
        color: '#4a5568'
      }
    })
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
        
        {/* Botão "Ver mais sabores" de largura total - apenas em mobile */}
        <div className="mt-8 lg:hidden">
          <button 
            onClick={onNavigateToFlavors}
            className="w-full text-black py-3 px-12 transition-all duration-300 ease-in-out touch-target"
            style={{
              backgroundColor: '#F4F4F4',
              borderRadius: '20px',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
              fontWeight: 'bold',
              fontSize: '18px',
              minHeight: '44px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E8E8E8';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F4F4F4';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0px 4px 4px rgba(0, 0, 0, 0.1)';
            }}
          >
            Ver mais sabores
          </button>
        </div>

        {/* Botões "Ver mais sabores" abaixo de cada produto - apenas em desktop */}
        <div className="hidden lg:grid grid-cols-4 gap-8 mt-4">
          {COOKITIE_PRODUCTS.map((product) => (
            <button 
              key={`more-${product.id}`}
              onClick={onNavigateToFlavors}
              className="text-black py-3 px-4 transition-all duration-300 ease-in-out touch-target"
              style={{
                backgroundColor: '#F4F4F4',
                borderRadius: '20px',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
                fontWeight: 'bold',
                fontSize: '18px',
                minHeight: '44px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E8E8E8';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F4F4F4';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0px 4px 4px rgba(0, 0, 0, 0.1)';
              }}
            >
              Ver mais sabores
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}