
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
};

export const useOrdersStats = () => {
  return useQuery({
    queryKey: ['orders-stats'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString();

      // Total de pedidos hoje
      const { data: todayOrders, error: todayError } = await supabase
        .from('orders')
        .select('id, total')
        .gte('created_at', todayStr);

      if (todayError) throw todayError;

      // Total de pedidos
      const { count: totalOrders, error: totalError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      if (totalError) throw totalError;

      // Vendas hoje
      const todaySales = todayOrders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

      return {
        totalOrders: totalOrders || 0,
        todayOrdersCount: todayOrders?.length || 0,
        todaySales
      };
    }
  });
};
