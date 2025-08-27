import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'

export interface Order {
  id: string
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  items: {
    id: string
    name: string
    quantity: number
    price: number
    image: string
  }[]
  total: number
  created_at: string
  pickup_date: string
  pickup_location: string
  payment_method: string
  payment_status: 'pending' | 'paid' | 'failed'
  customer: {
    name: string
    email: string
    phone: string
  }
  notes?: string
  transactionId?: string
  admin_notes?: string
}

export const useOrders = () => {
  const { isAuthenticated } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  // Carregar pedidos do localStorage
  const loadOrders = useCallback(() => {
    try {
      const storedOrders = JSON.parse(localStorage.getItem('user_orders') || '[]')
      setOrders(storedOrders)
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
      setOrders([])
      setLoading(false)
    }
  }, [])

  // Adicionar novo pedido
  const addOrder = useCallback((order: Order) => {
    try {
      const existingOrders = JSON.parse(localStorage.getItem('user_orders') || '[]')
      const newOrders = [order, ...existingOrders]
      localStorage.setItem('user_orders', JSON.stringify(newOrders))
      setOrders(newOrders)
      
      // Também salvar no localStorage de admin para controle
      const adminOrders = JSON.parse(localStorage.getItem('admin_orders') || '[]')
      const newAdminOrders = [order, ...adminOrders]
      localStorage.setItem('admin_orders', JSON.stringify(newAdminOrders))
      
      console.log('✅ Pedido adicionado:', order.id)
      return true
    } catch (error) {
      console.error('Erro ao adicionar pedido:', error)
      return false
    }
  }, [])

  // Atualizar status do pedido
  const updateOrderStatus = useCallback((orderId: string, newStatus: Order['status'], adminNotes?: string) => {
    try {
      const existingOrders = JSON.parse(localStorage.getItem('user_orders') || '[]')
      const updatedOrders = existingOrders.map((order: Order) => 
        order.id === orderId 
          ? { ...order, status: newStatus, admin_notes: adminNotes }
          : order
      )
      localStorage.setItem('user_orders', JSON.stringify(updatedOrders))
      setOrders(updatedOrders)

      // Atualizar também no admin
      const adminOrders = JSON.parse(localStorage.getItem('admin_orders') || '[]')
      const updatedAdminOrders = adminOrders.map((order: Order) => 
        order.id === orderId 
          ? { ...order, status: newStatus, admin_notes: adminNotes }
          : order
      )
      localStorage.setItem('admin_orders', JSON.stringify(updatedAdminOrders))
      
      console.log('✅ Status do pedido atualizado:', orderId, newStatus)
      return true
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error)
      return false
    }
  }, [])

  // Obter pedidos do admin
  const getAdminOrders = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem('admin_orders') || '[]')
    } catch (error) {
      console.error('Erro ao carregar pedidos do admin:', error)
      return []
    }
  }, [])

  // Estatísticas dos pedidos
  const getOrderStats = useCallback(() => {
    const allOrders = getAdminOrders()
    const stats = {
      total: allOrders.length,
      pending: allOrders.filter((o: Order) => o.status === 'pending').length,
      confirmed: allOrders.filter((o: Order) => o.status === 'confirmed').length,
      preparing: allOrders.filter((o: Order) => o.status === 'preparing').length,
      ready: allOrders.filter((o: Order) => o.status === 'ready').length,
      delivered: allOrders.filter((o: Order) => o.status === 'delivered').length,
      cancelled: allOrders.filter((o: Order) => o.status === 'cancelled').length,
      totalRevenue: allOrders
        .filter((o: Order) => o.payment_status === 'paid')
        .reduce((sum: number, o: Order) => sum + o.total, 0)
    }
    return stats
  }, [getAdminOrders])

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders()
    } else {
      setOrders([])
      setLoading(false)
    }
  }, [isAuthenticated, loadOrders])

  return {
    orders,
    loading,
    loadOrders,
    addOrder,
    updateOrderStatus,
    getAdminOrders,
    getOrderStats
  }
}
