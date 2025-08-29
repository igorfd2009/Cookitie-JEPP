import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface UserProfile {
  id: string
  email: string
  name?: string
  phone?: string
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  isAuthenticated: boolean
  supabaseError: string | null
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
  const [supabaseError, setSupabaseError] = useState<string | null>(null)

  // Função para buscar perfil do usuário
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    if (!supabase) return null
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
      
      if (error) {
        console.error('Erro ao buscar perfil:', error.message)
        
        // Se a tabela não existe (erro 406), alertar
        if (error.code === 'PGRST116' || error.message.includes('relation "public.profiles" does not exist')) {
          const errorMsg = 'Tabela profiles não existe. Execute sql/supabase-setup.sql no painel do Supabase.'
          console.error('❌ ERRO:', errorMsg)
          setSupabaseError(errorMsg)
        }
        
        return null
      }
      
      return data || null
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
      return null
    }
  }

  // Função para criar/atualizar perfil do usuário (idempotente)
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
        .upsert(profileData, { onConflict: 'id' })
        .select()
        .maybeSingle()
      
      if (error) {
        console.error('Erro ao criar/atualizar perfil:', error)
        return null
      }
      
      return data || null
    } catch (error) {
      console.error('Erro ao criar perfil:', error)
      return null
    }
  }

  useEffect(() => {
    const getInitialSession = async () => {
      if (!supabase) {
        console.warn('Supabase não configurado. Verifique as variáveis de ambiente.')
        setLoading(false)
        return
      }

      try {
        // Buscar sessão atual
        const { data: { session }, error } = await supabase.auth.getSession()
        
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
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (session?.user) {
          setUser(session.user)
          setSession(session)
          
          // Buscar perfil do usuário
          let userProfile = await fetchUserProfile(session.user.id)
          if (!userProfile) {
            // criar perfil básico se não existir ainda
            const defaultName = (session.user.user_metadata as any)?.name || 'Usuário'
            userProfile = await createUserProfile(session.user, defaultName)
          }
          if (userProfile) setProfile(userProfile)
        } else {
          setUser(null)
          setProfile(null)
          setSession(null)
        }
      })

      return () => subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    if (!supabase) {
      return { success: false, error: 'Supabase não configurado. Verifique as variáveis de ambiente.' }
    }

    try {
      console.log('Tentando criar conta:', email)
      
      // Criar conta no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
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
        console.error('Erro no signup:', error)
        return { success: false, error: error.message }
      }

      if (data.user) {
        console.log('Conta criada com sucesso:', data.user.email)
        
        // Criar/obter perfil na tabela profiles (idempotente)
        let userProfile = await createUserProfile(data.user, name, phone)
        if (!userProfile) {
          userProfile = await fetchUserProfile(data.user.id)
        }

        setUser(data.user)
        if (data.session) setSession(data.session)
        if (userProfile) setProfile(userProfile)
        return { success: true }
      }

      return { success: false, error: 'Erro desconhecido ao criar conta' }
    } catch (error) {
      console.error('Erro no signup:', error)
      return { success: false, error: 'Erro inesperado ao criar conta' }
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { success: false, error: 'Supabase não configurado. Verifique as variáveis de ambiente.' }
    }

    try {
      console.log('Tentando fazer login:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Erro no login:', error)
        return { success: false, error: error.message }
      }

      if (data.user && data.session) {
        console.log('Login realizado com sucesso:', data.user.email)
        
        setUser(data.user)
        setSession(data.session)
        
        // Buscar perfil do usuário
        let userProfile = await fetchUserProfile(data.user.id)
        if (!userProfile) {
          const defaultName = (data.user.user_metadata as any)?.name || 'Usuário'
          userProfile = await createUserProfile(data.user, defaultName)
        }
        if (userProfile) setProfile(userProfile)
        
        return { success: true }
      }

      return { success: false, error: 'Erro desconhecido no login' }
    } catch (error) {
      console.error('Erro no login:', error)
      return { success: false, error: 'Erro inesperado no login' }
    }
  }

  const signOut = async () => {
    if (!supabase) {
      return
    }

    try {
      console.log('Fazendo logout...')
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Erro no logout:', error)
      }
      
      // Limpar estado local
      setUser(null)
      setProfile(null)
      setSession(null)
    } catch (error) {
      console.error('Erro no logout:', error)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!supabase || !user) {
      return { success: false, error: 'Usuário não autenticado ou Supabase não configurado' }
    }

    try {
      const { error } = await supabase
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

  const isAuthenticated = Boolean(user && session)

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    isAuthenticated,
    supabaseError,
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