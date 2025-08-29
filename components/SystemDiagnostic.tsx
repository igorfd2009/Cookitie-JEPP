import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useOrders } from '../hooks/useOrders'
import { isSupabaseAvailable, testSupabaseConnection } from '../lib/supabase'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  User, 
  Database, 
  ShoppingCart,
  Trash2,
  TestTube
} from 'lucide-react'

interface DiagnosticResult {
  test: string
  status: 'success' | 'error' | 'warning' | 'pending'
  message: string
  details?: any
}

interface ConnectivityResult {
  available: boolean
  reason: string
}

export function SystemDiagnostic() {
  const { user, profile, isAuthenticated, signUp, signIn, signOut, loading } = useAuth()
  const { orders, createOrder, loadOrders } = useOrders()
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [testing, setTesting] = useState(false)
  const [testEmail] = useState(`teste.${Date.now()}@cookite.com`)
  const [testPassword] = useState('123456')
  const [testName] = useState('Usuário Teste Diagnóstico')

  const addResult = (result: DiagnosticResult) => {
    setResults(prev => [...prev, { ...result, timestamp: Date.now() }])
  }

  const clearResults = () => {
    setResults([])
  }

  // Helpers com timeout para evitar travamentos quando o backend está lento/indisponível
  const withTimeout = async <T,>(promise: Promise<T>, ms: number, timeoutMessage: string): Promise<T | { error: { message: string } }> => {
    return Promise.race([
      promise,
      new Promise<{ error: { message: string } }>((resolve) => setTimeout(() => resolve({ error: { message: timeoutMessage } }), ms))
    ]) as any
  }

  // Teste de conectividade antes de executar testes que dependem de API
  const testConnectivity = async (): Promise<ConnectivityResult> => {
    if (!isSupabaseAvailable()) {
      return { available: false, reason: 'Supabase não configurado (modo offline)' }
    }
    
    try {
      const isConnected = await testSupabaseConnection()
      
      if (isConnected) {
        return { available: true, reason: 'Supabase conectado' }
      } else {
        return { available: false, reason: 'Supabase não respondeu' }
      }
    } catch (error) {
      return { available: false, reason: `Erro ao testar Supabase: ${error}` }
    }
  }

  const runDiagnostic = async () => {
    setTesting(true)
    clearResults()

    try {
      // Aguarda Auth carregar para evitar leituras inconsistentes
      if (loading) {
        addResult({
          test: '0. Inicialização de Autenticação',
          status: 'pending',
          message: 'Aguardando carregamento inicial do Auth...'
        })
        // espera incremental até 5s
        let waitedMs = 0
        while (waitedMs < 5000 && loading) {
          await new Promise(resolve => setTimeout(resolve, 250))
          waitedMs += 250
        }
      }

      // TESTE 1: Verificar estado inicial
      addResult({
        test: '1. Estado Inicial',
        status: 'pending',
        message: 'Verificando estado inicial do sistema...'
      })

      await new Promise(resolve => setTimeout(resolve, 500))

      addResult({
        test: '1. Estado Inicial',
        status: isAuthenticated ? 'warning' : 'success',
        message: isAuthenticated 
          ? `Usuário já logado: ${user?.email}` 
          : 'Sistema em estado limpo (não logado)',
        details: { user: user?.email, profile: profile?.name }
      })

      // TESTE 2: Verificar localStorage
      addResult({
        test: '2. LocalStorage',
        status: 'pending',
        message: 'Verificando dados do localStorage...'
      })

      await new Promise(resolve => setTimeout(resolve, 300))

      // Leituras resilientes do localStorage
      let offlineUsersCount = 0
      let hasCurrentUser = false
      let userOrdersCount = 0
      try {
        const offlineUsers = localStorage.getItem('offline_users')
        if (offlineUsers) offlineUsersCount = JSON.parse(offlineUsers).length
      } catch (_) {}
      try {
        const currentUser = localStorage.getItem('offline_current_user')
        hasCurrentUser = Boolean(currentUser)
      } catch (_) {}
      try {
        const userOrders = localStorage.getItem('user_orders')
        if (userOrders) userOrdersCount = JSON.parse(userOrders).length
      } catch (_) {}

      addResult({
        test: '2. LocalStorage',
        status: 'success',
        message: 'LocalStorage verificado',
        details: {
          offline_users: offlineUsersCount,
          current_user: hasCurrentUser,
          user_orders: userOrdersCount
        }
      })

      // TESTE 3: Teste de cadastro
      addResult({
        test: '3. Cadastro de Usuário',
        status: 'pending',
        message: 'Testando cadastro de novo usuário...'
      })

      // Verificar conectividade antes do cadastro
      const connectivity = await testConnectivity()
      if (!connectivity.available) {
        addResult({
          test: '3. Cadastro de Usuário',
          status: 'warning',
          message: `Cadastro em modo offline: ${connectivity.reason}`,
          details: { mode: 'offline', reason: connectivity.reason }
        })
      }

      const signUpResult = await withTimeout(
        signUp(testEmail, testPassword, {
          name: testName,
          phone: '(11) 99999-9999'
        }),
        20000,
        'Tempo esgotado no cadastro (20s). Supabase lento ou indisponível.'
      )

      if (signUpResult.error) {
        addResult({
          test: '3. Cadastro de Usuário',
          status: 'error',
          message: `Erro no cadastro: ${signUpResult.error.message}`,
          details: signUpResult.error
        })
      } else {
        addResult({
          test: '3. Cadastro de Usuário',
          status: 'success',
          message: 'Cadastro realizado com sucesso',
          details: { email: testEmail, name: testName }
        })

        // TESTE 4: Verificar estado pós-cadastro
        await new Promise(resolve => setTimeout(resolve, 500))
        
        addResult({
          test: '4. Estado Pós-Cadastro',
          status: isAuthenticated ? 'success' : 'error',
          message: isAuthenticated 
            ? 'Usuário logado automaticamente após cadastro' 
            : 'ERRO: Usuário não foi logado após cadastro',
          details: { 
            user: user?.email, 
            profile: profile?.name,
            isAuthenticated 
          }
        })

        // TESTE 5: Teste de logout
        addResult({
          test: '5. Logout',
          status: 'pending',
          message: 'Testando logout...'
        })

        await signOut()
        await new Promise(resolve => setTimeout(resolve, 500))

        addResult({
          test: '5. Logout',
          status: !isAuthenticated ? 'success' : 'error',
          message: !isAuthenticated 
            ? 'Logout realizado com sucesso' 
            : 'ERRO: Usuário ainda está logado após logout',
          details: { isAuthenticated, user: user?.email }
        })

        // TESTE 6: Teste de login
        addResult({
          test: '6. Login',
          status: 'pending',
          message: 'Testando login com conta criada...'
        })

        const signInResult = await withTimeout(
          signIn(testEmail, testPassword),
          15000,
          'Tempo esgotado no login (15s). Supabase lento ou indisponível.'
        )
        await new Promise(resolve => setTimeout(resolve, 500))

        if (signInResult.error) {
          addResult({
            test: '6. Login',
            status: 'error',
            message: `Erro no login: ${signInResult.error.message}`,
            details: signInResult.error
          })
        } else {
          addResult({
            test: '6. Login',
            status: isAuthenticated ? 'success' : 'error',
            message: isAuthenticated 
              ? 'Login realizado com sucesso' 
              : 'ERRO: Login não foi efetivado',
            details: { 
              user: user?.email, 
              profile: profile?.name,
              isAuthenticated 
            }
          })
        }

        // TESTE 7: Teste de persistência (simular reload)
        addResult({
          test: '7. Persistência de Sessão',
          status: 'pending',
          message: 'Testando persistência da sessão...'
        })

        // Simular um "reload" verificando se os dados persistem
        const savedUser = localStorage.getItem('offline_current_user')
        const persistenceWorks = savedUser && JSON.parse(savedUser).email === testEmail

        addResult({
          test: '7. Persistência de Sessão',
          status: persistenceWorks ? 'success' : 'error',
          message: persistenceWorks 
            ? 'Sessão persiste corretamente no localStorage' 
            : 'ERRO: Sessão não está sendo persistida',
          details: { savedUser: !!savedUser, email: savedUser ? JSON.parse(savedUser).email : null }
        })

        // TESTE 8: Sistema de pedidos
        addResult({
          test: '8. Sistema de Pedidos',
          status: 'pending',
          message: 'Testando sistema de pedidos...'
        })

        try {
          await loadOrders()
          
          // Criar pedido de teste
          const testOrder = {
            items: [
              {
                id: 'test-item-1',
                name: 'Produto Teste',
                price: 10.50,
                quantity: 2,
                total: 21.00
              }
            ],
            total: 21.00,
            payment_method: 'PIX'
          }

          const orderResult = await createOrder(testOrder)
          
          if (orderResult.success) {
            addResult({
              test: '8. Sistema de Pedidos',
              status: 'success',
              message: `Pedido criado com sucesso. Total de pedidos: ${orders.length}`,
              details: { orderId: orderResult.order?.id, totalOrders: orders.length }
            })
          } else {
            addResult({
              test: '8. Sistema de Pedidos',
              status: 'error',
              message: `Erro ao criar pedido: ${orderResult.error}`,
              details: orderResult
            })
          }
        } catch (error) {
          addResult({
            test: '8. Sistema de Pedidos',
            status: 'error',
            message: `Erro no sistema de pedidos: ${error}`,
            details: error
          })
        }

        // TESTE 9: Teste de email duplicado
        addResult({
          test: '9. Validação Email Duplicado',
          status: 'pending',
          message: 'Testando validação de email duplicado...'
        })

        const duplicateResult = await withTimeout(
          signUp(testEmail, testPassword, {
            name: 'Outro Nome',
            phone: '(11) 88888-8888'
          }),
          15000,
          'Tempo esgotado ao testar email duplicado (15s).'
        )

        if (duplicateResult.error && duplicateResult.error.message.includes('já cadastrado')) {
          addResult({
            test: '9. Validação Email Duplicado',
            status: 'success',
            message: 'Validação de email duplicado funcionando',
            details: duplicateResult.error.message
          })
        } else {
          addResult({
            test: '9. Validação Email Duplicado',
            status: 'error',
            message: 'ERRO: Permitiu cadastro com email duplicado',
            details: duplicateResult
          })
        }
      }

      // TESTE FINAL: Resumo geral
      addResult({
        test: '10. Resumo Final',
        status: 'success',
        message: 'Diagnóstico completo finalizado',
        details: {
          totalTests: results.length,
          timestamp: new Date().toISOString(),
          currentUser: user?.email,
          totalOrders: orders.length
        }
      })

    } catch (error) {
      addResult({
        test: 'ERRO CRÍTICO',
        status: 'error',
        message: `Erro durante diagnóstico: ${error}`,
        details: error
      })
    } finally {
      setTesting(false)
    }
  }

  const cleanupTestData = () => {
    // Limpar dados de teste
    const offlineUsers = JSON.parse(localStorage.getItem('offline_users') || '[]')
    const filteredUsers = offlineUsers.filter((u: any) => !u.email.includes('teste.'))
    localStorage.setItem('offline_users', JSON.stringify(filteredUsers))
    
    // Se o usuário atual é de teste, fazer logout
    if (user?.email?.includes('teste.')) {
      signOut()
    }
    
    clearResults()
  }

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'error': return <XCircle className="w-4 h-4 text-red-600" />
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case 'pending': return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
      default: return null
    }
  }

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200'
      case 'error': return 'bg-red-100 text-red-800 border-red-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'pending': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Diagnóstico Completo do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Atual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-sm">
                <strong>Usuário:</strong> {user?.email || 'Não logado'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span className="text-sm">
                <strong>Perfil:</strong> {profile?.name || 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm">
                <strong>Pedidos:</strong> {orders.length}
              </span>
            </div>
          </div>

          {/* Controles */}
          <div className="flex gap-3">
            <Button 
              onClick={runDiagnostic} 
              disabled={testing}
              className="flex items-center gap-2"
            >
              {testing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Executando...
                </>
              ) : (
                <>
                  <TestTube className="w-4 h-4" />
                  Executar Diagnóstico Completo
                </>
              )}
            </Button>
            
            <Button 
              onClick={cleanupTestData} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Limpar Dados de Teste
            </Button>
            
            <Button 
              onClick={clearResults} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Limpar Resultados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados do Diagnóstico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 border rounded-lg"
                >
                  <div className="mt-0.5">
                    {getStatusIcon(result.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{result.test}</span>
                      <Badge className={getStatusColor(result.status)}>
                        {result.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{result.message}</p>
                    {result.details && (
                      <details className="text-xs">
                        <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                          Ver detalhes
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {results.filter(r => r.status === 'success').length}
                </div>
                <div className="text-sm text-green-600">Sucessos</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {results.filter(r => r.status === 'error').length}
                </div>
                <div className="text-sm text-red-600">Erros</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {results.filter(r => r.status === 'warning').length}
                </div>
                <div className="text-sm text-yellow-600">Avisos</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {results.length}
                </div>
                <div className="text-sm text-blue-600">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
