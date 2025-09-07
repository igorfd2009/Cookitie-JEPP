import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { pb } from '../lib/pocketbase'

interface UserProfile {
  id: string
  email: string
  name?: string
  phone?: string
  created_at?: string
  updated_at?: string
}

interface AuthContextType {
  user: any | null
  profile: UserProfile | null
  session: { token: string | null } | null
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
  const [user, setUser] = useState<any | null>(pb.authStore.model)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const mapUserToProfile = (model: any | null): UserProfile | null => {
    if (!model) return null
    return {
      id: model.id,
      email: model.email,
      name: model.name,
      phone: (model as any).phone,
      created_at: model?.created,
      updated_at: model?.updated
    }
  }

  useEffect(() => {
    // Inicialização: carregar sessão do pb.authStore (lib já tenta restaurar do localStorage)
    setUser(pb.authStore.model)
    setProfile(mapUserToProfile(pb.authStore.model))
    setLoading(false)

    // Listener de mudanças de auth (login/logout/refresh)
    const unsub = pb.authStore.onChange(() => {
      setUser(pb.authStore.model)
      setProfile(mapUserToProfile(pb.authStore.model))
    })

    return () => {
      // @ts-ignore - onChange retorna unsub em versões mais novas
      if (typeof unsub === 'function') unsub()
    }
  }, [])

  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    try {
      setLoading(true)

      // Criar usuário na coleção de auth do PocketBase (users)
      await pb.collection('users').create({
        email,
        emailVisibility: true,
        password,
        passwordConfirm: password,
        name,
        phone
      })

      // Autenticar após criar
      await pb.collection('users').authWithPassword(email, password)

      setUser(pb.authStore.model)
      setProfile(mapUserToProfile(pb.authStore.model))

      return { success: true }
    } catch (error: any) {
      console.error('Erro no cadastro PocketBase:', error)
      const msg = error?.message || 'Erro inesperado ao criar conta'
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)

      const identity = email
      try {
        // URL usada
        // @ts-ignore
        console.log('[PocketBase][login] Base URL:', (pb as any)?.baseUrl || 'desconhecida')
      } catch (_) {}

      try {
        // Body enviado (senha mascarada)
        console.log('[PocketBase][login] Request body:', { identity, passwordLength: password ? password.length : 0 })
      } catch (_) {}

      const result = await pb.collection('users').authWithPassword(identity, password)

      try {
        // Resposta de sucesso (sem expor token inteiro)
        console.log('[PocketBase][login] Success:', {
          recordId: pb?.authStore?.model?.id,
          email: pb?.authStore?.model?.email,
          tokenLength: pb?.authStore?.token ? pb.authStore.token.length : 0,
          hasResult: Boolean(result)
        })
      } catch (_) {}

      setUser(pb.authStore.model)
      setProfile(mapUserToProfile(pb.authStore.model))

      return { success: true }
    } catch (error: any) {
      try {
        // Log detalhado de erro (inclui status e payload do PB)
        console.error('[PocketBase][login] Error detail:', {
          status: error?.status,
          data: error?.data,
          response: error?.response,
          message: error?.message
        })
      } catch (_) {}
      console.error('Erro no login PocketBase:', error)
      const msg = error?.message || 'Erro inesperado no login'
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      pb.authStore.clear()
      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error('Erro no logout PocketBase:', error)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) return { success: false, error: 'Usuário não autenticado' }
      const payload: any = {}
      if (typeof updates.name !== 'undefined') payload.name = updates.name
      if (typeof updates.phone !== 'undefined') payload.phone = updates.phone

      await pb.collection('users').update(user.id, payload)
      // Atualizar estado local
      const newModel = { ...pb.authStore.model, ...payload }
      setUser(newModel)
      setProfile(mapUserToProfile(newModel))
      return { success: true }
    } catch (error) {
      console.error('Erro ao atualizar perfil PocketBase:', error)
      return { success: false, error: 'Erro inesperado ao atualizar perfil' }
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    session: { token: pb.authStore.token },
    loading,
    isAuthenticated: Boolean(user && pb.authStore.isValid),
    signUp,
    signIn,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}