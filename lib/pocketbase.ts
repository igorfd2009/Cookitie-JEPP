import PocketBase from 'pocketbase'

const DEFAULT_URL = 'http://localhost:8090'
const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL || DEFAULT_URL

export const pb = new PocketBase(POCKETBASE_URL)

// Log da URL utilizada pelo PocketBase no frontend
try {
  console.log('[PocketBase] URL em uso:', POCKETBASE_URL)
} catch (_) {}

// Persistência simples em localStorage (token + model)
const AUTH_STORAGE_KEY = 'cookitie_pb_auth'

try {
  const saved = localStorage.getItem(AUTH_STORAGE_KEY)
  if (saved) {
    const parsed = JSON.parse(saved)
    if (parsed?.token) {
      pb.authStore.save(parsed.token, parsed.model)
    }
  }
} catch (err) {
  console.warn('Não foi possível carregar sessão do PocketBase:', err)
}

pb.authStore.onChange(() => {
  try {
    const snapshot = JSON.stringify({ token: pb.authStore.token, model: pb.authStore.model })
    localStorage.setItem(AUTH_STORAGE_KEY, snapshot)
  } catch (err) {
    console.warn('Não foi possível salvar sessão do PocketBase:', err)
  }
})

// Auto refresh de token (a cada 4 minutos se válido)
const FOUR_MINUTES = 4 * 60 * 1000
setInterval(async () => {
  try {
    if (pb.authStore.isValid) {
      await pb.collection('users').authRefresh()
    }
  } catch (err) {
    console.warn('Falha ao atualizar token do PocketBase:', err)
  }
}, FOUR_MINUTES)
