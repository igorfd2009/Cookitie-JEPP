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
  pickupCode?: string
  createdAt: string
  updatedAt?: string
}

// Detecção automática de backend
const detectBackend = () => {
  // Verifica se PocketBase está rodando
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'pocketbase'
  }
  
  // Verifica se Firebase está configurado
  if (import.meta.env.VITE_FIREBASE_PROJECT_ID) {
    return 'firebase'
  }
  
  // Verifica se Supabase está configurado
  if (import.meta.env.VITE_SUPABASE_URL) {
    return 'supabase'
  }
  
  // Fallback para localStorage
  return 'localStorage'
}

export const useUniversalOrders = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [backend] = useState(detectBackend())

  // Mostrar qual backend está sendo usado
  useEffect(() => {
    console.log(`🔧 Backend detectado: ${backend.toUpperCase()}`)
  }, [backend])

  // ===== LOCALSTORAGE (Funciona sempre) =====
  const localStorageOperations = {
    load: () => {
      try {
        const allOrders = JSON.parse(localStorage.getItem('cookitie_orders') || '[]')
        return allOrders.filter((order: Order) => order.userId === user?.id)
      } catch {
        return []
      }
    },
    
    save: (newOrders: Order[]) => {
      try {
        const allOrders = JSON.parse(localStorage.getItem('cookitie_orders') || '[]')
        const otherUsersOrders = allOrders.filter((order: Order) => order.userId !== user?.id)
        localStorage.setItem('cookitie_orders', JSON.stringify([...otherUsersOrders, ...newOrders]))
      } catch (error) {
        console.error('❌ Erro ao salvar no localStorage:', error)
      }
    },
    
    create: async (orderData: Omit<Order, 'id' | 'createdAt' | 'userId'>) => {
      const newOrder: Order = {
        ...orderData,
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user!.id,
        createdAt: new Date().toISOString()
      }
      
      const allOrders = JSON.parse(localStorage.getItem('cookitie_orders') || '[]')
      allOrders.push(newOrder)
      localStorage.setItem('cookitie_orders', JSON.stringify(allOrders))
      
      return newOrder
    },
    
    updateStatus: async (orderId: string, status: Order['status']) => {
      const allOrders = JSON.parse(localStorage.getItem('cookitie_orders') || '[]')
      const updatedOrders = allOrders.map((order: Order) => 
        order.id === orderId 
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      )
      localStorage.setItem('cookitie_orders', JSON.stringify(updatedOrders))
    }
  }

  // ===== POCKETBASE =====
  const pocketbaseOperations = {
    load: async () => {
      try {
        const response = await fetch(`http://localhost:8090/api/collections/orders/records?filter=(userId='${user?.id}')`)
        const data = await response.json()
        return data.items || []
      } catch (error) {
        console.error('❌ PocketBase não disponível, usando localStorage')
        return localStorageOperations.load()
      }
    },
    
    create: async (orderData: Omit<Order, 'id' | 'createdAt' | 'userId'>) => {
      try {
        const response = await fetch('http://localhost:8090/api/collections/orders/records', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...orderData, userId: user!.id })
        })
        return await response.json()
      } catch (error) {
        console.error('❌ Erro PocketBase, usando localStorage')
        return localStorageOperations.create(orderData)
      }
    },
    
    updateStatus: async (orderId: string, status: Order['status']) => {
      try {
        await fetch(`http://localhost:8090/api/collections/orders/records/${orderId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        })
      } catch (error) {
        console.error('❌ Erro PocketBase, usando localStorage')
        return localStorageOperations.updateStatus(orderId, status)
      }
    }
  }

  // Carregar pedidos baseado no backend
  const loadOrders = async () => {
    if (!user) {
      setOrders([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      let userOrders: Order[] = []

      switch (backend) {
        case 'pocketbase':
          userOrders = await pocketbaseOperations.load()
          break
        case 'firebase':
          // TODO: Implementar Firebase
          console.log('🔥 Firebase ainda não implementado, usando localStorage')
          userOrders = localStorageOperations.load()
          break
        case 'supabase':
          // TODO: Usar hook existente do Supabase
          console.log('🟦 Supabase detectado, mas usando localStorage por enquanto')
          userOrders = localStorageOperations.load()
          break
        default:
          userOrders = localStorageOperations.load()
      }

      setOrders(userOrders)
      console.log(`✅ ${userOrders.length} pedidos carregados do ${backend}`)
    } catch (error) {
      console.error('❌ Erro ao carregar pedidos:', error)
      // Fallback para localStorage
      setOrders(localStorageOperations.load())
    } finally {
      setLoading(false)
    }
  }

  // Criar pedido
  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) throw new Error('Usuário não autenticado')

    try {
      setSyncing(true)
      let newOrder: Order

      switch (backend) {
        case 'pocketbase':
          newOrder = await pocketbaseOperations.create(orderData)
          break
        default:
          newOrder = await localStorageOperations.create(orderData)
      }

      setOrders(prev => [newOrder, ...prev])
      return newOrder
    } catch (error) {
      console.error('❌ Erro ao criar pedido:', error)
      throw error
    } finally {
      setSyncing(false)
    }
  }

  // Atualizar status
  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      setSyncing(true)

      switch (backend) {
        case 'pocketbase':
          await pocketbaseOperations.updateStatus(orderId, status)
          break
        default:
          await localStorageOperations.updateStatus(orderId, status)
      }

      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      ))
    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error)
      throw error
    } finally {
      setSyncing(false)
    }
  }

  // Estatísticas
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

  // Configurar sincronização automática
  useEffect(() => {
    loadOrders()
    
    // Sincronizar automaticamente a cada 30 segundos (exceto localStorage)
    if (backend !== 'localStorage') {
      const interval = setInterval(() => {
        console.log(`🔄 Sincronização automática (${backend})...`)
        loadOrders()
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [user, backend])

  return {
    orders,
    loading,
    syncing,
    backend, // Mostra qual backend está sendo usado
    createOrder,
    updateOrderStatus,
    getOrderById: (id: string) => orders.find(order => order.id === id),
    getOrdersByStatus: (status: Order['status']) => orders.filter(order => order.status === status),
    getOrderStats,
    refreshOrders: loadOrders
  }
}
