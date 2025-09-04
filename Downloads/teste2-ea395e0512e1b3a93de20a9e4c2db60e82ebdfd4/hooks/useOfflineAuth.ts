import { useState, useEffect } from 'react'

interface OfflineUser {
  id: string
  email: string
  name: string
  phone?: string
  created_at: string
  updated_at: string
}

interface OfflineAuthHook {
  user: OfflineUser | null
  loading: boolean
  isAuthenticated: boolean
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<{ success: boolean; error?: string }>
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<OfflineUser>) => Promise<{ success: boolean; error?: string }>
}

const OFFLINE_AUTH_KEY = 'cookite_offline_auth'
const OFFLINE_USERS_KEY = 'cookite_offline_users'

export const useOfflineAuth = (): OfflineAuthHook => {
  const [user, setUser] = useState<OfflineUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Carregar usuário do localStorage na inicialização
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem(OFFLINE_AUTH_KEY)
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error('Erro ao carregar usuário offline:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  // Função para salvar usuário no localStorage
  const saveUser = (userData: OfflineUser | null) => {
    try {
      if (userData) {
        localStorage.setItem(OFFLINE_AUTH_KEY, JSON.stringify(userData))
      } else {
        localStorage.removeItem(OFFLINE_AUTH_KEY)
      }
      setUser(userData)
    } catch (error) {
      console.error('Erro ao salvar usuário offline:', error)
    }
  }

  // Função para obter usuários do localStorage
  const getUsers = (): OfflineUser[] => {
    try {
      const stored = localStorage.getItem(OFFLINE_USERS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Erro ao carregar usuários offline:', error)
      return []
    }
  }

  // Função para salvar usuários no localStorage
  const saveUsers = (users: OfflineUser[]) => {
    try {
      localStorage.setItem(OFFLINE_USERS_KEY, JSON.stringify(users))
    } catch (error) {
      console.error('Erro ao salvar usuários offline:', error)
    }
  }

  const signUp = async (email: string, _password: string, name: string, phone?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const users = getUsers()
      
      // Verificar se o email já existe
      if (users.find(u => u.email === email)) {
        return { success: false, error: 'Email já cadastrado' }
      }

      // Criar novo usuário
      const newUser: OfflineUser = {
        id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        name,
        phone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Adicionar à lista de usuários
      users.push(newUser)
      saveUsers(users)

      // Fazer login automaticamente
      saveUser(newUser)

      console.log('Usuário criado offline:', newUser.email)
      return { success: true }
    } catch (error) {
      console.error('Erro ao criar usuário offline:', error)
      return { success: false, error: 'Erro inesperado ao criar conta' }
    }
  }

  const signIn = async (email: string, _password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const users = getUsers()
      const user = users.find(u => u.email === email)

      if (!user) {
        return { success: false, error: 'Email não encontrado' }
      }

      // Em modo offline, não verificamos senha (simulação)
      saveUser(user)
      console.log('Login realizado offline:', user.email)
      return { success: true }
    } catch (error) {
      console.error('Erro no login offline:', error)
      return { success: false, error: 'Erro inesperado no login' }
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      saveUser(null)
      console.log('Logout realizado offline')
    } catch (error) {
      console.error('Erro no logout offline:', error)
    }
  }

  const updateProfile = async (updates: Partial<OfflineUser>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' }
      }

      const updatedUser = {
        ...user,
        ...updates,
        updated_at: new Date().toISOString()
      }

      // Atualizar na lista de usuários
      const users = getUsers()
      const userIndex = users.findIndex(u => u.id === user.id)
      if (userIndex !== -1) {
        users[userIndex] = updatedUser
        saveUsers(users)
      }

      // Atualizar usuário atual
      saveUser(updatedUser)

      console.log('Perfil atualizado offline:', updatedUser.email)
      return { success: true }
    } catch (error) {
      console.error('Erro ao atualizar perfil offline:', error)
      return { success: false, error: 'Erro inesperado ao atualizar perfil' }
    }
  }

  return {
    user,
    loading,
    isAuthenticated: Boolean(user),
    signUp,
    signIn,
    signOut,
    updateProfile
  }
}
