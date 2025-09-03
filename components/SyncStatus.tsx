import { RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { usePocketBaseOrders as useOrders } from '../hooks/usePocketBaseOrders'

interface SyncStatusProps {
  className?: string
}

export const SyncStatus = ({ className = '' }: SyncStatusProps) => {
  const { syncing, orders, backend } = useOrders()

  // Verificar se está usando PocketBase
  const isPocketBaseOnline = backend === 'pocketbase'

  if (!isPocketBaseOnline) {
    return (
      <div className={`flex items-center gap-2 text-sm text-amber-600 ${className}`}>
        <WifiOff size={16} />
        <span>Modo Offline</span>
      </div>
    )
  }

  if (syncing) {
    return (
      <div className={`flex items-center gap-2 text-sm text-blue-600 ${className}`}>
        <RefreshCw size={16} className="animate-spin" />
        <span>Sincronizando...</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 text-sm text-green-600 ${className}`}>
      <Wifi size={16} />
      <span>PocketBase ({orders.length} pedidos)</span>
    </div>
  )
}

