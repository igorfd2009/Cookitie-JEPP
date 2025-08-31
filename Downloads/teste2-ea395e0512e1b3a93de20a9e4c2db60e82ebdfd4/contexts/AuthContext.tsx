import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseAvailable } from '../lib/supabase'
import { useOfflineAuth } from '../hooks/useOfflineAuth'

interface UserProfile {
  id: string
  email: string
  name?: string
  phone?: string
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | any | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  isAuthenticated: boolean
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<{ success: boolean; error?: string }>
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
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
  
  // Hook para autenticação offline
  const offlineAuth = useOfflineAuth()
  
  // Verificar se o Supabase está disponível
  const supabaseAvailable = isSupabaseAvailable()

  // Função para buscar perfil do usuário
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    if (!supabase) return null
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        console.error('Erro ao buscar perfil:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
      return null
    }
  }

  // Função para criar perfil do usuário
  const createUserProfile = async (user: User, name: string, phone?: string): Promise<UserProfile | null> => {
    if (!supabase) return null
    
    try {
      const profileData = {
        id: user.id,
        email: user.email!,
        name,
        phone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single()
      
      if (error) {
        console.error('Erro ao criar perfil:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Erro ao criar perfil:', error)
      return null
    }
  }

  useEffect(() => {
    const getInitialSession = async () => {
      if (!supabaseAvailable) {
        console.warn('Supabase não configurado. Usando modo offline.')
        setLoading(false)
        return
      }

      try {
        // Buscar sessão atual
        const { data: { session }, error } = await supabase!.auth.getSession()
        
        if (error) {
          console.error('Erro ao buscar sessão:', error)
          setLoading(false)
          return
        }

        if (session?.user) {
          console.log('Sessão encontrada:', session.user.email)
          setUser(session.user)
          setSession(session)
          
          // Buscar perfil do usuário
          const userProfile = await fetchUserProfile(session.user.id)
          if (userProfile) {
            setProfile(userProfile)
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar sessão:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listener para mudanças de autenticação
    if (supabaseAvailable && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          setSession(session)
          
          // Buscar perfil do usuário
          const userProfile = await fetchUserProfile(session.user.id)
          if (userProfile) {
            setProfile(userProfile)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
          setSession(null)
        } else if (event === 'TOKEN_REFRESHED') {
          setSession(session)
        } else if (!session?.user) {
          setUser(null)
          setProfile(null)
          setSession(null)
        }
      })

      return () => subscription.unsubscribe()
    }
  }, [supabaseAvailable])

  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    // Primeiro tentar signup online
    if (supabaseAvailable) {
      console.log('Tentando signup online primeiro')
      try {
        console.log('Tentando criar conta online:', email)
        
        // Verificar se email já existe
        try {
          const { data: existingUser } = await supabase!
            .from('profiles')
            .select('email')
            .eq('email', email)
            .single()
          
          if (existingUser) {
            console.error('Email já cadastrado:', email)
            return { success: false, error: 'Email já cadastrado' }
          }
        } catch (error) {
          // Email não existe, pode continuar
          console.log('Email disponível para cadastro')
        }
        
        // Criar conta no Supabase Auth
        const { data, error } = await supabase!.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              phone
            }
          }
        })

        if (error) {
          console.error('Erro no signup online:', error)
          // Se falhou online, usar offline
          console.log('Signup online falhou, usando offline')
          return await offlineAuth.signUp(email, password, name, phone)
        }

        if (data.user) {
          console.log('Conta criada online com sucesso:', data.user.email)
          
          // Definir usuário e sessão imediatamente
          setUser(data.user)
          setSession(data.session)
          
          // Criar perfil manualmente
          try {
            console.log('Criando perfil online para:', data.user.email)
            const userProfile = await createUserProfile(data.user, name, phone)
            
            if (userProfile) {
              console.log('Perfil criado online com sucesso')
              setProfile(userProfile)
            } else {
              console.warn('Não foi possível criar o perfil online')
            }
          } catch (profileError) {
            console.warn('Erro ao criar perfil online (não crítico):', profileError)
          }
          
          return { success: true }
        }
      } catch (error) {
        console.error('Erro no signup online:', error)
        // Se falhou online, usar offline
        console.log('Signup online falhou, usando offline')
        return await offlineAuth.signUp(email, password, name, phone)
      }
    }
    
    // Se não há Supabase ou falhou, usar offline
    console.log('Usando signup offline')
    return await offlineAuth.signUp(email, password, name, phone)
  }

  const signIn = async (email: string, password: string) => {
    // Primeiro tentar login online (para sincronização)
    if (supabaseAvailable) {
      console.log('Tentando login online primeiro...')
      const onlineResult = await signInOnline(email, password)
      if (onlineResult.success) {
        console.log('Login online realizado com sucesso')
        return onlineResult
      }
    }
    
    // Se online falhou, tentar offline
    console.log('Login online falhou, tentando offline...')
    const offlineResult = await offlineAuth.signIn(email, password)
    
    if (offlineResult.success) {
      console.log('Login offline realizado com sucesso')
      
      // ✅ ATUALIZAR ESTADOS LOCAIS após login offline
      if (offlineAuth.user) {
        // Usar 'any' para compatibilidade entre tipos online/offline
        setUser(offlineAuth.user as any)
        setProfile({
          id: offlineAuth.user.id,
          email: offlineAuth.user.email,
          name: offlineAuth.user.name,
          phone: offlineAuth.user.phone,
          created_at: offlineAuth.user.created_at,
          updated_at: offlineAuth.user.updated_at
        })
        console.log('Estados locais atualizados após login offline')
      }
      
      return offlineResult
    }
    
    return { success: false, error: 'Credenciais inválidas' }
  }

  const signInOnline = async (email: string, password: string) => {
    if (!supabaseAvailable) {
      return { success: false, error: 'Supabase não disponível' }
    }

    try {
      console.log('Tentando fazer login online:', email)
      
      const { data, error } = await supabase!.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Erro no login online:', error)
        return { success: false, error: error.message }
      }

      if (data.user && data.session) {
        console.log('Login online realizado com sucesso:', data.user.email)
        
        setUser(data.user)
        setSession(data.session)
        
        // Buscar perfil do usuário
        const userProfile = await fetchUserProfile(data.user.id)
        if (userProfile) {
          setProfile(userProfile)
        }
        
        return { success: true }
      }

      return { success: false, error: 'Erro desconhecido no login online' }
    } catch (error) {
      console.error('Erro no login online:', error)
      return { success: false, error: 'Erro inesperado no login online' }
    }
  }

  const signOut = async () => {
    console.log('Fazendo logout...')
    
    // Limpar Supabase (se disponível)
    if (supabaseAvailable) {
      try {
        const { error } = await supabase!.auth.signOut()
        if (error) {
          console.error('Erro no logout Supabase:', error)
        }
      } catch (error) {
        console.error('Erro no logout Supabase:', error)
      }
    }
    
    // Limpar autenticação offline
    try {
      await offlineAuth.signOut()
    } catch (error) {
      console.error('Erro no logout offline:', error)
    }
    
    // Limpar localStorage
    try {
      localStorage.removeItem('cookitie_user')
      localStorage.removeItem('cookitie_cart')
      localStorage.removeItem('supabase-auth-token')
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error)
    }
    
    // Limpar estados locais
    setUser(null)
    setProfile(null)
    setSession(null)
    
    console.log('Logout completo realizado')
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!supabaseAvailable) {
      // Usar autenticação offline
      console.log('Usando atualização offline de perfil')
      return await offlineAuth.updateProfile(updates)
    }

    if (!user) {
      return { success: false, error: 'Usuário não autenticado' }
    }

    try {
      const { error } = await supabase!
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        console.error('Erro ao atualizar perfil:', error)
        return { success: false, error: error.message }
      }

      // Atualizar estado local
      if (profile) {
        setProfile({ ...profile, ...updates, updated_at: new Date().toISOString() })
      }

      return { success: true }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      return { success: false, error: 'Erro inesperado ao atualizar perfil' }
    }
  }

  // Garantir que profile sempre existe (online ou offline)
  const getCurrentProfile = (): UserProfile | null => {
    if (supabaseAvailable && profile) {
      return profile
    }
    
    if (offlineAuth.user) {
      return {
        id: offlineAuth.user.id,
        email: offlineAuth.user.email,
        name: offlineAuth.user.name,
        phone: offlineAuth.user.phone,
        created_at: offlineAuth.user.created_at,
        updated_at: offlineAuth.user.updated_at
      }
    }
    
    return null
  }

  const isAuthenticated = supabaseAvailable ? Boolean(user && session) : Boolean(offlineAuth.user)
  const isLoading = supabaseAvailable ? loading : offlineAuth.loading
  const currentProfile = getCurrentProfile()

  const value: AuthContextType = {
    user: supabaseAvailable ? user : offlineAuth.user,
    profile: currentProfile,
    session,
    loading: isLoading,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}