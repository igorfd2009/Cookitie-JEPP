-- =====================================================
-- CONFIGURAÇÃO COOKITIE SUPABASE - VERSÃO CORRIGIDA
-- Execute este SQL no painel do Supabase
-- =====================================================

-- Remover tabelas existentes se houver problemas
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ✅ CRIAR TABELA PROFILES
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ✅ CRIAR TABELA ORDERS 
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'preparing', 'ready', 'completed', 'cancelled')) NOT NULL,
  payment_method TEXT NOT NULL,
  pix_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ✅ CRIAR ÍNDICES PARA PERFORMANCE
CREATE INDEX orders_user_id_idx ON orders(user_id);
CREATE INDEX orders_status_idx ON orders(status);
CREATE INDEX orders_created_at_idx ON orders(created_at DESC);

-- ✅ HABILITAR RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- ✅ POLÍTICAS RLS PARA PROFILES
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;

CREATE POLICY "profiles_select_policy" ON profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_policy" ON profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON profiles 
  FOR UPDATE USING (auth.uid() = id);

-- ✅ POLÍTICAS RLS PARA ORDERS
DROP POLICY IF EXISTS "orders_select_policy" ON orders;
DROP POLICY IF EXISTS "orders_insert_policy" ON orders;
DROP POLICY IF EXISTS "orders_update_policy" ON orders;

CREATE POLICY "orders_select_policy" ON orders 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "orders_insert_policy" ON orders 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders_update_policy" ON orders 
  FOR UPDATE USING (auth.uid() = user_id);

-- ✅ FUNÇÃO PARA ATUALIZAR UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ✅ TRIGGERS PARA AUTO-UPDATE
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;

CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ✅ FUNÇÃO PARA CRIAR PERFIL AUTOMÁTICO
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    NOW(),
    NOW()
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Se der erro, não impede a criação do usuário
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ✅ TRIGGER PARA CRIAR PERFIL AUTOMÁTICO
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ✅ VERIFICAR SE TUDO FOI CRIADO
DO $$
DECLARE
  profiles_exists BOOLEAN;
  orders_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
  ) INTO profiles_exists;
  
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'orders'
  ) INTO orders_exists;
  
  IF profiles_exists THEN
    RAISE NOTICE '✅ Tabela profiles criada com sucesso';
  ELSE
    RAISE NOTICE '❌ ERRO: Tabela profiles não foi criada';
  END IF;
  
  IF orders_exists THEN
    RAISE NOTICE '✅ Tabela orders criada com sucesso';
  ELSE
    RAISE NOTICE '❌ ERRO: Tabela orders não foi criada';
  END IF;
  
  IF profiles_exists AND orders_exists THEN
    RAISE NOTICE '🎉 CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!';
    RAISE NOTICE 'Agora você pode usar o sistema Cookitie normalmente.';
  ELSE
    RAISE NOTICE '❌ CONFIGURAÇÃO FALHOU! Verifique os erros acima.';
  END IF;
END $$;

-- ✅ TESTE RÁPIDO (OPCIONAL)
-- INSERT INTO profiles (id, email, name) VALUES (gen_random_uuid(), 'teste@cookitie.com', 'Teste');
-- SELECT 'Teste realizado com sucesso!' as resultado;
-- DELETE FROM profiles WHERE email = 'teste@cookitie.com';