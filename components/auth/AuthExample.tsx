import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { AuthModals } from './AuthModals'
import { UserProfile } from '../user/UserProfile'
import { UserMenuButton } from '../user/UserMenuButton'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'

export const AuthExample: React.FC = () => {
  const { isAuthenticated, user, profile, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Sistema de Autenticação - Cookite Jepp
        </h1>
        <p className="text-gray-600">
          Exemplo de implementação do sistema de cadastro e login
        </p>
      </div>

      {/* Status da Autenticação */}
      <Card>
        <CardHeader>
          <CardTitle>Status da Autenticação</CardTitle>
          <CardDescription>
            Informações sobre o estado atual do usuário
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Status:</span>
            <Badge variant={isAuthenticated ? "default" : "secondary"}>
              {isAuthenticated ? 'Autenticado' : 'Não Autenticado'}
            </Badge>
          </div>
          
          {isAuthenticated && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Email:</span>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                <div>
                  <span className="font-medium">Nome:</span>
                  <p className="text-sm text-gray-600">
                    {profile?.full_name || 'Não informado'}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Telefone:</span>
                  <p className="text-sm text-gray-600">
                    {profile?.phone || 'Não informado'}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Membro desde:</span>
                  <p className="text-sm text-gray-600">
                    {profile?.created_at 
                      ? new Date(profile.created_at).toLocaleDateString('pt-BR')
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Ações de Autenticação */}
      <Card>
        <CardHeader>
          <CardTitle>Ações</CardTitle>
          <CardDescription>
            Botões para testar as funcionalidades do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="flex-1"
              >
                Entrar / Cadastrar
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => setShowProfile(true)}
                variant="outline"
                className="flex-1"
              >
                Ver Meu Perfil
              </Button>
              <Button 
                onClick={() => setShowProfile(false)}
                variant="outline"
                className="flex-1"
              >
                Ocultar Perfil
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Menu do Usuário */}
      {isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle>Menu do Usuário</CardTitle>
            <CardDescription>
              Exemplo do botão de menu integrado ao header
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <UserMenuButton 
                onProfileClick={() => setShowProfile(true)}
                onOrdersClick={() => alert('Funcionalidade de pedidos em desenvolvimento')}
                onFavoritesClick={() => alert('Funcionalidade de favoritos em desenvolvimento')}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Perfil do Usuário */}
      {showProfile && isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle>Meu Perfil</CardTitle>
            <CardDescription>
              Gerenciamento completo do perfil do usuário
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserProfile />
          </CardContent>
        </Card>
      )}

      {/* Instruções de Uso */}
      <Card>
        <CardHeader>
          <CardTitle>Como Usar</CardTitle>
          <CardDescription>
            Instruções para implementar o sistema em seu projeto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">1. Configuração do Supabase</h4>
            <p className="text-sm text-gray-600">
              Execute o arquivo <code className="bg-gray-100 px-1 rounded">sql/supabase-setup.sql</code> no seu banco Supabase
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">2. Integração no App</h4>
            <p className="text-sm text-gray-600">
              Envolva sua aplicação com o <code className="bg-gray-100 px-1 rounded">AuthProvider</code> no arquivo principal
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">3. Uso dos Componentes</h4>
            <p className="text-sm text-gray-600">
              Use <code className="bg-gray-100 px-1 rounded">AuthModals</code>, <code className="bg-gray-100 px-1 rounded">UserProfile</code> e <code className="bg-gray-100 px-1 rounded">UserMenuButton</code> conforme necessário
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">4. Validações</h4>
            <p className="text-sm text-gray-600">
              Utilize o hook <code className="bg-gray-100 px-1 rounded">useAuthValidation</code> para validações personalizadas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Autenticação */}
      <AuthModals
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="login"
      />
    </div>
  )
}
