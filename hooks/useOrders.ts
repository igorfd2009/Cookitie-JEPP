import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  total: number
}

interface Order {
  id: string
  user_id: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  payment_method: string
  pickup_code?: string
  created_at: string
  updated_at: string
}

interface CreateOrderData {
  items: OrderItem[]
  total: number
  payment_method: string
  pickup_code?: string
}

export const useOrders = () => {
  const { user, profile, isAuthenticated } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ✅ CORREÇÃO: Buscar pedidos do Supabase em vez de apenas localStorage
  const loadOrders = useCallback(async () => {
    if (!user) {
      setOrders([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (import.meta.env.DEV) console.log('🔄 Carregando pedidos para usuário:', user.id)

      if (supabase) {
        // ✅ CORREÇÃO: Buscar pedidos do Supabase
        const { data: supabaseOrders, error: supabaseError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (supabaseError) {
          console.error('❌ Erro ao buscar pedidos do Supabase:', supabaseError)
          setError('Erro ao carregar pedidos do servidor')
          return
        }

        if (supabaseOrders) {
          // ✅ CORREÇÃO: Salvar no localStorage para modo offline
          localStorage.setItem(`user_orders_${user.id}`, JSON.stringify(supabaseOrders))
          setOrders(supabaseOrders)
          
          if (import.meta.env.DEV) console.log('✅ Pedidos carregados do Supabase:', supabaseOrders.length)
        } else {
          setOrders([])
        }
      } else {
        // ✅ CORREÇÃO: Modo offline - carregar do localStorage
        if (import.meta.env.DEV) console.log('📱 Modo offline - carregando do localStorage')
        
        const userSpecificOrders = JSON.parse(localStorage.getItem(`user_orders_${user.id}`) || '[]')
        const generalOrders = JSON.parse(localStorage.getItem('user_orders') || '[]')
        
        // Filtrar pedidos do usuário atual
        const userOrders = generalOrders.filter((order: any) => 
          order.customer?.email === profile?.email || order.customer?.id === user.id
        )
        
        // Mesclar pedidos únicos
        const allUserOrders = [...userOrders, ...userSpecificOrders]
        const uniqueOrders = allUserOrders.filter((order, index, self) =>
          index === self.findIndex(o => o.id === order.id)
        )
        
        // Ordenar por data de criação
        const sortedOrders = uniqueOrders.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        
        setOrders(sortedOrders)
        
        if (import.meta.env.DEV) console.log('✅ Pedidos carregados offline:', sortedOrders.length)
      }
    } catch (error) {
      console.error('❌ Erro ao carregar pedidos:', error)
      setError('Erro interno ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }, [user, profile])

  // ✅ CORREÇÃO: Função createOrder que salva no servidor
  const createOrder = useCallback(async (orderData: CreateOrderData): Promise<{ success: boolean; order?: Order; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' }
    }

    try {
      if (import.meta.env.DEV) console.log('🚀 Criando novo pedido para usuário:', user.id)

      const newOrder: Omit<Order, 'id' | 'created_at' | 'updated_at'> = {
        user_id: user.id,
        items: orderData.items,
        total: orderData.total,
        status: 'pending',
        payment_method: orderData.payment_method,
        pickup_code: orderData.pickup_code
      }

      if (supabase) {
        // ✅ CORREÇÃO: Salvar no Supabase
        if (import.meta.env.DEV) console.log('🌐 Salvando pedido no Supabase...')
        
        const { data, error: supabaseError } = await supabase
          .from('orders')
          .insert([newOrder])
          .select()
          .single()

        if (supabaseError) {
          console.error('❌ Erro ao salvar pedido no Supabase:', supabaseError)
          return { success: false, error: 'Erro ao salvar pedido no servidor' }
        }

        if (data) {
          // ✅ CORREÇÃO: Sincronizar com localStorage
          const updatedOrders = [data, ...orders]
          setOrders(updatedOrders)
          localStorage.setItem(`user_orders_${user.id}`, JSON.stringify(updatedOrders))
          
          if (import.meta.env.DEV) console.log('✅ Pedido criado no Supabase:', data.id)
          return { success: true, order: data }
        }
      } else {
        // ✅ CORREÇÃO: Modo offline - salvar no localStorage
        if (import.meta.env.DEV) console.log('📱 Modo offline - salvando no localStorage')
        
        const offlineOrder: Order = {
          ...newOrder,
          id: `offline_${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        // Salvar no localStorage específico do usuário
        const userSpecificOrders = JSON.parse(localStorage.getItem(`user_orders_${user.id}`) || '[]')
        userSpecificOrders.unshift(offlineOrder)
        localStorage.setItem(`user_orders_${user.id}`, JSON.stringify(userSpecificOrders))

        // Salvar também no localStorage geral para compatibilidade
        const generalOrders = JSON.parse(localStorage.getItem('user_orders') || '[]')
        const orderWithCustomer = {
          ...offlineOrder,
          customer: {
            id: user.id,
            email: profile?.email || user.email,
            name: profile?.name || 'Usuário'
          }
        }
        generalOrders.unshift(orderWithCustomer)
        localStorage.setItem('user_orders', JSON.stringify(generalOrders))

        // Salvar no localStorage de admin para compatibilidade
        const adminOrders = JSON.parse(localStorage.getItem('admin_orders') || '[]')
        adminOrders.unshift(orderWithCustomer)
        localStorage.setItem('admin_orders', JSON.stringify(adminOrders))

        // Atualizar estado local
        setOrders([offlineOrder, ...orders])
        
        if (import.meta.env.DEV) console.log('✅ Pedido criado offline:', offlineOrder.id)
        return { success: true, order: offlineOrder }
      }

      return { success: false, error: 'Erro desconhecido ao criar pedido' }
    } catch (error) {
      console.error('❌ Erro ao criar pedido:', error)
      return { success: false, error: 'Erro interno ao criar pedido' }
    }
  }, [user, profile, orders])

  // ✅ CORREÇÃO: Função para sincronizar pedidos entre dispositivos
  const syncOrders = useCallback(async () => {
    if (!user || !supabase) return

    try {
      if (import.meta.env.DEV) console.log('🔄 Sincronizando pedidos para usuário:', user.id)

      // Buscar pedidos mais recentes do Supabase
      const { data: supabaseOrders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Erro ao sincronizar pedidos:', error)
        return
      }

      if (supabaseOrders) {
        // Atualizar estado e localStorage
        setOrders(supabaseOrders)
        localStorage.setItem(`user_orders_${user.id}`, JSON.stringify(supabaseOrders))
        
        if (import.meta.env.DEV) console.log('✅ Pedidos sincronizados:', supabaseOrders.length)
      }
    } catch (error) {
      console.error('❌ Erro ao sincronizar pedidos:', error)
    }
  }, [user])

  // ✅ CORREÇÃO: Função para atualizar status do pedido
  const updateOrderStatus = useCallback(async (orderId: string, status: Order['status']): Promise<boolean> => {
    if (!user) return false

    try {
      if (import.meta.env.DEV) console.log('🔄 Atualizando status do pedido:', orderId, 'para:', status)

      if (supabase) {
        // Atualizar no Supabase
        const { error } = await supabase
          .from('orders')
          .update({ 
            status, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', orderId)
          .eq('user_id', user.id)

        if (error) {
          console.error('❌ Erro ao atualizar status no Supabase:', error)
          return false
        }

        // Atualizar estado local
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status, updated_at: new Date().toISOString() }
              : order
          )
        )

        if (import.meta.env.DEV) console.log('✅ Status atualizado no Supabase')
        return true
      } else {
        // Modo offline - atualizar localStorage
        const userSpecificOrders = JSON.parse(localStorage.getItem(`user_orders_${user.id}`) || '[]')
        const orderIndex = userSpecificOrders.findIndex((order: Order) => order.id === orderId)
        
        if (orderIndex !== -1) {
          userSpecificOrders[orderIndex].status = status
          userSpecificOrders[orderIndex].updated_at = new Date().toISOString()
          localStorage.setItem(`user_orders_${user.id}`, JSON.stringify(userSpecificOrders))

          // Atualizar estado local
          setOrders(prevOrders => 
            prevOrders.map(order => 
              order.id === orderId 
                ? { ...order, status, updated_at: new Date().toISOString() }
                : order
            )
          )

          if (import.meta.env.DEV) console.log('✅ Status atualizado offline')
          return true
        }
      }

      return false
    } catch (error) {
      console.error('❌ Erro ao atualizar status do pedido:', error)
      return false
    }
  }, [user])

  // ✅ CORREÇÃO: Carregar pedidos quando usuário mudar
  useEffect(() => {
    if (isAuthenticated && user) {
      loadOrders()
    } else {
      setOrders([])
    }
  }, [isAuthenticated, user, loadOrders])

  // ✅ CORREÇÃO: Sincronizar pedidos periodicamente (a cada 30 segundos)
  useEffect(() => {
    if (!isAuthenticated || !user || !supabase) return

    const interval = setInterval(() => {
      syncOrders()
    }, 30000) // 30 segundos

    return () => clearInterval(interval)
  }, [isAuthenticated, user, syncOrders])

  return {
    orders,
    loading,
    error,
    loadOrders,
    createOrder,
    updateOrderStatus,
    syncOrders
  }
}
