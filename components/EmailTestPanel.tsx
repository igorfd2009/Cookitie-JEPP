import { useState } from 'react'
import { Mail, TestTube, Play, RefreshCw, Settings } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { EmailConfirmation } from './EmailConfirmation'
import { EmailDashboard } from './EmailDashboard'

import type { Reservation, Payment } from '../utils/emailService'

export function EmailTestPanel() {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [testReservation, setTestReservation] = useState<Reservation>({
    id: 'TEST-001',
    name: 'João Silva',
    email: 'joao@exemplo.com',
    phone: '(11) 99999-9999',
    products: [
      { id: '1', name: 'Brigadeiro Gourmet', quantity: 2, price: 8.50 },
      { id: '2', name: 'Beijinho', quantity: 1, price: 7.00 }
    ],
    totalAmount: 24.00,
    discountApplied: true,
    notes: 'Teste do sistema de email',
    createdAt: new Date().toISOString()
  })

  const [testPayment, setTestPayment] = useState<Payment>({
    transactionId: 'TXN-TEST-001',
    amount: 24.00,
    status: 'paid'
  })

  const handleTestEmail = () => {
    setShowConfirmation(true)
  }

  const handleTestDashboard = () => {
    setShowDashboard(true)
  }

  const handleUpdateTestData = () => {
    const newId = `TEST-${Date.now().toString().slice(-6)}`
    setTestReservation(prev => ({
      ...prev,
      id: newId,
      name: `Cliente Teste ${newId}`,
      email: `teste${newId}@exemplo.com`
    }))
    
    setTestPayment(prev => ({
      ...prev,
      transactionId: `TXN-${newId}`,
      amount: prev.amount
    }))
  }

  const mockReservations: Reservation[] = [
    testReservation,
    {
      id: 'TEST-002',
      name: 'Maria Santos',
      email: 'maria@exemplo.com',
      phone: '(11) 88888-8888',
      products: [
        { id: '3', name: 'Cajuzinho', quantity: 3, price: 6.50 }
      ],
      totalAmount: 19.50,
      discountApplied: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'TEST-003',
      name: 'Pedro Costa',
      email: 'pedro@exemplo.com',
      phone: '(11) 77777-7777',
      products: [
        { id: '1', name: 'Brigadeiro Gourmet', quantity: 1, price: 8.50 },
        { id: '4', name: 'Quindim', quantity: 2, price: 9.00 }
      ],
      totalAmount: 26.50,
      discountApplied: true,
      createdAt: new Date().toISOString()
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Painel de Teste - Sistema de Email
          </CardTitle>
          <CardDescription>
            Teste todas as funcionalidades do sistema de confirmação e agradecimento por email
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Configuração de Teste */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuração de Teste
          </CardTitle>
          <CardDescription>
            Personalize os dados de teste para simular diferentes cenários
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="testName">Nome do Cliente</Label>
              <Input
                id="testName"
                value={testReservation.name}
                onChange={(e) => setTestReservation(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome para teste"
              />
            </div>
            <div>
              <Label htmlFor="testEmail">Email do Cliente</Label>
              <Input
                id="testEmail"
                value={testReservation.email}
                onChange={(e) => setTestReservation(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@exemplo.com"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="testNotes">Observações</Label>
            <Textarea
              id="testNotes"
              value={testReservation.notes || ''}
              onChange={(e) => setTestReservation(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Observações adicionais para o teste"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleUpdateTestData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Gerar Novo ID
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Botões de Teste */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Teste Individual
            </CardTitle>
            <CardDescription>
              Teste o envio de email para uma reserva específica
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleTestEmail} className="w-full">
              <Play className="w-4 h-4 mr-2" />
              Testar Email Individual
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              Teste em Massa
            </CardTitle>
            <CardDescription>
              Teste o dashboard de emails em massa com dados simulados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleTestDashboard} className="w-full">
              <Play className="w-4 h-4 mr-2" />
              Testar Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Informações de Configuração */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Informações Importantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <h4 className="font-semibold text-blue-800 mb-2">🔑 Configuração Necessária</h4>
            <p className="text-sm text-blue-700">
              Para que os emails sejam enviados, você precisa configurar a chave da API do Resend.
              Crie um arquivo <code>.env.local</code> com <code>VITE_RESEND_API_KEY=sua_chave_aqui</code>
            </p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Dados de Teste</h4>
            <p className="text-sm text-yellow-700">
              Este painel usa dados simulados. Em produção, os dados virão do seu sistema de reservas.
            </p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
            <h4 className="font-semibold text-green-800 mb-2">✅ Funcionalidades Testadas</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Envio de email de agradecimento</li>
              <li>• Confirmação de pagamento</li>
              <li>• Email de lembrete</li>
              <li>• Dashboard de emails em massa</li>
              <li>• Geração de códigos de retirada</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Confirmação Individual */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <EmailConfirmation
              reservation={testReservation}
              payment={testPayment}
              onClose={() => setShowConfirmation(false)}
              showPaymentConfirmation={true}
            />
          </div>
        </div>
      )}

      {/* Modal do Dashboard */}
      {showDashboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Dashboard de Emails - Modo Teste</h2>
                <Button onClick={() => setShowDashboard(false)} variant="outline">
                  Fechar
                </Button>
              </div>
            </div>
            <div className="p-4">
              <EmailDashboard 
                reservations={mockReservations}
                onRefresh={handleUpdateTestData}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
