import { Plus } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { toast } from 'sonner'

const SAMPLE_PRODUCTS = [
  {
    id: '1',
    name: 'Cookie Chocolate',
    price: 8.50,
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop',
    description: 'Delicioso cookie de chocolate com gotas'
  },
  {
    id: '2',
    name: 'Cookie Baunilha',
    price: 7.50,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop',
    description: 'Cookie tradicional de baunilha'
  },
  {
    id: '3',
    name: 'Cookie Red Velvet',
    price: 9.50,
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400&h=400&fit=crop',
    description: 'Cookie red velvet com cream cheese'
  },
  {
    id: '4',
    name: 'Cookie Nutella',
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop',
    description: 'Cookie recheado com Nutella'
  },
  {
    id: '5',
    name: 'Cookie Limão',
    price: 8.00,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop',
    description: 'Cookie cítrico de limão siciliano'
  },
  {
    id: '6',
    name: 'Cookie Amendoim',
    price: 9.00,
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400&h=400&fit=crop',
    description: 'Cookie crocante com pasta de amendoim'
  }
]

export const Products = () => {
  const { addItem } = useCart()

  const handleAddToCart = (product: typeof SAMPLE_PRODUCTS[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    })
    toast.success(`${product.name} adicionado ao carrinho!`)
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Cookies Artesanais
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Os melhores cookies fresquinhos feitos com muito carinho para o evento JEPP
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAMPLE_PRODUCTS.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-purple-600">
                  R$ {product.price.toFixed(2)}
                </span>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="bg-purple-50 rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-purple-900 mb-2">
          Evento JEPP 2024
        </h2>
        <p className="text-purple-700">
          Todos os cookies serão entregues fresquinhos no dia do evento!
        </p>
      </div>
    </div>
  )
}