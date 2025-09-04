import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Copy, CheckCircle, Clock, AlertCircle, QrCode, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { pixService } from '../utils/pixService'


interface PaymentPixProps {
  isOpen: boolean
  onClose: () => void
  paymentData: {
    transactionId: string
    qrCode: string
    pixCode: string
    amount: number
    expiresAt: string
  }
  onPaymentConfirmed: () => void
}

export const PaymentPix: React.FC<PaymentPixProps> = ({
  isOpen,
  onClose,
  paymentData,
  onPaymentConfirmed
}) => {
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'expired' | 'cancelled'>('pending')
  const [timeLeft, setTimeLeft] = useState<string>('')
  const [isChecking, setIsChecking] = useState(false)
  const [copied, setCopied] = useState(false)

  // Atualizar countdown
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const expiry = new Date(paymentData.expiresAt).getTime()
      const difference = expiry - now

      if (difference > 0) {
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
      } else {
        setTimeLeft('00:00')
        setPaymentStatus('expired')
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [paymentData.expiresAt])

  // Verificar status do pagamento periodicamente
  useEffect(() => {
    if (!isOpen || paymentStatus !== 'pending') return

    const checkPayment = async () => {
      try {
        setIsChecking(true)
        const status = await pixService.checkPaymentStatus(paymentData.transactionId)
        
        if (status) {
          setPaymentStatus(status.status)
          
          if (status.status === 'paid') {
            onPaymentConfirmed()
            toast.success('Pagamento confirmado! 🎉')
          } else if (status.status === 'expired') {
            toast.error('Pagamento expirado. Tente novamente.')
          }
        }
      } catch (error) {
        console.error('Erro ao verificar pagamento:', error)
      } finally {
        setIsChecking(false)
      }
    }

    // Verificar a cada 5 segundos
    const interval = setInterval(checkPayment, 5000)
    
    // Verificação inicial
    checkPayment()

    return () => clearInterval(interval)
  }, [isOpen, paymentStatus, paymentData.transactionId, onPaymentConfirmed])

  const copyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(paymentData.pixCode)
      setCopied(true)
      toast.success('Código PIX copiado!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Erro ao copiar código PIX')
    }
  }

  const handleManualCheck = async () => {
    try {
      setIsChecking(true)
      const status = await pixService.checkPaymentStatus(paymentData.transactionId)
      
      if (status) {
        setPaymentStatus(status.status)
        
        if (status.status === 'paid') {
          onPaymentConfirmed()
          toast.success('Pagamento confirmado! 🎉')
        } else if (status.status === 'pending') {
          toast.info('Pagamento ainda pendente. Aguarde...')
        } else if (status.status === 'expired') {
          toast.error('Pagamento expirado. Tente novamente.')
        }
      }
    } catch (error) {
      toast.error('Erro ao verificar pagamento')
    } finally {
      setIsChecking(false)
    }
  }

  const getStatusBadge = () => {
    switch (paymentStatus) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Aguardando</Badge>
      case 'paid':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Pago</Badge>
      case 'expired':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Expirado</Badge>
      case 'cancelled':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800"><AlertCircle className="w-3 h-3 mr-1" />Cancelado</Badge>
    }
  }

  const getStatusDescription = () => {
    switch (paymentStatus) {
      case 'pending':
        return `Pagamento PIX de R$ ${paymentData.amount.toFixed(2)} aguardando confirmação. Expira em ${timeLeft}.`
      case 'paid':
        return 'Pagamento confirmado com sucesso! Sua reserva está garantida.'
      case 'expired':
        return 'O tempo limite para pagamento foi excedido. Faça uma nova reserva.'
      case 'cancelled':
        return 'Pagamento cancelado. Você pode fazer uma nova reserva.'
      default:
        return 'Processando pagamento via PIX.'
    }
  }

  // Função utilitária para garantir que o QR Code está em formato base64
  const [qrCodeSrc, setQrCodeSrc] = useState(paymentData.qrCode)

  useEffect(() => {
    async function ensureBase64(qrCode: string) {
      if (qrCode.startsWith('data:image')) {
        setQrCodeSrc(qrCode)
      } else if (qrCode.startsWith('http')) {
        // Converte URL para base64
        try {
          const response = await fetch(qrCode)
          const blob = await response.blob()
          const reader = new FileReader()
          reader.onloadend = () => {
            setQrCodeSrc(reader.result as string)
          }
          reader.readAsDataURL(blob)
        } catch (e) {
          setQrCodeSrc('')
        }
      } else {
        setQrCodeSrc('')
      }
    }
    ensureBase64(paymentData.qrCode)
  }, [paymentData.qrCode])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center flex flex-col items-center">
            <QrCode className="w-6 h-6 mx-auto mb-2" />
            Pagamento PIX
          </DialogTitle>
          <DialogDescription className="text-center">
            {getStatusDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status e Valor */}
          <div className="text-center space-y-2">
            {getStatusBadge()}
            <div className="text-3xl font-bold text-gray-900">
              R$ {paymentData.amount.toFixed(2)}
            </div>
            {paymentStatus === 'pending' && (
              <div className="text-sm text-orange-600 font-medium">
                ⏰ Expira em {timeLeft}
              </div>
            )}
          </div>

          {paymentStatus === 'pending' && (
            <>
              {/* QR Code */}
              <div className="bg-white p-6 rounded-lg border-2 border-[var(--color-cookite-blue)] text-center qr-code-frame shadow-lg">
                <div className="mb-4">
                  <img 
                    src={qrCodeSrc} 
                    alt="QR Code PIX para pagamento" 
                    className="w-56 h-56 mx-auto border rounded-lg pix-qrcode"
                  />
                </div>
                <p className="text-base text-gray-700 font-medium">
                  Escaneie o QR Code com seu app bancário
                </p>
              </div>

              {/* Código PIX */}
              <div className="space-y-3">
                <div className="text-base font-semibold text-gray-800 text-center">
                  Ou copie o código PIX para pagar:
                </div>
                <div className="flex gap-3 items-center">
                  <div className="flex-1 p-4 bg-blue-50 rounded-lg text-sm font-mono break-all border border-blue-200 pix-code-container shadow-sm">
                    {paymentData.pixCode}
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={copyPixCode}
                    className="shrink-0 copy-button bg-[var(--color-cookite-blue)] text-white hover:bg-[var(--color-cookite-blue-hover)] hover:text-white rounded-xl"
                    aria-label="Copiar código PIX"
                  >
                    {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              {/* Instruções */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-base space-y-3">
                <h4 className="font-semibold text-blue-800 mb-2">📱 Como pagar com PIX:</h4>
                <ol className="text-blue-700 space-y-2 list-decimal list-inside leading-relaxed">
                  <li>Abra o aplicativo do seu banco ou instituição financeira.</li>
                  <li>Selecione a opção <strong>PIX Copia e Cola</strong> ou <strong>Pagar com QR Code</strong>.</li>
                  <li>Cole o código PIX ou escaneie o QR Code acima.</li>
                  <li>Confirme o valor e finalize o pagamento.</li>
                </ol>
              </div>

              {/* Verificação Manual */}
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={handleManualCheck}
                  disabled={isChecking}
                  className="w-full"
                  aria-label="Verificar se pagamento foi confirmado"
                >
                  {isChecking ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  {isChecking ? 'Verificando...' : 'Já paguei - Verificar'}
                </Button>
              </div>
            </>
          )}

          {paymentStatus === 'paid' && (
            <div className="text-center space-y-4 payment-success-animation">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Pagamento Confirmado! 🎉
                </h3>
                <p className="text-green-700 text-sm">
                  Sua reserva está garantida.
                </p>
              </div>
            </div>
          )}

          {paymentStatus === 'expired' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Pagamento Expirado ⏰
                </h3>
                <p className="text-red-700 text-sm mb-4">
                  O tempo para pagamento acabou. Faça uma nova reserva para tentar novamente.
                </p>
                <Button onClick={onClose} className="w-full">
                  Fazer Nova Reserva
                </Button>
              </div>
            </div>
          )}

          {/* Informações adicionais */}
          {paymentStatus === 'pending' && (
            <div className="text-xs text-gray-500 text-center space-y-1">
              <p>Transação ID: {paymentData.transactionId}</p>
              <p>Verificação automática a cada 5 segundos</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}