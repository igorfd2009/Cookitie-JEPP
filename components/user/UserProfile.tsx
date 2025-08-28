import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { 
  Edit3, 
  Save, 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Loader2
} from 'lucide-react'
import { toast } from 'react-toastify'

export const UserProfile: React.FC = () => {
  const { profile, updateProfile, loading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: profile?.name || '',
    phone: profile?.phone || ''
  })
  const [updating, setUpdating] = useState(false)

  const handleEdit = () => {
    setEditForm({
      name: profile?.name || '',
      phone: profile?.phone || ''
    })
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditForm({
      name: profile?.name || '',
      phone: profile?.phone || ''
    })
  }

  const handleSave = async () => {
    setUpdating(true)
    
    try {
      const { error } = await updateProfile(editForm)
      
      if (error) {
        toast.error(error.message || 'Erro ao atualizar perfil')
      } else {
        toast.success('Perfil atualizado com sucesso!')
        setIsEditing(false)
      }
    } catch (error) {
      toast.error('Erro interno ao atualizar perfil')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Perfil não encontrado</p>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
        {!isEditing && (
          <Button onClick={handleEdit} variant="outline" size="sm">
            <Edit3 className="h-4 h-4 mr-2" />
            Editar Perfil
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card de Avatar e Informações Básicas */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar_url} alt={profile.name || 'Usuário'} />
                <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                  {profile.name ? getInitials(profile.name) : 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">
              {profile.name || 'Usuário'}
            </CardTitle>
            <CardDescription>
              Membro desde {new Date(profile.created_at).toLocaleDateString('pt-BR')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {profile.total_pedidos || 0}
              </div>
              <div className="text-sm text-gray-600">Pedidos realizados</div>
            </div>
            {profile.total_gasto && (
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  R$ {profile.total_gasto.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-sm text-gray-600">Total gasto</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card de Informações Detalhadas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditing ? (
              // Formulário de Edição
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Seu nome completo"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={editForm.phone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleSave} 
                    disabled={updating}
                    className="flex-1"
                  >
                    {updating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar Alterações
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={handleCancel} 
                    variant="outline" 
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              // Visualização das Informações
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-600">Nome</div>
                    <div className="font-medium">{profile.name || 'Não informado'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-medium">{profile.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-600">Telefone</div>
                    <div className="font-medium">{profile.phone || 'Não informado'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-600">Membro desde</div>
                    <div className="font-medium">
                      {new Date(profile.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>

                {profile.updated_at && profile.updated_at !== profile.created_at && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-600">Última atualização</div>
                      <div className="font-medium">
                        {new Date(profile.updated_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas Adicionais */}
      {profile.total_pedidos && profile.total_pedidos > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{profile.total_pedidos}</div>
                <div className="text-sm text-blue-600">Total de Pedidos</div>
              </div>
              {profile.total_gasto && (
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    R$ {profile.total_gasto.toFixed(2).replace('.', ',')}
                  </div>
                  <div className="text-sm text-green-600">Total Gasto</div>
                </div>
              )}
              {profile.primeiro_pedido !== undefined && (
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {profile.primeiro_pedido ? '🎉' : '✅'}
                  </div>
                  <div className="text-sm text-purple-600">
                    {profile.primeiro_pedido ? 'Primeiro Pedido' : 'Cliente Regular'}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
