import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'
import { Badge } from './ui/badge'
import { CheckCircle, XCircle, AlertCircle, Copy, Save } from 'lucide-react'
import { toast } from 'sonner'

export function EnvStatus() {
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)

  // Verificar variáveis de ambiente
  const envVars = {
    VITE_RESEND_API_KEY: import.meta.env.VITE_RESEND_API_KEY,
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_PIX_MERCHANT_ID: import.meta.env.VITE_PIX_MERCHANT_ID,
    VITE_PIX_MERCHANT_NAME: import.meta.env.VITE_PIX_MERCHANT_NAME,
  }

  const hasResendKey = !!envVars.VITE_RESEND_API_KEY

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copiado para a área de transferência!')
  }

  const createEnvFile = () => {
    const envContent = `# Configurações do Resend (Email)
VITE_RESEND_API_KEY=${apiKey}

# Configurações do Supabase (Opcional)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Configurações do PIX (Opcional)
VITE_PIX_MERCHANT_ID=
VITE_PIX_MERCHANT_NAME=
`

    const blob = new Blob([envContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '.env.local'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success('Arquivo .env.local criado! Salve-o na raiz do projeto.')
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Status das Variáveis de Ambiente
          </CardTitle>
          <CardDescription>
            Verifique se todas as variáveis necessárias estão configuradas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Resend API Key */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {hasResendKey ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <div>
                <Label className="font-medium">VITE_RESEND_API_KEY</Label>
                <p className="text-sm text-muted-foreground">
                  Chave da API do Resend para envio de emails
                </p>
              </div>
            </div>
            <Badge variant={hasResendKey ? "default" : "destructive"}>
              {hasResendKey ? "Configurado" : "Não configurado"}
            </Badge>
          </div>

          {/* Outras variáveis */}
          {Object.entries(envVars).map(([key, value]) => {
            if (key === 'VITE_RESEND_API_KEY') return null
            return (
              <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <div>
                    <Label className="font-medium">{key}</Label>
                    <p className="text-sm text-muted-foreground">
                      {value ? 'Configurado' : 'Opcional - não configurado'}
                    </p>
                  </div>
                </div>
                <Badge variant={value ? "default" : "secondary"}>
                  {value ? "Configurado" : "Opcional"}
                </Badge>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Configuração do Resend */}
      {!hasResendKey && (
        <Card>
          <CardHeader>
            <CardTitle>Configurar Resend API Key</CardTitle>
            <CardDescription>
              Para obter sua chave da API do Resend:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ol className="list-decimal list-inside space-y-1 mt-2">
                  <li>Acesse <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">resend.com</a></li>
                  <li>Faça login ou crie uma conta</li>
                  <li>Vá para "API Keys" no painel</li>
                  <li>Crie uma nova chave da API</li>
                  <li>Copie a chave e cole abaixo</li>
                </ol>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="api-key">Chave da API do Resend</Label>
              <div className="flex gap-2">
                <Input
                  id="api-key"
                  type={showKey ? "text" : "password"}
                  placeholder="re_123456789..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? "🔒" : "👁️"}
                </Button>
                {apiKey && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(apiKey)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <Button onClick={createEnvFile} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Criar arquivo .env.local
            </Button>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Importante:</strong> Após criar o arquivo .env.local, salve-o na raiz do projeto (mesmo nível do package.json) e reinicie o servidor de desenvolvimento.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Teste rápido */}
      {hasResendKey && (
        <Card>
          <CardHeader>
            <CardTitle>Teste Rápido do Resend</CardTitle>
            <CardDescription>
              Teste se a chave da API está funcionando corretamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={async () => {
                try {
                  const response = await fetch('https://api.resend.com/domains', {
                    headers: {
                      'Authorization': `Bearer ${envVars.VITE_RESEND_API_KEY}`,
                      'Content-Type': 'application/json'
                    }
                  })
                  
                  if (response.ok) {
                    toast.success('✅ Chave da API do Resend está funcionando!')
                  } else {
                    toast.error('❌ Erro na chave da API do Resend')
                  }
                } catch (error) {
                  toast.error('❌ Erro ao testar a API do Resend')
                }
              }}
              className="w-full"
            >
              Testar Conexão com Resend
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
