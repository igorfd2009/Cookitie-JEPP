// Script para testar conexão com Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://deeichvgibhpbrowhaiq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlZWljaHZnaWJocGJyb3doYWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzQxMDgsImV4cCI6MjA3MDg1MDEwOH0.edQcNr-MnsLY2D6QtxgUy-1so9CvCxwwPBt4v881M9U'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('🔍 Testando conexão com Supabase...')
  
  try {
    // Testar conexão básica
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true })
    
    if (error) {
      console.log('❌ Erro na conexão:', error.message)
      return false
    }
    
    console.log('✅ Conexão com Supabase estabelecida com sucesso!')
    console.log('📊 Dados recebidos:', data)
    return true
    
  } catch (error) {
    console.log('❌ Erro inesperado:', error.message)
    return false
  }
}

testConnection()
