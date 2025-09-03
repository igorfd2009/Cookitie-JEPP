-- =====================================================
-- CONFIGURAÇÃO COMPLETA DO BANCO SUPABASE
-- Cookitie JEPP - Sistema de Autenticação e Pedidos
-- =====================================================

-- ✅ CORREÇÃO: Criar tabela profiles com constraint único
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ✅ CORREÇÃO: Criar índice único para email
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_unique ON profiles(email);

-- ✅ CORREÇÃO: Criar tabela orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_method TEXT NOT NULL,
  pickup_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ✅ CORREÇÃO: Criar índices para performance
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at);

-- ✅ CORREÇÃO: Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- ✅ CORREÇÃO: Políticas de segurança para profiles
CREATE POLICY "Usuários podem ver seus perfis" ON profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seus perfis" ON profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus perfis" ON profiles 
  FOR UPDATE USING (auth.uid() = id);

-- ✅ CORREÇÃO: Políticas de segurança para orders
CREATE POLICY "Usuários podem ver seus pedidos" ON orders 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar pedidos" ON orders 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus pedidos" ON orders 
  FOR UPDATE USING (auth.uid() = user_id);

-- ✅ CORREÇÃO: Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ✅ CORREÇÃO: Triggers para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ✅ CORREÇÃO: Função para sincronizar dados do auth.users com profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ✅ CORREÇÃO: Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ✅ CORREÇÃO: Função para obter estatísticas dos pedidos
CREATE OR REPLACE FUNCTION get_user_order_stats(user_uuid UUID)
RETURNS TABLE(
  total_orders BIGINT,
  total_spent DECIMAL(10,2),
  first_order_date TIMESTAMP WITH TIME ZONE,
  last_order_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_orders,
    COALESCE(SUM(total), 0) as total_spent,
    MIN(created_at) as first_order_date,
    MAX(created_at) as last_order_date
  FROM orders 
  WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ✅ CORREÇÃO: Função para buscar pedidos com paginação
CREATE OR REPLACE FUNCTION get_user_orders_paginated(
  user_uuid UUID,
  page_size INTEGER DEFAULT 10,
  page_number INTEGER DEFAULT 1
)
RETURNS TABLE(
  id UUID,
  items JSONB,
  total DECIMAL(10,2),
  status TEXT,
  payment_method TEXT,
  pickup_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.items,
    o.total,
    o.status,
    o.payment_method,
    o.pickup_code,
    o.created_at,
    o.updated_at
  FROM orders o
  WHERE o.user_id = user_uuid
  ORDER BY o.created_at DESC
  LIMIT page_size
  OFFSET (page_number - 1) * page_size;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ✅ CORREÇÃO: Comentários nas tabelas
COMMENT ON TABLE profiles IS 'Perfis dos usuários do sistema';
COMMENT ON TABLE orders IS 'Pedidos dos usuários';
COMMENT ON COLUMN profiles.email IS 'Email único do usuário';
COMMENT ON COLUMN profiles.name IS 'Nome completo do usuário';
COMMENT ON COLUMN orders.status IS 'Status do pedido: pending, confirmed, completed, cancelled';
COMMENT ON COLUMN orders.items IS 'Itens do pedido em formato JSONB';

-- ✅ CORREÇÃO: Verificar se as tabelas foram criadas
DO $$
BEGIN
  RAISE NOTICE 'Verificando criação das tabelas...';
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
    RAISE NOTICE '✅ Tabela profiles criada com sucesso';
  ELSE
    RAISE NOTICE '❌ Erro: Tabela profiles não foi criada';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'orders') THEN
    RAISE NOTICE '✅ Tabela orders criada com sucesso';
  ELSE
    RAISE NOTICE '❌ Erro: Tabela orders não foi criada';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
    RAISE NOTICE '✅ RLS habilitado para profiles';
  ELSE
    RAISE NOTICE '❌ Erro: RLS não foi habilitado para profiles';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'orders' AND table_schema = 'public') THEN
    RAISE NOTICE '✅ RLS habilitado para orders';
  ELSE
    RAISE NOTICE '❌ Erro: RLS não foi habilitado para orders';
  END IF;
END $$;

-- ✅ CORREÇÃO: Mensagem de conclusão
SELECT '🎉 Configuração do banco Supabase concluída com sucesso!' as status;
