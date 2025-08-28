import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useOrders } from '../hooks/useOrders'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { 
  User, 
  Mail, 
 
 
  Database,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  UserPlus,
  LogIn,
  LogOut,
  ShoppingBag
} from 'lucide-react'

export function AuthTestFixed() {
  const { user, profile, isAuthenticated, signIn, signUp, signOut, loading } = useAuth()
  const { orders, loadOrders } = useOrders()
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})
  const [testEmail, setTestEmail] = useState('test@cookite.com')
  const [testPassword, setTestPassword] = useState('123456')
  const [testName, setTestName] = useState('Usuário Teste')

  // Teste 1: Persistência de sessão
  const testSessionPersistence = async () => {
    try {
      // Simular logout e login
      await signOut()
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const result = await signIn(testEmail, testPassword)
      if (!result.error && profile?.name) {
        setTestResults(prev => ({ ...prev, sessionPersistence: true }))
        return true
      }
      
      setTestResults(prev => ({ ...prev, sessionPersistence: false }))
      return false
    } catch (error) {
      setTestResults(prev => ({ ...prev, sessionPersistence: false }))
      return false
    }
  }

  // Teste 2: Prevenção de contas duplicadas
  const testDuplicateAccountPrevention = async () => {
    try {
      // Tentar criar conta com email já existente
              const result = await signUp(testEmail, testPassword, { name: 'Outro Nome' })
      
      // Deve dar erro de email já cadastrado
      if (result.error && result.error.message.includes('já cadastrado')) {
        setTestResults(prev => ({ ...prev, duplicatePrevention: true }))
        return true
      }
      
      setTestResults(prev => ({ ...prev, duplicatePrevention: false }))
      return false
    } catch (error) {
      setTestResults(prev => ({ ...prev, duplicatePrevention: false }))
      return false
    }
  }

  // Teste 3: Sincronização de dados
  const testDataSync = async () => {
    try {
      // Verificar se pedidos carregam corretamente
      loadOrders()
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Verificar se dados do usuário são consistentes
      const hasValidProfile = profile?.name && profile?.email
      const ordersLoaded = Array.isArray(orders)
      
      if (hasValidProfile && ordersLoaded) {
        setTestResults(prev => ({ ...prev, dataSync: true }))
        return true
      }
      
      setTestResults(prev => ({ ...prev, dataSync: false }))
      return false
    } catch (error) {
      setTestResults(prev => ({ ...prev, dataSync: false }))
      return false
    }
  }

  // Executar todos os testes
  const runAllTests = async () => {
    setTestResults({})
    
    // Primeiro criar uma conta de teste se não existir
    const signUpResult = await signUp(testEmail, testPassword, { 
              name: testName,
      phone: '11999999999'
    })
    
    if (signUpResult.error && !signUpResult.error.message.includes('já cadastrado')) {
      console.error('Erro ao criar conta de teste:', signUpResult.error)
      return
    }
    
    // Executar testes
    await testSessionPersistence()
    await testDuplicateAccountPrevention()
    await testDataSync()
  }

  const TestResultIcon = ({ result }: { result: boolean | undefined }) => {
    if (result === undefined) return <AlertCircle className="w-5 h-5 text-gray-400" />
    return result ? 
      <CheckCircle className="w-5 h-5 text-green-500" /> : 
      <XCircle className="w-5 h-5 text-red-500" />
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-6 h-6" />
            Sistema de Autenticação - Testes de Correção
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Atual */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <span>Pedidos:</span>
                  <span>{orders.length} pedidos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Configuração de Teste */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Configuração de Teste</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email de Teste</label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Senha de Teste</label>
                <input
                  type="password"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nome de Teste</label>
                <input
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* Resultados dos Testes */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Resultados dos Testes</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <TestResultIcon result={testResults.sessionPersistence} />
                  <div>
                    <div className="font-medium">Persistência de Sessão</div>
                    <div className="text-sm text-gray-600">
                      Dados do usuário mantidos após logout/login
                    </div>
                  </div>
                </div>
                <Button
                  onClick={testSessionPersistence}
                  variant="outline"
                  size="sm"
                  disabled={!isAuthenticated}
                >
                  Testar
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <TestResultIcon result={testResults.duplicatePrevention} />
                  <div>
                    <div className="font-medium">Prevenção de Contas Duplicadas</div>
                    <div className="text-sm text-gray-600">
                      Sistema impede criação de contas com mesmo email
                    </div>
                  </div>
                </div>
                <Button
                  onClick={testDuplicateAccountPrevention}
                  variant="outline"
                  size="sm"
                  disabled={!isAuthenticated}
                >
                  Testar
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <TestResultIcon result={testResults.dataSync} />
                  <div>
                    <div className="font-medium">Sincronização de Dados</div>
                    <div className="text-sm text-gray-600">
                      Pedidos e dados sincronizados entre dispositivos
                    </div>
                  </div>
                </div>
                <Button
                  onClick={testDataSync}
                  variant="outline"
                  size="sm"
                  disabled={!isAuthenticated}
                >
                  Testar
                </Button>
              </div>
            </div>
          </div>

          {/* Ações de Teste */}
          <div className="border-t pt-6 flex flex-wrap gap-3">
            <Button onClick={runAllTests} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Executar Todos os Testes
            </Button>

            {!isAuthenticated ? (
              <>
                <Button
                                     onClick={() => signUp(testEmail, testPassword, { name: testName })}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Criar Conta Teste
                </Button>
                <Button
                  onClick={() => signIn(testEmail, testPassword)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Fazer Login
                </Button>
              </>
            ) : (
              <Button
                onClick={signOut}
                variant="outline"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Fazer Logout
              </Button>
            )}

            <Button
              onClick={loadOrders}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Recarregar Pedidos
            </Button>
          </div>

          {/* Resumo dos Testes */}
          {Object.keys(testResults).length > 0 && (
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Resumo</h3>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm">
                  <div className="font-medium mb-2">Testes Executados: {Object.keys(testResults).length}/3</div>
                  <div className="text-green-600">
                    ✅ Passou: {Object.values(testResults).filter(Boolean).length}
                  </div>
                  <div className="text-red-600">
                    ❌ Falhou: {Object.values(testResults).filter(r => !r).length}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
