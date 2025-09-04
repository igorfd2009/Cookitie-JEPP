import React, { useEffect } from 'react'
import { useAppState } from '../../contexts/AppStateContext'
import { Button } from './button'
import { Card } from './card'
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'

export const NotificationSystem: React.FC = () => {
  const { state, removeNotification } = useAppState()
  
  useEffect(() => {
    // Auto-remove notifications after 5 seconds
    state.notifications.forEach(notification => {
      const timeElapsed = Date.now() - notification.timestamp
      if (timeElapsed >= 5000) {
        removeNotification(notification.id)
      }
    })
  }, [state.notifications, removeNotification])
  
  if (state.notifications.length === 0) {
    return null
  }
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }
  
  const getColors = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }
  
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {state.notifications.map(notification => (
        <Card
          key={notification.id}
          className={`p-4 border-2 shadow-lg animate-in slide-in-from-right-full duration-300 ${getColors(notification.type)}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {notification.message}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeNotification(notification.id)}
              className="h-6 w-6 p-0 hover:bg-black/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
