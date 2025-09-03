import { useState } from 'react'
import { CreditCard, Copy, Check, ArrowLeft, Heart } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { usePocketBaseOrders as useOrders } from '../hooks/usePocketBaseOrders'
import { toast } from 'sonner'
import QRCode from 'qrcode'

interface CheckoutProps {
  onOrderComplete: () => void
}

import { Order } from '../hooks/usePocketBaseOrders'

export const Checkout = ({ onOrderComplete }: CheckoutProps) => {
  const { items, totalPrice, clearCart } = useCart()
  const { user, profile } = useAuth()
  const { createOrder, updateOrderStatus } = useOrders()
  const [step, setStep] = useState<'review' | 'payment' | 'success'>('review')
  const [pixCode, setPixCode] = useState('')
  const [qrCodeDataURL, setQrCodeDataURL] = useState('')
  const [copied, setCopied] = useState(false)

  // Função para calcular o dígito verificador CRC16-CCITT
  const calculateCRC16 = (data: string): string => {
    let crc = 0xFFFF
    for (let i = 0; i < data.length; i++) {
      crc ^= data.charCodeAt(i) << 8
      for (let j = 0; j < 8; j++) {
        if (crc & 0x8000) {
          crc = (crc << 1) ^ 0x1021
        } else {
          crc <<= 1
        }
        crc &= 0xFFFF
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0')
  }

  const generatePixCode = () => {
    // Chave PIX da Nicolly (telefone com código do país)
    const pixKey = '+5511998008397'
    const merchantName = 'NICOLLY ASCIONE SALOMAO'
    const merchantCity = 'SAO PAULO'
    const amount = totalPrice.toFixed(2)
    
    // Construir o código PIX seguindo o padrão EMVCo
    let pixCode = ''
    
    // Payload Format Indicator (obrigatório)
    pixCode += '000201'
    
    // Point of Initiation Method (estático)
    pixCode += '010212'
    
    // Merchant Account Information
    const merchantInfo = `0014br.gov.bcb.pix01${pixKey.length.toString().padStart(2, '0')}${pixKey}`
    pixCode += `26${merchantInfo.length.toString().padStart(2, '0')}${merchantInfo}`
    
    // Merchant Category Code
    pixCode += '52040000'
    
    // Transaction Currency (Real = 986)
    pixCode += '5303986'
    
    // Transaction Amount
    pixCode += `54${amount.length.toString().padStart(2, '0')}${amount}`
    
    // Country Code
    pixCode += '5802BR'
    
    // Merchant Name
    pixCode += `59${merchantName.length.toString().padStart(2, '0')}${merchantName}`
    
    // Merchant City
    pixCode += `60${merchantCity.length.toString().padStart(2, '0')}${merchantCity}`
    
    // Additional Data Field Template
    const txid = `COOKITIE${Date.now().toString().slice(-8)}`
    const additionalData = `05${txid.length.toString().padStart(2, '0')}${txid}`
    pixCode += `62${additionalData.length.toString().padStart(2, '0')}${additionalData}`
    
    // CRC16 (será calculado)
    pixCode += '6304'
    
    // Calcular e adicionar o CRC16
    const crc = calculateCRC16(pixCode)
    pixCode += crc
    
    return pixCode
  }

  const handleCreateOrder = async () => {
    if (!user) return

    try {
      const pixCode = generatePixCode()
      
      // Gerar QR Code
      const qrCodeDataURL = await QRCode.toDataURL(pixCode, {
        errorCorrectionLevel: 'M',
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        width: 256,
      })

      // Criar pedido usando o hook
      await createOrder({
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: totalPrice,
        status: 'paid', // TEMPORÁRIO: usando 'paid' até corrigir no admin panel
        paymentMethod: 'pix',
        pixCode
      })

      setPixCode(pixCode)
      setQrCodeDataURL(qrCodeDataURL)
      setStep('payment')
      
      toast.success('Código PIX gerado com sucesso! 🍪', {
        style: {
          background: 'linear-gradient(135deg, #e0f0ff 0%, #fff5b8 100%)',
          border: '1px solid #b8e0ff',
          color: '#374151'
        }
      })
    } catch (error) {
      console.error('Erro ao gerar PIX:', error)
      toast.error('Erro ao gerar código PIX. Tente novamente.')
    }
  }

  const handlePaymentConfirm = async () => {
    try {
      // Encontrar o pedido pelo código PIX
      const allOrders = JSON.parse(localStorage.getItem('cookitie_orders') || '[]')
      const order = allOrders.find((o: Order) => o.pixCode === pixCode)
      
      if (order) {
        await updateOrderStatus(order.id, 'ready') // Mudando para 'ready' após pagamento
      }

      clearCart()
      setStep('success')
      toast.success('Pagamento confirmado! Obrigado por escolher a Cookitie! 🎉', {
        style: {
          background: 'linear-gradient(135deg, #dcfce7 0%, #fff5b8 100%)',
          border: '1px solid #bbf7d0',
          color: '#374151'
        }
      })
    } catch (error) {
      console.error('Erro ao confirmar pagamento:', error)
      toast.error('Erro ao confirmar pagamento. Tente novamente.')
    }
  }

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode)
    setCopied(true)
    toast.success('Código PIX copiado! Cole no seu app de pagamento 📱', {
      style: {
        background: 'linear-gradient(135deg, #e0f0ff 0%, #fff5b8 100%)',
        border: '1px solid #b8e0ff',
        color: '#374151'
      }
    })
    setTimeout(() => setCopied(false), 3000)
  }

  if (step === 'success') {
    return (
      <div className="text-center py-16 space-y-6">
        <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto">
          <Check size={40} className="text-green-600" />
        </div>
        <h2 className="font-cookitie text-3xl font-bold text-gray-900">
          Pedido Confirmado! 🎉
        </h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Seu pedido foi confirmado e será preparado com muito carinho pelos jovens da Cookitie para o evento JEPP.
        </p>
        <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-2xl p-6 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Heart className="text-red-400" size={20} />
            <span className="font-cookitie font-bold text-gray-800">Obrigado pela confiança!</span>
          </div>
          <p className="text-sm text-gray-700">
            Você acaba de apoiar jovens empreendedores em seu primeiro projeto empresarial! ✨
          </p>
        </div>
        <button
          onClick={onOrderComplete}
          className="btn-cookitie-primary py-3 px-8 font-cookitie text-lg"
        >
          Ver Meus Pedidos 📦
        </button>
      </div>
    )
  }

  if (step === 'payment') {
    return (
      <div className="max-w-lg mx-auto space-y-4 sm:space-y-6 px-4">
        <div className="text-center space-y-2">
          <button
            onClick={() => setStep('review')}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors mb-3 sm:mb-4 text-sm"
          >
            <ArrowLeft size={14} />
            <span>Voltar</span>
          </button>
          <h2 className="font-cookitie text-2xl sm:text-3xl font-bold text-gray-900">
            🍪 Pagamento PIX
          </h2>
          <p className="text-sm sm:text-base text-gray-600 px-4">
            Escaneie o QR Code ou copie o código PIX para finalizar seu pedido
          </p>
        </div>

        <div className="cookitie-card p-4 sm:p-6 lg:p-8 text-center space-y-4 sm:space-y-6">
          {/* QR Code */}
          <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm mx-auto w-fit">
            {qrCodeDataURL ? (
              <img 
                src={qrCodeDataURL} 
                alt="QR Code PIX" 
                className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 mx-auto"
              />
            ) : (
              <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <CreditCard size={32} className="sm:w-12 sm:h-12" />
                  <p className="text-xs sm:text-sm mt-2">Gerando QR Code...</p>
                </div>
              </div>
            )}
          </div>

          {/* Código PIX */}
          <div className="space-y-3 sm:space-y-4">
            <p className="font-cookitie text-base sm:text-lg font-bold text-gray-800">Código PIX:</p>
            <div className="bg-gray-50 p-3 sm:p-4 rounded-xl border-2 border-blue-100">
              <p className="text-xs font-mono break-all text-gray-700 leading-relaxed">
                {pixCode}
              </p>
            </div>
            
            <button
              onClick={copyPixCode}
              className="w-full btn-cookitie-secondary py-3 font-cookitie flex items-center justify-center gap-2 hover:scale-105 transition-transform text-sm sm:text-base"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? '✅ Copiado!' : '📋 Copiar Código PIX'}
            </button>
          </div>
        </div>

        {/* Resumo do Pagamento */}
        <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <h3 className="font-cookitie text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3 text-center">
            💰 Total a Pagar
          </h3>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent font-cookitie">
              R$ {totalPrice.toFixed(2)}
            </p>
            <p className="text-xs sm:text-sm text-gray-700 mt-2">
              Após o pagamento, confirme abaixo para finalizar seu pedido 🍪
            </p>
          </div>
        </div>

        <button
          onClick={handlePaymentConfirm}
          className="w-full btn-cookitie-primary py-3 sm:py-4 font-cookitie text-base sm:text-lg hover:scale-105 transition-transform"
        >
          ✅ Confirmar Pagamento
        </button>

        <p className="text-xs text-center text-gray-500 px-4">
          💡 Após efetuar o pagamento em seu banco, clique em "Confirmar Pagamento"
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 px-4">
      <div className="text-center">
        <h1 className="font-cookitie text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          🛍️ Finalizar Pedido
        </h1>
        <p className="text-sm sm:text-base text-gray-600">Revise suas informações antes de prosseguir</p>
      </div>

      {/* Resumo do pedido */}
      <div className="cookitie-card p-4 sm:p-6 space-y-4">
        <h2 className="font-cookitie text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">📋 Resumo do Pedido</h2>
        
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2 sm:py-3 border-b border-blue-100 last:border-b-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                <div className="min-w-0">
                  <span className="font-medium text-gray-900 text-sm sm:text-base block">{item.name}</span>
                  <span className="text-blue-600 text-xs sm:text-sm">x{item.quantity}</span>
                </div>
              </div>
              <span className="font-bold text-gray-900 text-sm sm:text-base flex-shrink-0">
                R$ {(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center pt-3 sm:pt-4 border-t-2 border-blue-200">
          <span className="text-lg sm:text-xl font-bold text-gray-800">Total:</span>
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent font-cookitie">
            R$ {totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Informações do cliente */}
      <div className="cookitie-card p-4 sm:p-6">
        <h2 className="font-cookitie text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">👤 Dados do Cliente</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0"></div>
            <p className="text-sm sm:text-base"><strong>Nome:</strong> {profile?.name || 'Não informado'}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0"></div>
            <p className="text-sm sm:text-base break-all"><strong>Email:</strong> {user?.email}</p>
          </div>
          {profile?.phone && (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0"></div>
              <p className="text-sm sm:text-base"><strong>Telefone:</strong> {profile.phone}</p>
            </div>
          )}
        </div>
      </div>

      {/* Entrega */}
      <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <h2 className="font-cookitie text-lg sm:text-xl font-bold text-gray-800 mb-3">
          🎉 Informações de Entrega
        </h2>
        <div className="space-y-2 text-gray-700">
          <p className="flex items-center gap-2 text-sm sm:text-base">
            <span className="text-base sm:text-lg">🏫</span>
            <strong>Evento JEPP 2024</strong>
          </p>
          <p className="flex items-center gap-2 text-sm sm:text-base">
            <span className="text-base sm:text-lg">🍪</span>
            Seus cookies serão entregues fresquinhos no dia do evento
          </p>
          <p className="flex items-center gap-2 text-sm sm:text-base">
            <span className="text-base sm:text-lg">📍</span>
            Local será informado por email
          </p>
          <p className="flex items-center gap-2 text-sm sm:text-base">
            <span className="text-base sm:text-lg">💝</span>
            Feitos com amor pelos jovens empreendedores da Cookitie
          </p>
        </div>
      </div>

      <button
        onClick={handleCreateOrder}
        className="w-full btn-cookitie-primary py-3 sm:py-4 font-cookitie text-lg sm:text-xl hover:scale-105 transition-transform"
      >
        🍪 Pagar com PIX
      </button>
    </div>
  )
}