import { RefreshCw, CheckCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react'
import { useOrders } from '../hooks/useOrders'
import { isSupabaseAvailable } from '../lib/supabase'

interface SyncStatusProps {
  className?: string
}

export const SyncStatus = ({ className = '' }: SyncStatusProps) => {
  const { syncing, orders } = useOrders()
  const isOnline = isSupabaseAvailable()

  if (!isOnline) {
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
      <span>Sincronizado ({orders.length} pedidos)</span>
    </div>
  )
}
