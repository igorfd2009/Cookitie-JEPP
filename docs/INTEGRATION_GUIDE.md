# Guia de Integração - Sistema de Autenticação

Este guia mostra como integrar o sistema de autenticação no seu projeto Cookite Jepp existente.

## ✅ **Integração Concluída**

### 1. **AuthProvider Integrado no App.tsx**

O `AuthProvider` já foi integrado no seu `App.tsx`:

```tsx
// App.tsx
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  // ... seus estados e funções existentes

  return (
    <AuthProvider>
      <div className="min-h-screen">
        {/* Seu conteúdo existente */}
        <Topbar />
        <Hero />
        <Products />
        <FAQ />
        {/* ... outros componentes */}
      </div>
    </AuthProvider>
  );
}
```

## 🔧 **Como Usar o Sistema**

### 1. **Verificar Status de Autenticação**

```tsx
import { useAuth } from './contexts/AuthContext';

function MeuComponente() {
  const { isAuthenticated, user, profile, loading } = useAuth();
  
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  if (isAuthenticated) {
    return <div>Bem-vindo, {profile?.full_name}!</div>;
  }
  
  return <div>Faça login para continuar</div>;
}
```

### 2. **Mostrar Modal de Login/Cadastro**

```tsx
import { useState } from 'react';
import { AuthModals } from './components/auth/AuthModals';

function MeuComponente() {
  const [showAuth, setShowAuth] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowAuth(true)}>
        Entrar / Cadastrar
      </button>
      
      <AuthModals
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        defaultTab="login"
      />
    </div>
  );
}
```

### 3. **Menu do Usuário no Header**

```tsx
import { UserMenuButton } from './components/user/UserMenuButton';

function Header() {
  return (
    <header>
      {/* Outros elementos */}
      <UserMenuButton 
        onProfileClick={() => navigate('/profile')}
        onOrdersClick={() => navigate('/orders')}
        onFavoritesClick={() => navigate('/favorites')}
      />
    </header>
  );
}
```

### 4. **Página de Perfil**

```tsx
import { UserProfile } from './components/user/UserProfile';

function ProfilePage() {
  return (
    <div>
      <h1>Meu Perfil</h1>
      <UserProfile />
    </div>
  );
}
```

## 🎯 **Exemplos Práticos**

### **Exemplo 1: Botão de Login no Header**

```tsx
import { useAuth } from './contexts/AuthContext';
import { AuthModals } from './components/auth/AuthModals';

function Header() {
  const { isAuthenticated } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  
  return (
    <header>
      {isAuthenticated ? (
        <UserMenuButton />
      ) : (
        <button onClick={() => setShowAuth(true)}>
          Entrar
        </button>
      )}
      
      <AuthModals
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
      />
    </header>
  );
}
```

### **Exemplo 2: Conteúdo Protegido**

```tsx
import { useAuth } from './contexts/AuthContext';

function ConteudoProtegido() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    return (
      <div>
        <p>Faça login para ver este conteúdo</p>
        <button onClick={() => setShowAuth(true)}>
          Entrar
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <h2>Conteúdo Exclusivo</h2>
      <p>Bem-vindo ao conteúdo protegido!</p>
    </div>
  );
}
```

### **Exemplo 3: Integração com Carrinho**

```tsx
import { useAuth } from './contexts/AuthContext';

function Carrinho() {
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  
  const finalizarCompra = () => {
    if (!isAuthenticated) {
      // Mostrar modal de login
      setShowAuth(true);
      return;
    }
    
    // Prosseguir com a compra
    console.log('Finalizando compra para:', user.email);
  };
  
  return (
    <div>
      {/* Lista de itens */}
      <button onClick={finalizarCompra}>
        {isAuthenticated ? 'Finalizar Compra' : 'Entrar para Comprar'}
      </button>
    </div>
  );
}
```

## 🔄 **Substituir Topbar Existente**

Para usar o Topbar com autenticação, substitua no seu `App.tsx`:

```tsx
// Antes
import { Topbar } from './components/Topbar';

// Depois
import { TopbarWithAuth } from './components/TopbarWithAuth';

// No JSX
<TopbarWithAuth />
```

## 🎨 **Personalização**

### **Cores e Estilos**

O sistema usa as variáveis CSS existentes do seu projeto:

```css
:root {
  --color-cookite-blue: #3b82f6;
  --color-cookite-blue-hover: #2563eb;
}
```

### **Componentes Customizáveis**

Todos os componentes podem ser personalizados:

```tsx
// Exemplo de personalização
<UserMenuButton 
  className="custom-user-menu"
  onProfileClick={() => {
    // Sua lógica personalizada
  }}
/>
```

## 🚀 **Funcionalidades Disponíveis**

### **✅ Implementadas**
- Login/Logout
- Cadastro de usuários
- Gerenciamento de perfil
- Validações robustas
- Interface responsiva
- Integração com Supabase

### **🔄 Próximas Implementações**
- Upload de avatar
- Recuperação de senha
- Login social
- Histórico de pedidos

## 🧪 **Testando o Sistema**

### **1. Teste de Cadastro**
1. Clique em "Entrar" no header
2. Vá para a aba "Cadastrar"
3. Preencha os dados
4. Verifique se o perfil foi criado

### **2. Teste de Login**
1. Use as credenciais criadas
2. Verifique se o menu do usuário aparece
3. Teste o logout

### **3. Teste de Perfil**
1. Clique no menu do usuário
2. Acesse "Meu Perfil"
3. Teste a edição de informações

## 🔒 **Segurança**

- ✅ Row Level Security (RLS) ativo
- ✅ Validações no frontend e backend
- ✅ Tokens JWT seguros
- ✅ Políticas de acesso restritas

## 📱 **Responsividade**

O sistema é totalmente responsivo e funciona em:
- ✅ Desktop
- ✅ Tablet  
- ✅ Mobile

## 🚨 **Troubleshooting**

### **Problema: Supabase não conecta**
```bash
# Verifique as variáveis de ambiente
VITE_SUPABASE_URL=sua_url
VITE_SUPABASE_ANON_KEY=sua_chave
```

### **Problema: Componentes não aparecem**
```tsx
// Verifique se o AuthProvider está envolvendo sua app
<AuthProvider>
  {/* Sua aplicação */}
</AuthProvider>
```

### **Problema: Erros de validação**
```tsx
// Use o hook de validação
import { useAuthValidation } from './hooks/useAuthValidation';

const { validateLoginForm } = useAuthValidation();
```

## 📞 **Suporte**

Para dúvidas ou problemas:
1. Verifique esta documentação
2. Consulte os exemplos de código
3. Verifique os logs no console
4. Abra uma issue no repositório

---

**Sistema de Autenticação Integrado com Sucesso! 🎉**
