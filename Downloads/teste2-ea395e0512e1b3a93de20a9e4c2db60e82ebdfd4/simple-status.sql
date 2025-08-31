-- Status simples sem UNION
-- 1. Verificar trigger
SELECT 'Trigger on_auth_user_created existe?' as pergunta,
       CASE 
         WHEN EXISTS (SELECT FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created') 
         THEN 'SIM' 
         ELSE 'NÃO' 
       END as resposta;

-- 2. Verificar tabela profiles
SELECT 'Tabela profiles existe?' as pergunta,
       CASE 
         WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') 
         THEN 'SIM' 
         ELSE 'NÃO' 
       END as resposta;

-- 3. Contar usuários
SELECT 'Número de usuários:' as pergunta,
       COUNT(*)::text as resposta
FROM auth.users;
