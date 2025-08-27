import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Loader2, Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
import { toast } from 'react-toastify'
// import { useAuthRateLimit, useSignupRateLimit } from '../../hooks/useRateLimit'

interface AuthModalsProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: 'login' | 'signup'
}

export const AuthModals: React.FC<AuthModalsProps> = ({ 
  isOpen, 
  onClose, 
  defaultTab = 'login' 
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()

  // Rate Limiting - Temporariamente desabilitado para debug
  // const loginRateLimit = useAuthRateLimit()
  // const signupRateLimit = useSignupRateLimit()

  // Estados do formulário de login
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })

  // Estados do formulário de cadastro
  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: ''
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validações básicas
    if (!loginForm.email.trim()) {
      toast.error('Email é obrigatório')
      return
    }

    if (!loginForm.password.trim()) {
      toast.error('Senha é obrigatória')
      return
    }

    // Rate limit temporariamente desabilitado
    // if (!loginRateLimit.canExecute()) {
    //   if (loginRateLimit.isBlocked) {
    //     const timeRemaining = loginRateLimit.getBlockedTimeFormatted()
    //     toast.error(`Muitas tentativas. Tente novamente em ${timeRemaining}`)
    //   } else {
    //     toast.error('Limite de tentativas excedido')
    //   }
    //   return
    // }

    setLoading(true)

    try {
      if (import.meta.env.DEV) console.log('🔑 Tentando fazer login...', { email: loginForm.email })

      const result = await signIn(loginForm.email, loginForm.password)
      
      if (import.meta.env.DEV) console.log('📋 Resultado do login:', result)

      if (result.error) {
        toast.error(result.error.message || 'Erro ao fazer login')
      } else {
        toast.success('Login realizado com sucesso!')
        onClose()
        setLoginForm({ email: '', password: '' })
      }
      
    } catch (error) {
      console.error('❌ Erro no login:', error)
      toast.error('Erro interno ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validações básicas
    if (!signupForm.email.trim()) {
      toast.error('Email é obrigatório')
      return
    }

    if (!signupForm.password.trim()) {
      toast.error('Senha é obrigatória')
      return
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }

    if (signupForm.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return
    }

    if (!signupForm.fullName.trim()) {
      toast.error('Nome é obrigatório')
      return
    }

    // Rate limit temporariamente desabilitado
    // if (!signupRateLimit.canExecute()) {
    //   if (signupRateLimit.isBlocked) {
    //     const timeRemaining = signupRateLimit.getBlockedTimeFormatted()
    //     toast.error(`Muitas tentativas. Tente novamente em ${timeRemaining}`)
    //   } else {
    //     toast.error('Limite de tentativas excedido')
    //   }
    //   return
    // }

    setLoading(true)

    try {
      if (import.meta.env.DEV) console.log('🚀 Iniciando cadastro...', {
        email: signupForm.email,
        fullName: signupForm.fullName,
        phone: signupForm.phone
      })

      const result = await signUp(
        signupForm.email, 
        signupForm.password, 
        {
          full_name: signupForm.fullName,
          phone: signupForm.phone
        }
      )
      
      if (import.meta.env.DEV) console.log('📋 Resultado do cadastro:', result)

      if (result.error) {
        toast.error(result.error.message || 'Erro ao fazer cadastro')
      } else {
        toast.success('Cadastro realizado com sucesso!')
        onClose()
        setSignupForm({
          email: '',
          password: '',
          confirmPassword: '',
          fullName: '',
          phone: ''
        })
      }
      
    } catch (error) {
      console.error('❌ Erro no cadastro:', error)
      toast.error('Erro interno ao fazer cadastro')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Entrar / Cadastrar</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="signup">Cadastrar</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Rate Limit Indicator - Temporariamente desabilitado */}
              {/* {loginRateLimit.isBlocked && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Muitas tentativas. Tente novamente em {loginRateLimit.getBlockedTimeFormatted()}
                    </span>
                  </div>
                </div>
              )}

              {!loginRateLimit.isBlocked && loginRateLimit.remainingAttempts <= 2 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      Tentativas restantes: {loginRateLimit.remainingAttempts}
                    </span>
                  </div>
                </div>
              )} */}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button
                variant="link"
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={() => setActiveTab('signup')}
              >
                Não tem uma conta? Cadastre-se
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="p-6">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-fullname">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-fullname"
                    type="text"
                    placeholder="Seu nome completo"
                    value={signupForm.fullName}
                    onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-phone">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={signupForm.phone}
                    onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password">Confirmar Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Rate Limit Indicator - Temporariamente desabilitado */}
              {/* {signupRateLimit.isBlocked && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Muitas tentativas. Tente novamente em {signupRateLimit.getBlockedTimeFormatted()}
                    </span>
                  </div>
                </div>
              )}

              {!signupRateLimit.isBlocked && signupRateLimit.remainingAttempts <= 2 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      Tentativas restantes: {signupRateLimit.remainingAttempts}
                    </span>
                  </div>
                </div>
              )} */}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  'Cadastrar'
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button
                variant="link"
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={() => setActiveTab('login')}
              >
                Já tem uma conta? Entre aqui
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
