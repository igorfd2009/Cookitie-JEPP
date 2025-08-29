import { useState } from 'react'
import { CreditCard, Copy, Check } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'

interface CheckoutProps {
  onOrderComplete: () => void
}

interface Order {
  id: string
  userId: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
  total: number
  status: 'pending' | 'paid' | 'preparing' | 'ready' | 'completed'
  paymentMethod: 'pix'
  pixCode?: string
  createdAt: string
}

export const Checkout = ({ onOrderComplete }: CheckoutProps) => {
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const [step, setStep] = useState<'review' | 'payment' | 'success'>('review')
  const [pixCode, setPixCode] = useState('')
  const [copied, setCopied] = useState(false)

  const generatePixCode = () => {
    // Gerar código PIX simulado
    const code = `00020126580014br.gov.bcb.pix0136${user?.id || 'demo'}-${Date.now()}5204000053039865406${totalPrice.toFixed(2)}5802BR5925COOKITIE JEPP6009SAO PAULO62070503***6304`
    return code
  }

  const handleCreateOrder = () => {
    if (!user) return

    const pixCode = generatePixCode()
    const order: Order = {
      id: `order_${Date.now()}`,
      userId: user.id,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total: totalPrice,
      status: 'pending',
      paymentMethod: 'pix',
      pixCode,
      createdAt: new Date().toISOString()
    }

    // Salvar pedido no localStorage
    const existingOrders = JSON.parse(localStorage.getItem('cookitie_orders') || '[]')
    existingOrders.push(order)
    localStorage.setItem('cookitie_orders', JSON.stringify(existingOrders))

    setPixCode(pixCode)
    setStep('payment')
  }

  const handlePaymentConfirm = () => {
    // Simular confirmação de pagamento
    const orders = JSON.parse(localStorage.getItem('cookitie_orders') || '[]')
    const updatedOrders = orders.map((order: Order) => 
      order.pixCode === pixCode ? { ...order, status: 'paid' } : order
    )
    localStorage.setItem('cookitie_orders', JSON.stringify(updatedOrders))

    clearCart()
    setStep('success')
    toast.success('Pagamento confirmado!')
  }

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode)
    setCopied(true)
    toast.success('Código PIX copiado!')
    setTimeout(() => setCopied(false), 2000)
  }

  if (step === 'success') {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={32} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Pedido realizado com sucesso!
        </h2>
        <p className="text-gray-600 mb-6">
          Seu pedido foi confirmado e será preparado com carinho para o evento JEPP.
        </p>
        <button
          onClick={onOrderComplete}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Ver Meus Pedidos
        </button>
      </div>
    )
  }

  if (step === 'payment') {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pagamento PIX
          </h2>
          <p className="text-gray-600">
            Escaneie o QR Code ou copie o código PIX
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <CreditCard size={48} className="text-gray-400" />
            <p className="text-sm text-gray-500 ml-2">QR Code PIX</p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600">Código PIX:</p>
            <div className="bg-gray-50 p-3 rounded border text-xs font-mono break-all">
              {pixCode}
            </div>
            
            <button
              onClick={copyPixCode}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copiado!' : 'Copiar Código PIX'}
            </button>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="font-semibold text-purple-900 mb-2">
            Total a pagar: R$ {totalPrice.toFixed(2)}
          </h3>
          <p className="text-sm text-purple-700">
            Após o pagamento, clique em "Confirmar Pagamento" para finalizar seu pedido.
          </p>
        </div>

        <button
          onClick={handlePaymentConfirm}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          Confirmar Pagamento
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Finalizar Pedido</h1>

      {/* Resumo do pedido */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
        
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
            <div>
              <span className="font-medium">{item.name}</span>
              <span className="text-gray-500 ml-2">x{item.quantity}</span>
            </div>
            <span className="font-semibold">
              R$ {(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
        
        <div className="flex justify-between items-center pt-4 mt-4 border-t text-lg font-bold">
          <span>Total:</span>
          <span className="text-purple-600">R$ {totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Informações do cliente */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Dados do Cliente</h2>
        <div className="space-y-2">
          <p><strong>Nome:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          {user?.phone && <p><strong>Telefone:</strong> {user.phone}</p>}
        </div>
      </div>

      {/* Entrega */}
      <div className="bg-purple-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-purple-900 mb-2">
          Informações de Entrega
        </h2>
        <p className="text-purple-700">
          🎉 <strong>Evento JEPP 2024</strong><br />
          📅 Seus cookies serão entregues fresquinhos no dia do evento<br />
          📍 Local será informado por email
        </p>
      </div>

      <button
        onClick={handleCreateOrder}
        className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg"
      >
        Pagar com PIX
      </button>
    </div>
  )
}
