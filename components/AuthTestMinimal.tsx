import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'

export const AuthTestMinimal: React.FC = () => {
  const auth = useAuth()

  console.log('🔍 AuthTestMinimal - Estado:', {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user?.email,
    profile: auth.profile?.name,
    loading: auth.loading
  })

  const testSignup = async () => {
    console.log('🔑 Teste de cadastro iniciado...')
    const result = await auth.signUp('teste@teste.com', '123456', {
      name: 'Usuario Teste',
      phone: '(11) 99999-9999'
    })
    console.log('📋 Resultado:', result)
    if (result.error) {
      alert(`Erro: ${result.error.message}`)
    } else {
      alert('Cadastro OK!')
    }
  }

  const testLogin = async () => {
    console.log('🔑 Teste de login iniciado...')
    const result = await auth.signIn('teste@teste.com', '123456')
    console.log('📋 Resultado:', result)
    if (result.error) {
      alert(`Erro: ${result.error.message}`)
    } else {
      alert('Login OK!')
    }
  }

  const testLogout = async () => {
    console.log('🚪 Teste de logout iniciado...')
    await auth.signOut()
    alert('Logout OK!')
  }

  const clearStorage = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <div style={{ 
      border: '2px solid red', 
      padding: '20px', 
      margin: '20px',
      backgroundColor: '#fff'
    }}>
      <h2>🧪 TESTE MÍNIMO DE AUTENTICAÇÃO</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>Status:</strong> {auth.loading ? '⏳ Carregando...' : auth.isAuthenticated ? '✅ LOGADO' : '❌ DESLOGADO'}
      </div>
      
      {auth.isAuthenticated && (
        <div style={{ marginBottom: '20px' }}>
                     <strong>Usuário:</strong> {auth.profile?.name} ({auth.user?.email})
        </div>
      )}
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <Button onClick={testSignup}>1. Cadastrar</Button>
        <Button onClick={testLogin}>2. Login</Button>
        <Button onClick={testLogout}>3. Logout</Button>
        <Button onClick={clearStorage} variant="destructive">4. Limpar Storage</Button>
      </div>
    </div>
  )
}
