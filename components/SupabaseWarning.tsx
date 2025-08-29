import { AlertTriangle, Database, ExternalLink } from 'lucide-react'

export const SupabaseWarning = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-red-500 to-red-600 text-white p-4 z-50 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle size={24} className="text-yellow-300" />
          <div>
            <h3 className="font-bold text-lg">⚠️ Supabase Não Configurado</h3>
            <p className="text-sm opacity-90">
              As tabelas do banco de dados não foram criadas. O sistema está em modo offline.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              console.log('📋 INSTRUÇÕES PARA CONFIGURAR SUPABASE:')
              console.log('1. Acesse o painel do Supabase')
              console.log('2. Vá em SQL Editor')
              console.log('3. Execute o arquivo sql/supabase-setup.sql')
              console.log('4. Recarregue a página')
            }}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Database size={16} />
            Ver Instruções
          </button>
          
          <button
            onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
            className="bg-white text-red-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium"
          >
            <ExternalLink size={16} />
            Abrir Supabase
          </button>
        </div>
      </div>
    </div>
  )
}
