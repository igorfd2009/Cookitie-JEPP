import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Badge } from './ui/badge'
import { Card, CardContent } from './ui/card'
import { UserCheck, LogIn, Loader2 } from 'lucide-react'

export const LoginStatus: React.FC = () => {
  const { profile, loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <Card className="w-full max-w-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <span className="text-sm text-gray-600">Verificando login...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <UserCheck className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-sm font-medium text-green-800">
                    Logado como
                  </div>
                  <div className="text-xs text-gray-600">
                                         {profile?.name || profile?.email || 'Usuário'}
                  </div>
                </div>
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Não logado
                  </div>
                  <div className="text-xs text-gray-500">
                    Faça login para continuar
                  </div>
                </div>
              </>
            )}
          </div>
          
          <Badge 
            variant={isAuthenticated ? "default" : "secondary"}
            className={isAuthenticated ? "bg-green-100 text-green-800" : ""}
          >
            {isAuthenticated ? "Online" : "Offline"}
          </Badge>
        </div>

        {/* Informações adicionais se logado */}
        {isAuthenticated && profile && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600 space-y-1">
              <div><strong>Email:</strong> {profile.email}</div>
              {profile.phone && (
                <div><strong>Telefone:</strong> {profile.phone}</div>
              )}
              <div><strong>Pedidos:</strong> {profile.total_pedidos || 0}</div>
              <div><strong>Total gasto:</strong> R$ {(profile.total_gasto || 0).toFixed(2)}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
