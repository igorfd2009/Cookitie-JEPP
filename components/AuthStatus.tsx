import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { isSupabaseAvailable } from '../lib/supabase'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Database, Wifi, WifiOff, User, UserCheck } from 'lucide-react'

export const AuthStatus: React.FC = () => {
  const { user, profile, loading } = useAuth()
  const supabaseAvailable = isSupabaseAvailable()

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Status do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
            <span className="text-sm text-gray-600">Carregando...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Status do Sistema
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status do Supabase */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {supabaseAvailable ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-orange-600" />
            )}
            <span className="text-sm font-medium">Supabase</span>
          </div>
          <Badge variant={supabaseAvailable ? "default" : "secondary"}>
            {supabaseAvailable ? "Online" : "Offline"}
          </Badge>
        </div>

        {/* Status do Usuário */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {user ? (
              <UserCheck className="h-4 w-4 text-green-600" />
            ) : (
              <User className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-sm font-medium">Usuário</span>
          </div>
          <Badge variant={user ? "default" : "outline"}>
            {user ? "Logado" : "Não logado"}
          </Badge>
        </div>

        {/* Informações do Usuário */}
        {user && profile && (
          <div className="pt-2 border-t">
            <div className="text-sm space-y-1">
              <div><strong>Email:</strong> {profile.email}</div>
              {profile.full_name && (
                <div><strong>Nome:</strong> {profile.full_name}</div>
              )}
              {profile.phone && (
                <div><strong>Telefone:</strong> {profile.phone}</div>
              )}
              <div><strong>Pedidos:</strong> {profile.total_pedidos || 0}</div>
              <div><strong>Total gasto:</strong> R$ {(profile.total_gasto || 0).toFixed(2)}</div>
            </div>
          </div>
        )}

        {/* Aviso sobre modo offline */}
        {!supabaseAvailable && (
          <div className="pt-2 border-t">
            <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
              <strong>Modo Offline:</strong> Os dados são salvos localmente. 
              Para funcionalidade completa, configure o Supabase.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
