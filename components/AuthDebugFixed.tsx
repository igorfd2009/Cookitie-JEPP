import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'
import { CheckCircle, XCircle, AlertCircle, User, Mail, Phone, Calendar } from 'lucide-react'

export const AuthDebugFixed: React.FC = () => {
  const { signUp, signIn, signOut, user, profile, isAuthenticated, loading } = useAuth()
  const [testEmail, setTestEmail] = useState('usuario@teste.com')
  const [testPassword, setTestPassword] = useState('123456')
  const [testName, setTestName] = useState('Usuário de Teste')
  const [testPhone, setTestPhone] = useState('(11) 99999-9999')
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Verificar estado da autenticação a cada mudança
  useEffect(() => {
    setDebugInfo({
      timestamp: new Date().toISOString(),
      isAuthenticated,
      hasUser: !!user,
      hasProfile: !!profile,
      loading,
      userEmail: user?.email,
      profileName: profile?.full_name,
      localStorage: {
        currentUser: localStorage.getItem('offline_current_user'),
        users: localStorage.getItem('offline_users')
      }
    })
  }, [isAuthenticated, user, profile, loading])

  const testSignup = async () => {
    if (isProcessing) return
    setIsProcessing(true)
    
    try {
      console.log('🧪 TESTE CADASTRO - Iniciando...')
      console.log('📋 Dados:', { email: testEmail, password: testPassword, name: testName, phone: testPhone })
      
      const result = await signUp(testEmail, testPassword, {
        full_name: testName,
        phone: testPhone
      })
      
      console.log('📋 RESULTADO CADASTRO:', result)
      
      if (result.error) {
        toast.error(`❌ Erro no cadastro: ${result.error.message}`)
        console.error('❌ ERRO CADASTRO:', result.error)
      } else {
        toast.success('✅ Cadastro realizado com sucesso!')
        console.log('✅ CADASTRO OK')
      }
    } catch (error) {
      console.error('❌ EXCEÇÃO CADASTRO:', error)
      toast.error(`❌ Erro interno: ${error}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const testSignin = async () => {
    if (isProcessing) return
    setIsProcessing(true)
    
    try {
      console.log('🧪 TESTE LOGIN - Iniciando...')
      console.log('📋 Dados:', { email: testEmail, password: testPassword })
      
      const result = await signIn(testEmail, testPassword)
      
      console.log('📋 RESULTADO LOGIN:', result)
      
      if (result.error) {
        toast.error(`❌ Erro no login: ${result.error.message}`)
        console.error('❌ ERRO LOGIN:', result.error)
      } else {
        toast.success('✅ Login realizado com sucesso!')
        console.log('✅ LOGIN OK')
      }
    } catch (error) {
      console.error('❌ EXCEÇÃO LOGIN:', error)
      toast.error(`❌ Erro interno: ${error}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const testSignout = async () => {
    if (isProcessing) return
    setIsProcessing(true)
    
    try {
      console.log('🧪 TESTE LOGOUT - Iniciando...')
      
      await signOut()
      
      toast.success('✅ Logout realizado!')
      console.log('✅ LOGOUT OK')
    } catch (error) {
      console.error('❌ EXCEÇÃO LOGOUT:', error)
      toast.error(`❌ Erro no logout: ${error}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const clearLocalStorage = () => {
    localStorage.removeItem('offline_users')
    localStorage.removeItem('offline_current_user')
    toast.success('🧹 LocalStorage limpo!')
    window.location.reload()
  }

  const getStatusIcon = () => {
    if (loading) return <AlertCircle className="w-5 h-5 text-yellow-500" />
    if (isAuthenticated) return <CheckCircle className="w-5 h-5 text-green-500" />
    return <XCircle className="w-5 h-5 text-red-500" />
  }

  const getStatusText = () => {
    if (loading) return 'Carregando...'
    if (isAuthenticated) return 'AUTENTICADO'
    return 'NÃO AUTENTICADO'
  }

  const getStatusColor = () => {
    if (loading) return 'bg-yellow-50 border-yellow-200 text-yellow-800'
    if (isAuthenticated) return 'bg-green-50 border-green-200 text-green-800'
    return 'bg-red-50 border-red-200 text-red-800'
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Status Principal */}
      <Card className={`border-2 ${getStatusColor()}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {getStatusIcon()}
            🔐 Sistema de Autenticação - {getStatusText()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isAuthenticated && profile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">Nome:</span>
                  <span>{profile.full_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="font-medium">Email:</span>
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span className="font-medium">Telefone:</span>
                  <span>{profile.phone}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Cadastro:</span>
                  <span>{new Date(profile.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <Badge variant="secondary">
                    {profile.total_pedidos || 0} pedidos realizados
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Nenhum usuário logado</p>
          )}
        </CardContent>
      </Card>

      {/* Formulário de Teste */}
      <Card>
        <CardHeader>
          <CardTitle>🧪 Teste de Funcionalidades</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email:</label>
              <Input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="usuario@teste.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Senha:</label>
              <Input
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                placeholder="123456"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Nome:</label>
              <Input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="Usuário de Teste"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Telefone:</label>
              <Input
                type="text"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {!isAuthenticated ? (
              <>
                <Button 
                  onClick={testSignup} 
                  disabled={isProcessing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessing ? '⏳' : '📝'} Testar Cadastro
                </Button>
                <Button 
                  onClick={testSignin} 
                  disabled={isProcessing}
                  variant="outline"
                >
                  {isProcessing ? '⏳' : '🔑'} Testar Login
                </Button>
              </>
            ) : (
              <Button 
                onClick={testSignout} 
                disabled={isProcessing}
                variant="destructive"
              >
                {isProcessing ? '⏳' : '🚪'} Testar Logout
              </Button>
            )}
            
            <Button 
              onClick={clearLocalStorage} 
              variant="outline"
              className="bg-gray-100 hover:bg-gray-200"
            >
              🧹 Limpar Storage
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Debug Info */}
      <Card>
        <CardHeader>
          <CardTitle>🔍 Informações de Debug</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {/* Instruções */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">📋 Como Testar</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 space-y-2">
          <p><strong>1. Cadastro:</strong> Preencha os dados e clique em "Testar Cadastro"</p>
          <p><strong>2. Verificação:</strong> Veja se o status muda para "AUTENTICADO"</p>
          <p><strong>3. Logout:</strong> Clique em "Testar Logout" para deslogar</p>
          <p><strong>4. Login:</strong> Use os mesmos dados para testar o login</p>
          <p><strong>5. Storage:</strong> Use "Limpar Storage" se houver problemas</p>
        </CardContent>
      </Card>
    </div>
  )
}
