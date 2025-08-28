import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { 
  User, 
  Settings, 
  LogOut, 
  Heart, 
  ShoppingBag, 
  FileText,
  ChevronDown 
} from 'lucide-react'
import { toast } from 'react-toastify'

interface UserMenuButtonProps {
  onProfileClick?: () => void
  onOrdersClick?: () => void
  onFavoritesClick?: () => void
}

export const UserMenuButton: React.FC<UserMenuButtonProps> = ({
  onProfileClick,
  onOrdersClick,
  onFavoritesClick
}) => {
  const { profile, signOut, isAuthenticated, loading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Logout realizado com sucesso!')
      setIsOpen(false)
    } catch (error) {
      toast.error('Erro ao fazer logout')
    }
  }

  const getInitials = (name: string) => {
    if (!name || name.trim() === '') return 'U'
    
    return name
      .trim()
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // CORREÇÃO: Função para obter nome com fallback
  const getDisplayName = () => {
    const name = profile?.full_name
    if (!name || name.trim() === '') {
      // Tentar extrair nome do email
      const emailName = profile?.email?.split('@')[0]
      return emailName || 'Usuário'
    }
    return name.trim()
  }

  // CORREÇÃO: Função para obter email com fallback
  const getDisplayEmail = () => {
    return profile?.email || 'email@exemplo.com'
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || 'Usuário'} />
            <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
              {getInitials(getDisplayName())}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium text-gray-900">
              {getDisplayName()}
            </span>
            <span className="text-xs text-gray-500">
              {getDisplayEmail()}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-56"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {getDisplayName()}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {getDisplayEmail()}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => {
            onProfileClick?.()
            setIsOpen(false)
          }}
          className="cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Meu Perfil</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => {
            onOrdersClick?.()
            setIsOpen(false)
          }}
          className="cursor-pointer"
        >
          <FileText className="mr-2 h-4 w-4" />
          <span>Meus Pedidos</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => {
            onFavoritesClick?.()
            setIsOpen(false)
          }}
          className="cursor-pointer"
        >
          <Heart className="mr-2 h-4 w-4" />
          <span>Favoritos</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => {
            // Implementar carrinho de compras
            setIsOpen(false)
          }}
          className="cursor-pointer"
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          <span>Carrinho</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem 
          onClick={() => {
            // Implementar configurações
            setIsOpen(false)
          }}
          className="cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem 
          onClick={handleSignOut}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Componente simplificado para mobile
export const UserMenuButtonMobile: React.FC<UserMenuButtonProps> = (props) => {
  const { profile, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return null
  }

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="p-2"
      onClick={props.onProfileClick}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || 'Usuário'} />
        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
          {getInitials(profile?.full_name || '')}
        </AvatarFallback>
      </Avatar>
    </Button>
  )
}
