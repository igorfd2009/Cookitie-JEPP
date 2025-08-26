import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { isSupabaseAvailable } from '../lib/supabase'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { toast } from 'react-toastify'

export const AuthDebug: React.FC = () => {
  const { signUp, signIn, user, profile, loading } = useAuth()
  const [testEmail, setTestEmail] = useState('teste@exemplo.com')
  const [testPassword, setTestPassword] = useState('123456')
  const [testName, setTestName] = useState('Usuário Teste')
  const [testPhone, setTestPhone] = useState('(11) 99999-9999')
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const testSignup = async () => {
    try {
      console.log('🔍 Testando cadastro...')
      console.log('Email:', testEmail)
      console.log('Password:', testPassword)
      console.log('Name:', testName)
      console.log('Phone:', testPhone)
      
      const result = await signUp(testEmail, testPassword, {
        full_name: testName,
        phone: testPhone
      })
      
      console.log('📋 Resultado do cadastro:', result)
      setDebugInfo({ type: 'signup', result, timestamp: new Date().toISOString() })
      
      if (result.error) {
        toast.error(`Erro no cadastro: ${result.error.message}`)
      } else {
        toast.success('Cadastro realizado com sucesso!')
      }
    } catch (error) {
      console.error('❌ Erro no teste de cadastro:', error)
      toast.error(`Erro interno: ${error}`)
    }
  }

  const testSignin = async () => {
    try {
      console.log('🔍 Testando login...')
      console.log('Email:', testEmail)
      console.log('Password:', testPassword)
      
      const result = await signIn(testEmail, testPassword)
      
      console.log('📋 Resultado do login:', result)
      setDebugInfo({ type: 'signin', result, timestamp: new Date().toISOString() })
      
      if (result.error) {
        toast.error(`Erro no login: ${result.error.message}`)
      } else {
        toast.success('Login realizado com sucesso!')
      }
    } catch (error) {
      console.error('❌ Erro no teste de login:', error)
      toast.error(`Erro interno: ${error}`)
    }
  }

  const checkLocalStorage = () => {
    const offlineUsers = localStorage.getItem('offline_users')
    const currentUser = localStorage.getItem('offline_current_user')
    
    console.log('📦 Dados do localStorage:')
    console.log('offline_users:', offlineUsers)
    console.log('offline_current_user:', currentUser)
    
    setDebugInfo({ 
      type: 'localStorage', 
      offlineUsers: offlineUsers ? JSON.parse(offlineUsers) : null,
      currentUser: currentUser ? JSON.parse(currentUser) : null,
      timestamp: new Date().toISOString()
    })
  }

  const clearLocalStorage = () => {
    localStorage.removeItem('offline_users')
    localStorage.removeItem('offline_current_user')
    toast.success('LocalStorage limpo!')
    setDebugInfo(null)
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔧 Debug do Sistema de Autenticação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status do Sistema */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Supabase:</span>
              <Badge variant={isSupabaseAvailable() ? "default" : "secondary"}>
                {isSupabaseAvailable() ? "Online" : "Offline"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Usuário:</span>
              <Badge variant={user ? "default" : "outline"}>
                {user ? "Logado" : "Não logado"}
              </Badge>
            </div>
          </div>

          {/* Formulário de Teste */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="testEmail">Email</Label>
              <Input
                id="testEmail"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="teste@exemplo.com"
              />
            </div>
            <div>
              <Label htmlFor="testPassword">Senha</Label>
              <Input
                id="testPassword"
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                placeholder="123456"
              />
            </div>
            <div>
              <Label htmlFor="testName">Nome</Label>
              <Input
                id="testName"
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="Usuário Teste"
              />
            </div>
            <div>
              <Label htmlFor="testPhone">Telefone</Label>
              <Input
                id="testPhone"
                type="text"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          {/* Botões de Teste */}
          <div className="flex gap-2 flex-wrap">
            <Button onClick={testSignup} disabled={loading}>
              🧪 Testar Cadastro
            </Button>
            <Button onClick={testSignin} disabled={loading}>
              🔑 Testar Login
            </Button>
            <Button onClick={checkLocalStorage} variant="outline">
              📦 Verificar LocalStorage
            </Button>
            <Button onClick={clearLocalStorage} variant="destructive">
              🗑️ Limpar LocalStorage
            </Button>
          </div>

          {/* Informações do Usuário Atual */}
          {user && profile && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">👤 Usuário Atual:</h4>
              <div className="text-sm space-y-1 bg-gray-50 p-3 rounded">
                <div><strong>ID:</strong> {user.id}</div>
                <div><strong>Email:</strong> {profile.email}</div>
                <div><strong>Nome:</strong> {profile.full_name || 'Não informado'}</div>
                <div><strong>Telefone:</strong> {profile.phone || 'Não informado'}</div>
                <div><strong>Pedidos:</strong> {profile.total_pedidos || 0}</div>
                <div><strong>Total gasto:</strong> R$ {(profile.total_gasto || 0).toFixed(2)}</div>
              </div>
            </div>
          )}

          {/* Debug Info */}
          {debugInfo && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">📋 Último Debug:</h4>
              <div className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
