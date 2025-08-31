# 🔧 Guia de Configuração do Supabase

## ❌ Problema Atual
O sistema está funcionando em **modo offline** porque o Supabase não está configurado. Isso significa que:
- ✅ Login e cadastro funcionam (dados salvos no localStorage)
- ❌ Dados não sincronizam entre dispositivos
- ❌ Não há backup na nuvem

## ✅ Solução Temporária (Modo Offline)
O sistema já está funcionando em modo offline! Você pode:
- ✅ Cadastrar usuários
- ✅ Fazer login
- ✅ Atualizar perfil
- ✅ Fazer pedidos

## 🚀 Configuração Completa do Supabase

### 1. Criar Conta no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com GitHub ou crie uma conta

### 2. Criar Novo Projeto
1. Clique em "New Project"
2. Escolha sua organização
3. Digite um nome para o projeto (ex: "cookite-app")
4. Escolha uma senha forte para o banco de dados
5. Escolha uma região (recomendo São Paulo)
6. Clique em "Create new project"

### 3. Obter Credenciais
1. Aguarde o projeto ser criado (2-3 minutos)
2. Vá em **Settings** → **API**
3. Copie as seguintes informações:
   - **Project URL** (ex: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (ex: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 4. Configurar Variáveis de Ambiente

#### Opção A: Criar arquivo `.env.local`
1. Na raiz do projeto, crie um arquivo chamado `.env.local`
2. Adicione o seguinte conteúdo:

```env
# Configurações do Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui

# Configurações do Resend (Email) - Opcional
VITE_RESEND_API_KEY=sua-chave-resend-aqui

# Configurações do PIX - Opcional
VITE_PIX_MERCHANT_ID=seu-merchant-id-aqui
VITE_PIX_MERCHANT_NAME=seu-nome-aqui
```

#### Opção B: Usar arquivo `env.example`
1. Copie o arquivo `env.example` para `.env.local`
2. Substitua os valores pelos seus dados reais

### 5. Configurar Banco de Dados
1. No Supabase, vá em **SQL Editor**
2. Clique em **New query**
3. Cole o seguinte SQL:

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

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, phone)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'name',
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
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seu próprio perfil
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Política para usuários atualizarem apenas seu próprio perfil
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);
```

4. Clique em **Run** para executar o SQL

### 6. Testar a Configuração
1. Reinicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Abra o console do navegador (F12)
3. Tente fazer login/cadastro
4. Verifique se não há erros no console
5. Verifique no Supabase se os usuários estão sendo criados

## 🔍 Verificação de Status

### Console do Navegador
- ✅ "Supabase configurado corretamente"
- ❌ "Supabase não configurado. Usando modo offline"

### Supabase Dashboard
- Vá em **Authentication** → **Users**
- Deve mostrar os usuários cadastrados

### Network Tab
- Deve mostrar requisições para `supabase.co`

## 🚨 Troubleshooting

### Erro: "Invalid API key"
- Verifique se a chave anon está correta
- Verifique se a URL do projeto está correta
- Reinicie o servidor após criar o `.env.local`

### Erro: "Table doesn't exist"
- Execute o script SQL no Supabase
- Verifique se as tabelas foram criadas em **Table Editor**

### Erro: "RLS policy"
- Verifique se as políticas RLS foram criadas
- Execute novamente o script SQL

## 📝 Notas Importantes

### Segurança
- ✅ O arquivo `.env.local` está no `.gitignore`
- ✅ Nunca commite suas chaves no Git
- ✅ Use sempre a chave `anon` (não a `service_role`)

### Funcionalidades
- ✅ Autenticação completa
- ✅ Sincronização entre dispositivos
- ✅ Backup na nuvem
- ✅ Perfis de usuário

### Modo Offline vs Online
- **Offline**: Dados salvos no localStorage
- **Online**: Dados sincronizados com Supabase
- O sistema detecta automaticamente qual modo usar

## 🎉 Próximos Passos

Após configurar o Supabase:
1. Teste o cadastro de novos usuários
2. Teste o login com usuários existentes
3. Verifique se os dados aparecem no Supabase
4. Teste a sincronização entre abas/dispositivos

Se precisar de ajuda, verifique os logs no console do navegador!


