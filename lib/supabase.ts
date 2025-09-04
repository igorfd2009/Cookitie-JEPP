import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Verificar se as variáveis de ambiente estão configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase não configurado. Usando modo offline com localStorage.')
}

// Criar cliente Supabase apenas se as variáveis estiverem configuradas
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: 'cookitie_supabase_auth'
      }
    })
  : null

// Função para verificar se o Supabase está disponível
export const isSupabaseAvailable = (): boolean => {
  return Boolean(supabase)
}

// Função para testar conexão com Supabase
export const testSupabaseConnection = async (): Promise<boolean> => {
  if (!supabase) return false
  try {
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true })
    return !error
  } catch (error) {
    console.error('Erro ao testar conexão Supabase:', error)
    return false
  }
}
