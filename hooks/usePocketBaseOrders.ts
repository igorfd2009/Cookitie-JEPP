import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { pb } from '../lib/pocketbase'

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
  created: string
  updated?: string
}

export const usePocketBaseOrders = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Carregar pedidos do PocketBase
  const loadOrders = async () => {
    if (!user) {
      console.log('📦 [DEBUG] Usuário não autenticado, limpando pedidos')
      setOrders([])
      setLoading(false)
      return
    }

    // Cancelar requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Criar novo AbortController
    abortControllerRef.current = new AbortController()

    try {
      setLoading(true)
      console.log('📦 [DEBUG] Carregando pedidos do PocketBase...')
      console.log('📦 [DEBUG] Usuário ID:', user.id)
      console.log('📦 [DEBUG] Token válido:', pb.authStore.isValid)
      
      const records = await pb.collection('orders').getFullList({
        filter: `(userId='${user.id}')`,
        sort: '-created'
      }, {
        signal: abortControllerRef.current.signal
      })

      const converted: Order[] = records.map((order: any) => ({
        id: order.id,
        userId: order.userId,
        items: order.items,
        total: order.total,
        status: order.status,
        paymentMethod: order.paymentMethod,
        pixCode: order.pixCode,
        pickupCode: order.pickupCode,
        created: order.created,
        updated: order.updated
      }))

      setOrders(converted)
      console.log('✅ Pedidos carregados do PocketBase:', converted.length)
    } catch (error) {
      // Ignorar erros de cancelamento
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('📦 [DEBUG] Requisição cancelada')
        return
      }
      console.error('❌ Erro ao carregar do PocketBase:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  // Criar novo pedido
  const createOrder = async (orderData: Omit<Order, 'id' | 'created' | 'userId'>) => {
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    console.log('📦 [DEBUG] Dados recebidos para criação:', orderData)

    // 🔍 VALIDAÇÃO RIGOROSA DOS DADOS
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      console.error('❌ [VALIDAÇÃO] Items inválidos:', orderData.items)
      throw new Error('Pedido deve ter pelo menos um item válido')
    }
    
    // Validar estrutura de cada item
    for (let i = 0; i < orderData.items.length; i++) {
      const item = orderData.items[i]
      if (!item.id || !item.name || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
        console.error(`❌ [VALIDAÇÃO] Item ${i} inválido:`, item)
        throw new Error(`Item ${i + 1} possui estrutura inválida. Deve conter: id, name, price (número), quantity (número)`)
      }
      if (item.price <= 0 || item.quantity <= 0) {
        console.error(`❌ [VALIDAÇÃO] Item ${i} com valores inválidos:`, item)
        throw new Error(`Item ${i + 1} deve ter preço e quantidade maiores que zero`)
      }
    }
    
    if (!orderData.total || typeof orderData.total !== 'number' || orderData.total <= 0) {
      console.error('❌ [VALIDAÇÃO] Total inválido:', orderData.total)
      throw new Error('Total do pedido deve ser um número maior que zero')
    }

    // TEMPORÁRIO: Usar status que sabemos que funciona
    // Baseado nos migrations, "paid" aparece em todos
    const validStatuses = ['pending', 'paid', 'preparing', 'ready', 'completed']
    const status = (orderData.status && validStatuses.includes(orderData.status) ? orderData.status : 'pending')
    if (!validStatuses.includes(status)) {
      console.error('❌ [VALIDAÇÃO] Status inválido:', status)
      throw new Error(`Status deve ser um dos seguintes: ${validStatuses.join(', ')}`)
    }

    // Validar paymentMethod
    if (!orderData.paymentMethod || typeof orderData.paymentMethod !== 'string') {
      console.error('❌ [VALIDAÇÃO] PaymentMethod inválido:', orderData.paymentMethod)
      throw new Error('Método de pagamento é obrigatório')
    }

    try {
      setSyncing(true)
      console.log('📦 [PROCESSO] Iniciando criação do pedido...')

      // 🎯 MONTAGEM CUIDADOSA DOS DADOS PARA POCKETBASE
        const pocketBaseData: any = {
          userId: user.id,
          items: orderData.items.map(item => ({
            id: String(item.id),
            name: String(item.name),
            price: Number(item.price),
            quantity: Number(item.quantity)
          })),
          total: Number(orderData.total),
          status: status,
          paymentMethod: String(orderData.paymentMethod)
        }

        // ✅ Adicionar campos opcionais apenas se existirem e forem válidos
        if (orderData.pixCode && typeof orderData.pixCode === 'string' && orderData.pixCode.trim()) {
          pocketBaseData.pixCode = orderData.pixCode.trim()
        }
        
        if (orderData.pickupCode && typeof orderData.pickupCode === 'string' && orderData.pickupCode.trim()) {
          pocketBaseData.pickupCode = orderData.pickupCode.trim()
        }

        console.log('📦 [ENVIO] Dados finais para PocketBase:', JSON.stringify(pocketBaseData, null, 2))

        // 🚀 ENVIAR PARA POCKETBASE via SDK
        const newOrder = await pb.collection('orders').create(pocketBaseData)
        console.log('✅ [SUCESSO] Pedido criado no PocketBase:', newOrder.id, newOrder)
        
        // 🔄 Recarregar pedidos
        await loadOrders()
        return newOrder
    } catch (error) {
      console.error('❌ [ERRO GERAL] Falha ao criar pedido:', error)
      
      // Log detalhado do erro para debug
      if (error instanceof Error) {
        console.error('❌ [ERRO DETALHADO] Nome:', error.name)
        console.error('❌ [ERRO DETALHADO] Mensagem:', error.message)
        console.error('❌ [ERRO DETALHADO] Stack:', error.stack)
      }
      
      // Log específico para erros de autenticação
      if (error && typeof error === 'object' && 'status' in error) {
        const statusError = error as any
        if (statusError.status === 401) {
          console.error('❌ [ERRO AUTH] Usuário não autenticado ou token inválido')
          console.error('❌ [ERRO AUTH] Verifique se o usuário está logado')
        } else if (statusError.status === 403) {
          console.error('❌ [ERRO PERMISSÃO] Usuário não tem permissão para criar pedidos')
          console.error('❌ [ERRO PERMISSÃO] Verifique as regras de acesso no PocketBase')
        } else if (statusError.status === 400) {
          console.error('❌ [ERRO VALIDAÇÃO] Dados inválidos enviados')
          console.error('❌ [ERRO VALIDAÇÃO] Verifique o schema da collection orders')
        }
      }
      
      throw error
    } finally {
      setSyncing(false)
    }
  }

  // Atualizar status do pedido
  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      setSyncing(true)
      console.log('📦 Atualizando status do pedido...')

      // Atualizar no PocketBase via SDK
      await pb.collection('orders').update(orderId, { status })
      console.log('✅ Status atualizado no PocketBase')
      
      // Recarregar pedidos
      await loadOrders()
    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error)
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

  // Configurar sincronização automática
  useEffect(() => {
    loadOrders()
    
    // Sincronizar a cada 30 segundos
    const interval = setInterval(() => {
      console.log('🔄 Sincronização automática...')
      loadOrders()
    }, 30000)

    return () => {
      clearInterval(interval)
      // Cancelar requisição pendente ao desmontar
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [user])

  return {
    orders,
    loading,
    syncing,
    createOrder,
    updateOrderStatus,
    getOrderById,
    getOrdersByStatus,
    getOrderStats,
    refreshOrders: loadOrders,
    backend: 'pocketbase' as const
  }
}
