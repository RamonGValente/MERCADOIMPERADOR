
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProductsStats = () => {
  return useQuery({
    queryKey: ['products-stats'],
    queryFn: async () => {
      // Total de produtos ativos
      const { count: activeProducts, error: activeError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (activeError) throw activeError;

      // Produtos com estoque baixo
      const { data: lowStockProducts, error: lowStockError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .lt('stock_quantity', 10);

      if (lowStockError) throw lowStockError;

      // Total de categorias
      const { count: totalCategories, error: categoriesError } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });

      if (categoriesError) throw categoriesError;

      return {
        activeProducts: activeProducts || 0,
        lowStockCount: lowStockProducts?.length || 0,
        totalCategories: totalCategories || 0
      };
    }
  });
};
