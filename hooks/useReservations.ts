import { useState, useEffect } from 'react'
// import { supabase } from '../lib/supabase'
const supabase = null as any // Temporariamente desabilitado

export interface Reservation {
  id: string
  name: string
  email: string
  phone: string
  products: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
  totalAmount: number
  discountApplied: boolean
  notes: string
  createdAt: string
  paymentStatus: 'pending' | 'paid' | 'expired' | 'cancelled'
  transactionId?: string
  pickupCode?: string
}

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar reservas do localStorage (fallback se Supabase não estiver disponível)
  const loadReservationsFromStorage = () => {
    try {
      const stored = localStorage.getItem('cookite-reservations')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Erro ao carregar reservas do localStorage:', error)
      return []
    }
  }

  // Salvar reservas no localStorage
  const saveReservationsToStorage = (reservations: Reservation[]) => {
    try {
      localStorage.setItem('cookite-reservations', JSON.stringify(reservations))
    } catch (error) {
      console.error('Erro ao salvar reservas no localStorage:', error)
    }
  }

  // Carregar reservas
  const loadReservations = async () => {
    setLoading(true)
    try {
      // Tentar carregar do Supabase primeiro
      if (supabase) {
        const { data, error } = await supabase
          .from('reservations')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Erro ao carregar reservas do Supabase:', error)
          // Fallback para localStorage
          const localReservations = loadReservationsFromStorage()
          setReservations(localReservations)
        } else {
          setReservations(data || [])
        }
      } else {
        // Usar localStorage se Supabase não estiver disponível
        const localReservations = loadReservationsFromStorage()
        setReservations(localReservations)
      }
    } catch (error) {
      console.error('Erro ao carregar reservas:', error)
      setError('Erro ao carregar reservas')
      // Fallback para localStorage
      const localReservations = loadReservationsFromStorage()
      setReservations(localReservations)
    } finally {
      setLoading(false)
    }
  }

  // Criar reserva
  const createReservation = async (reservationData: Omit<Reservation, 'id' | 'createdAt' | 'pickupCode'>) => {
    try {
      const newReservation: Reservation = {
        ...reservationData,
        id: `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        pickupCode: Math.random().toString(36).substr(2, 8).toUpperCase()
      }

      // Tentar salvar no Supabase primeiro
      if (supabase) {
        const { data, error } = await supabase
          .from('reservations')
          .insert([newReservation])
          .select()
          .single()

        if (error) {
          console.error('Erro ao criar reserva no Supabase:', error)
          // Fallback para localStorage
          const updatedReservations = [newReservation, ...reservations]
          setReservations(updatedReservations)
          saveReservationsToStorage(updatedReservations)
          
          return {
            success: true,
            reservationId: newReservation.id,
            reservation: newReservation
          }
        } else {
          setReservations([data, ...reservations])
          return {
            success: true,
            reservationId: data.id,
            reservation: data
          }
        }
      } else {
        // Usar localStorage se Supabase não estiver disponível
        const updatedReservations = [newReservation, ...reservations]
        setReservations(updatedReservations)
        saveReservationsToStorage(updatedReservations)
        
        return {
          success: true,
          reservationId: newReservation.id,
          reservation: newReservation
        }
      }
    } catch (error) {
      console.error('Erro ao criar reserva:', error)
      setError('Erro ao criar reserva')
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao criar reserva'
      }
    }
  }

  // Atualizar status de pagamento
  const updatePaymentStatus = async (reservationId: string, status: Reservation['paymentStatus'], transactionId?: string) => {
    try {
      // Tentar atualizar no Supabase primeiro
      if (supabase) {
        const { error } = await supabase
          .from('reservations')
          .update({ 
            payment_status: status,
            transaction_id: transactionId 
          })
          .eq('id', reservationId)

        if (error) {
          console.error('Erro ao atualizar status no Supabase:', error)
        }
      }

      // Atualizar no estado local e localStorage
      const updatedReservations = reservations.map(reservation =>
        reservation.id === reservationId
          ? { ...reservation, paymentStatus: status, transactionId }
          : reservation
      )
      setReservations(updatedReservations)
      saveReservationsToStorage(updatedReservations)
    } catch (error) {
      console.error('Erro ao atualizar status de pagamento:', error)
      setError('Erro ao atualizar status de pagamento')
    }
  }

  // Excluir reserva
  const deleteReservation = async (reservationId: string) => {
    try {
      // Tentar excluir do Supabase primeiro
      if (supabase) {
        const { error } = await supabase
          .from('reservations')
          .delete()
          .eq('id', reservationId)

        if (error) {
          console.error('Erro ao excluir reserva do Supabase:', error)
        }
      }

      // Excluir do estado local e localStorage
      const updatedReservations = reservations.filter(reservation => reservation.id !== reservationId)
      setReservations(updatedReservations)
      saveReservationsToStorage(updatedReservations)
    } catch (error) {
      console.error('Erro ao excluir reserva:', error)
      setError('Erro ao excluir reserva')
    }
  }

  // Carregar reservas quando o hook é montado
  useEffect(() => {
    loadReservations()
  }, [])

  return {
    reservations,
    loading,
    isLoading: loading, // Alias para compatibilidade
    error,
    createReservation,
    updatePaymentStatus,
    deleteReservation,
    reload: loadReservations
  }
}
