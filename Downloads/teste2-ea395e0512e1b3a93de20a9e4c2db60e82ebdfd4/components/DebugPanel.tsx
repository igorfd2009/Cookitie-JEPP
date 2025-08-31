import { useAuth } from '../contexts/AuthContext'
import { isSupabaseAvailable } from '../lib/supabase'

export const DebugPanel = () => {
  const { user, profile, loading, isAuthenticated } = useAuth()
  const supabaseAvailable = isSupabaseAvailable()

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <h3 className="font-bold text-sm mb-2">🔍 Debug Panel</h3>
      <div className="text-xs space-y-1">
        <div>Supabase: {supabaseAvailable ? '✅ Online' : '❌ Offline'}</div>
        <div>Loading: {loading ? '⏳ Sim' : '✅ Não'}</div>
        <div>Authenticated: {isAuthenticated ? '✅ Sim' : '❌ Não'}</div>
        {user && (
          <div>User: {user.email}</div>
        )}
        {profile && (
          <div>Profile: {profile.name}</div>
        )}
        <div className="mt-2 text-gray-500">
          {supabaseAvailable ? 'Modo Online' : 'Modo Offline (localStorage)'}
        </div>
      </div>
    </div>
  )
}
