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
  created: string
  updated?: string
}

const POCKETBASE_URL = 'http://localhost:8090'

export const usePocketBaseOrders = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  // Verificar se PocketBase está disponível
  const isPocketBaseAvailable = async () => {
    try {
      const response = await fetch(`${POCKETBASE_URL}/api/health`)
      return response.ok
    } catch {
      return false
    }
  }

  // Carregar pedidos do PocketBase
  const loadOrders = async () => {
    if (!user) {
      setOrders([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      console.log('📦 Carregando pedidos do PocketBase...')

      const available = await isPocketBaseAvailable()
      if (!available) {
        console.log('❌ PocketBase não disponível, usando localStorage')
        loadFromLocalStorage()
        return
      }

      const response = await fetch(
        `${POCKETBASE_URL}/api/collections/orders/records?filter=(userId='${user.id}')&sort=-created`
      )

      if (!response.ok) {
        throw new Error('Erro ao carregar pedidos')
      }

      const data = await response.json()
      const pocketBaseOrders = data.items || []

      // Converter formato PocketBase para formato local
      const convertedOrders: Order[] = pocketBaseOrders.map((order: any) => ({
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

      setOrders(convertedOrders)
      console.log('✅ Pedidos carregados do PocketBase:', convertedOrders.length)

      // Sincronizar com localStorage
      syncToLocalStorage(convertedOrders)
    } catch (error) {
      console.error('❌ Erro ao carregar do PocketBase:', error)
      loadFromLocalStorage()
    } finally {
      setLoading(false)
    }
  }

  // Fallback para localStorage
  const loadFromLocalStorage = () => {
    try {
      const allOrders = JSON.parse(localStorage.getItem('cookitie_orders') || '[]')
      const userOrders = allOrders.filter((order: Order) => order.userId === user?.id)
      setOrders(userOrders)
      console.log('✅ Pedidos carregados do localStorage:', userOrders.length)
    } catch (error) {
      console.error('❌ Erro ao carregar do localStorage:', error)
      setOrders([])
    }
  }

  // Sincronizar com localStorage
  const syncToLocalStorage = (ordersToSync: Order[]) => {
    try {
      const allOrders = JSON.parse(localStorage.getItem('cookitie_orders') || '[]')
      const otherUsersOrders = allOrders.filter((order: Order) => order.userId !== user?.id)
      const updatedOrders = [...otherUsersOrders, ...ordersToSync]
      localStorage.setItem('cookitie_orders', JSON.stringify(updatedOrders))
      console.log('✅ Pedidos sincronizados com localStorage')
    } catch (error) {
      console.error('❌ Erro ao sincronizar com localStorage:', error)
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

      const available = await isPocketBaseAvailable()
      console.log('📦 [CONEXÃO] PocketBase disponível:', available)
      
      if (available) {
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

        // 🚀 ENVIAR PARA POCKETBASE
        const response = await fetch(`${POCKETBASE_URL}/api/collections/orders/records`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pocketBaseData)
        })

        console.log('📦 [RESPOSTA] Status HTTP:', response.status, response.statusText)

        if (!response.ok) {
          let errorData: any
          try {
            const errorText = await response.text()
            console.error('❌ [ERRO] Resposta PocketBase (texto):', errorText)
            
            // Tentar parsear como JSON para detalhes do erro
            try {
              errorData = JSON.parse(errorText)
              console.error('❌ [ERRO] Detalhes do erro:', JSON.stringify(errorData, null, 2))
            } catch {
              errorData = { message: errorText }
            }
          } catch (readError) {
            console.error('❌ [ERRO] Não foi possível ler resposta de erro:', readError)
            errorData = { message: 'Erro desconhecido do servidor' }
          }

          // Mensagem de erro mais detalhada
          let errorMessage = `Erro ${response.status} no PocketBase`
          if (errorData.data) {
            const fieldErrors = Object.entries(errorData.data).map(([field, error]) => 
              `${field}: ${typeof error === 'object' ? JSON.stringify(error) : error}`
            ).join(', ')
            errorMessage += ` - Campos: ${fieldErrors}`
          } else if (errorData.message) {
            errorMessage += ` - ${errorData.message}`
          }

          throw new Error(errorMessage)
        }

        const newOrder = await response.json()
        console.log('✅ [SUCESSO] Pedido criado no PocketBase:', newOrder.id, newOrder)
        
        // 🔄 Recarregar pedidos
        await loadOrders()
        return newOrder
      } else {
        // 💾 FALLBACK: CRIAR NO LOCALSTORAGE
        console.log('📦 [FALLBACK] Criando pedido no localStorage...')
        
        const newOrder: Order = {
          ...orderData,
          id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: user.id,
          created: new Date().toISOString(),
          status: status as Order['status'] // Cast para tipo correto
        }

        const allOrders = JSON.parse(localStorage.getItem('cookitie_orders') || '[]')
        allOrders.push(newOrder)
        localStorage.setItem('cookitie_orders', JSON.stringify(allOrders))
        
        setOrders(prev => [newOrder, ...prev])
        console.log('✅ [SUCESSO] Pedido criado no localStorage:', newOrder.id)
        return newOrder
      }
    } catch (error) {
      console.error('❌ [ERRO GERAL] Falha ao criar pedido:', error)
      
      // Log detalhado do erro para debug
      if (error instanceof Error) {
        console.error('❌ [ERRO DETALHADO] Nome:', error.name)
        console.error('❌ [ERRO DETALHADO] Mensagem:', error.message)
        console.error('❌ [ERRO DETALHADO] Stack:', error.stack)
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

      const available = await isPocketBaseAvailable()
      
      if (available) {
        // Atualizar no PocketBase
        const response = await fetch(`${POCKETBASE_URL}/api/collections/orders/records/${orderId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status })
        })

        if (!response.ok) {
          throw new Error('Erro ao atualizar status no PocketBase')
        }

        console.log('✅ Status atualizado no PocketBase')
        
        // Recarregar pedidos
        await loadOrders()
      } else {
        // Atualizar no localStorage
        const allOrders = JSON.parse(localStorage.getItem('cookitie_orders') || '[]')
        const updatedOrders = allOrders.map((order: Order) => 
          order.id === orderId 
            ? { ...order, status, updated: new Date().toISOString() }
            : order
        )
        
        localStorage.setItem('cookitie_orders', JSON.stringify(updatedOrders))
        setOrders(prev => prev.map(order => 
          order.id === orderId 
            ? { ...order, status, updated: new Date().toISOString() }
            : order
        ))
        console.log('✅ Status atualizado no localStorage')
      }
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

    return () => clearInterval(interval)
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
