
-- Criar tabela para sessões de caixa (cash sessions)
CREATE TABLE IF NOT EXISTS public.cash_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE,
  opening_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  closing_amount DECIMAL(10,2),
  total_sales DECIMAL(10,2) DEFAULT 0,
  total_cash_sales DECIMAL(10,2) DEFAULT 0,
  total_card_sales DECIMAL(10,2) DEFAULT 0,
  total_pix_sales DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_cash_sessions_user_id ON public.cash_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_cash_sessions_status ON public.cash_sessions(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- Atualizar tabela de pedidos para incluir informações do PDV
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS cash_session_id UUID REFERENCES public.cash_sessions(id),
ADD COLUMN IF NOT EXISTS change_amount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS received_amount DECIMAL(10,2);

-- Criar função para gerar números de pedido únicos
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  counter INTEGER;
BEGIN
  -- Gerar número baseado na data + contador
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM '[0-9]+$') AS INTEGER)), 0) + 1
  INTO counter
  FROM orders 
  WHERE order_number LIKE TO_CHAR(NOW(), 'YYYYMMDD') || '%';
  
  new_number := TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(counter::TEXT, 4, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar número do pedido automaticamente
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_order_number ON public.orders;
CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.cash_sessions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para cash_sessions (permitir acesso a todos usuários autenticados)
CREATE POLICY "Users can view cash sessions" ON public.cash_sessions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create cash sessions" ON public.cash_sessions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update cash sessions" ON public.cash_sessions
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Políticas RLS mais permissivas para o PDV (permitir acesso a todos usuários autenticados)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.products;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.products;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.products;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.products;

CREATE POLICY "Enable all access for authenticated users" ON public.products
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Políticas para categories
DROP POLICY IF EXISTS "Enable read access for all users" ON public.categories;
CREATE POLICY "Enable all access for authenticated users" ON public.categories
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Políticas para orders
DROP POLICY IF EXISTS "Enable read access for all users" ON public.orders;
CREATE POLICY "Enable all access for authenticated users" ON public.orders
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Políticas para order_items
DROP POLICY IF EXISTS "Enable read access for all users" ON public.order_items;
CREATE POLICY "Enable all access for authenticated users" ON public.order_items
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Políticas para customers
DROP POLICY IF EXISTS "Enable read access for all users" ON public.customers;
CREATE POLICY "Enable all access for authenticated users" ON public.customers
  FOR ALL USING (auth.uid() IS NOT NULL);
