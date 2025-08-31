// Teste de conexão com Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://deeichvgibhpbrowhaiq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlZWljaHZnaWJocGJyb3doYWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzQxMDgsImV4cCI6MjA3MDg1MDEwOH0.edQcNr-MnsLY2D6QtxgUy-1so9CvCxwwPBt4v881M9U'

console.log('🔍 Testando conexão com Supabase...')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseAnonKey.substring(0, 20) + '...')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSupabaseConnection() {
  try {
    console.log('\n📡 Testando conectividade básica...')
    
    // Teste 1: Verificar se consegue acessar o Supabase
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.log('❌ Erro na autenticação:', authError.message)
    } else {
      console.log('✅ Autenticação funcionando')
    }
    
    // Teste 2: Verificar se a tabela profiles existe
    console.log('\n📊 Testando acesso à tabela profiles...')
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true })
    
    if (profileError) {
      console.log('❌ Erro ao acessar tabela profiles:', profileError.message)
      console.log('💡 Isso pode indicar que:')
      console.log('   - A tabela profiles não foi criada')
      console.log('   - As políticas RLS não estão configuradas')
      console.log('   - Há problemas de permissão')
    } else {
      console.log('✅ Tabela profiles acessível')
      console.log('📈 Contagem de registros:', profileData)
    }
    
    // Teste 3: Verificar configurações do projeto
    console.log('\n⚙️ Verificando configurações do projeto...')
    const { data: configData, error: configError } = await supabase
      .from('_supabase_migrations')
      .select('*')
      .limit(1)
    
    if (configError) {
      console.log('❌ Erro ao verificar configurações:', configError.message)
    } else {
      console.log('✅ Configurações do projeto acessíveis')
    }
    
  } catch (error) {
    console.log('❌ Erro inesperado:', error.message)
  }
}

testSupabaseConnection()
