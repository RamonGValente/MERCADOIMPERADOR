
-- Criação das tabelas principais do sistema Mercado Imperador

-- Tabela de configurações da empresa
CREATE TABLE public.company_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Mercado Imperador',
  logo_url TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  delivery_base_fee DECIMAL(10,2) DEFAULT 0.00,
  delivery_per_km DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de usuários do sistema (funcionários)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'cashier', 'waiter', 'delivery', 'kitchen')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de clientes
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  neighborhood TEXT,
  city TEXT,
  zip_code TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de fornecedores
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  cnpj TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de categorias de produtos
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de produtos
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  cost_price DECIMAL(10,2),
  barcode TEXT,
  image_url TEXT,
  category_id UUID REFERENCES public.categories(id),
  unit_type TEXT NOT NULL CHECK (unit_type IN ('unit', 'weight')),
  stock_quantity DECIMAL(10,3) DEFAULT 0,
  min_stock DECIMAL(10,3) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de opcionais/adicionais dos produtos
CREATE TABLE public.product_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de insumos/ingredientes
CREATE TABLE public.ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  unit TEXT NOT NULL,
  cost_per_unit DECIMAL(10,4),
  current_stock DECIMAL(10,3) DEFAULT 0,
  min_stock DECIMAL(10,3) DEFAULT 0,
  supplier_id UUID REFERENCES public.suppliers(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de fichas técnicas (receitas)
CREATE TABLE public.product_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES public.ingredients(id) ON DELETE CASCADE,
  quantity DECIMAL(10,4) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de combos promocionais
CREATE TABLE public.promotional_combos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de produtos do combo
CREATE TABLE public.combo_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combo_id UUID REFERENCES public.promotional_combos(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de movimentação de estoque
CREATE TABLE public.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id),
  ingredient_id UUID REFERENCES public.ingredients(id),
  type TEXT NOT NULL CHECK (type IN ('entry', 'exit', 'adjustment')),
  quantity DECIMAL(10,3) NOT NULL,
  unit_cost DECIMAL(10,4),
  total_cost DECIMAL(10,2),
  reason TEXT,
  user_id UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de mesas
CREATE TABLE public.tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number INTEGER NOT NULL UNIQUE,
  capacity INTEGER DEFAULT 4,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved', 'maintenance')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de pedidos
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.customers(id),
  table_id UUID REFERENCES public.tables(id),
  type TEXT NOT NULL CHECK (type IN ('dine_in', 'takeout', 'delivery')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'delivered', 'cancelled')),
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'cancelled')),
  notes TEXT,
  delivery_address TEXT,
  delivery_distance DECIMAL(5,2),
  user_id UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de itens do pedido
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  combo_id UUID REFERENCES public.promotional_combos(id),
  quantity DECIMAL(10,3) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'served')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de opcionais do item do pedido
CREATE TABLE public.order_item_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID REFERENCES public.order_items(id) ON DELETE CASCADE,
  option_id UUID REFERENCES public.product_options(id),
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de caixa
CREATE TABLE public.cash_registers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  opening_amount DECIMAL(10,2) NOT NULL,
  closing_amount DECIMAL(10,2),
  total_sales DECIMAL(10,2) DEFAULT 0,
  opened_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  closed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed'))
);

-- Tabela de movimentações financeiras
CREATE TABLE public.financial_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  payment_method TEXT,
  order_id UUID REFERENCES public.orders(id),
  user_id UUID REFERENCES public.users(id),
  due_date DATE,
  paid_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotional_combos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.combo_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_item_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_registers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_movements ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas (permitir acesso a usuários autenticados)
CREATE POLICY "Allow authenticated users" ON public.company_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON public.users FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON public.customers FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON public.suppliers FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON public.categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON public.products FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON public.product_options FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON public.ingredients FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON public.product_recipes FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON public.promotional_combos FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON public.combo_products FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON public.stock_movements FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON public.tables FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON public.orders FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON public.order_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON public.order_item_options FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON public.cash_registers FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON public.financial_movements FOR ALL TO authenticated USING (true);

-- Inserir dados iniciais
INSERT INTO public.company_settings (name, address, phone) VALUES 
('Mercado Imperador', 'Rua Principal, 123 - Centro', '(11) 99999-9999');

INSERT INTO public.categories (name, description) VALUES 
('Bebidas', 'Bebidas diversas'),
('Lanches', 'Lanches e sanduíches'),
('Refeições', 'Pratos principais'),
('Sobremesas', 'Doces e sobremesas');

INSERT INTO public.tables (number, capacity) VALUES 
(1, 4), (2, 4), (3, 2), (4, 6), (5, 4);
