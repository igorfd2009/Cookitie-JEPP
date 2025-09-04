-- Verificação rápida do estado atual
SELECT 
  'Trigger existe?' as check_item,
  EXISTS (SELECT FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created')::text as status
UNION ALL
SELECT 
  'Tabela profiles existe?' as check_item,
  EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles')::text as status
UNION ALL
SELECT 
  'Usuários existentes' as check_item,
  COUNT(*)::text as status
FROM auth.users;
