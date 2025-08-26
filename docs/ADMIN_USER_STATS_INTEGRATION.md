# Integração de Estatísticas de Usuários no AdminDashboard

Este guia mostra como o sistema de estatísticas de usuários foi integrado no `AdminDashboard` para fornecer insights valiosos sobre o comportamento dos usuários.

## ✅ **Funcionalidades Implementadas**

### **1. Estatísticas Principais de Usuários**
- ✅ **Total de Usuários**: Contagem total de usuários cadastrados
- ✅ **Usuários Ativos**: Usuários que fizeram pelo menos um pedido
- ✅ **Receita Total**: Soma total dos gastos de todos os usuários
- ✅ **Novos Cadastros**: Usuários que se cadastraram nos últimos 7 dias

### **2. Estatísticas Detalhadas**
- ✅ **Primeiro Pedido**: Contagem de usuários fazendo primeiro pedido
- ✅ **Média de Pedidos**: Média de pedidos por usuário
- ✅ **Média de Gasto**: Média de gasto por usuário
- ✅ **Percentuais**: Cálculos de conversão e engajamento

### **3. Integração com Supabase**
- ✅ **Consulta Direta**: Acesso direto à tabela `user_profiles`
- ✅ **Dados em Tempo Real**: Estatísticas atualizadas a cada refresh
- ✅ **Tratamento de Erros**: Fallbacks para dados ausentes

## 🔧 **Como Funciona**

### **Importações e Estados**

```tsx
// Sistema de Autenticação e Supabase
import { supabase } from '../lib/supabase';

export function AdminDashboard() {
  // Estados para estatísticas de usuários
  const [userStats, setUserStats] = useState<any>(null);
  
  // ... resto do código
}
```

### **Função de Carregamento de Estatísticas**

```tsx
// Função para carregar estatísticas de usuários
const loadUserStats = async () => {
  try {
    const { data: users, error } = await supabase
      .from('user_profiles')
      .select('total_pedidos, total_gasto, data_criacao, primeiro_pedido');
    
    if (error) {
      console.error('Error loading user stats:', error);
      return;
    }
    
    const stats = {
      totalUsuarios: users?.length || 0,
      usuariosAtivos: users?.filter(u => u.total_pedidos > 0).length || 0,
      receitaTotal: users?.reduce((sum, u) => sum + (u.total_gasto || 0), 0) || 0,
      novosCadastros: users?.filter(u => 
        new Date(u.data_criacao) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length || 0,
      primeiroPedido: users?.filter(u => u.primeiro_pedido).length || 0,
      mediaPedidos: users?.length > 0 
        ? (users?.reduce((sum, u) => sum + (u.total_pedidos || 0), 0) || 0) / users.length
        : 0,
      mediaGasto: users?.length > 0 
        ? (users?.reduce((sum, u) => sum + (u.total_gasto || 0), 0) || 0) / users.length
        : 0,
    };
    
    setUserStats(stats);
  } catch (error) {
    console.error('Error loading user stats:', error);
    setUserStats(null);
  }
};
```

### **Integração na Função Principal**

```tsx
const loadData = async () => {
  // ... código existente para reservas e pagamentos

  // Carregar estatísticas de usuários
  try {
    await loadUserStats();
  } catch (userStatsError) {
    if (import.meta.env.DEV) {
      console.error('Error loading user stats:', userStatsError);
    }
    setUserStats(null);
  }
  
  // ... resto do código
};
```

## 🎯 **Interface do Usuário**

### **Estatísticas Principais (Grid 4x1)**

```tsx
{/* Estatísticas de Usuários */}
{userStats && (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    {/* Total de Usuários */}
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <UserCheck className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-2xl text-gray-800">{userStats.totalUsuarios}</p>
            <p className="text-sm text-gray-600">Total Usuários</p>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Usuários Ativos */}
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <TrendingUp className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-2xl text-gray-800">{userStats.usuariosAtivos}</p>
            <p className="text-sm text-gray-600">Usuários Ativos</p>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Receita Total */}
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <DollarSign className="text-purple-600" size={24} />
          </div>
          <div>
            <p className="text-2xl text-gray-800">{formatCurrency(userStats.receitaTotal)}</p>
            <p className="text-sm text-gray-600">Receita Total</p>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Novos Cadastros */}
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <TrendingDown className="text-orange-600" size={24} />
          </div>
          <div>
            <p className="text-2xl text-gray-800">{userStats.novosCadastros}</p>
            <p className="text-sm text-gray-600">Novos (7d)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)}
```

### **Estatísticas Detalhadas (Grid 3x1)**

```tsx
{/* Estatísticas Detalhadas de Usuários */}
{userStats && (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    {/* Primeiro Pedido */}
    <Card>
      <CardContent className="p-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-blue-600">{userStats.primeiroPedido}</p>
          <p className="text-sm text-gray-600">Primeiro Pedido</p>
          <p className="text-xs text-gray-500 mt-1">
            {userStats.totalUsuarios > 0 
              ? `${((userStats.primeiroPedido / userStats.totalUsuarios) * 100).toFixed(1)}% dos usuários`
              : '0% dos usuários'
            }
          </p>
        </div>
      </CardContent>
    </Card>

    {/* Média de Pedidos */}
    <Card>
      <CardContent className="p-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-green-600">{userStats.mediaPedidos.toFixed(1)}</p>
          <p className="text-sm text-gray-600">Média de Pedidos</p>
          <p className="text-xs text-gray-500 mt-1">Por usuário</p>
        </div>
      </CardContent>
    </Card>

    {/* Média de Gasto */}
    <Card>
      <CardContent className="p-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-purple-600">{formatCurrency(userStats.mediaGasto)}</p>
          <p className="text-sm text-gray-600">Média de Gasto</p>
          <p className="text-xs text-gray-500 mt-1">Por usuário</p>
        </div>
      </CardContent>
    </Card>
  </div>
)}
```

## 📊 **Métricas Calculadas**

### **Métricas Principais**

```tsx
const stats = {
  // Contagens básicas
  totalUsuarios: users?.length || 0,
  usuariosAtivos: users?.filter(u => u.total_pedidos > 0).length || 0,
  
  // Valores monetários
  receitaTotal: users?.reduce((sum, u) => sum + (u.total_gasto || 0), 0) || 0,
  
  // Métricas temporais
  novosCadastros: users?.filter(u => 
    new Date(u.data_criacao) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length || 0,
  
  // Métricas de comportamento
  primeiroPedido: users?.filter(u => u.primeiro_pedido).length || 0,
  
  // Médias
  mediaPedidos: users?.length > 0 
    ? (users?.reduce((sum, u) => sum + (u.total_pedidos || 0), 0) || 0) / users.length
    : 0,
  mediaGasto: users?.length > 0 
    ? (users?.reduce((sum, u) => sum + (u.total_gasto || 0), 0) || 0) / users.length
    : 0,
};
```

### **Cálculos de Percentuais**

```tsx
// Percentual de usuários ativos
const percentualAtivos = userStats.totalUsuarios > 0 
  ? (userStats.usuariosAtivos / userStats.totalUsuarios) * 100 
  : 0;

// Percentual de primeiro pedido
const percentualPrimeiroPedido = userStats.totalUsuarios > 0 
  ? (userStats.primeiroPedido / userStats.totalUsuarios) * 100 
  : 0;

// Taxa de conversão (usuários que fizeram pedido)
const taxaConversao = userStats.totalUsuarios > 0 
  ? (userStats.usuariosAtivos / userStats.totalUsuarios) * 100 
  : 0;
```

## 🎨 **Design e Estilos**

### **Cores e Temas por Métrica**

```tsx
// Total de Usuários - Azul
<div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
  <UserCheck className="text-blue-600" size={24} />
</div>

// Usuários Ativos - Verde
<div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
  <TrendingUp className="text-green-600" size={24} />
</div>

// Receita Total - Roxo
<div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
  <DollarSign className="text-purple-600" size={24} />
</div>

// Novos Cadastros - Laranja
<div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
  <TrendingDown className="text-orange-600" size={24} />
</div>
```

### **Responsividade**

```tsx
// Grid responsivo para estatísticas principais
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
  {/* 2 colunas no mobile, 4 no desktop */}
</div>

// Grid responsivo para estatísticas detalhadas
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  {/* 1 coluna no mobile, 3 no desktop */}
</div>
```

## 🔄 **Fluxo de Dados**

### **1. Carregamento Inicial**
```
1. AdminDashboard é montado
2. loadData() é chamada
3. loadUserStats() é executada
4. Consulta ao Supabase
5. Dados são processados
6. userStats é atualizado
7. Interface é renderizada
```

### **2. Atualização Manual**
```
1. Usuário clica em "Atualizar"
2. loadData() é chamada novamente
3. loadUserStats() é executada
4. Dados são atualizados
5. Interface é re-renderizada
```

### **3. Tratamento de Erros**
```
1. Erro na consulta ao Supabase
2. Error é capturado no catch
3. userStats é definido como null
4. Interface não exibe estatísticas
5. Erro é logado no console (dev)
```

## 🧪 **Testando a Integração**

### **1. Teste de Carregamento**
1. Abra o AdminDashboard
2. Verifique se as estatísticas de usuários aparecem
3. Verifique se os valores estão corretos
4. Teste o botão "Atualizar"

### **2. Teste de Responsividade**
1. Teste em diferentes tamanhos de tela
2. Verifique se o grid se adapta corretamente
3. Verifique se os ícones e textos estão visíveis

### **3. Teste de Dados**
1. Verifique se os cálculos estão corretos
2. Teste com diferentes quantidades de usuários
3. Verifique se os percentuais estão corretos

## 🔒 **Segurança e Dados**

### **Dados Acessados**
- ✅ **total_pedidos**: Número de pedidos por usuário
- ✅ **total_gasto**: Valor total gasto por usuário
- ✅ **data_criacao**: Data de criação da conta
- ✅ **primeiro_pedido**: Flag indicando primeiro pedido

### **Proteções**
- ✅ **Tratamento de Erros**: Fallbacks para dados ausentes
- ✅ **Validação de Dados**: Verificação de tipos e valores
- ✅ **Logs de Desenvolvimento**: Apenas em ambiente dev

## 🚨 **Troubleshooting**

### **Problema: Estatísticas não aparecem**
```tsx
// Verifique se o userStats está sendo carregado
console.log('User Stats:', userStats);

// Verifique se há erro na consulta
const { data: users, error } = await supabase
  .from('user_profiles')
  .select('total_pedidos, total_gasto, data_criacao, primeiro_pedido');

console.log('Users Data:', users);
console.log('Supabase Error:', error);
```

### **Problema: Valores incorretos**
```tsx
// Verifique os cálculos
console.log('Raw Users Data:', users);
console.log('Calculated Stats:', {
  totalUsuarios: users?.length,
  usuariosAtivos: users?.filter(u => u.total_pedidos > 0).length,
  receitaTotal: users?.reduce((sum, u) => sum + (u.total_gasto || 0), 0),
});
```

### **Problema: Performance lenta**
```tsx
// Considere otimizar a consulta
const { data: users, error } = await supabase
  .from('user_profiles')
  .select('total_pedidos, total_gasto, data_criacao, primeiro_pedido')
  .order('data_criacao', { ascending: false })
  .limit(1000); // Limite para evitar sobrecarga
```

## 📋 **Checklist de Implementação**

- [ ] Importar `supabase` client
- [ ] Adicionar estado `userStats`
- [ ] Criar função `loadUserStats`
- [ ] Integrar na função `loadData`
- [ ] Adicionar interface de estatísticas principais
- [ ] Adicionar interface de estatísticas detalhadas
- [ ] Testar carregamento de dados
- [ ] Verificar responsividade
- [ ] Testar tratamento de erros

## 🔄 **Próximas Melhorias**

### **Funcionalidades Planejadas**
- [ ] **Gráficos**: Visualizações com Chart.js ou Recharts
- [ ] **Filtros Temporais**: Seleção de período (7d, 30d, 90d)
- [ ] **Exportação**: CSV/Excel das estatísticas
- [ ] **Comparação**: Períodos anteriores vs. atual
- [ ] **Alertas**: Notificações para métricas importantes

### **Otimizações**
- [ ] **Cache**: Dados em cache local para melhor performance
- [ ] **Paginação**: Para grandes volumes de usuários
- [ ] **Real-time**: WebSocket para atualizações em tempo real
- [ ] **Agregação**: Dados pré-calculados no banco

## 🎯 **Insights de Negócio**

### **Métricas Importantes**
- 📊 **Taxa de Conversão**: % de usuários que fazem pedido
- 📊 **Engajamento**: Média de pedidos por usuário
- 📊 **Valor do Cliente**: Média de gasto por usuário
- 📊 **Crescimento**: Novos cadastros por período

### **Tomada de Decisão**
- ✅ **Marketing**: Foco em usuários inativos
- ✅ **Produto**: Melhorar experiência de primeiro pedido
- ✅ **Preços**: Otimizar baseado no valor médio
- ✅ **Retenção**: Estratégias para usuários ativos

---

**Integração de Estatísticas de Usuários no AdminDashboard Concluída! 🎉**

Agora o painel administrativo oferece insights valiosos sobre o comportamento dos usuários!
