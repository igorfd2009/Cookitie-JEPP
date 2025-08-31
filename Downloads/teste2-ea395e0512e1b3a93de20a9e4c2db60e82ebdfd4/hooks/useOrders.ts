import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'paid' | 'preparing' | 'ready' | 'completed'
  paymentMethod: 'pix'
  pixCode?: string
  createdAt: string
  updatedAt?: string
}

export const useOrders = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  // Carregar pedidos do localStorage
  const loadOrders = () => {
    if (!user) {
      setOrders([])
      setLoading(false)
      return
    }

    try {
      // Carregar pedidos gerais
      const allOrders = JSON.parse(localStorage.getItem('cookitie_orders') || '[]')
      
      // Filtrar apenas pedidos do usuário atual
      const userOrders = allOrders.filter((order: Order) => order.userId === user.id)
      
      setOrders(userOrders)
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  // Criar novo pedido
  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const newOrder: Order = {
      ...orderData,
      id: `cookitie_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      createdAt: new Date().toISOString()
    }

    try {
      // Carregar pedidos existentes
      const existingOrders = JSON.parse(localStorage.getItem('cookitie_orders') || '[]')
      
      // Adicionar novo pedido
      existingOrders.push(newOrder)
      
      // Salvar no localStorage
      localStorage.setItem('cookitie_orders', JSON.stringify(existingOrders))
      
      // Atualizar estado local
      setOrders(prev => [newOrder, ...prev])
      
      return newOrder
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      throw error
    }
  }

  // Atualizar status do pedido
  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      // Carregar todos os pedidos
      const allOrders = JSON.parse(localStorage.getItem('cookitie_orders') || '[]')
      
      // Encontrar e atualizar o pedido
      const updatedOrders = allOrders.map((order: Order) => 
        order.id === orderId 
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      )
      
      // Salvar no localStorage
      localStorage.setItem('cookitie_orders', JSON.stringify(updatedOrders))
      
      // Atualizar estado local
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      ))
      
      return true
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error)
      throw error
    }
  }

  // Buscar pedido por ID
  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId)
  }

  // Buscar pedidos por status
  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter(order => order.status === status)
  }

  // Estatísticas dos pedidos
  const getOrderStats = () => {
    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0)
    const pendingOrders = orders.filter(order => order.status === 'pending').length
    const completedOrders = orders.filter(order => order.status === 'completed').length

    return {
      totalOrders,
      totalSpent,
      pendingOrders,
      completedOrders,
      averageOrderValue: totalOrders > 0 ? totalSpent / totalOrders : 0
    }
  }

  // Carregar pedidos quando o usuário mudar
  useEffect(() => {
    loadOrders()
  }, [user])

  return {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    getOrderById,
    getOrdersByStatus,
    getOrderStats,
    refreshOrders: loadOrders
  }
}
