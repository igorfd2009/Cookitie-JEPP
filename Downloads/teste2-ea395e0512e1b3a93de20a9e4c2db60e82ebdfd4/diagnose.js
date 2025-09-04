// Diagnóstico do sistema
console.log('🔍 DIAGNÓSTICO DO SISTEMA')
console.log('========================')

// 1. Verificar variáveis de ambiente
console.log('\n1️⃣ VERIFICANDO VARIÁVEIS DE AMBIENTE')
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? '✅ Configurado' : '❌ Não configurado')
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? '✅ Configurado' : '❌ Não configurado')

// 2. Verificar localStorage
console.log('\n2️⃣ VERIFICANDO LOCALSTORAGE')
try {
  const offlineAuth = localStorage.getItem('cookite_offline_auth')
  const offlineUsers = localStorage.getItem('cookite_offline_users')
  console.log('Offline Auth:', offlineAuth ? '✅ Existe' : '❌ Não existe')
  console.log('Offline Users:', offlineUsers ? '✅ Existe' : '❌ Não existe')
} catch (error) {
  console.log('❌ Erro ao acessar localStorage:', error.message)
}

// 3. Verificar se o Supabase está acessível
console.log('\n3️⃣ TESTANDO CONEXÃO SUPABASE')
async function testSupabase() {
  try {
    const response = await fetch('https://deeichvgibhpbrowhaiq.supabase.co/rest/v1/profiles?select=count', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlZWljaHZnaWJocGJyb3doYWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzQxMDgsImV4cCI6MjA3MDg1MDEwOH0.edQcNr-MnsLY2D6QtxgUy-1so9CvCxwwPBt4v881M9U',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlZWljaHZnaWJocGJyb3doYWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzQxMDgsImV4cCI6MjA3MDg1MDEwOH0.edQcNr-MnsLY2D6QtxgUy-1so9CvCxwwPBt4v881M9U'
      }
    })
    
    if (response.ok) {
      console.log('✅ Supabase acessível')
    } else {
      console.log('❌ Erro Supabase:', response.status, response.statusText)
    }
  } catch (error) {
    console.log('❌ Erro de conexão:', error.message)
  }
}

testSupabase()

// 4. Verificar se há erros no console
console.log('\n4️⃣ VERIFICANDO ERROS NO CONSOLE')
console.log('Abra o console do navegador (F12) e verifique se há erros')

// 5. Verificar se o AuthContext está funcionando
console.log('\n5️⃣ VERIFICANDO AUTHCONTEXT')
console.log('Verifique se o AuthProvider está envolvendo a aplicação')

console.log('\n📋 PRÓXIMOS PASSOS:')
console.log('1. Abra o console do navegador (F12)')
console.log('2. Acesse http://localhost:5174')
console.log('3. Tente fazer cadastro/login')
console.log('4. Verifique as mensagens de erro')
