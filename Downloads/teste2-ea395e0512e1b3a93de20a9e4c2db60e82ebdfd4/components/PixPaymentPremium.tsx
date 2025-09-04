import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card, CardContent } from './ui/card'
import { Progress } from './ui/progress'
import { 
  Copy, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  QrCode, 
  RefreshCw, 
  Smartphone,
  CreditCard,
  Shield,

  Download,
  Share2,
  Eye
} from 'lucide-react'
import { toast } from 'sonner'
import { pixSystem, type PixResponse } from '../utils/pixAdvanced'

interface PixPaymentPremiumProps {
  isOpen: boolean
  onClose: () => void
  paymentData: {
    amount: number
    description: string
    orderId: string
    customer: {
      name: string
      email: string
      phone: string
    }
  }
  onPaymentConfirmed: (transactionId: string) => void
}

export const PixPaymentPremium: React.FC<PixPaymentPremiumProps> = ({
  isOpen,
  onClose,
  paymentData,
  onPaymentConfirmed
}) => {
  const [pixResponse, setPixResponse] = useState<PixResponse | null>(null)
  const [_timeLeft, setTimeLeft] = useState<number>(0)
  const [timeLeftFormatted, setTimeLeftFormatted] = useState<string>('')
  const [progress, setProgress] = useState<number>(100)
  const [_isChecking, _setIsChecking] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showQRCode, setShowQRCode] = useState(true)
  const [animationClass, setAnimationClass] = useState('')


  // Criar pagamento PIX quando abrir o modal
  useEffect(() => {
    if (isOpen && !pixResponse) {
      createPixPayment()
    }
  }, [isOpen])

  // Criar pagamento PIX
  const createPixPayment = async () => {
    try {
      const response = await pixSystem.createPayment({
        amount: paymentData.amount,
        description: paymentData.description,
        orderId: paymentData.orderId,
        customer: paymentData.customer,
        expiresInMinutes: 30
      })

      if (response.success) {
        setPixResponse(response)
        setAnimationClass('animate-fade-in')
        toast.success('PIX gerado com sucesso! 🎉')
      } else {
        toast.error('Erro ao gerar PIX: ' + response.error)
      }
    } catch (error) {
      toast.error('Erro ao criar pagamento PIX')
    }
  }

  // Atualizar countdown
  useEffect(() => {
    if (!pixResponse || pixResponse.status !== 'pending') return

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const expiry = new Date(pixResponse.expiresAt).getTime()
      const difference = expiry - now

      if (difference > 0) {
        const totalTime = 30 * 60 * 1000 // 30 minutos em ms
        const elapsed = totalTime - difference
        const progressPercent = Math.max(0, 100 - (elapsed / totalTime * 100))
        
        setTimeLeft(difference)
        setProgress(progressPercent)
        
        const minutes = Math.floor(difference / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        setTimeLeftFormatted(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
      } else {
        setTimeLeft(0)
        setTimeLeftFormatted('00:00')
        setProgress(0)
        if (pixResponse.status === 'pending') {
          // Atualizar status para expirado
          const updatedResponse = { ...pixResponse, status: 'expired' as const }
          setPixResponse(updatedResponse)
          toast.error('Pagamento expirado!')
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [pixResponse])

  // Verificar status do pagamento - função comentada pois não está sendo usada
  // const checkPaymentStatus = useCallback(async () => {
  //   if (!pixResponse) return
  //   setIsChecking(true)
  //   try {
  //     const status = pixSystem.checkPaymentStatus(pixResponse.transactionId)
  //     if (status && status.status !== pixResponse.status) {
  //       setPixResponse(status)
  //       if (status.status === 'paid') {
  //         setAnimationClass('animate-success')
  //         onPaymentConfirmed(status.transactionId)
  //         toast.success('Pagamento confirmado! 🎉', {
  //           description: 'Sua reserva foi confirmada com sucesso!'
  //         })
  //       } else if (status.status === 'expired') {
  //         toast.error('Pagamento expirado')
  //       }
  //     }
  //   } catch (error) {
  //     toast.error('Erro ao verificar pagamento')
  //   } finally {
  //     setIsChecking(false)
  //   }
  // }, [pixResponse, onPaymentConfirmed])

  // Verificação automática - DESABILITADA para evitar falsos positivos
  // useEffect(() => {
  //   if (!pixResponse || pixResponse.status !== 'pending') return

  //   const interval = setInterval(checkPaymentStatus, 3000)
  //   return () => clearInterval(interval)
  // }, [checkPaymentStatus, pixResponse])

  // Copiar código PIX
  const copyPixCode = async () => {
    if (!pixResponse) return

    try {
      await navigator.clipboard.writeText(pixResponse.pixCode)
      setCopied(true)
      toast.success('Código PIX copiado!', {
        description: 'Cole no seu app bancário para pagar'
      })
      setTimeout(() => setCopied(false), 3000)
    } catch (error) {
      toast.error('Erro ao copiar código PIX')
    }
  }



  // Download QR Code
  const downloadQRCode = () => {
    if (!pixResponse) return

    const link = document.createElement('a')
    link.href = pixResponse.qrCodeBase64
    link.download = `pix-qr-${pixResponse.transactionId}.png`
    link.click()
    toast.success('QR Code baixado!')
  }

  // Compartilhar
  const sharePayment = async () => {
    if (!pixResponse) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pagamento PIX - Cookite JEPP',
          text: `Pagamento de R$ ${pixResponse.amount.toFixed(2)} via PIX`,
          url: window.location.href
        })
      } catch (error) {
        copyPixCode()
      }
    } else {
      copyPixCode()
    }
  }

  const getStatusColor = () => {
    if (!pixResponse) return 'bg-gray-100'
    
    switch (pixResponse.status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'paid': return 'bg-green-100 text-green-800'
      case 'expired': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100'
    }
  }

  const getStatusIcon = () => {
    if (!pixResponse) return <Clock className="w-4 h-4" />
    
    switch (pixResponse.status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'paid': return <CheckCircle className="w-4 h-4" />
      case 'expired': return <AlertCircle className="w-4 h-4" />
      case 'cancelled': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusText = () => {
    if (!pixResponse) return 'Gerando...'
    
    switch (pixResponse.status) {
      case 'pending': return 'Aguardando Pagamento'
      case 'paid': return 'Pagamento Confirmado'
      case 'expired': return 'Pagamento Expirado'
      case 'cancelled': return 'Pagamento Cancelado'
      default: return 'Processando...'
    }
  }

  if (!pixResponse) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md mx-auto p-0 sm:p-6">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--color-cookite-blue)]" />
              <p className="text-lg font-medium">Gerando PIX...</p>
              <p className="text-sm text-gray-500">Aguarde um momento</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
             <DialogContent className={`max-w-lg mx-auto p-0 overflow-y-auto max-h-[80vh] border-0 shadow-2xl bg-white payment-modal ${animationClass}`}>
        <DialogHeader className="relative px-0 pt-0 pb-0">
          {/* Header com gradiente */}
          <div className="relative bg-gradient-to-r from-[var(--color-cookite-blue)] to-[var(--color-cookite-yellow)] px-6 py-8">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
            </div>
            
            <DialogTitle className="relative text-center flex flex-col items-center space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
                  <QrCode className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Pagamento PIX</h2>
                  <p className="text-blue-100 text-sm">Rápido, seguro e instantâneo</p>
                </div>
              </div>
              
              <Badge className={`${getStatusColor()} px-4 py-2 text-sm font-medium rounded-full shadow-md border-0`}>
                {getStatusIcon()}
                <span className="ml-2">{getStatusText()}</span>
              </Badge>
            </DialogTitle>
          </div>
        </DialogHeader>

                 <div className="px-6 space-y-6 pb-6 pt-6 overflow-y-auto">
          {/* Valor e Progresso */}
          <Card className="border-0 shadow-lg bg-white overflow-hidden">
            <CardContent className="p-6 text-center relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-cookite-blue)]/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[var(--color-cookite-yellow)]/10 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative">
                <div className="text-4xl sm:text-5xl font-bold text-[var(--color-cookite-blue)] mb-2">
                  R$ {pixResponse.amount.toFixed(2)}
                </div>
                <div className="text-sm text-slate-600 mb-4 font-medium">
                  {paymentData.description}
                </div>
              </div>
              
              {pixResponse.status === 'pending' && (
                <div className="space-y-4 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm font-medium">Tempo restante:</span>
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-3 py-1 rounded-full shadow-md">
                      <Clock className="w-3 h-3 mr-1" />
                      {timeLeftFormatted}
                    </Badge>
                  </div>
                  <div className="relative">
                    <Progress value={progress} className="h-3 bg-gray-200" />
                    <div className="absolute inset-0 bg-[var(--color-cookite-blue)] rounded-full opacity-80" style={{width: `${progress}%`}}></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {pixResponse.status === 'pending' && (
            <>
              {/* Controles do QR Code */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-[var(--color-cookite-blue)]/5 rounded-2xl border border-[var(--color-cookite-blue)]/20">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQRCode(!showQRCode)}
                  className="flex items-center gap-2 w-full sm:w-auto bg-white/80 hover:bg-white shadow-sm border border-[var(--color-cookite-blue)]/30"
                >
                  <Eye className="w-4 h-4" />
                  {showQRCode ? 'Ocultar' : 'Mostrar'} QR Code
                </Button>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={downloadQRCode}
                    className="flex items-center gap-2 flex-1 sm:flex-none bg-white/80 hover:bg-white shadow-sm border border-[var(--color-cookite-blue)]/30"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Baixar</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={sharePayment}
                    className="flex items-center gap-2 flex-1 sm:flex-none bg-white/80 hover:bg-white shadow-sm border border-[var(--color-cookite-blue)]/30"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Compartilhar</span>
                  </Button>
                </div>
              </div>

              {/* QR Code */}
              {showQRCode && (
                <Card className="border-0 shadow-xl bg-white overflow-hidden">
                  <CardContent className="p-6 text-center relative">
                    <div className="absolute inset-0 bg-[var(--color-cookite-blue)]/5"></div>
                    <div className="qr-container mb-4">
                      <img 
                        src={pixResponse.qrCodeBase64} 
                        alt="QR Code PIX" 
                        className="w-48 h-48 sm:w-64 sm:h-64 mx-auto border rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      />
                    </div>
                    <div className="flex items-center gap-2 justify-center text-[var(--color-cookite-blue)]">
                      <Smartphone className="w-5 h-5" />
                      <span className="font-medium text-sm sm:text-base">Escaneie com seu app bancário</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Código PIX */}
              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-5">
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2 text-gray-700 font-semibold">
                      <CreditCard className="w-5 h-5 text-[var(--color-cookite-blue)]" />
                      <span className="text-sm">Ou use o código PIX:</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <div className="flex-1 p-4 bg-gray-50 rounded-xl text-xs font-mono break-all border border-gray-200 max-h-20 overflow-y-auto shadow-inner">
                      {pixResponse.pixCode}
                    </div>
                    <Button
                      size="lg"
                      onClick={copyPixCode}
                      className={`shrink-0 transition-all duration-300 ${
                        copied 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : 'bg-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue-hover)]'
                      } text-white shadow-lg hover:shadow-xl w-full sm:w-auto`}
                    >
                      {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      <span className="ml-2">
                        {copied ? 'Copiado!' : 'Copiar'}
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Instruções */}
              <Card className="border-0 shadow-lg bg-[var(--color-cookite-blue)]/5 overflow-hidden">
                <CardContent className="p-5 relative">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--color-cookite-blue)]/10 rounded-full -translate-y-10 translate-x-10"></div>
                  
                  <h4 className="font-bold text-[var(--color-cookite-blue)] mb-4 flex items-center gap-2 relative">
                    <div className="w-8 h-8 bg-[var(--color-cookite-blue)] rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    Como pagar:
                  </h4>
                  <ol className="text-[var(--color-cookite-blue)] space-y-3 text-sm relative">
                    <li className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-[var(--color-cookite-blue)] text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                      Abra o app do seu banco
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-[var(--color-cookite-blue)] text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                      Escolha <strong>PIX</strong> → <strong>Pagar</strong>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-[var(--color-cookite-blue)] text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                      Escaneie o QR Code ou cole o código
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-[var(--color-cookite-blue)] text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                      Confirme o valor e finalize
                    </li>
                  </ol>
                </CardContent>
              </Card>

              {/* Informação sobre verificação automática */}
              <Card className="border-0 shadow-lg bg-yellow-50">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 text-yellow-700">
                    <div className="w-10 h-10 bg-yellow-600 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Confirmação manual necessária</p>
                      <p className="text-xs text-yellow-600">Após realizar o pagamento PIX, clique em "Confirmar Pedido"</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ações */}
              <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <Button
                  size="lg"
                  onClick={() => {
                    if (pixResponse && confirm('✅ Confirma que o pagamento PIX foi realizado?\n\n💳 Valor: R$ ' + pixResponse.amount.toFixed(2) + '\n📱 Para: NICOLLY ASCIONE SALOMAO\n\n⚠️ Esta ação não pode ser desfeita.')) {
                      toast.success('Pedido confirmado com sucesso! 🎉')
                      onPaymentConfirmed(pixResponse.transactionId)
                    }
                  }}
                  className="flex-1 order-1 sm:order-1 transition-all duration-300 shadow-lg hover:shadow-xl bg-green-600 hover:bg-green-700 text-white border-0"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirmar Pedido
                </Button>
              </div>
            </>
          )}

          {/* Status de Sucesso */}
          {pixResponse.status === 'paid' && (
            <Card className="border-2 border-green-300 bg-green-50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  Pagamento Confirmado! 🎉
                </h3>
                <p className="text-green-700">
                  Sua reserva foi confirmada com sucesso!
                </p>
                <p className="text-sm text-green-600 mt-2">
                  ID: {pixResponse.transactionId}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Status de Expirado */}
          {pixResponse.status === 'expired' && (
            <Card className="border-2 border-red-300 bg-red-50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-red-800 mb-2">
                  Pagamento Expirado ⏰
                </h3>
                <p className="text-red-700 mb-4">
                  O tempo para pagamento acabou. Faça uma nova reserva.
                </p>
                <Button onClick={onClose} className="w-full">
                  Fazer Nova Reserva
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Info da transação */}
          <div className="text-xs text-gray-500 text-center space-y-1 border-t pt-4">
            <p>ID: {pixResponse.transactionId}</p>
            <p>Confirmação manual após pagamento</p>
            <p className="flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              Seguro e criptografado
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
