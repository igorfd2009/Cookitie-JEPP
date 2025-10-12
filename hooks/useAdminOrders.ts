import { useState, useEffect, useRef } from 'react'
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
  const abortControllerRef = useRef<AbortController | null>(null)

  // Carregar TODOS os pedidos (admin)
  const loadAllOrders = async () => {
    // Cancelar requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Criar novo AbortController
    abortControllerRef.current = new AbortController()

    try {
      setLoading(true)
      console.log('📦 [ADMIN] Carregando todos os pedidos do PocketBase...')
      
      // Buscar todos os pedidos sem filtro de usuário
      const records = await pb.collection('orders').getFullList({
        sort: '-created',
        expand: 'userId', // Expandir dados do usuário se possível
        $autoCancel: false
      })

      console.log('📦 [ADMIN] Registros brutos encontrados:', records.length)
      console.log('📦 [ADMIN] Exemplo de registro:', records[0])

      // Coletar IDs únicos de usuários
      const userIds = [...new Set(records.map((order: any) => order.userId))]
      console.log('📦 [ADMIN] IDs únicos de usuários:', userIds.length)

      // Buscar todos os usuários de uma vez
      const usersMap = new Map<string, any>()
      
      try {
        // Buscar todos os usuários em uma única requisição
        const users = await pb.collection('users').getFullList({
          filter: userIds.map(id => `id="${id}"`).join(' || ')
        })
        
        console.log('📦 [ADMIN] Usuários encontrados:', users.length)
        users.forEach(user => {
          usersMap.set(user.id, user)
        })
      } catch (error) {
        console.warn('⚠️ [ADMIN] Erro ao buscar usuários em lote:', error)
      }

      // Processar cada pedido com os dados dos usuários já carregados
      const converted: AdminOrder[] = records.map((order: any) => {
        let userEmail = 'Email não disponível'
        let userName = 'Cliente não identificado'

        // Tentar obter dados do expand primeiro
        if (order.expand?.userId) {
          userEmail = order.expand.userId.email || userEmail
          userName = order.expand.userId.name || userName
          console.log('📦 [ADMIN] Dados do expand para pedido', order.id.slice(-8), ':', { userEmail, userName })
        } else if (usersMap.has(order.userId)) {
          // Usar dados do mapa de usuários
          const user = usersMap.get(order.userId)
          userEmail = user.email || userEmail
          userName = user.name || userName
          console.log('📦 [ADMIN] Dados do mapa para pedido', order.id.slice(-8), ':', { userEmail, userName })
        } else {
          console.warn('⚠️ [ADMIN] Usuário não encontrado para pedido:', order.id.slice(-8), 'userId:', order.userId)
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
      })

      setOrders(converted)
      console.log('✅ [ADMIN] Pedidos carregados:', converted.length)
      console.log('📋 [ADMIN] Amostra de pedido processado:', converted[0])
    } catch (error) {
      // Ignorar erros de cancelamento
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('📦 [ADMIN] Requisição cancelada')
        return
      }
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

    return () => {
      clearInterval(interval)
      // Cancelar requisição pendente ao desmontar
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
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
