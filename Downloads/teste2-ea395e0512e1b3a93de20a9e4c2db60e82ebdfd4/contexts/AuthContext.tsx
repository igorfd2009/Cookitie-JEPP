import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
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
  session: any | null
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
  const [profile, setProfile] = useState<UserProfile | null>(null)
  
  // Hook para autenticação offline
  const offlineAuth = useOfflineAuth()



  useEffect(() => {
    // ✅ VERSÃO 100% OFFLINE
    console.log('Inicializando sistema offline...')
  }, [])

  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    // ✅ VERSÃO 100% OFFLINE
    console.log('Criando conta offline:', email)
    
    const result = await offlineAuth.signUp(email, password, name, phone)
    
    if (result.success && offlineAuth.user) {
      // ✅ ATUALIZAR ESTADOS LOCAIS após signup offline
      setProfile({
        id: offlineAuth.user.id,
        email: offlineAuth.user.email,
        name: offlineAuth.user.name,
        phone: offlineAuth.user.phone,
        created_at: offlineAuth.user.created_at,
        updated_at: offlineAuth.user.updated_at
      })
      console.log('Estados locais atualizados após signup offline')
    }
    
    return result
  }

  const signIn = async (email: string, password: string) => {
    // ✅ VERSÃO 100% OFFLINE
    console.log('Tentando login offline:', email)
    
    const result = await offlineAuth.signIn(email, password)
    
    if (result.success && offlineAuth.user) {
      // ✅ ATUALIZAR ESTADOS LOCAIS após login offline
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
    
    return result
  }



  const signOut = async () => {
    console.log('Fazendo logout offline...')
    
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
    setProfile(null)
    
    console.log('Logout offline completo realizado')
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    // ✅ VERSÃO 100% OFFLINE
    console.log('Atualizando perfil offline')
    return await offlineAuth.updateProfile(updates)
  }

  // Garantir que profile sempre existe (offline)
  const getCurrentProfile = (): UserProfile | null => {
    if (profile) {
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

  const isAuthenticated = Boolean(offlineAuth.user)
  const isLoading = offlineAuth.loading
  const currentProfile = getCurrentProfile()

  const value: AuthContextType = {
    user: offlineAuth.user,
    profile: currentProfile,
    session: null, // Não usado no modo offline
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