-- Limpar sessões antigas e verificar configuração
-- 1. Verificar se há sessões antigas
SELECT 
  'Sessões ativas' as check_item,
  COUNT(*)::text as status
FROM auth.sessions 
WHERE expires_at > NOW();

-- 2. Limpar sessões expiradas
DELETE FROM auth.sessions 
WHERE expires_at <= NOW();

-- 3. Verificar configuração de JWT
SELECT 
  'JWT Secret configurado' as check_item,
  CASE 
    WHEN EXISTS (SELECT 1 FROM auth.config WHERE key = 'jwt_secret') THEN 'true'
    ELSE 'false'
  END as status;

-- 4. Verificar se a tabela profiles existe
SELECT 
  'Tabela profiles existe' as check_item,
  EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') as status;

-- 5. Verificar trigger
SELECT 
  'Trigger on_auth_user_created existe' as check_item,
  EXISTS (SELECT FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created') as status;

-- 6. Verificar usuários
SELECT 
  'Usuários existentes' as check_item,
  COUNT(*)::text as status
FROM auth.users;
