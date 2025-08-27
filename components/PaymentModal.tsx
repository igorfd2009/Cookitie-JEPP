import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { 
  Copy, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  QrCode, 
  RefreshCw, 
  Smartphone,

  X
} from 'lucide-react'
import { toast } from 'sonner'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  paymentData: {
    amount: number
    pixCode: string
    qrCode: string
    qrCodeUrl?: string
    transactionId: string
    expiresAt: string
  }
  onPaymentConfirmed: (transactionId: string) => void
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  paymentData,
  onPaymentConfirmed
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [status, setStatus] = useState<'pending' | 'paid' | 'expired'>('pending')
  const [isChecking, setIsChecking] = useState(false)

  // Calcular tempo restante
  useEffect(() => {
    if (!isOpen || !paymentData.expiresAt) return

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const expiry = new Date(paymentData.expiresAt).getTime()
      const remaining = Math.max(0, expiry - now)
      
      setTimeLeft(remaining)
      
      if (remaining === 0) {
        setStatus('expired')
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen, paymentData.expiresAt])

  // Formatar tempo
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  // Copiar código PIX
  const copyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(paymentData.pixCode)
      toast.success('📋 Código PIX copiado!')
    } catch {
      toast.error('❌ Erro ao copiar código')
    }
  }

  // Simular verificação de pagamento
  const checkPayment = async () => {
    setIsChecking(true)
    
    // Simular delay de verificação
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Por enquanto, sempre retorna pending - em produção, verificaria com API
    toast.info('⏳ Pagamento ainda não detectado')
    setIsChecking(false)
  }

  // Confirmar pagamento manualmente
  const confirmPayment = () => {
    if (confirm('✅ Confirma que o pagamento PIX foi realizado?\n\n⚠️ Esta ação não pode ser desfeita.')) {
      setStatus('paid')
      onPaymentConfirmed(paymentData.transactionId)
      toast.success('🎉 Pagamento confirmado!')
    }
  }

  if (status === 'paid') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-800 mb-2">
              Pagamento Confirmado! 🎉
            </h3>
            <p className="text-green-700 mb-4">
              Sua reserva foi confirmada com sucesso!
            </p>
            <p className="text-sm text-green-600 mb-4">
              ID: {paymentData.transactionId}
            </p>
            <Button onClick={onClose} className="w-full">
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (status === 'expired') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-red-800 mb-2">
              Pagamento Expirado
            </h3>
            <p className="text-red-700 mb-4">
              O tempo para pagamento expirou. Tente novamente.
            </p>
            <Button onClick={onClose} variant="outline" className="w-full">
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const progressPercent = Math.max(0, (timeLeft / (30 * 60 * 1000)) * 100)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-center">
            💳 Pagamento PIX
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-600">
            Escaneie o QR Code ou copie o código PIX para realizar o pagamento
          </DialogDescription>
          <div className="flex justify-center">
            <Button variant="ghost" size="sm" onClick={onClose} className="absolute right-4 top-4">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Timer */}
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">
                    Tempo restante
                  </span>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  {formatTime(timeLeft)}
                </Badge>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </CardContent>
          </Card>

          {/* Valor */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              R$ {paymentData.amount.toFixed(2)}
            </div>
            <p className="text-sm text-gray-600">
              Para: COOKITE JEPP
            </p>
          </div>

          {/* QR Code */}
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                {(paymentData.qrCode || paymentData.qrCodeUrl) ? (
                  <img 
                    src={
                      paymentData.qrCodeUrl || 
                      (paymentData.qrCode.startsWith('data:') ? paymentData.qrCode : `data:image/png;base64,${paymentData.qrCode}`)
                    }
                    alt="QR Code PIX" 
                    className="w-full h-full object-contain rounded-lg"
                    onError={(e) => {
                      // Fallback para URL externa se imagem falhar
                      e.currentTarget.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(paymentData.pixCode)}`
                    }}
                  />
                ) : (
                  <QrCode className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <p className="text-xs text-gray-600">
                📱 Escaneie com seu banco ou Pix
              </p>
            </CardContent>
          </Card>

          {/* Código Pix para Cópia */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Código PIX (Copia e Cola)
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyPixCode}
                  className="h-8"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copiar
                </Button>
              </div>
              <div className="bg-gray-50 p-3 rounded text-xs font-mono text-gray-800 break-all">
                {paymentData.pixCode}
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="space-y-2">
            <Button
              onClick={confirmPayment}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              ✅ Confirmar Pagamento
            </Button>
            
            <Button
              onClick={checkPayment}
              variant="outline"
              className="w-full"
              disabled={isChecking}
            >
              {isChecking ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  🔍 Verificar Pagamento
                </>
              )}
            </Button>
          </div>

          {/* Instruções */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Como pagar:
              </h4>
              <div className="space-y-1 text-sm text-blue-700">
                <p>1. 📱 Abra seu app do banco</p>
                <p>2. 📷 Escaneie o QR Code ou</p>
                <p>3. 📋 Copie e cole o código PIX</p>
                <p>4. ✅ Confirme o pagamento</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
