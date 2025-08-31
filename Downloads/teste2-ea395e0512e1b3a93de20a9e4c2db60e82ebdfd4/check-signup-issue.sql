-- Verificar se o trigger foi realmente removido
SELECT 'Trigger on_auth_user_created existe?' as pergunta,
       CASE 
         WHEN EXISTS (SELECT FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created') 
         THEN 'SIM - PROBLEMA!' 
         ELSE 'NÃO - OK' 
       END as resposta;

-- Verificar se a função foi removida
SELECT 'Função handle_new_user existe?' as pergunta,
       CASE 
         WHEN EXISTS (SELECT FROM information_schema.routines WHERE routine_name = 'handle_new_user') 
         THEN 'SIM - PROBLEMA!' 
         ELSE 'NÃO - OK' 
       END as resposta;

-- Verificar estrutura da tabela profiles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar políticas RLS
SELECT policyname, permissive, cmd
FROM pg_policies 
WHERE tablename = 'profiles';

-- Verificar se há usuários sem perfil
SELECT 'Usuários sem perfil:' as pergunta,
       COUNT(*)::text as resposta
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.id = au.id
);
