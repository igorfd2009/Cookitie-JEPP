import { List, Lock } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'

interface CheckoutPageProps {
  onGoToPayment?: () => void
  onBackToCart?: () => void
}

export const CheckoutPage = ({ onGoToPayment }: CheckoutPageProps) => {
  const { items, totalPrice } = useCart()
  const { user, profile } = useAuth()

  const handlePayment = () => {
    if (onGoToPayment) {
      onGoToPayment()
    }
  }

  return (
    <div 
      className="min-h-screen py-8 px-4"
      style={{
        backgroundImage: 'linear-gradient(rgba(253, 250, 245, 0.8), rgba(253, 250, 245, 0.8)), url(/imagens/fundo-patas.jpeg)',
        backgroundSize: '500px 500px',
        backgroundRepeat: 'repeat',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundColor: '#FDFAF5'
      }}
    >
      <div className="max-w-lg mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
            Finalizar Pedido
          </h1>
        </div>

        {/* Card 1 - Order Summary */}
        <div className="rounded-2xl p-5 shadow-lg" style={{ backgroundColor: '#F4F4F4' }}>
          
          {/* Título */}
          <div className="flex items-center gap-3 mb-4">
            <List size={20} className="text-black" />
            <h2 className="text-xl font-bold text-black" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '800' }}>
              Resumo do pedido
            </h2>
          </div>

          {/* Produtos */}
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex-1">
                  <span className="text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {item.name} x{item.quantity}
                  </span>
                </div>
                <span className="font-bold text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
                  R$ {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <span className="font-bold text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
              Total:
            </span>
            <span className="font-bold text-blue-600 text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
              R$ {totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Card 2 - Customer Data */}
        <div className="rounded-2xl p-5 shadow-lg" style={{ backgroundColor: '#F4F4F4' }}>
          {/* Título */}
          <div className="flex items-center gap-3 mb-4">
            <Lock size={20} className="text-black" />
            <h2 className="text-xl font-bold text-black" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '800' }}>
              Dados do cliente
            </h2>
          </div>

          {/* Dados */}
          <div className="space-y-2">
            <div>
              <span className="text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
                Nome: {profile?.name || user?.email || 'Não informado'}
              </span>
            </div>
            <div>
              <span className="text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
                Email: {user?.email || 'Não informado'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3 - Delivery Information */}
        <div className="rounded-2xl shadow-lg p-2" style={{ backgroundColor: '#F4F4F4' }}>
          {/* Imagem de informações de entrega */}
          <div className="flex justify-center">
            <img 
              src="/imagens/informacoes-de-entrega.png" 
              alt="Informações de entrega" 
              className="w-full h-auto object-cover rounded-xl"
              style={{ minHeight: '200px' }}
              onError={(e) => {
                console.log('Erro ao carregar informacoes-de-entrega.png');
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Botão de Pagamento */}
        <button 
          onClick={handlePayment}
          className="w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all duration-300 hover:bg-blue-700"
          style={{ 
            backgroundColor: '#007BFF',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          Pagar com PIX
        </button>
      </div>
    </div>
  )
}
