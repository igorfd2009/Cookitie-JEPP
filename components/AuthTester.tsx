import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'

export const AuthTester: React.FC = () => {
  const { signUp, signIn, signOut, profile, isAuthenticated, loading } = useAuth()
  const [email, setEmail] = useState('teste@exemplo.com')
  const [password, setPassword] = useState('123456')
  const [name, setName] = useState('Usuário Teste')
  const [phone, setPhone] = useState('(11) 99999-9999')

  const handleTestSignup = async () => {
    try {
      console.log('🧪 Teste de cadastro iniciado')
      const result = await signUp(email, password, {
        name: name,
        phone: phone
      })
      
      if (result.error) {
        toast.error(`Erro: ${result.error.message}`)
      } else {
        toast.success('Cadastro realizado com sucesso!')
      }
    } catch (error) {
      console.error('Erro no teste:', error)
      toast.error('Erro interno')
    }
  }

  const handleTestLogin = async () => {
    try {
      console.log('🧪 Teste de login iniciado')
      const result = await signIn(email, password)
      
      if (result.error) {
        toast.error(`Erro: ${result.error.message}`)
      } else {
        toast.success('Login realizado com sucesso!')
      }
    } catch (error) {
      console.error('Erro no teste:', error)
      toast.error('Erro interno')
    }
  }

  const handleTestLogout = async () => {
    try {
      await signOut()
      toast.success('Logout realizado!')
    } catch (error) {
      console.error('Erro no logout:', error)
      toast.error('Erro no logout')
    }
  }

  const clearLocalStorage = () => {
    localStorage.removeItem('offline_users')
    localStorage.removeItem('offline_current_user')
    toast.success('LocalStorage limpo!')
    window.location.reload()
  }

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center">Carregando...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          🧪 Teste de Autenticação
          <Badge variant={isAuthenticated ? "default" : "secondary"}>
            {isAuthenticated ? "Logado" : "Deslogado"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status atual */}
        {isAuthenticated && profile ? (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-sm">
                             <div><strong>Nome:</strong> {profile.name}</div>
              <div><strong>Email:</strong> {profile.email}</div>
              <div><strong>Telefone:</strong> {profile.phone}</div>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-sm text-gray-600">Nenhum usuário logado</div>
          </div>
        )}

        {/* Formulário de teste */}
        {!isAuthenticated && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="test-email">Email</Label>
              <Input
                id="test-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="test-password">Senha</Label>
              <Input
                id="test-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="test-name">Nome</Label>
              <Input
                id="test-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="test-phone">Telefone</Label>
              <Input
                id="test-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex gap-2 flex-wrap">
          {!isAuthenticated ? (
            <>
              <Button onClick={handleTestSignup} className="flex-1">
                Cadastrar
              </Button>
              <Button onClick={handleTestLogin} variant="outline" className="flex-1">
                Login
              </Button>
            </>
          ) : (
            <Button onClick={handleTestLogout} variant="destructive" className="w-full">
              Logout
            </Button>
          )}
        </div>

        {/* Botão de limpar */}
        <Button onClick={clearLocalStorage} variant="outline" size="sm" className="w-full">
          Limpar LocalStorage
        </Button>

        {/* Instruções */}
        <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
          <strong>Como testar:</strong><br/>
          1. Preencha os dados<br/>
          2. Clique em "Cadastrar"<br/>
          3. Verifique se o status muda para "Logado"<br/>
          4. Teste o "Logout"<br/>
          5. Teste o "Login" com os mesmos dados
        </div>
      </CardContent>
    </Card>
  )
}
