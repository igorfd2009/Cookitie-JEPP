-- Verificar e corrigir a tabela profiles
DO $$
BEGIN
  -- Verificar se a tabela profiles existe
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
    RAISE EXCEPTION 'Tabela profiles não existe!';
  END IF;

  -- Verificar se a coluna phone existe, se não, adicionar
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone TEXT;
    RAISE NOTICE 'Coluna phone adicionada à tabela profiles';
  END IF;

  -- Verificar se há usuários sem perfil
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

  RAISE NOTICE 'Perfis criados para usuários existentes';

  -- Verificar estrutura da tabela
  RAISE NOTICE 'Estrutura da tabela profiles:';
  RAISE NOTICE 'Colunas: %', (
    SELECT string_agg(column_name || ' ' || data_type, ', ')
    FROM information_schema.columns 
    WHERE table_name = 'profiles'
  );

END $$;
