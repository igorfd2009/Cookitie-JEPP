
import { CheckCircle, Mail, AlertCircle, Loader2, Copy } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

import { useEmailConfirmation } from '../hooks/useEmailConfirmation'
import type { Reservation, Payment } from '../utils/emailService'

interface EmailConfirmationProps {
  reservation: Reservation
  payment?: Payment
  onClose?: () => void
  showPaymentConfirmation?: boolean
}

export function EmailConfirmation({ 
  reservation, 
  payment, 
  onClose,
  showPaymentConfirmation = false 
}: EmailConfirmationProps) {
  const {
    isSending,
    isConfirmed,
    error,
    pickupCode,
    emailSent,
    sendThankYouEmail,
    sendPaymentConfirmation,
    resetState
  } = useEmailConfirmation()

  const handleSendThankYou = async () => {
    await sendThankYouEmail(reservation)
  }

  const handleSendPaymentConfirmation = async () => {
    if (payment) {
      await sendPaymentConfirmation(reservation, payment)
    }
  }

  const handleCopyPickupCode = () => {
    if (pickupCode) {
      navigator.clipboard.writeText(pickupCode)
      // Você pode adicionar um toast aqui se quiser
    }
  }

  const handleReset = () => {
    resetState()
    onClose?.()
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-red-600">Erro no Envio</CardTitle>
          <CardDescription className="text-red-500">
            {error}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={handleReset} variant="outline" className="w-full">
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isSending) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
          <CardTitle>Enviando Email...</CardTitle>
          <CardDescription>
            Aguarde enquanto enviamos sua confirmação
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (emailSent && !showPaymentConfirmation) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-green-600">Email Enviado!</CardTitle>
          <CardDescription>
            Seu email de agradecimento foi enviado com sucesso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pickupCode && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 text-center">
              <h4 className="font-semibold text-yellow-800 mb-2">🎯 Código de Retirada</h4>
              <div className="bg-white border-2 border-dashed border-yellow-300 rounded-lg p-3 mb-3">
                <p className="font-mono text-xl font-bold text-blue-600 tracking-wider">
                  {pickupCode}
                </p>
              </div>
              <Button 
                onClick={handleCopyPickupCode} 
                variant="outline" 
                size="sm"
                className="w-full"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar Código
              </Button>
            </div>
          )}
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <h4 className="font-semibold text-blue-800 mb-2">📧 Próximos Passos</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Verifique sua caixa de entrada</li>
              <li>• Complete o pagamento PIX em até 30 minutos</li>
              <li>• Guarde o código de retirada</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleReset} variant="outline" className="flex-1">
              Fechar
            </Button>
            {showPaymentConfirmation && (
              <Button onClick={handleSendPaymentConfirmation} className="flex-1">
                <Mail className="w-4 h-4 mr-2" />
                Confirmar Pagamento
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isConfirmed) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-green-600">Pagamento Confirmado!</CardTitle>
          <CardDescription>
            Email de confirmação enviado com sucesso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
            <h4 className="font-semibold text-green-800 mb-2">✅ Reserva Garantida</h4>
            <p className="text-sm text-green-700">
              Sua reserva está confirmada e seus doces estão garantidos para o evento!
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <h4 className="font-semibold text-blue-800 mb-2">📅 Lembrete</h4>
            <p className="text-sm text-blue-700">
              Não se esqueça de retirar seus doces no dia do evento!
            </p>
          </div>

          <Button onClick={handleReset} className="w-full">
            Concluído
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle>Confirmação por Email</CardTitle>
        <CardDescription>
          Envie um email de agradecimento para {reservation.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">📋 Detalhes da Reserva</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Cliente:</strong> {reservation.name}</p>
            <p><strong>Email:</strong> {reservation.email}</p>
            <p><strong>Total:</strong> R$ {reservation.totalAmount.toFixed(2).replace('.', ',')}</p>
            <p><strong>Produtos:</strong> {reservation.products.length} item(s)</p>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Importante</h4>
          <p className="text-sm text-yellow-700">
            O cliente receberá um email com código de retirada e instruções de pagamento
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleReset} variant="outline" className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleSendThankYou} className="flex-1">
            <Mail className="w-4 h-4 mr-2" />
            Enviar Email
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
