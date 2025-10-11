import { useState, useEffect } from 'react'
import { pb } from '../lib/pocketbase'

export interface AdminOrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

export interface AdminOrder {
  id: string
  userId: string
  items: AdminOrderItem[]
  total: number
  status: 'pending' | 'paid' | 'preparing' | 'ready' | 'completed'
  paymentMethod: 'pix'
  pixCode?: string
  pickupCode?: string
  created: string
  updated?: string
  // Campos adicionais para admin
  userEmail?: string
  userName?: string
}

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  // Carregar TODOS os pedidos (admin)
  const loadAllOrders = async () => {
    try {
      setLoading(true)
      console.log('📦 [ADMIN] Carregando todos os pedidos do PocketBase...')
      
      // Buscar todos os pedidos sem filtro de usuário
      const records = await pb.collection('orders').getFullList({
        sort: '-created',
        expand: 'userId' // Expandir dados do usuário se possível
      })

      console.log('📦 [ADMIN] Registros brutos encontrados:', records.length)
      console.log('📦 [ADMIN] Exemplo de registro:', records[0])

      // Processar cada pedido e buscar dados do usuário manualmente se necessário
      const converted: AdminOrder[] = await Promise.all(records.map(async (order: any) => {
        let userEmail = 'Email não disponível'
        let userName = 'Cliente não identificado'

        // Tentar obter dados do expand primeiro
        if (order.expand?.userId) {
          userEmail = order.expand.userId.email || userEmail
          userName = order.expand.userId.name || userName
          console.log('📦 [ADMIN] Dados do expand:', { userEmail, userName })
        } else {
          // Se expand não funcionou, buscar manualmente
          try {
            console.log('📦 [ADMIN] Buscando usuário manualmente:', order.userId)
            const user = await pb.collection('users').getOne(order.userId)
            userEmail = user.email || userEmail
            userName = user.name || userName
            console.log('📦 [ADMIN] Dados buscados manualmente:', { userEmail, userName })
          } catch (error) {
            console.warn('⚠️ [ADMIN] Não foi possível buscar dados do usuário:', order.userId, error)
          }
        }

        return {
          id: order.id,
          userId: order.userId,
          items: order.items || [],
          total: order.total || 0,
          status: order.status || 'pending',
          paymentMethod: order.paymentMethod || 'pix',
          pixCode: order.pixCode,
          pickupCode: order.pickupCode,
          created: order.created,
          updated: order.updated,
          userEmail,
          userName
        }
      }))

      setOrders(converted)
      console.log('✅ [ADMIN] Pedidos carregados:', converted.length)
      console.log('📋 [ADMIN] Detalhes dos pedidos:', converted)
    } catch (error) {
      console.error('❌ [ADMIN] Erro ao carregar pedidos:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  // Atualizar status do pedido
  const updateOrderStatus = async (orderId: string, status: AdminOrder['status']) => {
    try {
      setSyncing(true)
      console.log('📦 [ADMIN] Atualizando status do pedido:', orderId, 'para:', status)

      await pb.collection('orders').update(orderId, { status })
      console.log('✅ [ADMIN] Status atualizado no PocketBase')
      
      // Recarregar pedidos
      await loadAllOrders()
    } catch (error) {
      console.error('❌ [ADMIN] Erro ao atualizar status:', error)
      throw error
    } finally {
      setSyncing(false)
    }
  }

  // Buscar pedido por ID
  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId)
  }

  // Buscar pedidos por status
  const getOrdersByStatus = (status: AdminOrder['status']) => {
    return orders.filter(order => order.status === status)
  }

  // Estatísticas dos pedidos
  const getOrderStats = () => {
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const pendingOrders = orders.filter(order => order.status === 'pending').length
    const paidOrders = orders.filter(order => order.status === 'paid').length
    const preparingOrders = orders.filter(order => order.status === 'preparing').length
    const readyOrders = orders.filter(order => order.status === 'ready').length
    const completedOrders = orders.filter(order => order.status === 'completed').length
    const uniqueUsers = new Set(orders.map(order => order.userId)).size

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      paidOrders,
      preparingOrders,
      readyOrders,
      completedOrders,
      uniqueUsers,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
    }
  }

  // Configurar sincronização automática
  useEffect(() => {
    loadAllOrders()
    
    // Sincronizar a cada 10 segundos (mais frequente para admin)
    const interval = setInterval(() => {
      console.log('🔄 [ADMIN] Sincronização automática...')
      loadAllOrders()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return {
    orders,
    loading,
    syncing,
    updateOrderStatus,
    getOrderById,
    getOrdersByStatus,
    getOrderStats,
    refreshOrders: loadAllOrders
  }
}
