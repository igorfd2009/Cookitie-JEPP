# Guia de Integração - UserMenuButton no Header

Este guia mostra como integrar o `UserMenuButton` no seu header/navbar existente.

## 🎯 **Opções de Integração**

### **Opção 1: Header Simples (Recomendado)**

Use o componente `HeaderSimple` que segue exatamente o seu exemplo:

```tsx
// No seu App.tsx ou onde quiser usar
import { HeaderSimple as Header } from './components/HeaderSimple';

export function App() {
  return (
    <div>
      <Header />
      {/* Resto do seu conteúdo */}
    </div>
  );
}
```

### **Opção 2: Header Completo**

Use o componente `Header` com funcionalidades adicionais:

```tsx
import { Header } from './components/Header';

export function App() {
  const handleCartClick = () => {
    // Sua lógica do carrinho
  };

  const handleFavoritesClick = () => {
    // Sua lógica de favoritos
  };

  return (
    <div>
      <Header 
        onCartClick={handleCartClick}
        onFavoritesClick={handleFavoritesClick}
        cartItemCount={5}
      />
      {/* Resto do seu conteúdo */}
    </div>
  );
}
```

### **Opção 3: Integrar no Topbar Existente**

Substitua seu `Topbar` atual pelo `TopbarWithUserMenu`:

```tsx
// No App.tsx, substitua:
import { TopbarWithUserMenu } from './components/TopbarWithUserMenu';

// Por:
<TopbarWithUserMenu />
```

## 🔧 **Implementação Manual**

Se preferir integrar manualmente no seu header existente:

### **1. Importar os Componentes Necessários**

```tsx
import { useAuth } from '../contexts/AuthContext';
import { UserMenuButton } from './components/user/UserMenuButton';
import { AuthModals } from './components/auth/AuthModals';
import { Button } from './components/ui/button';
import { LogIn } from 'lucide-react';
import { useState } from 'react';
```

### **2. Adicionar Estados e Hooks**

```tsx
export function SeuHeader() {
  const { isAuthenticated, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  // ... resto do seu código
}
```

### **3. Adicionar o Sistema de Autenticação no JSX**

```tsx
return (
  <>
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo e navegação existente */}
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Cookite" className="h-8" />
          {/* Sua navegação atual */}
        </div>

        {/* Adicionar menu do usuário aqui */}
        <div className="flex items-center gap-4">
          {!loading && (
            <>
              {isAuthenticated ? (
                // Usuário logado - mostrar menu do usuário
                <UserMenuButton 
                  onProfileClick={() => {
                    // Implementar navegação para perfil
                    console.log('Ir para perfil');
                  }}
                  onOrdersClick={() => {
                    // Implementar navegação para pedidos
                    console.log('Ir para pedidos');
                  }}
                  onFavoritesClick={() => {
                    // Implementar navegação para favoritos
                    console.log('Ir para favoritos');
                  }}
                />
              ) : (
                // Usuário não logado - mostrar botão de login
                <Button
                  onClick={handleAuthClick}
                  size="sm"
                  variant="outline"
                  className="text-[var(--color-cookite-blue)] border-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue)] hover:text-white transition-colors"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Entrar
                </Button>
              )}
            </>
          )}
          {/* Seus outros botões (carrinho, etc.) */}
        </div>
      </div>
    </header>

    {/* Modal de Autenticação */}
    <AuthModals
      isOpen={showAuthModal}
      onClose={() => setShowAuthModal(false)}
      defaultTab="login"
    />
  </>
);
```

## 🎨 **Personalização**

### **Estilos do Botão de Login**

```tsx
// Estilo padrão (azul)
<Button
  onClick={handleAuthClick}
  size="sm"
  variant="outline"
  className="text-[var(--color-cookite-blue)] border-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue)] hover:text-white transition-colors"
>
  <LogIn className="h-4 w-4 mr-2" />
  Entrar
</Button>

// Estilo personalizado
<Button
  onClick={handleAuthClick}
  size="sm"
  className="bg-green-600 hover:bg-green-700 text-white border-green-600"
>
  <LogIn className="h-4 w-4 mr-2" />
  Entrar
</Button>
```

### **Estilos do UserMenuButton**

```tsx
// Com classes personalizadas
<UserMenuButton 
  className="custom-user-menu"
  onProfileClick={() => console.log('Perfil')}
/>

// Com estilos inline
<div className="[&_.user-menu]:bg-red-100 [&_.user-menu]:text-red-800">
  <UserMenuButton 
    onProfileClick={() => console.log('Perfil')}
  />
</div>
```

## 🔄 **Integração com Navegação**

### **Usando React Router**

```tsx
import { useNavigate } from 'react-router-dom';

export function SeuHeader() {
  const navigate = useNavigate();
  
  return (
    <header>
      {/* ... */}
      <UserMenuButton 
        onProfileClick={() => navigate('/profile')}
        onOrdersClick={() => navigate('/orders')}
        onFavoritesClick={() => navigate('/favorites')}
      />
    </header>
  );
}
```

### **Usando Navegação Programática**

```tsx
export function SeuHeader() {
  const handleProfileClick = () => {
    // Sua lógica de navegação
    window.location.href = '/profile';
    // ou
    history.pushState({}, '', '/profile');
  };
  
  return (
    <header>
      {/* ... */}
      <UserMenuButton 
        onProfileClick={handleProfileClick}
        onOrdersClick={() => window.location.href = '/orders'}
        onFavoritesClick={() => window.location.href = '/favorites'}
      />
    </header>
  );
}
```

## 📱 **Responsividade**

### **Mobile-First Design**

```tsx
// Botão responsivo
<Button
  onClick={handleAuthClick}
  size="sm"
  variant="outline"
  className="text-[var(--color-cookite-blue)] border-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue)] hover:text-white transition-colors"
>
  <LogIn className="h-4 w-4 mr-2" />
  <span className="hidden sm:inline">Entrar</span>
  <span className="sm:hidden">Login</span>
</Button>

// Layout responsivo
<div className="flex items-center gap-2 md:gap-4">
  <UserMenuButton />
  {/* Outros elementos */}
</div>
```

## 🧪 **Testando a Integração**

### **1. Verificar Renderização**
- ✅ Botão "Entrar" aparece quando não logado
- ✅ UserMenuButton aparece quando logado
- ✅ Modal de autenticação abre ao clicar

### **2. Testar Estados**
- ✅ Estado de loading funciona
- ✅ Transição entre estados funciona
- ✅ Modal fecha corretamente

### **3. Testar Funcionalidades**
- ✅ Login funciona
- ✅ Cadastro funciona
- ✅ Menu do usuário abre
- ✅ Logout funciona

## 🚨 **Troubleshooting**

### **Problema: UserMenuButton não aparece**
```tsx
// Verifique se o AuthProvider está envolvendo sua app
<AuthProvider>
  <SeuHeader />
</AuthProvider>
```

### **Problema: Modal não abre**
```tsx
// Verifique se o estado está sendo atualizado
console.log('showAuthModal:', showAuthModal);

// Verifique se o onClick está funcionando
const handleAuthClick = () => {
  console.log('Botão clicado');
  setShowAuthModal(true);
};
```

### **Problema: Estilos não aplicam**
```tsx
// Verifique se as variáveis CSS estão definidas
:root {
  --color-cookite-blue: #3b82f6;
  --color-cookite-blue-hover: #2563eb;
}
```

## 📋 **Checklist de Integração**

- [ ] Importar `useAuth` hook
- [ ] Importar `UserMenuButton` componente
- [ ] Importar `AuthModals` componente
- [ ] Adicionar estado para modal
- [ ] Adicionar lógica de autenticação
- [ ] Adicionar JSX condicional
- [ ] Testar estados de loading
- [ ] Testar login/logout
- [ ] Verificar responsividade
- [ ] Testar navegação

---

**Integração Concluída! 🎉**

Agora você tem um header totalmente funcional com sistema de autenticação integrado!
