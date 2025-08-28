import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface UserProfile {
  id: string
  email: string
  full_name?: string
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

  useEffect(() => {
    if (import.meta.env.DEV) console.log('🔄 AuthContext useEffect iniciado')
    // Obter sessão inicial
    const getInitialSession = async () => {
      if (!supabase) {
        if (import.meta.env.DEV) console.log('📱 Modo offline - verificando localStorage')
        // Modo offline - verificar localStorage
        try {
          const savedUser = localStorage.getItem('offline_current_user')
          if (import.meta.env.DEV) console.log('💾 Usuário salvo:', savedUser ? 'encontrado' : 'não encontrado')
          if (savedUser) {
            const user = JSON.parse(savedUser)
            
            // CORREÇÃO: Revalidar dados do usuário do localStorage
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
              
              // CORREÇÃO: Sincronizar pedidos na inicialização
              await syncUserOrders(revalidatedUser.id, revalidatedUser.email)
              
              if (import.meta.env.DEV) console.log('✅ Usuário offline revalidado:', revalidatedUser.email, revalidatedUser.full_name)
            } else {
              // Usuário não encontrado, limpar sessão
              localStorage.removeItem('offline_current_user')
              if (import.meta.env.DEV) console.log('🧹 Sessão offline inválida removida')
            }
          }
        } catch (error) {
          console.error('❌ Erro ao carregar usuário offline:', error)
          // Limpar dados corrompidos
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
        console.error('Erro ao obter sessão inicial:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Escutar mudanças de autenticação (apenas se Supabase estiver disponível)
    let subscription = null
    if (supabase) {
      const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
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
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Erro ao buscar perfil:', error)
        return
      }

      setProfile(data)
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
    }
  }

  // CORREÇÃO: Função para sincronizar pedidos do usuário
  const syncUserOrders = async (userId: string, userEmail: string) => {
    try {
      // Carregar pedidos existentes
      const allOrders = JSON.parse(localStorage.getItem('user_orders') || '[]')
      
      // Filtrar pedidos do usuário atual
      const userOrders = allOrders.filter((order: any) => 
        order.customer.email === userEmail || order.customer.id === userId
      )
      
      // Carregar pedidos específicos do usuário
      const userSpecificOrders = JSON.parse(localStorage.getItem(`user_orders_${userId}`) || '[]')
      
      // Mesclar pedidos únicos
      const allUserOrders = [...userOrders, ...userSpecificOrders]
      const uniqueOrders = allUserOrders.filter((order, index, self) =>
        index === self.findIndex(o => o.id === order.id)
      )
      
      // Salvar pedidos sincronizados
      localStorage.setItem(`user_orders_${userId}`, JSON.stringify(uniqueOrders))
      localStorage.setItem('user_orders', JSON.stringify(uniqueOrders))
      
      if (import.meta.env.DEV) console.log('🔄 Pedidos sincronizados para usuário:', userEmail, uniqueOrders.length)
      
      return uniqueOrders
    } catch (error) {
      console.error('Erro ao sincronizar pedidos:', error)
      return []
    }
  }

  // CORREÇÃO: Validar unicidade de email em todos os dispositivos
  const validateEmailUniqueness = async (email: string) => {
    try {
      // Verificar em usuários offline locais
      const localUsers = JSON.parse(localStorage.getItem('offline_users') || '[]')
      const localExists = localUsers.find((u: any) => u.email === email)
      
      if (localExists) {
        return { exists: true, source: 'local' }
      }
      
      // Se Supabase disponível, verificar também lá
      if (supabase) {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('email')
          .eq('email', email)
          .single()
          
        if (data && !error) {
          return { exists: true, source: 'supabase' }
        }
      }
      
      return { exists: false, source: null }
    } catch (error) {
      console.error('Erro ao validar unicidade do email:', error)
      return { exists: false, source: null }
    }
  }

  const signUp = async (email: string, password: string, profileData: Partial<UserProfile>) => {
    if (!supabase) {
      // Modo offline - simular cadastro com localStorage
      try {
        // Validação básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          return { error: { message: 'Email inválido' } as AuthError }
        }

        // Validação de senha
        if (!password || password.length < 6) {
          return { error: { message: 'Senha deve ter pelo menos 6 caracteres' } as AuthError }
        }

        // CORREÇÃO: Validar unicidade de email (local + remoto)
        const uniqueCheck = await validateEmailUniqueness(email)
        if (uniqueCheck.exists) {
          return { error: { message: `Email já cadastrado ${uniqueCheck.source === 'local' ? 'neste dispositivo' : 'no sistema'}. Faça login ao invés de criar nova conta.` } as AuthError }
        }

        const existingUsers = JSON.parse(localStorage.getItem('offline_users') || '[]')
        
        // Criar usuário offline
        const newUser = {
          id: `offline_${Date.now()}`,
          email,
          full_name: profileData.full_name,
          phone: profileData.phone,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          total_pedidos: 0,
          total_gasto: 0,
          primeiro_pedido: true
        }
        
        existingUsers.push(newUser)
        localStorage.setItem('offline_users', JSON.stringify(existingUsers))
        localStorage.setItem('offline_current_user', JSON.stringify(newUser))
        
        // Simular sessão
        setUser(newUser as any)
        setProfile(newUser)
        setSession({ user: newUser } as any)
        
        return { error: null }
      } catch (error) {
        console.error('Erro no cadastro offline:', error)
        return { error: { message: 'Erro ao criar conta offline' } as AuthError }
      }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: profileData.full_name,
            phone: profileData.phone
          }
        }
      })

      if (error) return { error }

      if (data.user) {
        // Criar perfil do usuário
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([
            {
              id: data.user.id,
              email: data.user.email!,
              full_name: profileData.full_name,
              phone: profileData.phone,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError)
        }
      }

      return { error: null }
    } catch (error) {
      console.error('Erro no cadastro:', error)
      return { error: { message: 'Erro interno no cadastro' } as AuthError }
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      // Modo offline - simular login com localStorage
      try {
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
        
        // CORREÇÃO: Revalidar e atualizar dados do usuário
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
        
        // CORREÇÃO: Garantir que profile seja definido corretamente
        setUser(updatedUser as any)
        setProfile(updatedUser)
        setSession({ user: updatedUser } as any)
        localStorage.setItem('offline_current_user', JSON.stringify(updatedUser))
        
        // CORREÇÃO: Sincronizar pedidos do usuário
        await syncUserOrders(updatedUser.id, updatedUser.email)
        
        if (import.meta.env.DEV) console.log('✅ Login offline realizado:', updatedUser.email, updatedUser.full_name)
        
        return { error: null }
      } catch (error) {
        console.error('Erro no login offline:', error)
        return { error: { message: 'Erro ao fazer login offline' } as AuthError }
      }
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      return { error }
    } catch (error) {
      console.error('Erro no login:', error)
      return { error: { message: 'Erro interno no login' } as AuthError }
    }
  }

  const signOut = async () => {
    if (!supabase) {
      // CORREÇÃO: Modo offline - limpar dados específicos do usuário
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
        console.error('Erro ao fazer logout offline:', error)
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
      console.error('Erro ao fazer logout:', error)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!supabase) {
      // Modo offline - atualizar localStorage
      if (!user) {
        return { error: { message: 'Usuário não autenticado' } as AuthError }
      }
      
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
    
    if (!user) {
      return { error: { message: 'Usuário não autenticado' } as AuthError }
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) return { error: { message: error.message, status: 500 } as AuthError }

      // Atualizar estado local
      if (profile) {
        setProfile({ ...profile, ...updates })
      }

      return { error: null }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
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
      console.error('Erro ao resetar senha:', error)
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
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
