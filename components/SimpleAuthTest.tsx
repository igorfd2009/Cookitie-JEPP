import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export function SimpleAuthTest() {
  const { signUp, signIn, user, profile, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('test@cookite.com')
  const [password, setPassword] = useState('123456')
  const [name, setName] = useState('Usuário Teste')
  const [result, setResult] = useState<string>('')

  const testSignUp = async () => {
    setResult('Iniciando cadastro...')
    
    try {
      console.log('🔍 Testando cadastro com:', { email, password, name })
      
      // Verificar localStorage antes
      const beforeUsers = localStorage.getItem('offline_users')
      console.log('📦 Usuários antes:', beforeUsers)
      
      // Tentar cadastro
      const signUpResult = await signUp(email, password, { full_name: name })
      console.log('📤 Resultado do cadastro:', signUpResult)
      
      if (signUpResult.error) {
        setResult(`❌ Erro: ${signUpResult.error.message}`)
        return
      }
      
      // Verificar localStorage depois
      const afterUsers = localStorage.getItem('offline_users')
      console.log('📦 Usuários depois:', afterUsers)
      
      // Verificar estado do usuário
      console.log('👤 Usuário atual:', user)
      console.log('📋 Perfil atual:', profile)
      
      setResult('✅ Cadastro realizado com sucesso!')
      
    } catch (error) {
      console.error('💥 Erro inesperado:', error)
      setResult(`💥 Erro inesperado: ${error}`)
    }
  }

  const testSignIn = async () => {
    setResult('Iniciando login...')
    
    try {
      console.log('🔍 Testando login com:', { email, password })
      
      const signInResult = await signIn(email, password)
      console.log('📤 Resultado do login:', signInResult)
      
      if (signInResult.error) {
        setResult(`❌ Erro: ${signInResult.error.message}`)
        return
      }
      
      setResult('✅ Login realizado com sucesso!')
      
    } catch (error) {
      console.error('💥 Erro inesperado:', error)
      setResult(`💥 Erro inesperado: ${error}`)
    }
  }

  const checkLocalStorage = () => {
    const offlineUsers = localStorage.getItem('offline_users')
    const currentUser = localStorage.getItem('offline_current_user')
    
    console.log('📦 localStorage atual:')
    console.log('offline_users:', offlineUsers)
    console.log('offline_current_user:', currentUser)
    
    setResult(`📦 localStorage verificado. Usuários: ${offlineUsers ? JSON.parse(offlineUsers).length : 0}`)
  }

  const clearStorage = () => {
    localStorage.removeItem('offline_users')
    localStorage.removeItem('offline_current_user')
    setResult('🧹 localStorage limpo!')
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Teste Simples de Autenticação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@cookite.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="123456"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Usuário Teste"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={testSignUp} className="flex-1">
              🧪 Testar Cadastro
            </Button>
            <Button onClick={testSignIn} variant="outline" className="flex-1">
              🔑 Testar Login
            </Button>
          </div>

          <div className="flex gap-2">
            <Button onClick={checkLocalStorage} variant="outline" className="flex-1">
              📦 Verificar localStorage
            </Button>
            <Button onClick={clearStorage} variant="destructive" className="flex-1">
              🧹 Limpar Storage
            </Button>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Resultado:</h4>
            <p className="text-sm">{result || 'Nenhuma ação executada'}</p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">Status Atual:</h4>
            <div className="text-sm space-y-1">
              <p>Autenticado: {isAuthenticated ? '✅ Sim' : '❌ Não'}</p>
              <p>Usuário: {user ? `✅ ${user.email}` : '❌ Nenhum'}</p>
              <p>Perfil: {profile ? `✅ ${profile.full_name}` : '❌ Nenhum'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
