import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

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

export const useOrders = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  // Carregar pedidos do Supabase ou localStorage
  const loadOrders = async () => {
    if (!user) {
      setOrders([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      // Tentar carregar do Supabase primeiro
      if (supabase) {
        console.log('🔄 Carregando pedidos do Supabase...')
        
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('❌ Erro ao carregar do Supabase:', error)
          // Fallback para localStorage
          loadFromLocalStorage()
        } else {
          console.log('✅ Pedidos carregados do Supabase:', data?.length || 0)
          
          // Converter formato do Supabase para formato local
          const convertedOrders = (data || []).map((order: any) => ({
            id: order.id,
            userId: order.user_id,
            items: order.items,
            total: parseFloat(order.total),
            status: order.status,
            paymentMethod: order.payment_method,
            pixCode: order.pix_code,
            pickupCode: order.pickup_code,
            createdAt: order.created_at,
            updatedAt: order.updated_at
          }))
          
          setOrders(convertedOrders)
          
          // Sincronizar com localStorage
          syncToLocalStorage(convertedOrders)
        }
      } else {
        console.log('🔄 Supabase não disponível, carregando do localStorage...')
        loadFromLocalStorage()
      }
    } catch (error) {
      console.error('❌ Erro ao carregar pedidos:', error)
      loadFromLocalStorage()
    } finally {
      setLoading(false)
    }
  }

  // Carregar do localStorage
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
      
      // Remover pedidos antigos do usuário
      const otherUsersOrders = allOrders.filter((order: Order) => order.userId !== user?.id)
      
      // Adicionar pedidos atualizados
      const updatedOrders = [...otherUsersOrders, ...ordersToSync]
      
      localStorage.setItem('cookitie_orders', JSON.stringify(updatedOrders))
      console.log('✅ Pedidos sincronizados com localStorage')
    } catch (error) {
      console.error('❌ Erro ao sincronizar com localStorage:', error)
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
      // Salvar no Supabase se disponível
      if (supabase) {
        console.log('🔄 Salvando pedido no Supabase...')
        
        const { error } = await supabase
          .from('orders')
          .insert({
            id: newOrder.id,
            user_id: newOrder.userId,
            items: newOrder.items,
            total: newOrder.total,
            status: newOrder.status,
            payment_method: newOrder.paymentMethod,
            pix_code: newOrder.pixCode,
            pickup_code: newOrder.pickupCode,
            created_at: newOrder.createdAt
          })

        if (error) {
          console.error('❌ Erro ao salvar no Supabase:', error)
          throw error
        }
        
        console.log('✅ Pedido salvo no Supabase')
      }

      // Salvar no localStorage
      const existingOrders = JSON.parse(localStorage.getItem('cookitie_orders') || '[]')
      existingOrders.push(newOrder)
      localStorage.setItem('cookitie_orders', JSON.stringify(existingOrders))
      
      // Atualizar estado local
      setOrders(prev => [newOrder, ...prev])
      
      console.log('✅ Pedido criado com sucesso:', newOrder.id)
      return newOrder
    } catch (error) {
      console.error('❌ Erro ao criar pedido:', error)
      throw error
    }
  }

  // Atualizar status do pedido
  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      setSyncing(true)
      
      // Atualizar no Supabase se disponível
      if (supabase) {
        console.log('🔄 Atualizando status no Supabase...')
        
        const { error } = await supabase
          .from('orders')
          .update({ 
            status, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', orderId)

        if (error) {
          console.error('❌ Erro ao atualizar no Supabase:', error)
          throw error
        }
        
        console.log('✅ Status atualizado no Supabase')
      }

      // Atualizar no localStorage
      const allOrders = JSON.parse(localStorage.getItem('cookitie_orders') || '[]')
      const updatedOrders = allOrders.map((order: Order) => 
        order.id === orderId 
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      )
      
      localStorage.setItem('cookitie_orders', JSON.stringify(updatedOrders))
      
      // Atualizar estado local
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      ))
      
      console.log('✅ Status atualizado com sucesso')
      return true
    } catch (error) {
      console.error('❌ Erro ao atualizar status do pedido:', error)
      throw error
    } finally {
      setSyncing(false)
    }
  }

  // Sincronizar dados (para uso manual)
  const syncOrders = async () => {
    if (!user) return
    
    try {
      setSyncing(true)
      console.log('🔄 Iniciando sincronização manual...')
      await loadOrders()
      console.log('✅ Sincronização concluída')
    } catch (error) {
      console.error('❌ Erro na sincronização:', error)
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
    
    // Sincronizar a cada 30 segundos se Supabase estiver disponível
    if (supabase && user) {
      const interval = setInterval(() => {
        console.log('🔄 Sincronização automática...')
        loadOrders()
      }, 30000) // 30 segundos

      return () => clearInterval(interval)
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
    syncOrders
  }
}
