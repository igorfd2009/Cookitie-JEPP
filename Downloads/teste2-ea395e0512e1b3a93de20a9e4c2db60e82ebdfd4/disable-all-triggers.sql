-- Desabilitar TODOS os triggers relacionados ao auth
-- 1. Listar todos os triggers existentes
SELECT 'Triggers existentes:' as info,
       trigger_name, event_manipulation, action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
AND event_object_schema = 'auth';

-- 2. Remover TODOS os triggers do auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;

-- 3. Remover TODAS as funções relacionadas
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS handle_user_update();
DROP FUNCTION IF EXISTS handle_user_delete();

-- 4. Verificar se ainda há triggers
SELECT 'Triggers restantes:' as info,
       trigger_name, event_manipulation, action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
AND event_object_schema = 'auth';

-- 5. Verificar se a tabela profiles está OK
SELECT 'Tabela profiles status:' as info,
       EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') as existe,
       (SELECT COUNT(*) FROM profiles) as total_perfis,
       (SELECT COUNT(*) FROM auth.users) as total_usuarios;
