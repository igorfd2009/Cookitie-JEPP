# Sistema de Rate Limiting

Este documento descreve o sistema de rate limiting implementado para proteger a aplicação contra ataques de força bruta e abuso de recursos.

## 🎯 **Objetivos**

- ✅ **Proteção contra Ataques**: Previne tentativas excessivas de login/cadastro
- ✅ **Segurança**: Bloqueia IPs que excedem limites de tentativas
- ✅ **Experiência do Usuário**: Feedback claro sobre limites e bloqueios
- ✅ **Performance**: Sistema eficiente com limpeza automática de dados

## 🔧 **Arquitetura**

### **Componentes Principais**

1. **`utils/rateLimiting.ts`**: Sistema core de rate limiting
2. **`hooks/useRateLimit.ts`**: Hooks React para integração
3. **`components/auth/AuthModals.tsx`**: Interface integrada

### **Fluxo de Funcionamento**

```
Usuário tenta ação → Verifica rate limit → Executa ação → Registra resultado
       ↓                    ↓              ↓              ↓
   Formulário          IP bloqueado?   Sucesso/Falha   Atualiza contadores
       ↓                    ↓              ↓              ↓
   Hook React          Bloquear IP      Registrar       Limpeza automática
```

## 📊 **Configurações Padrão**

### **Autenticação (Login)**
```typescript
{
  maxAttempts: 5,           // Máximo 5 tentativas
  windowMs: 15 * 60 * 1000, // Janela de 15 minutos
  blockDurationMs: 30 * 60 * 1000 // Bloqueio por 30 minutos
}
```

### **Cadastro (Signup)**
```typescript
{
  maxAttempts: 3,           // Máximo 3 tentativas
  windowMs: 60 * 60 * 1000, // Janela de 1 hora
  blockDurationMs: 2 * 60 * 60 * 1000 // Bloqueio por 2 horas
}
```

### **Reset de Senha**
```typescript
{
  maxAttempts: 3,           // Máximo 3 tentativas
  windowMs: 60 * 60 * 1000, // Janela de 1 hora
  blockDurationMs: 2 * 60 * 60 * 1000 // Bloqueio por 2 horas
}
```

## 🚀 **Como Usar**

### **Hook Básico**

```tsx
import { useRateLimit } from '../hooks/useRateLimit';

function MyComponent() {
  const rateLimit = useRateLimit({
    action: 'my_action',
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000,
    blockDurationMs: 30 * 60 * 1000,
    onBlocked: (blockedUntil) => {
      console.log(`Bloqueado até ${new Date(blockedUntil)}`);
    },
    onAttemptsExhausted: () => {
      console.log('Tentativas esgotadas');
    }
  });

  const handleAction = async () => {
    if (!rateLimit.canExecute()) {
      return;
    }

    const result = await rateLimit.executeWithRateLimit(
      () => performAction(),
      (success) => console.log('Sucesso'),
      (error) => console.log('Erro')
    );
  };

  return (
    <div>
      {rateLimit.isBlocked && (
        <p>Bloqueado por {rateLimit.getBlockedTimeFormatted()}</p>
      )}
      <button disabled={!rateLimit.canExecute()}>
        Executar Ação
      </button>
    </div>
  );
}
```

### **Hook Especializado para Autenticação**

```tsx
import { useAuthRateLimit } from '../hooks/useRateLimit';

function LoginForm() {
  const loginRateLimit = useAuthRateLimit();

  const handleLogin = async () => {
    if (!loginRateLimit.canExecute()) {
      return;
    }

    await loginRateLimit.executeWithRateLimit(
      () => signIn(email, password),
      (success) => {
        // Login bem-sucedido
        toast.success('Login realizado!');
      },
      (error) => {
        // Login falhou
        toast.error('Credenciais inválidas');
      }
    );
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Campos do formulário */}
      
      {/* Indicador de Rate Limit */}
      {loginRateLimit.isBlocked && (
        <div className="alert alert-error">
          Muitas tentativas. Tente novamente em {loginRateLimit.getBlockedTimeFormatted()}
        </div>
      )}

      <button 
        type="submit" 
        disabled={loginRateLimit.isBlocked}
      >
        {loginRateLimit.isBlocked ? 'Aguarde...' : 'Entrar'}
      </button>
    </form>
  );
}
```

## 🎨 **Interface do Usuário**

### **Indicadores Visuais**

#### **Bloqueado (Vermelho)**
```tsx
{loginRateLimit.isBlocked && (
  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
    <div className="flex items-center gap-2 text-red-800">
      <AlertTriangle className="h-4 w-4" />
      <span className="text-sm font-medium">
        Muitas tentativas. Tente novamente em {loginRateLimit.getBlockedTimeFormatted()}
      </span>
    </div>
  </div>
)}
```

#### **Aviso (Amarelo)**
```tsx
{!loginRateLimit.isBlocked && loginRateLimit.remainingAttempts <= 2 && (
  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
    <div className="flex items-center gap-2 text-yellow-800">
      <Clock className="h-4 w-4" />
      <span className="text-sm">
        Tentativas restantes: {loginRateLimit.remainingAttempts}
      </span>
    </div>
  </div>
)}
```

#### **Botão Desabilitado**
```tsx
<Button
  type="submit"
  disabled={loading || loginRateLimit.isBlocked}
>
  {loading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Entrando...
    </>
  ) : loginRateLimit.isBlocked ? (
    <>
      <Clock className="mr-2 h-4 w-4" />
      Aguarde...
    </>
  ) : (
    'Entrar'
  )}
</Button>
```

## 🔒 **Segurança**

### **Proteções Implementadas**

- ✅ **Limite de Tentativas**: Máximo de tentativas por janela de tempo
- ✅ **Bloqueio Temporário**: IP bloqueado por período configurável
- ✅ **Limpeza Automática**: Dados antigos são removidos automaticamente
- ✅ **Validação de IP**: Cada IP é tratado independentemente
- ✅ **Ações Específicas**: Diferentes limites para diferentes ações

### **Dados Armazenados**

```typescript
interface RateLimitAttempt {
  timestamp: number;    // Timestamp da tentativa
  action: string;       // Ação executada (login, signup, etc.)
  success: boolean;     // Se a tentativa foi bem-sucedida
}
```

### **Limpeza de Dados**

- **Tentativas**: Removidas após 24 horas
- **IPs Bloqueados**: Removidos automaticamente após expiração
- **Limpeza Automática**: Executada a cada hora

## 📈 **Monitoramento e Estatísticas**

### **Estatísticas por IP**

```typescript
const stats = getRateLimitStats(ip, action);

console.log({
  totalAttempts: stats.totalAttempts,      // Total de tentativas
  failedAttempts: stats.failedAttempts,    // Tentativas falhadas
  successAttempts: stats.successAttempts,  // Tentativas bem-sucedidas
  remainingAttempts: stats.remainingAttempts, // Tentativas restantes
  isBlocked: stats.isBlocked,              // Se está bloqueado
  blockedUntil: stats.blockedUntil,        // Quando o bloqueio expira
  windowMs: stats.windowMs                 // Janela de tempo
});
```

### **Estatísticas do Sistema**

```typescript
const systemStats = getSystemStats();

console.log({
  totalTrackedIPs: systemStats.totalTrackedIPs,     // IPs sendo monitorados
  totalBlockedIPs: systemStats.totalBlockedIPs,     // IPs bloqueados
  memoryUsage: systemStats.memoryUsage              // Uso de memória
});
```

## 🚨 **Troubleshooting**

### **Problema: Rate limit não está funcionando**

```typescript
// Verifique se o hook está sendo usado corretamente
const rateLimit = useRateLimit({
  action: 'login',
  maxAttempts: 5
});

console.log('Rate Limit State:', {
  isBlocked: rateLimit.isBlocked,
  remainingAttempts: rateLimit.remainingAttempts,
  canExecute: rateLimit.canExecute()
});
```

### **Problema: IP não está sendo bloqueado**

```typescript
// Verifique se as tentativas estão sendo registradas
const stats = rateLimit.getStats();
console.log('Rate Limit Stats:', stats);

// Verifique se o IP está sendo identificado corretamente
console.log('User IP:', rateLimit.userIP);
```

### **Problema: Performance lenta**

```typescript
// Considere reduzir a frequência de verificação
useEffect(() => {
  if (rateLimitState.isBlocked && rateLimitState.blockedUntil) {
    const checkInterval = setInterval(() => {
      // Verificar a cada 5 segundos em vez de 1 segundo
    }, 5000);
    
    return () => clearInterval(checkInterval);
  }
}, [rateLimitState.isBlocked, rateLimitState.blockedUntil]);
```

## 🔄 **Próximas Melhorias**

### **Funcionalidades Planejadas**

- [ ] **Redis Integration**: Armazenamento persistente para produção
- [ ] **Whitelist**: IPs confiáveis que não são bloqueados
- [ ] **Graduated Response**: Diferentes níveis de bloqueio
- [ ] **Analytics Dashboard**: Visualização de tentativas e bloqueios
- [ ] **Machine Learning**: Detecção automática de padrões suspeitos

### **Otimizações**

- [ ] **Cache Local**: Reduzir consultas ao sistema de rate limiting
- [ ] **Batch Operations**: Processar múltiplas tentativas de uma vez
- [ ] **Compression**: Comprimir dados armazenados em memória
- [ ] **Lazy Loading**: Carregar dados apenas quando necessário

## 📋 **Checklist de Implementação**

- [ ] **Core System**: Implementar `utils/rateLimiting.ts`
- [ ] **React Hooks**: Criar `hooks/useRateLimit.ts`
- [ ] **UI Integration**: Integrar no `AuthModals`
- [ ] **Testing**: Testar diferentes cenários de rate limiting
- [ ] **Documentation**: Documentar uso e configuração
- [ ] **Monitoring**: Implementar logs e estatísticas

## 🎯 **Casos de Uso**

### **1. Formulário de Login**
- Protege contra ataques de força bruta
- Limita tentativas de credenciais inválidas
- Bloqueia IPs suspeitos temporariamente

### **2. Formulário de Cadastro**
- Previne criação excessiva de contas
- Protege contra bots e spam
- Limita tentativas de email inválido

### **3. Reset de Senha**
- Evita spam de emails de reset
- Protege contra ataques de enumeração
- Limita tentativas de email inexistente

### **4. Ações Administrativas**
- Protege endpoints sensíveis
- Limita tentativas de acesso não autorizado
- Bloqueia IPs maliciosos

---

**Sistema de Rate Limiting Implementado com Sucesso! 🎉**

Agora sua aplicação está protegida contra ataques de força bruta e abuso de recursos!
