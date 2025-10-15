import { Minus, Plus, Trash2, Heart, Home } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

interface CartProps {
  onGoToCheckout: () => void
  onBackToProducts?: () => void
}

export const Cart = ({ onGoToCheckout }: CartProps) => {
  const { items, totalItems, totalPrice, updateQuantity, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-80 h-80 flex items-center justify-center mx-auto mb-6">
          <img 
            src="/imagens/carrinho-vazio-icone-removebg-preview.png" 
            alt="Carrinho vazio" 
            className="w-80 h-80 object-contain"
            onError={(e) => {
              console.log('Erro ao carregar carrinho-vazio-icone-removebg-preview.png');
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3 -mt-16" style={{ fontFamily: 'Inter, sans-serif' }}>
          Seu carrinho está vazio
        </h2>
        <div className="inline-flex items-center gap-2 text-blue-500 mb-8">
          <Heart size={20} className="text-red-400" />
          <span className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Que tal adicionar alguns produtos?</span>
        </div>
        
        {/* Botão Voltar aos Produtos */}
        <div className="flex justify-center">
          <button 
            onClick={() => window.location.href = '/products'}
            className="px-8 py-4 text-black font-bold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            style={{ backgroundColor: '#AAC5C8', fontFamily: 'Inter, sans-serif', borderRadius: '20px', marginBottom: '32px' }}
          >
            <Home size={20} />
            Voltar aos Produtos
          </button>
        </div>
        
      </div>
    )
  }

  return (
    <div className="space-y-6 py-4 px-4 sm:space-y-8 sm:py-8 sm:pl-8 sm:pr-4">
      {/* Header do Carrinho */}
      <div className="flex flex-col gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            🛒 Seu Carrinho
          </h1>
          <p className="text-gray-600 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
            {totalItems} {totalItems === 1 ? 'item delicioso' : 'itens deliciosos'} selecionados
          </p>
        </div>
        <button
          onClick={clearCart}
          className="flex items-center justify-center gap-2 px-4 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300 self-center sm:self-start"
          style={{ minHeight: '44px' }}
        >
          <Trash2 size={16} />
          <span className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Limpar carrinho</span>
        </button>
      </div>

      {/* Lista de Itens */}
      <div className="cookitie-card space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row sm:items-center p-4 sm:p-6 border-b border-blue-100 last:border-b-0 gap-4">
            {/* Layout mobile: foto metade + informações metade */}
            <div className="flex items-center gap-4 flex-1 sm:flex-1">
              {/* Foto do produto - metade em mobile */}
              <div className="w-1/2 sm:w-20 sm:h-20">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-32 sm:w-20 sm:h-20 object-cover rounded-2xl shadow-sm"
                />
              </div>
              
              {/* Informações do produto - metade em mobile */}
              <div className="w-1/2 sm:flex-1 min-w-0">
                <div className="flex flex-col gap-2">
                  {/* Nome do produto */}
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{item.name}</h3>
                  
                  {/* Sabores do Espetinho */}
                  {(item as any).customFlavors && (item as any).customFlavors.length > 0 && (
                    <div className="text-xs text-purple-600 space-y-0.5 mt-1">
                      <p className="font-semibold">🎨 Sabores:</p>
                      {(item as any).customFlavors.map((flavor: any, idx: number) => (
                        <p key={idx} className="text-gray-600">
                          {flavor.emoji} {flavor.quantity}x {flavor.name}
                        </p>
                      ))}
                    </div>
                  )}
                  
                  {/* Preço em azul */}
                  <p className="text-blue-600 font-bold text-base sm:text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '800' }}>
                    R$ {item.price.toFixed(2)}
                  </p>
                  
                  {/* Controles de quantidade - apenas em mobile */}
                  <div className="flex items-center bg-blue-50 rounded-full p-1 sm:hidden w-fit">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-white text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors shadow-sm"
                      style={{ minHeight: '32px', minWidth: '32px' }}
                    >
                      <Minus size={16} />
                    </button>
                    
                    <span className="w-10 text-center font-bold text-gray-900 text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {item.quantity}
                    </span>
                    
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-white text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors shadow-sm"
                      style={{ minHeight: '32px', minWidth: '32px' }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Controles de quantidade - apenas em desktop */}
            <div className="hidden sm:flex items-center justify-end">
              <div className="flex items-center bg-blue-50 rounded-full p-1">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-white text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors shadow-sm"
                  style={{ minHeight: '44px', minWidth: '44px' }}
                >
                  <Minus size={16} />
                </button>
                
                <span className="w-12 text-center font-bold text-gray-900 text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {item.quantity}
                </span>
                
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-white text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors shadow-sm"
                  style={{ minHeight: '44px', minWidth: '44px' }}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumo e Finalizar */}
      <div className="cookitie-card p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <span className="text-xl sm:text-2xl font-bold text-gray-800 text-center sm:text-left" style={{ fontFamily: 'Inter, sans-serif' }}>Total do Pedido:</span>
          <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent text-2xl sm:text-3xl font-bold text-center sm:text-right" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '800' }}>
            R$ {totalPrice.toFixed(2)}
          </span>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-2xl p-4 mb-6">
          <p className="text-center text-gray-700 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
            <span className="font-cookitie font-medium">🎉</span> Você está prestes a experimentar os melhores doces da Cookitie! 
            <span className="font-cookitie font-medium">✨</span>
          </p>
        </div>
        
        <button
          onClick={onGoToCheckout}
          className="w-full py-4 text-base sm:text-lg lg:text-xl hover:scale-105 transition-transform duration-300 text-white rounded-2xl"
          style={{ backgroundColor: '#3480FE', fontFamily: 'Inter, sans-serif', minHeight: '44px' }}
        >
          Finalizar Pedido com PIX
        </button>
      </div>
    </div>
  )
}
