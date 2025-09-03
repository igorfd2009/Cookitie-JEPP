import React from 'react'
import { ChefHat, Sparkles } from 'lucide-react'

interface CookiteLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
  fullScreen?: boolean
}

export const CookiteLoader: React.FC<CookiteLoaderProps> = ({
  size = 'md',
  message = 'Carregando...',
  fullScreen = false
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50'
    : 'flex items-center justify-center p-8'

  return (
    <div className={containerClasses}>
      <div className="text-center">
        {/* Logo animado */}
        <div className="relative mb-4">
          <div className={`${sizeClasses[size]} mx-auto relative`}>
            {/* Círculo de fundo */}
            <div className="absolute inset-0 bg-gradient-to-r from-cookite-blue to-cookite-purple rounded-full opacity-20 animate-pulse"></div>
            
            {/* Ícone principal */}
            <div className="relative z-10 w-full h-full bg-gradient-to-r from-cookite-blue to-cookite-purple rounded-full flex items-center justify-center animate-bounce-soft">
              <ChefHat className="w-1/2 h-1/2 text-white" />
            </div>
            
            {/* Sparkles animados */}
            <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-cookite-yellow animate-pulse" />
            <Sparkles className="absolute -bottom-1 -left-1 w-2 h-2 text-cookite-orange animate-pulse delay-500" />
          </div>
        </div>

        {/* Texto */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-cookite-blue to-cookite-purple bg-clip-text text-transparent">
            Cookite JEPP
          </h3>
          <p className="text-sm text-gray-600 animate-pulse">
            {message}
          </p>
        </div>

        {/* Barra de progresso animada */}
        <div className="mt-4 w-32 h-1 bg-gray-200 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-cookite-blue to-cookite-purple rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

// Componente de skeleton para listas
export const CookiteSkeleton: React.FC<{ items?: number }> = ({ items = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="cookite-card p-4">
          <div className="animate-pulse">
            <div className="flex space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg loading-shimmer"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded loading-shimmer"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 loading-shimmer"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 loading-shimmer"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
