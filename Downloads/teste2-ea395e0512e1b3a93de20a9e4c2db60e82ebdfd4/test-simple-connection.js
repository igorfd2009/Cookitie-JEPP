// Teste simples de conexão
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://deeichvgibhpbrowhaiq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlZWljaHZnaWJocGJyb3doYWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzQxMDgsImV4cCI6MjA3MDg1MDEwOH0.edQcNr-MnsLY2D6QtxgUy-1so9CvCxwwPBt4v881M9U'

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false, // Desabilitar refresh automático
    persistSession: false,   // Não persistir sessão
    detectSessionInUrl: false
  }
})

async function testSimpleConnection() {
  console.log('🔍 Teste simples de conexão...')
  
  try {
    // Teste básico sem autenticação
    const { data, error } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      console.log('❌ Erro:', error.message)
    } else {
      console.log('✅ Conexão funcionando!')
      console.log('📊 Dados:', data)
    }
    
  } catch (error) {
    console.log('❌ Erro inesperado:', error.message)
  }
}

testSimpleConnection()
