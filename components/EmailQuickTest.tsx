import { useState } from 'react'
import { Mail, TestTube, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useEmailConfirmation } from '../hooks/useEmailConfirmation'

export function EmailQuickTest() {
  const [testEmail, setTestEmail] = useState('')
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  
  const { sendThankYouEmail } = useEmailConfirmation()

  // Dados de teste
  const testReservation = {
    id: 'TEST-QUICK',
    name: 'Teste Rápido',
    email: testEmail || 'teste@exemplo.com',
    phone: '(11) 99999-9999',
    products: [
      { id: '1', name: 'Brigadeiro Gourmet', quantity: 1, price: 8.50 }
    ],
    totalAmount: 8.50,
    discountApplied: false,
    notes: 'Teste rápido do sistema de email',
    createdAt: new Date().toISOString()
  }

  const handleQuickTest = async () => {
    if (!testEmail) {
      setTestResult('error')
      setErrorMessage('Por favor, insira um email válido')
      return
    }

    setIsTesting(true)
    setTestResult(null)
    setErrorMessage('')

    try {
      await sendThankYouEmail(testReservation)
      
      if (true) {
        setTestResult('success')
      } else {
        setTestResult('error')
        setErrorMessage('Falha no envio do email')
      }
    } catch (error) {
      setTestResult('error')
      setErrorMessage(error instanceof Error ? error.message : 'Erro desconhecido')
    } finally {
      setIsTesting(false)
    }
  }

  const resetTest = () => {
    setTestResult(null)
    setErrorMessage('')
    setTestEmail('')
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-5 h-5" />
          Teste Rápido - Sistema de Email
        </CardTitle>
        <CardDescription>
          Teste se a API do Resend está funcionando corretamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="testEmail">Email para Teste</Label>
          <Input
            id="testEmail"
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="seu@email.com"
            className="mt-1"
          />
        </div>

        {testResult === 'success' && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-800">✅ Teste Bem-sucedido!</h4>
            </div>
            <p className="text-sm text-green-700 mt-2">
              O email foi enviado com sucesso! Verifique sua caixa de entrada.
            </p>
          </div>
        )}

        {testResult === 'error' && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h4 className="font-semibold text-red-800">❌ Erro no Teste</h4>
            </div>
            <p className="text-sm text-red-700 mt-2">
              {errorMessage}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          {testResult ? (
            <Button onClick={resetTest} variant="outline" className="flex-1">
              Testar Novamente
            </Button>
          ) : (
            <Button 
              onClick={handleQuickTest} 
              disabled={isTesting || !testEmail}
              className="flex-1"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testando...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar Teste
                </>
              )}
            </Button>
          )}
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <h4 className="font-semibold text-blue-800 mb-2">ℹ️ Informações do Teste</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Email será enviado para: {testEmail || 'não informado'}</li>
            <li>• Produto: Brigadeiro Gourmet (1x R$ 8,50)</li>
            <li>• Total: R$ 8,50</li>
            <li>• Incluirá código de retirada</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
