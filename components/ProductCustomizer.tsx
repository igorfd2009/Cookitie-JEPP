import { useState } from 'react'
import { X, Plus, Minus } from 'lucide-react'
import { toast } from 'sonner'

interface ProductCustomizerProps {
  isOpen: boolean
  onClose: () => void
  onAddToCart: (product: any) => void
  product: {
    id: string
    name: string
    price: number
    image: string
    description: string
    emoji: string
    category?: string
    flavors?: Array<{
      id: string
      name: string
      emoji: string
      description: string
    }>
  }
}

export const ProductCustomizer = ({ isOpen, onClose, onAddToCart, product }: ProductCustomizerProps) => {
  const [selectedFlavor, setSelectedFlavor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  // Para espetinho de brigadeiro - controle de quantidades por sabor
  const [brigadeiroQuantities, setBrigadeiroQuantities] = useState<{ [key: string]: number }>({
    tradicional: 1,
    pacoca: 1,
    ninho: 1,
    'beijinho-de-pe': 0
  })

  if (!isOpen) return null

  // Se o produto tem sabores, usar o primeiro como padrão
  const hasFlavors = product.flavors && product.flavors.length > 0
  const defaultFlavor = hasFlavors ? product.flavors[0].id : ''
  const isBrigadeiroEspetinho = product.id === '1' // ID do brigadeiro

  const handleAddToCart = () => {
    if (isBrigadeiroEspetinho) {
      // Validação especial para espetinho de brigadeiro
      const totalBrigadeiros = Object.values(brigadeiroQuantities).reduce((sum, qty) => sum + qty, 0)
      if (totalBrigadeiros !== 3) {
        toast.error('O espetinho deve ter exatamente 3 brigadeiros!')
        return
      }

      const customProduct = {
        id: `espetinho-custom-${Date.now()}`,
        name: 'Espetinho de Brigadeiro Personalizado',
        price: product.price,
        image: product.image,
        quantity: quantity,
        customFlavors: Object.entries(brigadeiroQuantities)
          .filter(([_, qty]) => qty > 0)
          .map(([flavorId, qty]) => {
            const flavor = product.flavors?.find(f => f.id === flavorId)
            return {
              id: flavorId,
              name: flavor?.name || '',
              emoji: flavor?.emoji || '',
              quantity: qty
            }
          })
      }

      onAddToCart(customProduct)
      onClose()
      
      toast.success('Espetinho personalizado adicionado ao carrinho! 🎉', {
        duration: 2000,
        style: {
          background: 'linear-gradient(135deg, #fdf1c3 0%, #d1eaed 100%)',
          border: '1px solid #d1eaed',
          color: '#4a5568'
        }
      })
      return
    }

    // Lógica normal para outros produtos
    if (hasFlavors && !selectedFlavor) {
      toast.error('Por favor, selecione um sabor!')
      return
    }

    const customProduct = {
      id: `${product.id}-${selectedFlavor || 'default'}-${Date.now()}`,
      name: hasFlavors 
        ? `${product.name} - ${product.flavors?.find(f => f.id === selectedFlavor)?.name || 'Sabor Selecionado'}`
        : product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      customFlavor: hasFlavors ? selectedFlavor : null
    }

    onAddToCart(customProduct)
    onClose()
    
    toast.success(`${customProduct.name} adicionado ao carrinho! 🎉`, {
      duration: 2000,
      style: {
        background: 'linear-gradient(135deg, #fdf1c3 0%, #d1eaed 100%)',
        border: '1px solid #d1eaed',
        color: '#4a5568'
      }
    })
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, Math.min(10, quantity + change))
    setQuantity(newQuantity)
  }

  // Funções para espetinho de brigadeiro
  const handleBrigadeiroQuantityChange = (flavorId: string, change: number) => {
    const currentQty = brigadeiroQuantities[flavorId] || 0
    const newQty = Math.max(0, Math.min(3, currentQty + change))
    
    setBrigadeiroQuantities(prev => ({
      ...prev,
      [flavorId]: newQty
    }))
  }

  const getTotalBrigadeiros = () => {
    return Object.values(brigadeiroQuantities).reduce((sum, qty) => sum + qty, 0)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Personalizar {product.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Imagem do produto */}
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm">{product.description}</p>
          </div>

          {/* Sistema especial para espetinho de brigadeiro */}
          {isBrigadeiroEspetinho ? (
            <div className="mb-6">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-blue-800 font-medium text-center">
                  Monte seu espetinho: {getTotalBrigadeiros()}/3 brigadeiros
                </p>
              </div>
              
              <h4 className="font-semibold mb-3">Escolha os sabores dos 3 brigadeiros:</h4>
              <div className="space-y-3">
                {product.flavors?.map((flavor) => {
                  const qty = brigadeiroQuantities[flavor.id] || 0
                  return (
                    <div
                      key={flavor.id}
                      className={`border-2 rounded-lg p-3 transition-all ${
                        qty > 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {flavor.emoji && <div className="text-2xl">{flavor.emoji}</div>}
                          <div>
                            <h5 className="font-medium">{flavor.name}</h5>
                            <p className="text-sm text-gray-600">{flavor.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleBrigadeiroQuantityChange(flavor.id, -1)}
                            disabled={qty === 0}
                            className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus size={16} />
                          </button>
                          
                          <span className="w-8 text-center font-semibold">
                            {qty}
                          </span>
                          
                          <button
                            onClick={() => handleBrigadeiroQuantityChange(flavor.id, 1)}
                            disabled={getTotalBrigadeiros() >= 3}
                            className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* Preview do espetinho */}
              {getTotalBrigadeiros() > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Seu espetinho:</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🍢</span>
                    {Object.entries(brigadeiroQuantities).map(([flavorId, qty]) => {
                      if (qty === 0) return null
                      const flavor = product.flavors?.find(f => f.id === flavorId)
                      if (!flavor) return null
                      
                      return Array(qty).fill(0).map((_, index) => (
                        <span key={`${flavorId}-${index}`} className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {flavor.name}
                        </span>
                      ))
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Seleção de Sabores para outros produtos */
            hasFlavors && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Escolha o sabor:</h4>
                <div className="space-y-2">
                  {product.flavors?.map((flavor) => (
                    <div
                      key={flavor.id}
                      className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                        selectedFlavor === flavor.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedFlavor(flavor.id)}
                    >
                      <div className="flex items-center gap-3">
                        {flavor.emoji && <div className="text-2xl">{flavor.emoji}</div>}
                        <div>
                          <h5 className="font-medium">{flavor.name}</h5>
                          <p className="text-sm text-gray-600">{flavor.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* Controle de Quantidade */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Quantidade:</h4>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus size={20} />
              </button>
              
              <span className="text-2xl font-bold w-8 text-center">{quantity}</span>
              
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 10}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Preço Total */}
          <div className="text-center mb-6">
            <div className="text-3xl font-bold" style={{ color: '#A27CBD' }}>
              R$ {(product.price * quantity).toFixed(2)}
            </div>
            {quantity > 1 && (
              <div className="text-sm text-gray-500">
                R$ {product.price.toFixed(2)} cada
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleAddToCart}
            disabled={
              isBrigadeiroEspetinho 
                ? getTotalBrigadeiros() !== 3
                : hasFlavors && !selectedFlavor
            }
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isBrigadeiroEspetinho ? 'Montar Espetinho' : 'Adicionar ao Carrinho'}
          </button>
        </div>
      </div>
    </div>
  )
}
