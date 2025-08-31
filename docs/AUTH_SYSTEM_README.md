# Sistema de Autenticação - Cookite Jepp

Este documento descreve a implementação completa do sistema de cadastro e autenticação para o projeto Cookite Jepp.

## 📁 Estrutura do Sistema

```
cookite-jepp/
├── contexts/
│   └── AuthContext.tsx                 # ✅ Contexto principal de autenticação
├── components/
│   ├── auth/
│   │   ├── AuthModals.tsx             # ✅ Modais de login/cadastro
│   │   └── AuthExample.tsx            # ✅ Exemplo de uso
│   └── user/
│       ├── UserProfile.tsx            # ✅ Perfil completo do usuário  
│       └── UserMenuButton.tsx         # ✅ Botão integrado ao header
├── hooks/
│   └── useAuthValidation.ts           # ✅ Validações personalizadas
├── sql/
│   └── supabase-setup.sql             # ✅ Configuração do banco
└── docs/
    └── AUTH_SYSTEM_README.md          # ✅ Esta documentação
```

## 🚀 Configuração Inicial

### 1. Configuração do Supabase

1. Acesse o painel do Supabase
2. Vá para a seção SQL Editor
3. Execute o arquivo `sql/supabase-setup.sql`
4. Verifique se as tabelas foram criadas corretamente

### 2. Variáveis de Ambiente

Certifique-se de que as seguintes variáveis estão configuradas no seu `.env`:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 3. Integração no App Principal

Envolva sua aplicação com o `AuthProvider`:

```tsx
// main.tsx ou App.tsx
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      {/* Sua aplicação aqui */}
    </AuthProvider>
  )
}
```

## 🔧 Componentes Principais

### AuthContext

O contexto principal que gerencia todo o estado de autenticação.

**Funcionalidades:**
- ✅ Login/Logout
- ✅ Cadastro de usuários
- ✅ Gerenciamento de perfil
- ✅ Reset de senha
- ✅ Estado de autenticação em tempo real

**Uso:**
```tsx
import { useAuth } from './contexts/AuthContext'

function MyComponent() {
  const { user, profile, signIn, signOut, isAuthenticated } = useAuth()
  
  // Use as funções conforme necessário
}
```

### AuthModals

Modais responsivos para login e cadastro.

**Props:**
- `isOpen: boolean` - Controla a visibilidade
- `onClose: () => void` - Função para fechar
- `defaultTab?: 'login' | 'signup'` - Aba padrão

**Uso:**
```tsx
import { AuthModals } from './components/auth/AuthModals'

function MyComponent() {
  const [showAuth, setShowAuth] = useState(false)
  
  return (
    <AuthModals
      isOpen={showAuth}
      onClose={() => setShowAuth(false)}
      defaultTab="login"
    />
  )
}
```

### UserProfile

Componente completo para gerenciamento de perfil do usuário.

**Funcionalidades:**
- ✅ Visualização de informações
- ✅ Edição inline
- ✅ Upload de avatar (preparado)
- ✅ Configurações de segurança

**Uso:**
```tsx
import { UserProfile } from './components/user/UserProfile'

function ProfilePage() {
  return <UserProfile />
}
```

### UserMenuButton

Botão de menu do usuário integrado ao header.

**Props:**
- `onProfileClick?: () => void`
- `onOrdersClick?: () => void`
- `onFavoritesClick?: () => void`

**Uso:**
```tsx
import { UserMenuButton } from './components/user/UserMenuButton'

function Header() {
  return (
    <header>
      {/* Outros elementos */}
      <UserMenuButton 
        onProfileClick={() => navigate('/profile')}
        onOrdersClick={() => navigate('/orders')}
      />
    </header>
  )
}
```

## 🎯 Hook de Validação

### useAuthValidation

Hook personalizado para validações de formulários de autenticação.

**Funcionalidades:**
- ✅ Validação de email
- ✅ Validação de senha
- ✅ Validação de nome completo
- ✅ Validação de telefone
- ✅ Validações customizáveis

**Uso:**
```tsx
import { useAuthValidation } from './hooks/useAuthValidation'

function LoginForm() {
  const { validateLoginForm, errors, clearErrors } = useAuthValidation()
  
  const handleSubmit = (email: string, password: string) => {
    const { isValid, errors } = validateLoginForm(email, password)
    
    if (isValid) {
      // Prosseguir com login
    }
  }
}
```

## 🗄️ Banco de Dados

### Tabelas Criadas

1. **user_profiles** - Perfis dos usuários
2. **user_sessions** - Sessões de usuário (opcional)
3. **user_activity_logs** - Logs de atividade (opcional)

### Políticas de Segurança (RLS)

- ✅ Usuários só podem ver/editar seus próprios perfis
- ✅ Triggers automáticos para criação de perfis
- ✅ Funções seguras para operações CRUD

### Funções Úteis

- `get_user_profile()` - Obter perfil do usuário
- `update_user_profile()` - Atualizar perfil do usuário
- `handle_new_user()` - Criar perfil automaticamente

## 🎨 Personalização

### Estilos

O sistema usa Tailwind CSS e pode ser facilmente personalizado:

```tsx
// Exemplo de personalização
<Button className="bg-red-500 hover:bg-red-600">
  Botão Personalizado
</Button>
```

### Temas

Para implementar temas, modifique as classes CSS ou use variáveis CSS:

```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
}
```

## 🔒 Segurança

### Recursos Implementados

- ✅ Row Level Security (RLS)
- ✅ Validação de entrada
- ✅ Sanitização de dados
- ✅ Tokens JWT seguros
- ✅ Políticas de acesso restritas

### Boas Práticas

1. **Nunca** exponha chaves secretas no frontend
2. **Sempre** valide dados de entrada
3. **Use** HTTPS em produção
4. **Implemente** rate limiting se necessário
5. **Monitore** logs de atividade

## 🧪 Testes

### Testando o Sistema

1. **Cadastro:**
   - Teste com emails válidos/inválidos
   - Teste com senhas fracas/fortes
   - Teste com nomes válidos/inválidos

2. **Login:**
   - Teste com credenciais corretas
   - Teste com credenciais incorretas
   - Teste de logout

3. **Perfil:**
   - Teste de edição de informações
   - Teste de validações
   - Teste de persistência

### Exemplo de Teste

```tsx
// Teste básico de autenticação
import { render, screen } from '@testing-library/react'
import { AuthProvider } from './contexts/AuthContext'

test('usuário pode fazer login', () => {
  render(
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  )
  
  // Implementar testes específicos
})
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Supabase não conecta:**
   - Verifique as variáveis de ambiente
   - Confirme se o projeto está ativo
   - Verifique as políticas RLS

2. **Erros de validação:**
   - Use o hook `useAuthValidation`
   - Verifique as regras de validação
   - Teste com dados válidos

3. **Problemas de perfil:**
   - Execute o SQL de configuração
   - Verifique se os triggers estão ativos
   - Confirme as políticas de acesso

### Logs Úteis

```tsx
// Adicione logs para debug
console.log('Auth State:', { user, profile, isAuthenticated })
console.log('Supabase Available:', isSupabaseAvailable())
```

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:

- ✅ Desktop
- ✅ Tablet
- ✅ Mobile
- ✅ Diferentes tamanhos de tela

## 🔄 Atualizações Futuras

### Funcionalidades Planejadas

- [ ] Upload de avatar
- [ ] Autenticação em duas etapas
- [ ] Login social (Google, Facebook)
- [ ] Recuperação de senha avançada
- [ ] Histórico de atividades
- [ ] Notificações push

### Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Teste thoroughly
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique esta documentação
2. Consulte os exemplos de código
3. Verifique os logs de erro
4. Abra uma issue no repositório

## 📄 Licença

Este sistema de autenticação é parte do projeto Cookite Jepp e segue as mesmas políticas de licenciamento.

---

**Desenvolvido com ❤️ para o Cookite Jepp**
