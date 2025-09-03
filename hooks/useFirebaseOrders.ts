import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

// Nota: Este hook requer Firebase instalado e configurado
// Para usar, instale: npm install firebase react-firebase-hooks
// E configure o arquivo lib/firebase.ts

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

export interface FirebaseOrder {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'paid' | 'preparing' | 'ready' | 'completed'
  paymentMethod: 'pix'
  pixCode?: string
  pickupCode?: string
  createdAt: string // Usando string por enquanto
  updatedAt?: string
}

export const useFirebaseOrders = () => {
  const { user } = useAuth()
  const [orders] = useState<FirebaseOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing] = useState(false)

  // NOTA: Esta é uma implementação de exemplo
  // Para usar Firebase, você precisa:
  // 1. npm install firebase react-firebase-hooks
  // 2. Configurar lib/firebase.ts
  // 3. Implementar as funções Firebase

  useEffect(() => {
    console.log('🔥 Firebase hook carregado (modo exemplo)')
    setLoading(false)
  }, [user])

  const createOrder = async (orderData: Omit<FirebaseOrder, 'id' | 'createdAt' | 'userId'>) => {
    console.log('🔥 Firebase createOrder (não implementado)', orderData)
    throw new Error('Firebase não configurado. Use useOrders ou configure Firebase.')
  }

  const updateOrderStatus = async (orderId: string, status: FirebaseOrder['status']) => {
    console.log('🔥 Firebase updateOrderStatus (não implementado)', orderId, status)
    throw new Error('Firebase não configurado. Use useOrders ou configure Firebase.')
  }

  // Buscar pedido por ID
  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId)
  }

  // Buscar pedidos por status
  const getOrdersByStatus = (status: FirebaseOrder['status']) => {
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

  return {
    orders,
    loading,
    syncing,
    createOrder,
    updateOrderStatus,
    getOrderById,
    getOrdersByStatus,
    getOrderStats,
    // Firebase não precisa de refresh manual - é automático!
    refreshOrders: () => console.log('🔥 Firebase sincroniza automaticamente!')
  }
}
