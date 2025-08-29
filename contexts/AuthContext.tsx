import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  created_at: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<{ success: boolean; error?: string }>
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Carregar usuário do localStorage na inicialização
  useEffect(() => {
    const savedUser = localStorage.getItem('cookitie_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Erro ao carregar usuário:', error)
        localStorage.removeItem('cookitie_user')
      }
    }
    setLoading(false)
  }, [])

  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    try {
      // Validações básicas
      if (!email || !password || !name) {
        return { success: false, error: 'Todos os campos são obrigatórios' }
      }

      if (password.length < 6) {
        return { success: false, error: 'Senha deve ter pelo menos 6 caracteres' }
      }

      // Verificar se email já existe
      const users = JSON.parse(localStorage.getItem('cookitie_users') || '[]')
      if (users.find((u: User) => u.email === email)) {
        return { success: false, error: 'Email já cadastrado' }
      }

      // Criar novo usuário
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        name,
        phone,
        created_at: new Date().toISOString()
      }

      // Salvar no localStorage
      users.push(newUser)
      localStorage.setItem('cookitie_users', JSON.stringify(users))
      localStorage.setItem('cookitie_user', JSON.stringify(newUser))
      
      setUser(newUser)
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Erro interno no cadastro' }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      // Validações básicas
      if (!email || !password) {
        return { success: false, error: 'Email e senha são obrigatórios' }
      }

      // Buscar usuário
      const users = JSON.parse(localStorage.getItem('cookitie_users') || '[]')
      const foundUser = users.find((u: User) => u.email === email)
      
      if (!foundUser) {
        return { success: false, error: 'Email não encontrado' }
      }

      // Salvar sessão
      localStorage.setItem('cookitie_user', JSON.stringify(foundUser))
      setUser(foundUser)
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Erro interno no login' }
    }
  }

  const signOut = () => {
    localStorage.removeItem('cookitie_user')
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    signUp,
    signIn,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}