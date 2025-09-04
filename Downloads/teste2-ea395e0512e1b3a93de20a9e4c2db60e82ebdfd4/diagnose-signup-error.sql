-- Diagnóstico completo do erro de signup
DO $$
DECLARE
  table_exists BOOLEAN;
  function_exists BOOLEAN;
  trigger_exists BOOLEAN;
  rls_enabled BOOLEAN;
  policies_count INTEGER;
BEGIN
  -- 1. Verificar se a tabela profiles existe
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
  ) INTO table_exists;
  
  RAISE NOTICE '1. Tabela profiles existe: %', table_exists;
  
  -- 2. Verificar estrutura da tabela
  IF table_exists THEN
    RAISE NOTICE '2. Estrutura da tabela profiles:';
    RAISE NOTICE '   Colunas: %', (
      SELECT string_agg(column_name || ' ' || data_type, ', ')
      FROM information_schema.columns 
      WHERE table_name = 'profiles' AND table_schema = 'public'
    );
  END IF;
  
  -- 3. Verificar se a função handle_new_user existe
  SELECT EXISTS (
    SELECT FROM information_schema.routines 
    WHERE routine_name = 'handle_new_user' 
    AND routine_schema = 'public'
  ) INTO function_exists;
  
  RAISE NOTICE '3. Função handle_new_user existe: %', function_exists;
  
  -- 4. Verificar se o trigger existe
  SELECT EXISTS (
    SELECT FROM information_schema.triggers 
    WHERE trigger_name = 'on_auth_user_created'
  ) INTO trigger_exists;
  
  RAISE NOTICE '4. Trigger on_auth_user_created existe: %', trigger_exists;
  
  -- 5. Verificar se RLS está habilitado
  SELECT EXISTS (
    SELECT FROM pg_tables 
    WHERE tablename = 'profiles' 
    AND rowsecurity = true
  ) INTO rls_enabled;
  
  RAISE NOTICE '5. RLS habilitado na tabela profiles: %', rls_enabled;
  
  -- 6. Contar políticas RLS
  SELECT COUNT(*) INTO policies_count
  FROM pg_policies 
  WHERE tablename = 'profiles';
  
  RAISE NOTICE '6. Número de políticas RLS: %', policies_count;
  
  -- 7. Listar políticas existentes
  RAISE NOTICE '7. Políticas existentes:';
  FOR policy_rec IN 
    SELECT policyname, permissive, roles, cmd, qual 
    FROM pg_policies 
    WHERE tablename = 'profiles'
  LOOP
    RAISE NOTICE '   - %: % % %', policy_rec.policyname, policy_rec.permissive, policy_rec.cmd, policy_rec.qual;
  END LOOP;
  
  -- 8. Verificar se há usuários existentes
  RAISE NOTICE '8. Usuários existentes: %', (SELECT COUNT(*) FROM auth.users);
  
  -- 9. Verificar se há perfis existentes
  IF table_exists THEN
    RAISE NOTICE '9. Perfis existentes: %', (SELECT COUNT(*) FROM profiles);
  END IF;
  
END $$;
