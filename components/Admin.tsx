interface AdminProps {
  onBackToProducts: () => void
}

export const Admin = ({ onBackToProducts }: AdminProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <h1 className="font-cookitie text-xl font-bold text-gray-900">
                🎛️ Admin Cookittie
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onBackToProducts}
                className="btn-cookitie-secondary"
              >
                Voltar ao Site
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="font-cookitie text-3xl font-bold text-gray-900 mb-4">
            📊 Dashboard Administrativo
          </h1>
          <p className="text-gray-600 mb-8">
            Sistema administrativo em desenvolvimento
          </p>
          <div className="cookitie-card p-8 max-w-md mx-auto">
            <h2 className="font-cookitie text-xl font-bold text-gray-900 mb-4">
              Funcionalidades Básicas
            </h2>
            <ul className="text-left space-y-2 text-gray-600">
              <li>• Visualização de pedidos</li>
              <li>• Estatísticas básicas</li>
              <li>• Filtros e busca</li>
              <li>• Exportação de dados</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
