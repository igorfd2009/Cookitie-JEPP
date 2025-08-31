-- Diagnóstico simples do erro de signup
SELECT 
  '1. Tabela profiles existe' as check_item,
  EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') as status
UNION ALL
SELECT 
  '2. Função handle_new_user existe' as check_item,
  EXISTS (SELECT FROM information_schema.routines WHERE routine_name = 'handle_new_user') as status
UNION ALL
SELECT 
  '3. Trigger on_auth_user_created existe' as check_item,
  EXISTS (SELECT FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created') as status
UNION ALL
SELECT 
  '4. RLS habilitado na tabela profiles' as check_item,
  EXISTS (SELECT FROM pg_tables WHERE tablename = 'profiles' AND rowsecurity = true) as status
UNION ALL
SELECT 
  '5. Número de políticas RLS' as check_item,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'profiles')::text as status
UNION ALL
SELECT 
  '6. Usuários existentes' as check_item,
  (SELECT COUNT(*) FROM auth.users)::text as status
UNION ALL
SELECT 
  '7. Perfis existentes' as check_item,
  (SELECT COUNT(*) FROM profiles)::text as status;

-- Verificar estrutura da tabela profiles
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar políticas RLS
SELECT 
  policyname,
  permissive,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'profiles';
