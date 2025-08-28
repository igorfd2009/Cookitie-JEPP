import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface UserProfile {
  id: string
  email: string
  name?: string
  phone?: string
  avatar_url?: string
  created_at: string
  updated_at: string
  total_pedidos?: number
  total_gasto?: number
  primeiro_pedido?: boolean
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, profile: Partial<UserProfile>) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // ✅ CORREÇÃO: Função para recarregar dados do usuário
  const refreshUser = async () => {
    if (!user) return

    try {
      if (import.meta.env.DEV) console.log('🔄 Recarregando dados do usuário:', user.id)
      
      if (supabase) {
        // Buscar perfil atualizado do Supabase
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('❌ Erro ao buscar perfil atualizado:', error)
          return
        }

        if (data) {
          setProfile(data)
          if (import.meta.env.DEV) console.log('✅ Perfil atualizado:', data)
        }
      } else {
        // Modo offline - buscar do localStorage
        const allUsers = JSON.parse(localStorage.getItem('offline_users') || '[]')
        const currentUser = allUsers.find((u: any) => u.id === user.id)
        
        if (currentUser) {
          setProfile(currentUser)
          if (import.meta.env.DEV) console.log('✅ Perfil offline atualizado:', currentUser)
        }
      }
    } catch (error) {
      console.error('❌ Erro ao recarregar usuário:', error)
    }
  }

  // ✅ CORREÇÃO: Função para sincronizar pedidos do usuário
  const syncUserOrders = async (userId: string, userEmail: string) => {
    try {
      if (import.meta.env.DEV) console.log('🔄 Sincronizando pedidos para usuário:', userEmail)
      
      if (supabase) {
        // Buscar pedidos do Supabase
        const { data: supabaseOrders, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('❌ Erro ao buscar pedidos do Supabase:', error)
          return []
        }

        // Salvar no localStorage para modo offline
        if (supabaseOrders) {
          localStorage.setItem(`user_orders_${userId}`, JSON.stringify(supabaseOrders))
          if (import.meta.env.DEV) console.log('✅ Pedidos sincronizados do Supabase:', supabaseOrders.length)
        }

        return supabaseOrders || []
      } else {
        // Modo offline - sincronizar localStorage
        const allOrders = JSON.parse(localStorage.getItem('user_orders') || '[]')
        const userOrders = allOrders.filter((order: any) => 
          order.customer?.email === userEmail || order.customer?.id === userId
        )
        
        const userSpecificOrders = JSON.parse(localStorage.getItem(`user_orders_${userId}`) || '[]')
        const allUserOrders = [...userOrders, ...userSpecificOrders]
        
        // Remover duplicatas
        const uniqueOrders = allUserOrders.filter((order, index, self) =>
          index === self.findIndex(o => o.id === order.id)
        )
        
        localStorage.setItem(`user_orders_${userId}`, JSON.stringify(uniqueOrders))
        if (import.meta.env.DEV) console.log('✅ Pedidos sincronizados offline:', uniqueOrders.length)
        
        return uniqueOrders
      }
    } catch (error) {
      console.error('❌ Erro ao sincronizar pedidos:', error)
      return []
    }
  }

  // ✅ CORREÇÃO: Validar unicidade de email (local + remoto)
  const validateEmailUniqueness = async (email: string) => {
    try {
      if (import.meta.env.DEV) console.log('🔍 Validando unicidade do email:', email)
      
      // Verificar em usuários offline locais
      const localUsers = JSON.parse(localStorage.getItem('offline_users') || '[]')
      const localExists = localUsers.find((u: any) => u.email === email)
      
      if (localExists) {
        if (import.meta.env.DEV) console.log('❌ Email já existe localmente')
        return { exists: true, source: 'local' }
      }
      
      // Se Supabase disponível, verificar também lá
      if (supabase) {
        if (import.meta.env.DEV) console.log('🌐 Verificando no Supabase...')
        const { data, error } = await supabase
          .from('profiles')
          .select('email')
          .eq('email', email)
          .single()
          
        if (data && !error) {
          if (import.meta.env.DEV) console.log('❌ Email já existe no Supabase')
          return { exists: true, source: 'supabase' }
        }
      }
      
      if (import.meta.env.DEV) console.log('✅ Email é único, pode prosseguir')
      return { exists: false, source: null }
    } catch (error) {
      console.error('❌ Erro ao validar unicidade do email:', error)
      return { exists: false, source: null }
    }
  }

  useEffect(() => {
    if (import.meta.env.DEV) console.log('🔄 AuthContext useEffect iniciado')
    
    // Obter sessão inicial
    const getInitialSession = async () => {
      if (!supabase) {
        if (import.meta.env.DEV) console.log('📱 Modo offline - verificando localStorage')
        
        try {
          const savedUser = localStorage.getItem('offline_current_user')
          if (import.meta.env.DEV) console.log('💾 Usuário salvo:', savedUser ? 'encontrado' : 'não encontrado')
          
          if (savedUser) {
            const user = JSON.parse(savedUser)
            
            // ✅ CORREÇÃO: Revalidar dados do usuário do localStorage
            const allUsers = JSON.parse(localStorage.getItem('offline_users') || '[]')
            const currentUser = allUsers.find((u: any) => u.id === user.id)
            
            if (currentUser) {
              // Usar dados mais recentes do usuário
              const revalidatedUser = {
                ...currentUser,
                last_session: new Date().toISOString()
              }
              
              setUser(revalidatedUser as any)
              setProfile(revalidatedUser)
              setSession({ user: revalidatedUser } as any)
              localStorage.setItem('offline_current_user', JSON.stringify(revalidatedUser))
              
              // ✅ CORREÇÃO: Sincronizar pedidos na inicialização
              await syncUserOrders(revalidatedUser.id, revalidatedUser.email)
              
              if (import.meta.env.DEV) console.log('✅ Usuário offline revalidado:', revalidatedUser.email, revalidatedUser.name)
            } else {
              // Usuário não encontrado, limpar sessão
              localStorage.removeItem('offline_current_user')
              if (import.meta.env.DEV) console.log('🧹 Sessão offline inválida removida')
            }
          }
        } catch (error) {
          console.error('❌ Erro ao carregar usuário offline:', error)
          localStorage.removeItem('offline_current_user')
        } finally {
          if (import.meta.env.DEV) console.log('🏁 Finalizando loading (offline)')
          setLoading(false)
        }
        return
      }

      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        }
      } catch (error) {
        console.error('❌ Erro ao obter sessão inicial:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // ✅ CORREÇÃO: Listener para mudanças de autenticação
    let subscription = null
    if (supabase) {
      const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (import.meta.env.DEV) console.log('🔄 Mudança de estado de autenticação:', _event)
          
          setSession(session)
          setUser(session?.user ?? null)
          
          if (session?.user) {
            await fetchUserProfile(session.user.id)
          } else {
            setProfile(null)
          }
          setLoading(false)
        }
      )
      subscription = authSubscription
    }

    return () => subscription?.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    if (!supabase) return

    try {
      if (import.meta.env.DEV) console.log('🔍 Buscando perfil do usuário:', userId)
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('❌ Erro ao buscar perfil:', error)
        return
      }

      if (data) {
        setProfile(data)
        if (import.meta.env.DEV) console.log('✅ Perfil carregado:', data)
      }
    } catch (error) {
      console.error('❌ Erro ao buscar perfil:', error)
    }
  }

  const signUp = async (email: string, password: string, profileData: Partial<UserProfile>) => {
    if (!supabase) {
      // Modo offline - simular cadastro com localStorage
      try {
        if (import.meta.env.DEV) console.log('🚀 Iniciando cadastro offline para:', email)
        
        // Validação básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          if (import.meta.env.DEV) console.log('❌ Email inválido:', email)
          return { error: { message: 'Email inválido' } as AuthError }
        }
        if (import.meta.env.DEV) console.log('✅ Email válido')

        // Validação de senha
        if (!password || password.length < 6) {
          if (import.meta.env.DEV) console.log('❌ Senha inválida:', password)
          return { error: { message: 'Senha deve ter pelo menos 6 caracteres' } as AuthError }
        }
        if (import.meta.env.DEV) console.log('✅ Senha válida')

        // ✅ CORREÇÃO: Validar unicidade de email (local + remoto)
        if (import.meta.env.DEV) console.log('🔍 Verificando unicidade do email...')
        const uniqueCheck = await validateEmailUniqueness(email)
        if (import.meta.env.DEV) console.log('📊 Resultado da validação:', uniqueCheck)
        
        if (uniqueCheck.exists) {
          if (import.meta.env.DEV) console.log('❌ Email já existe:', uniqueCheck.source)
          return { error: { message: `Email já cadastrado ${uniqueCheck.source === 'local' ? 'neste dispositivo' : 'no sistema'}. Faça login ao invés de criar nova conta.` } as AuthError }
        }
        if (import.meta.env.DEV) console.log('✅ Email é único, prosseguindo...')

        if (import.meta.env.DEV) console.log('📦 Carregando usuários existentes...')
        const existingUsers = JSON.parse(localStorage.getItem('offline_users') || '[]')
        if (import.meta.env.DEV) console.log('📊 Usuários existentes:', existingUsers.length)
        
        // Criar usuário offline
        if (import.meta.env.DEV) console.log('👤 Criando novo usuário...')
        const newUser = {
          id: `offline_${Date.now()}`,
          email,
          name: profileData.name,
          phone: profileData.phone,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          total_pedidos: 0,
          total_gasto: 0,
          primeiro_pedido: true
        }
        if (import.meta.env.DEV) console.log('👤 Usuário criado:', newUser)
        
        if (import.meta.env.DEV) console.log('💾 Salvando no localStorage...')
        existingUsers.push(newUser)
        localStorage.setItem('offline_users', JSON.stringify(existingUsers))
        localStorage.setItem('offline_current_user', JSON.stringify(newUser))
        if (import.meta.env.DEV) console.log('✅ localStorage atualizado')
        
        // Simular sessão
        if (import.meta.env.DEV) console.log('🔄 Atualizando estado da aplicação...')
        setUser(newUser as any)
        setProfile(newUser)
        setSession({ user: newUser } as any)
        if (import.meta.env.DEV) console.log('✅ Estado atualizado')
        
        if (import.meta.env.DEV) console.log('🎉 Cadastro concluído com sucesso!')
        return { error: null }
      } catch (error) {
        console.error('❌ Erro no cadastro offline:', error)
        return { error: { message: 'Erro ao criar conta offline' } as AuthError }
      }
    }

    try {
      if (import.meta.env.DEV) console.log('🚀 Iniciando cadastro no Supabase para:', email)
      
      // ✅ CORREÇÃO: Validar unicidade de email antes de criar
      const uniqueCheck = await validateEmailUniqueness(email)
      if (uniqueCheck.exists) {
        if (import.meta.env.DEV) console.log('❌ Email já existe:', uniqueCheck.source)
        return { error: { message: `Email já cadastrado ${uniqueCheck.source === 'local' ? 'neste dispositivo' : 'no sistema'}. Faça login ao invés de criar nova conta.` } as AuthError }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: profileData.name,
            phone: profileData.phone
          }
        }
      })

      if (error) {
        if (import.meta.env.DEV) console.log('❌ Erro no cadastro Supabase:', error)
        return { error }
      }

      if (data.user) {
        if (import.meta.env.DEV) console.log('✅ Usuário criado no Supabase, criando perfil...')
        
        // ✅ CORREÇÃO: Criar perfil do usuário na tabela profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: data.user.email!,
              name: profileData.name,
              phone: profileData.phone,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])

        if (profileError) {
          console.error('❌ Erro ao criar perfil:', profileError)
          return { error: { message: 'Usuário criado mas erro ao criar perfil' } as AuthError }
        }

        if (import.meta.env.DEV) console.log('✅ Perfil criado com sucesso')
      }

      return { error: null }
    } catch (error) {
      console.error('❌ Erro no cadastro:', error)
      return { error: { message: 'Erro interno no cadastro' } as AuthError }
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      // Modo offline - simular login com localStorage
      try {
        if (import.meta.env.DEV) console.log('🔑 Iniciando login offline para:', email)
        
        // Validação básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          return { error: { message: 'Email inválido' } as AuthError }
        }

        // Validação de senha
        if (!password || password.length < 6) {
          return { error: { message: 'Senha deve ter pelo menos 6 caracteres' } as AuthError }
        }

        const existingUsers = JSON.parse(localStorage.getItem('offline_users') || '[]')
        const user = existingUsers.find((u: any) => u.email === email)
        
        if (!user) {
          return { error: { message: 'Usuário não encontrado. Faça o cadastro primeiro.' } as AuthError }
        }
        
        // ✅ CORREÇÃO: Revalidar e atualizar dados do usuário
        const updatedUser = {
          ...user,
          last_login: new Date().toISOString()
        }
        
        // Atualizar no array de usuários
        const userIndex = existingUsers.findIndex((u: any) => u.email === email)
        if (userIndex !== -1) {
          existingUsers[userIndex] = updatedUser
          localStorage.setItem('offline_users', JSON.stringify(existingUsers))
        }
        
        // ✅ CORREÇÃO: Garantir que profile seja definido corretamente
        setUser(updatedUser as any)
        setProfile(updatedUser)
        setSession({ user: updatedUser } as any)
        localStorage.setItem('offline_current_user', JSON.stringify(updatedUser))
        
        // ✅ CORREÇÃO: Sincronizar pedidos do usuário
        await syncUserOrders(updatedUser.id, updatedUser.email)
        
        if (import.meta.env.DEV) console.log('✅ Login offline realizado:', updatedUser.email, updatedUser.name)
        
        return { error: null }
      } catch (error) {
        console.error('❌ Erro no login offline:', error)
        return { error: { message: 'Erro ao fazer login offline' } as AuthError }
      }
    }

    try {
      if (import.meta.env.DEV) console.log('🔑 Iniciando login no Supabase para:', email)
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        if (import.meta.env.DEV) console.log('❌ Erro no login Supabase:', error)
        return { error }
      }

      if (import.meta.env.DEV) console.log('✅ Login Supabase realizado com sucesso')
      return { error: null }
    } catch (error) {
      console.error('❌ Erro no login:', error)
      return { error: { message: 'Erro interno no login' } as AuthError }
    }
  }

  const signOut = async () => {
    if (!supabase) {
      // ✅ CORREÇÃO: Modo offline - limpar dados específicos do usuário
      try {
        const currentUser = localStorage.getItem('offline_current_user')
        if (currentUser) {
          const user = JSON.parse(currentUser)
          
          // Manter dados do usuário, mas limpar sessão atual
          localStorage.removeItem('offline_current_user')
          
          // Limpar pedidos da sessão atual (mas manter os específicos do usuário)
          // Os pedidos específicos ficam em `user_orders_${user.id}`
          
          if (import.meta.env.DEV) console.log('🚪 Logout offline realizado para:', user.email)
        }
        
        // Limpar estados
        setUser(null)
        setProfile(null)
        setSession(null)
        
        return
      } catch (error) {
        console.error('❌ Erro ao fazer logout offline:', error)
        // Forçar limpeza em caso de erro
        localStorage.removeItem('offline_current_user')
        setUser(null)
        setProfile(null)
        setSession(null)
      }
    }

    try {
      await supabase.auth.signOut()
      if (import.meta.env.DEV) console.log('🚪 Logout Supabase realizado')
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { error: { message: 'Usuário não autenticado' } as AuthError }
    }
    
    if (!supabase) {
      // Modo offline - atualizar localStorage
      try {
        const existingUsers = JSON.parse(localStorage.getItem('offline_users') || '[]')
        const userIndex = existingUsers.findIndex((u: any) => u.id === user.id)
        
        if (userIndex !== -1) {
          existingUsers[userIndex] = { ...existingUsers[userIndex], ...updates, updated_at: new Date().toISOString() }
          localStorage.setItem('offline_users', JSON.stringify(existingUsers))
          localStorage.setItem('offline_current_user', JSON.stringify(existingUsers[userIndex]))
          
          // Atualizar estado local
          setProfile(existingUsers[userIndex])
        }
        
        return { error: null }
      } catch (error) {
        return { error: { message: 'Erro ao atualizar perfil offline' } as AuthError }
      }
    }
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) return { error: { message: error.message, status: 500 } as AuthError }

      // ✅ CORREÇÃO: Atualizar estado local e recarregar dados
      if (profile) {
        setProfile({ ...profile, ...updates })
      }
      
      // Recarregar dados do usuário para garantir sincronização
      await refreshUser()

      return { error: null }
    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error)
      return { error: { message: 'Erro interno ao atualizar perfil' } as AuthError }
    }
  }

  const resetPassword = async (email: string) => {
    if (!supabase) {
      // Modo offline - simular reset de senha
      try {
        // Validação básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          return { error: { message: 'Email inválido' } as AuthError }
        }

        const existingUsers = JSON.parse(localStorage.getItem('offline_users') || '[]')
        const user = existingUsers.find((u: any) => u.email === email)
        
        if (!user) {
          return { error: { message: 'Email não encontrado' } as AuthError }
        }

        // Em modo offline, apenas simular o envio
        console.log('📧 Simulando envio de email de reset para:', email)
        return { error: null }
      } catch (error) {
        return { error: { message: 'Erro ao resetar senha offline' } as AuthError }
      }
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      return { error }
    } catch (error) {
      console.error('❌ Erro ao resetar senha:', error)
      return { error: { message: 'Erro interno ao resetar senha' } as AuthError }
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
    refreshUser,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
