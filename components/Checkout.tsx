import { useState } from 'react'
import { CreditCard, Check, ArrowLeft } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { usePocketBaseOrders as useOrders, Order } from '../hooks/usePocketBaseOrders'
import { toast } from 'sonner'
import QRCode from 'qrcode'
import { CheckoutPage } from './CheckoutPage'

interface CheckoutProps {
  onOrderComplete: () => void
  onBackToCart?: () => void
}

export const Checkout = ({ onOrderComplete, onBackToCart }: CheckoutProps) => {
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

      // Criar pedido usando o hook (PocketBase-first)
      await createOrder({
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          ...(((item as any).customFlavors) && { customFlavors: (item as any).customFlavors }),
          ...(((item as any).customFlavor) && { customFlavor: (item as any).customFlavor })
        })),
        total: totalPrice,
        status: 'pending', // Status inicial do pedido
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
        <div className="w-28 h-28 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto">
          <Check size={56} className="text-green-600" />
        </div>
        <h2 className="font-cookitie text-3xl font-bold text-gray-900">
          Pagamento efetuado com sucesso!
        </h2>
        <p className="text-2xl text-gray-600 max-w-xl mx-auto">
          Seu pedido foi confirmado e poderá ser retirado no evento JEPP, na nossa doceria Cookittie!
        </p>
        <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-2xl p-6 max-w-lg mx-auto">
          <p className="text-lg text-gray-700 text-center">
            Agradecemos a preferência e confiança!
          </p>
        </div>
        <button
          onClick={onOrderComplete}
          className="py-3 px-8 font-cookitie text-lg text-white font-bold rounded-3xl"
          style={{ backgroundColor: '#3480FE' }}
        >
          Ver Meus Pedidos
        </button>
      </div>
    )
  }

  if (step === 'payment') {
    return (
      <div className="max-w-md mx-auto space-y-6 sm:space-y-8 px-4 pt-6 sm:pt-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-4 mb-6 sm:mb-8">
            {onBackToCart && (
              <button
                onClick={onBackToCart}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors text-sm"
              >
                <ArrowLeft size={14} />
                <span>Voltar ao Carrinho</span>
              </button>
            )}
          </div>
          <h2 className="font-cookitie text-2xl sm:text-3xl font-bold text-gray-900">
            Pagamento PIX
          </h2>
          <p className="text-sm sm:text-base text-gray-600 px-4">
            Escaneie o QR Code ou copie o código PIX para finalizar seu pedido
          </p>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 text-center space-y-4 sm:space-y-6 rounded-2xl shadow-lg" style={{ backgroundColor: '#F4F4F4' }}>
          {/* QR Code */}
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm mx-auto w-fit" style={{ backgroundColor: '#F4F4F4' }}>
            {qrCodeDataURL ? (
              <img 
                src={qrCodeDataURL} 
                alt="QR Code PIX" 
                className="w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 mx-auto"
              />
            ) : (
              <div className="w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <CreditCard size={24} className="xs:w-8 xs:h-8 sm:w-12 sm:h-12" />
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
              className="w-full py-3 font-cookitie flex items-center justify-center hover:scale-105 transition-transform text-sm sm:text-base text-white font-bold rounded-3xl"
              style={{ backgroundColor: '#FFD225' }}
            >
              {copied ? 'Copiado!' : 'Copiar Código PIX'}
            </button>
          </div>
        </div>

        {/* Card de Total a Pagar */}
        <div className="rounded-2xl p-5 shadow-lg" style={{ backgroundColor: '#F4F4F4' }}>
          {/* Título */}
          <div className="flex items-center gap-3 mb-4">
            <CreditCard size={20} className="text-black" />
            <h2 className="text-xl font-bold text-black" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '800' }}>
              Total a pagar
            </h2>
          </div>

          {/* Valor Total */}
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600 mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '800' }}>
              R$ {totalPrice.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              Após o pagamento confirme abaixo para finalizar o seu pedido!
            </p>
          </div>
        </div>

        <button
          onClick={handlePaymentConfirm}
          className="w-full py-3 sm:py-4 font-cookitie text-base sm:text-lg hover:scale-105 transition-transform text-white font-bold rounded-3xl"
          style={{ backgroundColor: '#3480FE' }}
        >
          ✅ Confirmar Pagamento
        </button>

        <p className="text-xs text-center text-gray-500 px-4">
          💡 Após efetuar o pagamento em seu banco, clique em "Confirmar Pagamento"
        </p>
      </div>
    )
  }

  // Se estiver na etapa de revisão, mostrar a nova página de checkout
  if (step === 'review') {
    return <CheckoutPage onGoToPayment={handleCreateOrder} onBackToCart={onBackToCart} />
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 px-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          {onBackToCart && (
            <button
              onClick={onBackToCart}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors text-sm"
            >
              <ArrowLeft size={14} />
              <span>Voltar ao Carrinho</span>
            </button>
          )}
        </div>
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
            <div key={item.id} className="py-2 sm:py-3 border-b border-blue-100 last:border-b-0">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-2 sm:gap-3 flex-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 mt-1"></div>
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-gray-900 text-sm sm:text-base block">{item.name}</span>
                    <span className="text-blue-600 text-xs sm:text-sm">x{item.quantity}</span>
                    
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
                  </div>
                </div>
                <span className="font-bold text-gray-900 text-sm sm:text-base flex-shrink-0 ml-2">
                  R$ {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
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
      <div className="bg-gradient-to-r from-blue-50 to.yellow-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
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