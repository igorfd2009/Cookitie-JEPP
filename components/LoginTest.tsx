import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'

export const LoginTest: React.FC = () => {
  const { signUp, signIn, signOut, profile, isAuthenticated, loading } = useAuth()
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('123456')
  const [name, setName] = useState('Usuário Teste')
  const [phone, setPhone] = useState('(11) 99999-9999')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSignup = async () => {
    if (isProcessing) return
    setIsProcessing(true)
    
    try {
      const result = await signUp(email, password, {
        full_name: name,
        phone: phone
      })
      
      if (result.error) {
        toast.error(`Erro no cadastro: ${result.error.message}`)
      } else {
        toast.success('✅ Cadastro realizado com sucesso!')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro interno no cadastro')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleLogin = async () => {
    if (isProcessing) return
    setIsProcessing(true)
    
    try {
      const result = await signIn(email, password)
      
      if (result.error) {
        toast.error(`Erro no login: ${result.error.message}`)
      } else {
        toast.success('✅ Login realizado com sucesso!')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro interno no login')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleLogout = async () => {
    if (isProcessing) return
    setIsProcessing(true)
    
    try {
      await signOut()
      toast.success('✅ Logout realizado!')
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro no logout')
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Carregando sistema de autenticação...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          🔐 Teste de Login Simplificado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status atual */}
        <div className={`p-4 rounded-lg border-2 ${isAuthenticated ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
          <div className="text-center">
            <div className="text-lg font-bold mb-2">
              {isAuthenticated ? '✅ LOGADO' : '❌ DESLOGADO'}
            </div>
            {isAuthenticated && profile && (
              <div className="text-sm space-y-1">
                <div><strong>Nome:</strong> {profile.full_name}</div>
                <div><strong>Email:</strong> {profile.email}</div>
                <div><strong>Telefone:</strong> {profile.phone}</div>
              </div>
            )}
          </div>
        </div>

        {/* Formulário de teste */}
        {!isAuthenticated && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Senha</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
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

        {/* Botões de ação */}
        <div className="space-y-2">
          {!isAuthenticated ? (
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={handleSignup} 
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isProcessing ? '⏳' : '📝'} Cadastrar
              </Button>
              <Button 
                onClick={handleLogin} 
                disabled={isProcessing}
                variant="outline"
              >
                {isProcessing ? '⏳' : '🔑'} Login
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleLogout} 
              disabled={isProcessing}
              variant="destructive" 
              className="w-full"
            >
              {isProcessing ? '⏳' : '🚪'} Sair
            </Button>
          )}
        </div>

        {/* Debug info */}
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <div><strong>Status:</strong> {isAuthenticated ? 'Autenticado' : 'Não autenticado'}</div>
          <div><strong>Loading:</strong> {loading ? 'Sim' : 'Não'}</div>
          <div><strong>Processing:</strong> {isProcessing ? 'Sim' : 'Não'}</div>
        </div>
      </CardContent>
    </Card>
  )
}
