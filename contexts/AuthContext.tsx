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
    // Obter sessão inicial
    const getInitialSession = async () => {
      if (!supabase) {
        // Modo offline - verificar localStorage
        try {
          const savedUser = localStorage.getItem('offline_current_user')
          if (savedUser) {
            const user = JSON.parse(savedUser)
            setUser(user as any)
            setProfile(user)
            setSession({ user } as any)
          }
        } catch (error) {
          console.error('Erro ao carregar usuário offline:', error)
        } finally {
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

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase?.auth.onAuthStateChange(
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
    ) || { data: { subscription: null } }

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

  const signUp = async (email: string, password: string, profileData: Partial<UserProfile>) => {
    console.log('🔍 AuthContext.signUp called', { email, profileData, supabaseAvailable: !!supabase })
    
    if (!supabase) {
      console.log('📱 Modo offline - usando localStorage')
      // Modo offline - simular cadastro com localStorage
      try {
        // Validação básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          console.log('❌ Email inválido:', email)
          return { error: { message: 'Email inválido' } as AuthError }
        }

        // Validação de senha
        if (!password || password.length < 6) {
          console.log('❌ Senha muito curta:', password?.length)
          return { error: { message: 'Senha deve ter pelo menos 6 caracteres' } as AuthError }
        }

        const existingUsers = JSON.parse(localStorage.getItem('offline_users') || '[]')
        console.log('👥 Usuários existentes:', existingUsers.length)
        
        // Verificar se email já existe
        if (existingUsers.find((u: any) => u.email === email)) {
          console.log('❌ Email já existe:', email)
          return { error: { message: 'Email já cadastrado' } as AuthError }
        }
        
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
        
        console.log('✅ Criando novo usuário:', newUser)
        
        existingUsers.push(newUser)
        localStorage.setItem('offline_users', JSON.stringify(existingUsers))
        localStorage.setItem('offline_current_user', JSON.stringify(newUser))
        
        console.log('💾 Dados salvos no localStorage')
        
        // Simular sessão
        setUser(newUser as any)
        setProfile(newUser)
        setSession({ user: newUser } as any)
        
        console.log('🎉 Usuário logado com sucesso!')
        
        return { error: null }
      } catch (error) {
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
          return { error: { message: 'Senha inválida' } as AuthError }
        }

        const existingUsers = JSON.parse(localStorage.getItem('offline_users') || '[]')
        const user = existingUsers.find((u: any) => u.email === email)
        
        if (!user) {
          return { error: { message: 'Email não encontrado' } as AuthError }
        }
        
        // Simular sessão
        setUser(user as any)
        setProfile(user)
        setSession({ user } as any)
        localStorage.setItem('offline_current_user', JSON.stringify(user))
        
        return { error: null }
      } catch (error) {
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
      // Modo offline - limpar localStorage
      localStorage.removeItem('offline_current_user')
      setUser(null)
      setProfile(null)
      setSession(null)
      return
    }

    try {
      await supabase.auth.signOut()
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
