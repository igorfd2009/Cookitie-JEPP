import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Separator } from '../ui/separator'
import { Loader2, User, Mail, Phone, Calendar, Edit3, Save, X, Camera } from 'lucide-react'
import { toast } from 'react-toastify'

export const UserProfile: React.FC = () => {
  const { profile, updateProfile, loading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || ''
  })
  const [updating, setUpdating] = useState(false)

  const handleEdit = () => {
    setEditForm({
      full_name: profile?.full_name || '',
      phone: profile?.phone || ''
    })
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditForm({
      full_name: profile?.full_name || '',
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
            <Edit3 className="h-4 w-4 mr-2" />
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
                <AvatarImage src={profile.avatar_url} alt={profile.full_name || 'Usuário'} />
                <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                  {profile.full_name ? getInitials(profile.full_name) : 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">
              {profile.full_name || 'Usuário'}
            </CardTitle>
            <CardDescription>
              Membro desde {new Date(profile.created_at).toLocaleDateString('pt-BR')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              <Camera className="h-4 w-4 mr-2" />
              Alterar Foto
            </Button>
          </CardContent>
        </Card>

        {/* Card de Detalhes do Perfil */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
            <CardDescription>
              Gerencie suas informações pessoais e de contato
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email (não editável) */}
            <div className="space-y-2">
              <Label className="flex items-center text-sm font-medium text-gray-700">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                Email
              </Label>
              <Input
                value={profile.email}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">
                O email não pode ser alterado por questões de segurança
              </p>
            </div>

            <Separator />

            {/* Nome Completo */}
            <div className="space-y-2">
              <Label className="flex items-center text-sm font-medium text-gray-700">
                <User className="h-4 w-4 mr-2 text-gray-400" />
                Nome Completo
              </Label>
              {isEditing ? (
                <Input
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  placeholder="Seu nome completo"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md">
                  {profile.full_name || 'Não informado'}
                </div>
              )}
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <Label className="flex items-center text-sm font-medium text-gray-700">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                Telefone
              </Label>
              {isEditing ? (
                <Input
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  type="tel"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md">
                  {profile.phone || 'Não informado'}
                </div>
              )}
            </div>

            {/* Data de Criação */}
            <div className="space-y-2">
              <Label className="flex items-center text-sm font-medium text-gray-700">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                Data de Cadastro
              </Label>
              <div className="p-3 bg-gray-50 rounded-md">
                {new Date(profile.created_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>

            {/* Última Atualização */}
            {profile.updated_at !== profile.created_at && (
              <div className="space-y-2">
                <Label className="flex items-center text-sm font-medium text-gray-700">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  Última Atualização
                </Label>
                <div className="p-3 bg-gray-50 rounded-md">
                  {new Date(profile.updated_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            )}

            {/* Botões de Ação */}
            {isEditing && (
              <div className="flex space-x-3 pt-4">
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
                      Salvar
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
            )}
          </CardContent>
        </Card>
      </div>

      {/* Seção de Segurança */}
      <Card>
        <CardHeader>
          <CardTitle>Segurança</CardTitle>
          <CardDescription>
            Gerencie suas configurações de segurança
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Alterar Senha</h4>
              <p className="text-sm text-gray-500">
                Atualize sua senha regularmente para manter sua conta segura
              </p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Alterar
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Autenticação em Duas Etapas</h4>
              <p className="text-sm text-gray-500">
                Adicione uma camada extra de segurança à sua conta
              </p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Configurar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
