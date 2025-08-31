-- SOLUÇÃO DEFINITIVA: Remover trigger e recriar tudo do zero
-- 1. Remover trigger e função completamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- 2. Dropar e recriar a tabela profiles
DROP TABLE IF EXISTS profiles CASCADE;

-- 3. Criar tabela profiles do zero
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 4. Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas RLS
CREATE POLICY "profiles_select_policy" ON profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_policy" ON profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON profiles 
  FOR UPDATE USING (auth.uid() = id);

-- 6. Criar perfis para usuários existentes
INSERT INTO profiles (id, email, name, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', 'Usuário'),
  au.created_at,
  au.updated_at
FROM auth.users au
ON CONFLICT (id) DO NOTHING;

-- 7. Verificar se tudo está funcionando
SELECT 
  'Trigger removido' as item,
  NOT EXISTS (SELECT FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created') as status
UNION ALL
SELECT 
  'Tabela profiles criada' as item,
  EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') as status
UNION ALL
SELECT 
  'RLS habilitado' as item,
  EXISTS (SELECT FROM pg_tables WHERE tablename = 'profiles' AND rowsecurity = true) as status
UNION ALL
SELECT 
  'Políticas RLS' as item,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'profiles') > 0 as status
UNION ALL
SELECT 
  'Perfis criados' as item,
  (SELECT COUNT(*) FROM profiles) > 0 as status;
