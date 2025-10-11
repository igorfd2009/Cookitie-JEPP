import { useState } from 'react'
import { X, Plus, Minus } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { toast } from 'sonner'

interface BrigadeiroCustomizerProps {
  isOpen: boolean
  onClose: () => void
  onAddToCart: (customBrigadeiro: any) => void
}

const BRIGADEIRO_FLAVORS = [
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

export const BrigadeiroCustomizer = ({ isOpen, onClose, onAddToCart }: BrigadeiroCustomizerProps) => {
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>(['classico', 'morango', 'coco'])
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({
    classico: 1,
    morango: 1,
    coco: 1,
    beijinho: 0
  })

  if (!isOpen) return null

  const handleFlavorToggle = (flavorId: string) => {
    const currentCount = selectedFlavors.length
    const isSelected = selectedFlavors.includes(flavorId)
    
    if (isSelected && currentCount > 1) {
      // Remover sabor
      setSelectedFlavors(prev => prev.filter(id => id !== flavorId))
      setQuantities(prev => ({ ...prev, [flavorId]: 0 }))
    } else if (!isSelected && currentCount < 3) {
      // Adicionar sabor
      setSelectedFlavors(prev => [...prev, flavorId])
      setQuantities(prev => ({ ...prev, [flavorId]: 1 }))
    }
  }

  const handleQuantityChange = (flavorId: string, change: number) => {
    const currentQty = quantities[flavorId] || 0
    const newQty = Math.max(0, Math.min(3, currentQty + change))
    
    if (newQty === 0) {
      // Remover sabor se quantidade for 0
      setSelectedFlavors(prev => prev.filter(id => id !== flavorId))
    } else if (newQty > 0 && !selectedFlavors.includes(flavorId)) {
      // Adicionar sabor se quantidade for > 0
      setSelectedFlavors(prev => [...prev, flavorId])
    }
    
    setQuantities(prev => ({ ...prev, [flavorId]: newQty }))
  }

  const getTotalQuantity = () => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0)
  }

  const handleAddToCart = () => {
    const totalQty = getTotalQuantity()
    if (totalQty !== 3) {
      toast.error('O espetinho deve ter exatamente 3 brigadeiros!')
      return
    }

    const customBrigadeiro = {
      id: `espetinho-custom-${Date.now()}`,
      name: 'Espetinho de Brigadeiro Personalizado',
      price: 8.50,
      image: '/imagens/imagens-produtos/espetinho de brogadeiro.jpg',
      customFlavors: selectedFlavors.map(flavorId => {
        const flavor = BRIGADEIRO_FLAVORS.find(f => f.id === flavorId)
        return {
          id: flavorId,
          name: flavor?.name || '',
          emoji: flavor?.emoji || '',
          quantity: quantities[flavorId]
        }
      }).filter(flavor => flavor.quantity > 0)
    }

    onAddToCart(customBrigadeiro)
    onClose()
    
    toast.success('Espetinho personalizado adicionado ao carrinho! 🎉', {
      duration: 2000,
      style: {
        background: 'linear-gradient(135deg, #fdf1c3 0%, #d1eaed 100%)',
        border: '1px solid #d1eaed',
        color: '#4a5568'
      }
    })
  }

  const totalQty = getTotalQuantity()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Personalizar Espetinho de Brigadeiro</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Escolha exatamente 3 brigadeiros para seu espetinho personalizado:
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 font-medium">
                Brigadeiros selecionados: {totalQty}/3
              </p>
            </div>
          </div>

          {/* Sabores disponíveis */}
          <div className="space-y-4">
            {BRIGADEIRO_FLAVORS.map((flavor) => {
              const isSelected = selectedFlavors.includes(flavor.id)
              const quantity = quantities[flavor.id] || 0
              
              return (
                <div
                  key={flavor.id}
                  className={`border-2 rounded-lg p-4 transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{flavor.emoji}</div>
                      <div>
                        <h3 className="font-semibold text-lg">{flavor.name}</h3>
                        <p className="text-sm text-gray-600">{flavor.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {/* Controles de quantidade */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(flavor.id, -1)}
                          disabled={quantity === 0}
                          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus size={16} />
                        </button>
                        
                        <span className="w-8 text-center font-semibold">
                          {quantity}
                        </span>
                        
                        <button
                          onClick={() => handleQuantityChange(flavor.id, 1)}
                          disabled={totalQty >= 3}
                          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Preview do espetinho */}
          {totalQty > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Seu espetinho personalizado:</h3>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍢</span>
                {selectedFlavors.map(flavorId => {
                  const flavor = BRIGADEIRO_FLAVORS.find(f => f.id === flavorId)
                  const qty = quantities[flavorId]
                  if (!flavor || qty === 0) return null
                  
                  return Array(qty).fill(0).map((_, index) => (
                    <span key={`${flavorId}-${index}`} className="text-2xl">
                      {flavor.emoji}
                    </span>
                  ))
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-lg font-semibold">
            Total: R$ 8,50
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddToCart}
              disabled={totalQty !== 3}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
