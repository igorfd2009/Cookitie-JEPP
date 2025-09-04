import { useState } from 'react'
import { Mail, Send, CheckCircle, AlertCircle, Clock, Users, RefreshCw } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { useEmailConfirmation } from '../hooks/useEmailConfirmation'
import type { Reservation, Payment } from '../utils/emailService'

interface EmailDashboardProps {
  reservations: Reservation[]
  onRefresh?: () => void
}

interface EmailStatus {
  reservationId: string
  status: 'pending' | 'sent' | 'confirmed' | 'error'
  timestamp: string
  error?: string
}

export function EmailDashboard({ reservations, onRefresh }: EmailDashboardProps) {
  const [emailStatuses, setEmailStatuses] = useState<EmailStatus[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedReservations, setSelectedReservations] = useState<Set<string>>(new Set())
  
  const { sendThankYouEmail, sendPaymentConfirmation, sendReminderEmail } = useEmailConfirmation()

  // Estatísticas dos emails
  const stats = {
    total: reservations.length,
    pending: emailStatuses.filter(s => s.status === 'pending').length,
    sent: emailStatuses.filter(s => s.status === 'sent').length,
    confirmed: emailStatuses.filter(s => s.status === 'confirmed').length,
    error: emailStatuses.filter(s => s.status === 'error').length
  }

  // Selecionar/deselecionar todas as reservas
  const toggleSelectAll = () => {
    if (selectedReservations.size === reservations.length) {
      setSelectedReservations(new Set())
    } else {
      setSelectedReservations(new Set(reservations.map(r => r.id)))
    }
  }

  // Selecionar reserva individual
  const toggleReservation = (reservationId: string) => {
    const newSelected = new Set(selectedReservations)
    if (newSelected.has(reservationId)) {
      newSelected.delete(reservationId)
    } else {
      newSelected.add(reservationId)
    }
    setSelectedReservations(newSelected)
  }

  // Enviar emails em massa
  const sendBulkEmails = async (type: 'thankYou' | 'reminder' | 'paymentConfirmation') => {
    if (selectedReservations.size === 0) return

    setIsProcessing(true)
    const selectedReservationsList = reservations.filter(r => selectedReservations.has(r.id))
    
    // Inicializar status
    const initialStatuses: EmailStatus[] = selectedReservationsList.map(r => ({
      reservationId: r.id,
      status: 'pending',
      timestamp: new Date().toISOString()
    }))
    
    setEmailStatuses(prev => [...prev, ...initialStatuses])

    // Processar cada reserva
    for (const reservation of selectedReservationsList) {
      try {
        let success = false
        
        switch (type) {
          case 'thankYou':
            await sendThankYouEmail(reservation)
            success = true
            break
          case 'reminder':
            await sendReminderEmail(reservation)
            success = true
            break
          case 'paymentConfirmation':
            // Simular pagamento para teste
            const mockPayment: Payment = {
              transactionId: `TXN-${Date.now()}`,
              amount: reservation.totalAmount,
              status: 'paid'
            }
            await sendPaymentConfirmation(reservation, mockPayment)
            success = true
            break
        }

        // Atualizar status
        setEmailStatuses(prev => prev.map(s => 
          s.reservationId === reservation.id 
            ? { ...s, status: success ? 'sent' : 'error', error: success ? undefined : 'Falha no envio' }
            : s
        ))

        // Aguardar um pouco entre envios para não sobrecarregar a API
        await new Promise(resolve => setTimeout(resolve, 1000))

      } catch (error) {
        setEmailStatuses(prev => prev.map(s => 
          s.reservationId === reservation.id 
            ? { ...s, status: 'error', error: error instanceof Error ? error.message : 'Erro desconhecido' }
            : s
        ))
      }
    }

    setIsProcessing(false)
    setSelectedReservations(new Set())
  }

  // Marcar como confirmado (quando pagamento for confirmado)
  const markAsConfirmed = (reservationId: string) => {
    setEmailStatuses(prev => prev.map(s => 
      s.reservationId === reservationId 
        ? { ...s, status: 'confirmed' }
        : s
    ))
  }

  // Obter status de uma reserva
  const getReservationStatus = (reservationId: string): EmailStatus | undefined => {
    return emailStatuses.find(s => s.reservationId === reservationId)
  }

  // Obter ícone do status
  const getStatusIcon = (status: EmailStatus['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'sent': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-blue-500" />
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  // Obter cor do badge do status
  const getStatusBadgeVariant = (status: EmailStatus['status']) => {
    switch (status) {
      case 'pending': return 'secondary'
      case 'sent': return 'default'
      case 'confirmed': return 'default'
      case 'error': return 'destructive'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Reservas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Aguardando</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enviados</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.sent}</div>
            <p className="text-xs text-muted-foreground">Emails enviados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
            <p className="text-xs text-muted-foreground">Pagamentos confirmados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Erros</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.error}</div>
            <p className="text-xs text-muted-foreground">Falhas no envio</p>
          </CardContent>
        </Card>
      </div>

      {/* Ações em massa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Ações em Massa
          </CardTitle>
          <CardDescription>
            Selecione as reservas e execute ações em lote
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={toggleSelectAll}
              disabled={isProcessing}
            >
              {selectedReservations.size === reservations.length ? 'Deselecionar Todas' : 'Selecionar Todas'}
            </Button>
            
            <span className="text-sm text-muted-foreground">
              {selectedReservations.size} de {reservations.length} selecionadas
            </span>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => sendBulkEmails('thankYou')}
              disabled={selectedReservations.size === 0 || isProcessing}
              className="flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Enviar Agradecimentos
            </Button>

            <Button
              onClick={() => sendBulkEmails('reminder')}
              disabled={selectedReservations.size === 0 || isProcessing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Enviar Lembretes
            </Button>

            <Button
              onClick={() => sendBulkEmails('paymentConfirmation')}
              disabled={selectedReservations.size === 0 || isProcessing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Confirmar Pagamentos
            </Button>

            {onRefresh && (
              <Button
                onClick={onRefresh}
                variant="ghost"
                size="sm"
                className="ml-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Atualizar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lista de reservas */}
      <Card>
        <CardHeader>
          <CardTitle>Reservas e Status de Email</CardTitle>
          <CardDescription>
            Visualize o status de envio de emails para cada reserva
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reservations.map((reservation) => {
              const status = getReservationStatus(reservation.id)
              const isSelected = selectedReservations.has(reservation.id)
              
              return (
                <div
                  key={reservation.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleReservation(reservation.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    
                    <div>
                      <h4 className="font-medium">{reservation.name}</h4>
                      <p className="text-sm text-muted-foreground">{reservation.email}</p>
                      <p className="text-sm text-muted-foreground">
                        R$ {reservation.totalAmount.toFixed(2).replace('.', ',')} • {reservation.products.length} produto(s)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {status ? (
                      <div className="flex items-center gap-2">
                        {getStatusIcon(status.status)}
                        <Badge variant={getStatusBadgeVariant(status.status)}>
                          {status.status === 'pending' && 'Pendente'}
                          {status.status === 'sent' && 'Enviado'}
                          {status.status === 'confirmed' && 'Confirmado'}
                          {status.status === 'error' && 'Erro'}
                        </Badge>
                        {status.error && (
                          <span className="text-xs text-red-600 max-w-32 truncate" title={status.error}>
                            {status.error}
                          </span>
                        )}
                      </div>
                    ) : (
                      <Badge variant="outline">Não enviado</Badge>
                    )}

                    {status?.status === 'sent' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markAsConfirmed(reservation.id)}
                      >
                        Marcar Confirmado
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
