-- Solução temporária: Desabilitar trigger e permitir signup manual
-- 1. Desabilitar o trigger temporariamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Verificar se a tabela profiles tem a estrutura correta
DO $$
BEGIN
  -- Garantir que a tabela profiles existe com a estrutura correta
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
    CREATE TABLE profiles (
      id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
    
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    
    -- Criar políticas RLS
    CREATE POLICY "profiles_select_policy" ON profiles 
      FOR SELECT USING (auth.uid() = id);
    
    CREATE POLICY "profiles_insert_policy" ON profiles 
      FOR INSERT WITH CHECK (auth.uid() = id);
    
    CREATE POLICY "profiles_update_policy" ON profiles 
      FOR UPDATE USING (auth.uid() = id);
      
    RAISE NOTICE 'Tabela profiles criada com sucesso';
  END IF;
  
  -- Adicionar coluna phone se não existir
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone TEXT;
    RAISE NOTICE 'Coluna phone adicionada';
  END IF;
  
END $$;

-- 3. Criar perfis para usuários existentes
INSERT INTO profiles (id, email, name, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', 'Usuário'),
  au.created_at,
  au.updated_at
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- 4. Recriar a função handle_new_user de forma mais simples
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserir perfil apenas se não existir
  INSERT INTO public.profiles (id, email, name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Recriar o trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 6. Verificar se tudo está funcionando
SELECT 
  'Tabela profiles' as item,
  EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') as status
UNION ALL
SELECT 
  'Função handle_new_user' as item,
  EXISTS (SELECT FROM information_schema.routines WHERE routine_name = 'handle_new_user') as status
UNION ALL
SELECT 
  'Trigger on_auth_user_created' as item,
  EXISTS (SELECT FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created') as status
UNION ALL
SELECT 
  'RLS habilitado' as item,
  EXISTS (SELECT FROM pg_tables WHERE tablename = 'profiles' AND rowsecurity = true) as status;
