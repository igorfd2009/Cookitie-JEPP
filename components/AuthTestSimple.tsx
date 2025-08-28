import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'

export const AuthTestSimple: React.FC = () => {
  const auth = useAuth()
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('123456')
  const [name, setName] = useState('Usuario Teste')
  const [phone, setPhone] = useState('(11) 99999-9999')

  console.log('🔍 AuthTestSimple - Estado da autenticação:', {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    profile: auth.profile,
    loading: auth.loading
  })

  const handleSignup = async () => {
    try {
      console.log('🔑 Iniciando cadastro...')
      console.log('📋 Dados:', { email, password, name, phone })
      
      if (!auth.signUp) {
        console.error('❌ Função signUp não disponível')
        toast.error('Erro: função signUp não disponível')
        return
      }

      const result = await auth.signUp(email, password, {
        name: name,
        phone: phone
      })
      
      console.log('📋 Resultado:', result)

      if (result.error) {
        console.error('❌ Erro no cadastro:', result.error)
        toast.error(`Erro: ${result.error.message}`)
      } else {
        console.log('✅ Cadastro bem-sucedido!')
        toast.success('Cadastro realizado com sucesso!')
      }
    } catch (error) {
      console.error('❌ Exceção no cadastro:', error)
      toast.error(`Erro interno: ${error}`)
    }
  }

  const handleLogin = async () => {
    try {
      console.log('🔑 Iniciando login...')
      console.log('📋 Dados:', { email, password })
      
      if (!auth.signIn) {
        console.error('❌ Função signIn não disponível')
        toast.error('Erro: função signIn não disponível')
        return
      }

      const result = await auth.signIn(email, password)
      
      console.log('📋 Resultado:', result)

      if (result.error) {
        console.error('❌ Erro no login:', result.error)
        toast.error(`Erro: ${result.error.message}`)
      } else {
        console.log('✅ Login bem-sucedido!')
        toast.success('Login realizado com sucesso!')
      }
    } catch (error) {
      console.error('❌ Exceção no login:', error)
      toast.error(`Erro interno: ${error}`)
    }
  }

  const handleLogout = async () => {
    try {
      console.log('🔑 Iniciando logout...')
      
      if (!auth.signOut) {
        console.error('❌ Função signOut não disponível')
        toast.error('Erro: função signOut não disponível')
        return
      }

      await auth.signOut()
      
      console.log('✅ Logout bem-sucedido!')
      toast.success('Logout realizado!')
    } catch (error) {
      console.error('❌ Exceção no logout:', error)
      toast.error(`Erro interno: ${error}`)
    }
  }

  const clearStorage = () => {
    localStorage.removeItem('offline_users')
    localStorage.removeItem('offline_current_user')
    toast.success('Storage limpo!')
    window.location.reload()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          🧪 Teste de Autenticação Simples
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status */}
        <div className={`p-4 rounded-lg ${auth.isAuthenticated ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="text-center">
            <div className="text-lg font-bold mb-2">
              Status: {auth.loading ? '⏳ Carregando...' : auth.isAuthenticated ? '✅ AUTENTICADO' : '❌ NÃO AUTENTICADO'}
            </div>
            {auth.isAuthenticated && auth.profile && (
              <div className="text-sm space-y-1">
                                 <div>Nome: {auth.profile.name}</div>
                <div>Email: {auth.profile.email}</div>
                <div>Telefone: {auth.profile.phone}</div>
              </div>
            )}
          </div>
        </div>

        {/* Formulário */}
        {!auth.isAuthenticated && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Senha</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="123456"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Usuario Teste"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Telefone</label>
              <Input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
        )}

        {/* Botões */}
        <div className="space-y-2">
          {!auth.isAuthenticated ? (
            <div className="flex gap-2">
              <Button onClick={handleSignup} className="flex-1">
                📝 Cadastrar
              </Button>
              <Button onClick={handleLogin} variant="outline" className="flex-1">
                🔑 Login
              </Button>
            </div>
          ) : (
            <Button onClick={handleLogout} variant="destructive" className="w-full">
              🚪 Logout
            </Button>
          )}
          
          <Button onClick={clearStorage} variant="outline" size="sm" className="w-full">
            🧹 Limpar Storage
          </Button>
        </div>

        {/* Debug */}
        <details className="text-xs">
          <summary className="cursor-pointer font-medium">🔍 Debug Info</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
            {JSON.stringify({
              isAuthenticated: auth.isAuthenticated,
              hasUser: !!auth.user,
              hasProfile: !!auth.profile,
              loading: auth.loading,
              functions: {
                signUp: typeof auth.signUp,
                signIn: typeof auth.signIn,
                signOut: typeof auth.signOut
              },
              localStorage: {
                currentUser: !!localStorage.getItem('offline_current_user'),
                users: !!localStorage.getItem('offline_users')
              }
            }, null, 2)}
          </pre>
        </details>
      </CardContent>
    </Card>
  )
}
