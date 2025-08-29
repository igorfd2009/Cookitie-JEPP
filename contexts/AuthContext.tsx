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
  isAuthenticated: boolean
  signUp: (email: string, password: string, profile: Partial<UserProfile>) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  refreshUser: () => Promise<void>
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

  // ✅ CORREÇÃO: Função para sincronizar pedidos do usuário
  const syncUserOrders = async (userId: string, userEmail: string) => {
    try {
      if (import.meta.env.DEV) console.log('🔄 Sincronizando pedidos para:', userEmail)
      
      // Obter pedidos gerais do localStorage
      const generalOrders = JSON.parse(localStorage.getItem('user_orders') || '[]')
      
      // Obter pedidos específicos do usuário
      const userSpecificOrders = JSON.parse(localStorage.getItem(`user_orders_${userId}`) || '[]')
      
      // Combinar e deduplificar pedidos
      const allOrders = [...generalOrders, ...userSpecificOrders]
      const uniqueOrders = allOrders.reduce((acc, current) => {
        const exists = acc.find((order: any) => order.id === current.id)
        if (!exists) {
          acc.push(current)
        }
        return acc
      }, [])
      
      // Salvar pedidos únicos para o usuário específico
      localStorage.setItem(`user_orders_${userId}`, JSON.stringify(uniqueOrders))
      
      if (import.meta.env.DEV) console.log(`✅ ${uniqueOrders.length} pedidos sincronizados para ${userEmail}`)
      
    } catch (error) {
      console.error('❌ Erro ao sincronizar pedidos:', error)
    }
  }

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

  // ✅ CORREÇÃO: Validação de unicidade de email
  const validateEmailUniqueness = async (email: string) => {
    try {
      if (import.meta.env.DEV) console.log('🔍 Validando unicidade do email:', email)
      
      // Verificar no localStorage primeiro (modo offline)
      const localUsers = JSON.parse(localStorage.getItem('offline_users') || '[]')
      if (import.meta.env.DEV) console.log('📦 Usuários locais encontrados:', localUsers.length)
      
      const localExists = localUsers.find((u: any) => u.email === email)
      if (import.meta.env.DEV) console.log('🔍 Email local existe?', !!localExists)
      
      if (localExists) {
        if (import.meta.env.DEV) console.log('❌ Email já existe localmente')
        return { exists: true, source: 'local' }
      }

      // Verificar no Supabase se disponível
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
      console.error('Erro ao validar unicidade do email:', error)
      return { exists: false, source: null }
    }
  }

  // ✅ INICIALIZAÇÃO DO AUTH CONTEXT
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
          console.error('❌ Erro ao recuperar sessão offline:', error)
        }
        
        setLoading(false)
        return
      }

      // Modo online - usar Supabase
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setUser(session.user)
          setSession(session)
          
          // Buscar perfil do usuário
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()
            
            if (profile && !error) {
              setProfile(profile)
            } else if (error) {
              console.warn('⚠️ Perfil não encontrado na inicialização, criando perfil básico:', error)
              // Criar um perfil básico temporário
              setProfile({
                id: session.user.id,
                email: session.user.email || '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
            }
          } catch (error) {
            console.error('❌ Erro ao buscar perfil na inicialização:', error)
          }
          
          if (import.meta.env.DEV) console.log('✅ Sessão Supabase recuperada:', session.user.email)
        }
      } catch (error) {
        console.error('❌ Erro ao recuperar sessão Supabase:', error)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listener para mudanças de autenticação (apenas se Supabase estiver disponível)
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (import.meta.env.DEV) console.log('🔄 Auth state changed:', event)
          
          if (session?.user) {
            setUser(session.user)
            setSession(session)
            
            // Buscar perfil atualizado
            if (supabase) {
              try {
                const { data: profile, error } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', session.user.id)
                  .single()
                
                if (profile && !error) {
                  setProfile(profile)
                } else if (error) {
                  console.warn('⚠️ Perfil não encontrado, usuário autenticado sem perfil completo:', error)
                  // Criar um perfil básico temporário
                  setProfile({
                    id: session.user.id,
                    email: session.user.email || '',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  })
                }
              } catch (error) {
                console.error('❌ Erro ao buscar perfil no listener:', error)
              }
            }
          } else {
            setUser(null)
            setProfile(null)
            setSession(null)
          }
        }
      )

      return () => subscription.unsubscribe()
    }
  }, [])

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

        // Verificar unicidade do email
        if (import.meta.env.DEV) console.log('🔍 Verificando unicidade do email...')
        const uniqueCheck = await validateEmailUniqueness(email)
        if (import.meta.env.DEV) console.log('📊 Resultado da validação:', uniqueCheck)
        
        if (uniqueCheck.exists) {
          if (import.meta.env.DEV) console.log('❌ Email já existe:', uniqueCheck.source)
          return { 
            error: { 
              message: `Email já cadastrado ${uniqueCheck.source === 'local' ? 'neste dispositivo' : 'no sistema'}. Faça login ao invés de criar nova conta.` 
            } as AuthError 
          }
        }
        if (import.meta.env.DEV) console.log('✅ Email é único, prosseguindo...')

        // Carregar usuários existentes
        if (import.meta.env.DEV) console.log('📦 Carregando usuários existentes...')
        const existingUsers = JSON.parse(localStorage.getItem('offline_users') || '[]')
        if (import.meta.env.DEV) console.log('📊 Usuários existentes:', existingUsers.length)

        // Criar novo usuário
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

        // Salvar no localStorage
        if (import.meta.env.DEV) console.log('💾 Salvando no localStorage...')
        existingUsers.push(newUser)
        localStorage.setItem('offline_users', JSON.stringify(existingUsers))
        localStorage.setItem('offline_current_user', JSON.stringify(newUser))
        if (import.meta.env.DEV) console.log('✅ localStorage atualizado')

        // Atualizar estado da aplicação
        if (import.meta.env.DEV) console.log('🔄 Atualizando estado da aplicação...')
        setUser(newUser as any)
        setProfile(newUser)
        setSession({ user: newUser } as any)
        if (import.meta.env.DEV) console.log('✅ Estado atualizado')

        if (import.meta.env.DEV) console.log('🎉 Cadastro concluído com sucesso!')
        return { error: null }
        
      } catch (error) {
        console.error('Erro no cadastro offline:', error)
        return { error: { message: 'Erro ao criar conta offline' } as AuthError }
      }
    }

    // Modo online - usar Supabase
    try {
      // Verificar unicidade do email
      const uniqueCheck = await validateEmailUniqueness(email)
      if (uniqueCheck.exists) {
        return { 
          error: { 
            message: 'Email já cadastrado. Faça login ao invés de criar nova conta.' 
          } as AuthError 
        }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: profileData
        }
      })

      if (error) {
        return { error }
      }

      if (data.user) {
        // ✅ CORREÇÃO: Atualizar estado imediatamente após signup
        setUser(data.user)
        setSession(data.session)
        
        // Criar perfil na tabela profiles
        const newProfile = {
          id: data.user.id,
          email: data.user.email!,
          name: profileData.name,
          phone: profileData.phone,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert(newProfile)

        if (profileError) {
          console.error('❌ Erro ao criar perfil:', profileError)
          // Mesmo com erro no perfil, definir perfil básico
          setProfile(newProfile)
        } else {
          // Perfil criado com sucesso
          setProfile(newProfile)
          if (import.meta.env.DEV) console.log('✅ Perfil criado no Supabase:', newProfile)
        }
        
        if (import.meta.env.DEV) console.log('✅ Signup Supabase realizado para:', data.user.email)
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
        
        if (import.meta.env.DEV) console.log('✅ Login offline realizado para:', email)
        return { error: null }
        
      } catch (error) {
        console.error('Erro no login offline:', error)
        return { error: { message: 'Erro ao fazer login offline' } as AuthError }
      }
    }

    // Modo online - usar Supabase
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return { error }
      }

      // ✅ CORREÇÃO: Aguardar e forçar atualização do estado após login
      if (data.user) {
        setUser(data.user)
        setSession(data.session)
        
        // Buscar perfil do usuário logado
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single()
          
          if (profile && !profileError) {
            setProfile(profile)
          } else {
            console.warn('⚠️ Perfil não encontrado no login, criando perfil básico')
            // Criar perfil básico
            setProfile({
              id: data.user.id,
              email: data.user.email || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
          }
        } catch (profileError) {
          console.error('❌ Erro ao buscar perfil no login:', profileError)
        }
        
        if (import.meta.env.DEV) console.log('✅ Login Supabase realizado para:', data.user.email)
      }

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
      if (supabase) {
        await supabase.auth.signOut()
      }
      if (import.meta.env.DEV) console.log('🚪 Logout Supabase realizado')
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { error: { message: 'Usuário não autenticado' } as AuthError }
    }

    try {
      if (!supabase) {
        // Modo offline - atualizar localStorage
        const allUsers = JSON.parse(localStorage.getItem('offline_users') || '[]')
        const userIndex = allUsers.findIndex((u: any) => u.id === user.id)
        
        if (userIndex !== -1) {
          const updatedUser = {
            ...allUsers[userIndex],
            ...updates,
            updated_at: new Date().toISOString()
          }
          
          allUsers[userIndex] = updatedUser
          localStorage.setItem('offline_users', JSON.stringify(allUsers))
          localStorage.setItem('offline_current_user', JSON.stringify(updatedUser))
          
          setProfile(updatedUser)
          
          return { error: null }
        }
        
        return { error: { message: 'Usuário não encontrado' } as AuthError }
      }

      // Modo online - usar Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        return { error: { message: error.message } as AuthError }
      }

      // Atualizar estado local
      if (profile) {
        setProfile({ ...profile, ...updates })
      }

      return { error: null }
    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error)
      return { error: { message: 'Erro interno ao atualizar perfil' } as AuthError }
    }
  }

  const resetPassword = async (email: string) => {
    if (!supabase) {
      return { error: { message: 'Reset de senha não disponível no modo offline' } as AuthError }
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      return { error }
    } catch (error) {
      console.error('❌ Erro ao resetar senha:', error)
      return { error: { message: 'Erro interno ao resetar senha' } as AuthError }
    }
  }

  // ✅ CORREÇÃO: isAuthenticated mais robusto - considera user como suficiente
  const isAuthenticated = Boolean(user)

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}