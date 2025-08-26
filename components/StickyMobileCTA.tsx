import React from 'react'
import { Button } from './ui/button'
import { ShoppingCart, Package, ChefHat } from 'lucide-react'

interface StickyMobileCTAProps {
  currentPage: string
  onGoToCheckout: () => void
}

export const StickyMobileCTA: React.FC<StickyMobileCTAProps> = ({
  currentPage,
  onGoToCheckout
}) => {
  // Só mostrar na página de produtos
  if (currentPage !== 'products') {
    return null
  }

  const scrollToProducts = () => {
    const productsElement = document.getElementById('products')
    if (productsElement) {
      productsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex p-4 gap-3">
        <Button
          onClick={scrollToProducts}
          variant="outline"
          className="flex-1 h-12 text-sm font-medium"
        >
          <Package className="w-4 h-4 mr-2" />
          Ver Produtos
        </Button>
        
        <Button
          onClick={onGoToCheckout}
          className="flex-1 h-12 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Finalizar Pedido
        </Button>
      </div>
    </div>
  )
}