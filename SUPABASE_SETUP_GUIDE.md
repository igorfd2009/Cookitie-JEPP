# 🔧 Guia Completo: Sincronização Entre Dispositivos

## 🎯 **PROBLEMA ATUAL**
Os pedidos estão salvos apenas no **localStorage** de cada dispositivo, então:
- ❌ Pedidos feitos no celular não aparecem no computador
- ❌ Pedidos feitos no computador não aparecem no celular
- ❌ Não há backup na nuvem
- ❌ Dados podem ser perdidos

## ✅ **SOLUÇÃO: Configurar Supabase**

### **1. Criar Conta no Supabase**
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com GitHub ou crie uma conta

### **2. Criar Novo Projeto**
1. Clique em "New Project"
2. Digite nome: `cookite-jepp`
3. Escolha senha forte para o banco
4. Escolha região: **São Paulo**
5. Clique em "Create new project"

### **3. Obter Credenciais**
1. Aguarde 2-3 minutos para criação
2. Vá em **Settings** → **API**
3. Copie:
   - **Project URL** (ex: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (ex: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### **4. Configurar Variáveis de Ambiente**

Crie arquivo `.env.local` na raiz do projeto:

```env
# Configurações do Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui

# Configurações do Resend (Email) - Opcional
VITE_RESEND_API_KEY=sua-chave-resend-aqui
```

### **5. Configurar Banco de Dados**

No Supabase, vá em **SQL Editor** e execute:

```sql
-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    items JSONB NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'preparing', 'ready', 'completed')),
    payment_method TEXT NOT NULL,
    pix_code TEXT,
    pickup_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at);

-- Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Usuários podem ver seus perfis" ON profiles 
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuários podem ver seus pedidos" ON orders 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar pedidos" ON orders 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus pedidos" ON orders 
    FOR UPDATE USING (auth.uid() = user_id);

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### **6. Testar Configuração**
1. Reinicie o servidor: `npm run dev`
2. Abra console do navegador (F12)
3. Deve aparecer: "Supabase configurado corretamente"
4. Teste cadastro/login

---

## 📱 **COMO FUNCIONA A SINCRONIZAÇÃO**

### **🔄 Sincronização Automática**
- **Pedidos salvos na nuvem** (Supabase)
- **Atualização em tempo real** entre dispositivos
- **Backup automático** dos dados
- **Histórico completo** de pedidos

### **📊 Painel Administrativo**
- **Dashboard completo** com estatísticas
- **Lista de todos os pedidos**
- **Filtros por status**
- **Exportação de dados**
- **Gestão de status**

### **🔐 Segurança**
- **Autenticação obrigatória**
- **Dados isolados por usuário**
- **Políticas de segurança** (RLS)
- **Backup automático**

---

## 🎛️ **ACESSO AO PAINEL ADMIN**

### **URL do Painel Admin:**
```
https://seu-site.com/?admin=true
```

### **Funcionalidades Disponíveis:**
- 📊 **Dashboard** com estatísticas
- 📦 **Gerenciar Pedidos** com filtros
- 👁️ **Ver Detalhes** de cada pedido
- 🔄 **Atualizar Status** dos pedidos
- 📥 **Exportar Dados** em JSON

### **Status dos Pedidos:**
- 🟡 **pending** - Aguardando pagamento
- 🔵 **paid** - Pago
- 🟠 **preparing** - Preparando
- 🟢 **ready** - Pronto para entrega
- ✅ **completed** - Entregue

---

## 🧪 **TESTE DE SINCRONIZAÇÃO**

### **Teste 1: Dispositivos Diferentes**
1. **Cadastre-se** no celular
2. **Faça um pedido** no celular
3. **Acesse no computador** com mesma conta
4. **✅ Pedido deve aparecer** automaticamente

### **Teste 2: Múltiplas Abas**
1. **Abra 2 abas** do navegador
2. **Faça pedido** na aba 1
3. **Atualize aba 2** (F5)
4. **✅ Pedido deve aparecer** na aba 2

### **Teste 3: Painel Admin**
1. **Acesse** `/?admin=true`
2. **Verifique** se todos os pedidos aparecem
3. **Teste** atualização de status
4. **Teste** exportação de dados

---

## 🚨 **TROUBLESHOOTING**

### **Erro: "Supabase não configurado"**
- Verifique se `.env.local` foi criado
- Verifique se as chaves estão corretas
- Reinicie o servidor após criar `.env.local`

### **Erro: "Invalid API key"**
- Verifique se a chave anon está correta
- Verifique se a URL do projeto está correta
- Teste no Supabase Dashboard

### **Erro: "Table doesn't exist"**
- Execute o script SQL no Supabase
- Verifique se as tabelas foram criadas
- Verifique as políticas RLS

---

## 🎉 **RESULTADO FINAL**

### **Antes da Configuração:**
❌ Pedidos isolados por dispositivo  
❌ Sem backup na nuvem  
❌ Dados podem ser perdidos  
❌ Sem painel administrativo  

### **Depois da Configuração:**
✅ Sincronização automática entre dispositivos  
✅ Backup na nuvem  
✅ Dados seguros e persistentes  
✅ Painel administrativo completo  
✅ Histórico completo de pedidos  

---

## 📞 **SUPORTE**

Se precisar de ajuda:
1. Verifique os logs no console do navegador
2. Teste a conexão com Supabase
3. Verifique se as variáveis de ambiente estão corretas
4. Execute novamente o script SQL se necessário

**Com o Supabase configurado, você terá sincronização completa entre todos os dispositivos! 🚀**


