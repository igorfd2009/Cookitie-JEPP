# 🔧 Configuração do Sistema de Cadastro

## ❌ Problema Identificado
O sistema de cadastro não estava funcionando porque **não há um arquivo `.env` configurado** com as credenciais do Supabase.

## ✅ Solução Implementada
**Sistema de Fallback Offline**: Agora o sistema funciona mesmo sem Supabase configurado, usando localStorage para simular autenticação.

## ✅ Solução

### 1. Criar arquivo `.env` na raiz do projeto

Crie um arquivo chamado `.env` na pasta raiz do projeto com o seguinte conteúdo:

```env
# Configurações do Supabase
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Configurações do Resend (Email) - Opcional
VITE_RESEND_API_KEY=your_resend_api_key_here

# Configurações do PIX - Opcional
VITE_PIX_MERCHANT_ID=your_pix_merchant_id_here
VITE_PIX_MERCHANT_NAME=your_merchant_name_here
```

### 2. Configurar Supabase

1. **Acesse [supabase.com](https://supabase.com)**
2. **Crie uma conta ou faça login**
3. **Crie um novo projeto**
4. **Vá em Settings > API**
5. **Copie:**
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

### 3. Configurar Banco de Dados

Execute o script SQL em `sql/supabase-setup.sql` no SQL Editor do Supabase:

```sql
-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_pedidos INTEGER DEFAULT 0,
    total_gasto DECIMAL(10,2) DEFAULT 0.00,
    primeiro_pedido BOOLEAN DEFAULT true
);

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, phone)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'phone'
    );
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Políticas RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seu próprio perfil
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

-- Política para usuários atualizarem apenas seu próprio perfil
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);
```

### 4. Testar o Sistema

Após configurar:

1. **Reinicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

2. **Teste o cadastro:**
   - Clique no botão "Entrar" ou "Criar conta"
   - Preencha o formulário de cadastro
   - Verifique se o usuário é criado no Supabase

## 🔍 Verificação de Status

Para verificar se o Supabase está configurado corretamente, você pode:

1. **Verificar no console do navegador** se há mensagens de erro
2. **Verificar na aba Network** se as requisições para Supabase estão sendo feitas
3. **Verificar no dashboard do Supabase** se os usuários estão sendo criados

## 🚨 Troubleshooting

### Erro: "Supabase não configurado"
- Verifique se o arquivo `.env` existe
- Verifique se as variáveis estão corretas
- Reinicie o servidor após criar o `.env`

### Erro: "Invalid API key"
- Verifique se a chave anon está correta
- Verifique se a URL do projeto está correta

### Erro: "Table doesn't exist"
- Execute o script SQL no Supabase
- Verifique se as tabelas foram criadas

## 📝 Nota Importante

### ✅ Sistema Funcionando Agora!
O sistema agora funciona em **modo offline** (usando localStorage) quando o Supabase não está configurado. Você pode:

- ✅ **Cadastrar usuários** (dados salvos no localStorage)
- ✅ **Fazer login** (autenticação local)
- ✅ **Atualizar perfil** (dados persistidos localmente)
- ✅ **Fazer logout** (limpa dados locais)

### 🚀 Para Funcionalidade Completa
Para funcionalidade completa (sincronização entre dispositivos, backup na nuvem), configure o Supabase seguindo as instruções acima.

### 🔍 Como Testar
1. **Acesse o site** (http://localhost:5173)
2. **Clique em "Entrar" ou "Criar conta"**
3. **Teste o cadastro** - deve funcionar normalmente
4. **Teste o login** - deve funcionar normalmente
5. **Verifique o status** - use o componente `AuthStatus` para ver o modo atual
