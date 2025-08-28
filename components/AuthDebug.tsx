import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { 
  User, 
  Mail, 
 
  Database,



  RefreshCw,
  UserPlus,
  LogIn,
  LogOut,
  Bug
} from 'lucide-react'

export function AuthDebug() {
  const { user, profile, isAuthenticated, signIn, signUp, signOut, loading } = useAuth()
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [testEmail, setTestEmail] = useState('test@cookite.com')
  const [testPassword, setTestPassword] = useState('123456')
  const [testName, setTestName] = useState('Usuário Teste')
  const [testPhone, setTestPhone] = useState('11999999999')
  const [lastAction, setLastAction] = useState<string>('')
  const [lastResult, setLastResult] = useState<any>(null)

  // Função para coletar informações de debug
  const collectDebugInfo = () => {
    const info = {
      timestamp: new Date().toISOString(),
      localStorage: {
        offline_users: localStorage.getItem('offline_users'),
        offline_current_user: localStorage.getItem('offline_current_user'),
        user_orders: localStorage.getItem('user_orders')
      },
      authState: {
        isAuthenticated,
        loading,
        user: user ? { id: user.id, email: user.email } : null,
        profile: profile ? { id: profile.id, email: profile.email, name: profile.name } : null
      },
      environment: {
        hasSupabase: !!import.meta.env.VITE_SUPABASE_URL,
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
        nodeEnv: import.meta.env.MODE
      }
    }
    setDebugInfo(info)
    return info
  }

  // Teste de cadastro com debug
  const testSignUp = async () => {
    setLastAction('Cadastro')
    setLastResult(null)
    
    try {
      console.log('🔍 Iniciando teste de cadastro...')
      console.log('📧 Email:', testEmail)
      console.log('🔑 Senha:', testPassword)
      console.log('👤 Nome:', testName)
      console.log('📱 Telefone:', testPhone)
      
      // Coletar info antes
      const beforeInfo = collectDebugInfo()
      console.log('📊 Estado antes:', beforeInfo)
      
      // Tentar cadastro
      const result = await signUp(testEmail, testPassword, { 
        name: testName,
        phone: testPhone
      })
      
      console.log('📤 Resultado do cadastro:', result)
      setLastResult(result)
      
      // Aguardar um pouco para o estado atualizar
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Coletar info depois
      const afterInfo = collectDebugInfo()
      console.log('📊 Estado depois:', afterInfo)
      
      // Verificar se funcionou
      if (!result.error) {
        console.log('✅ Cadastro realizado com sucesso!')
        console.log('👤 Usuário criado:', afterInfo.authState.user)
        console.log('📋 Perfil criado:', afterInfo.authState.profile)
      } else {
        console.error('❌ Erro no cadastro:', result.error)
      }
      
    } catch (error) {
      console.error('💥 Erro inesperado no cadastro:', error)
      setLastResult({ error: { message: `Erro inesperado: ${error}` } })
    }
  }

  // Teste de login com debug
  const testSignIn = async () => {
    setLastAction('Login')
    setLastResult(null)
    
    try {
      console.log('🔍 Iniciando teste de login...')
      console.log('📧 Email:', testEmail)
      console.log('🔑 Senha:', testPassword)
      
      // Coletar info antes
      const beforeInfo = collectDebugInfo()
      console.log('📊 Estado antes:', beforeInfo)
      
      // Tentar login
      const result = await signIn(testEmail, testPassword)
      
      console.log('📤 Resultado do login:', result)
      setLastResult(result)
      
      // Aguardar um pouco para o estado atualizar
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Coletar info depois
      const afterInfo = collectDebugInfo()
      console.log('📊 Estado depois:', afterInfo)
      
      // Verificar se funcionou
      if (!result.error) {
        console.log('✅ Login realizado com sucesso!')
        console.log('👤 Usuário logado:', afterInfo.authState.user)
        console.log('📋 Perfil carregado:', afterInfo.authState.profile)
      } else {
        console.error('❌ Erro no login:', result.error)
      }
      
    } catch (error) {
      console.error('💥 Erro inesperado no login:', error)
      setLastResult({ error: { message: `Erro inesperado: ${error}` } })
    }
  }

  // Teste de logout
  const testSignOut = async () => {
    setLastAction('Logout')
    setLastResult(null)
    
    try {
      console.log('🔍 Iniciando teste de logout...')
      
      // Coletar info antes
      const beforeInfo = collectDebugInfo()
      console.log('📊 Estado antes:', beforeInfo)
      
      // Fazer logout
      await signOut()
      
      // Aguardar um pouco para o estado atualizar
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Coletar info depois
      const afterInfo = collectDebugInfo()
      console.log('📊 Estado depois:', afterInfo)
      
      console.log('✅ Logout realizado com sucesso!')
      
    } catch (error) {
      console.error('💥 Erro inesperado no logout:', error)
      setLastResult({ error: { message: `Erro inesperado: ${error}` } })
    }
  }

  // Limpar localStorage
  const clearLocalStorage = () => {
    try {
      localStorage.removeItem('offline_users')
      localStorage.removeItem('offline_current_user')
      localStorage.removeItem('user_orders')
      console.log('🧹 localStorage limpo com sucesso!')
      collectDebugInfo()
    } catch (error) {
      console.error('❌ Erro ao limpar localStorage:', error)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="w-6 h-6 text-red-500" />
            Debug do Sistema de Autenticação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Atual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="w-5 h-5" />
                Status da Autenticação
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Autenticado:</span>
                  <Badge variant={isAuthenticated ? 'default' : 'secondary'}>
                    {isAuthenticated ? 'Sim' : 'Não'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Loading:</span>
                  <Badge variant={loading ? 'secondary' : 'default'}>
                    {loading ? 'Sim' : 'Não'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Usuário ID:</span>
                  <span className="truncate max-w-32">{user?.id || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Dados do Perfil
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Nome:</span>
                  <span className="truncate max-w-32">
                                         {profile?.name || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Email:</span>
                  <span className="truncate max-w-32">
                    {profile?.email || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Telefone:</span>
                  <span className="truncate max-w-32">
                    {profile?.phone || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Database className="w-5 h-5" />
                Ambiente
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Supabase:</span>
                  <Badge variant={!!import.meta.env.VITE_SUPABASE_URL ? 'default' : 'secondary'}>
                    {!!import.meta.env.VITE_SUPABASE_URL ? 'Configurado' : 'Não configurado'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Modo:</span>
                  <Badge variant="outline">
                    {import.meta.env.MODE}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Usuários Offline:</span>
                  <span>
                    {JSON.parse(localStorage.getItem('offline_users') || '[]').length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Configuração de Teste */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Configuração de Teste</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="testEmail">Email de Teste</Label>
                <Input
                  id="testEmail"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="testPassword">Senha de Teste</Label>
                <Input
                  id="testPassword"
                  type="password"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="testName">Nome de Teste</Label>
                <Input
                  id="testName"
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="testPhone">Telefone de Teste</Label>
                <Input
                  id="testPhone"
                  type="text"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Ações de Teste */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Ações de Teste</h3>
            <div className="flex flex-wrap gap-3">
              <Button onClick={testSignUp} className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Testar Cadastro
              </Button>

              <Button 
                onClick={testSignIn} 
                variant="outline" 
                className="flex items-center gap-2"
                disabled={!isAuthenticated}
              >
                <LogIn className="w-4 h-4" />
                Testar Login
              </Button>

              <Button 
                onClick={testSignOut} 
                variant="outline" 
                className="flex items-center gap-2"
                disabled={!isAuthenticated}
              >
                <LogOut className="w-4 h-4" />
                Testar Logout
              </Button>

              <Button 
                onClick={collectDebugInfo} 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Atualizar Debug
              </Button>

              <Button 
                onClick={clearLocalStorage} 
                variant="destructive" 
                className="flex items-center gap-2"
              >
                🧹 Limpar localStorage
              </Button>
            </div>
          </div>

          {/* Última Ação */}
          {lastAction && (
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Última Ação: {lastAction}</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(lastResult, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Informações de Debug */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Informações de Debug</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <pre className="text-sm overflow-auto max-h-96">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
