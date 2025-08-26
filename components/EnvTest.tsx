
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'

export function EnvTest() {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY
  const nodeEnv = import.meta.env.MODE
  const baseUrl = import.meta.env.BASE_URL

  return (
    <Card className="w-full max-w-2xl mx-auto mb-6">
      <CardHeader>
        <CardTitle>🔍 Teste de Variáveis de Ambiente</CardTitle>
        <CardDescription>
          Verifica se as variáveis de ambiente estão sendo carregadas pelo Vite
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">VITE_RESEND_API_KEY</h4>
            <div className="flex items-center gap-2">
              <Badge variant={apiKey ? "default" : "destructive"}>
                {apiKey ? "✅ Configurada" : "❌ Não configurada"}
              </Badge>
            </div>
            {apiKey && (
              <p className="text-xs text-gray-600 mt-1">
                {apiKey.substring(0, 10)}...{apiKey.substring(apiKey.length - 4)}
              </p>
            )}
          </div>

          <div>
            <h4 className="font-semibold mb-2">MODE</h4>
            <Badge variant="outline">{nodeEnv}</Badge>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">BASE_URL</h4>
          <Badge variant="outline">{baseUrl}</Badge>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <h4 className="font-semibold text-blue-800 mb-2">ℹ️ Informações</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>VITE_RESEND_API_KEY:</strong> Deve mostrar "✅ Configurada"</li>
            <li>• <strong>MODE:</strong> Deve mostrar "development"</li>
            <li>• <strong>BASE_URL:</strong> Deve mostrar "/"</li>
            <li>• Se a API Key não aparecer, o servidor precisa ser reiniciado</li>
          </ul>
        </div>

        {!apiKey && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
            <h4 className="font-semibold text-red-800 mb-2">🚨 Problema Detectado</h4>
            <p className="text-sm text-red-700">
              A variável VITE_RESEND_API_KEY não está sendo carregada. 
              Tente recarregar a página ou reiniciar o servidor.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
