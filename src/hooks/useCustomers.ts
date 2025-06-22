
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
};

export const useCustomersStats = () => {
  return useQuery({
    queryKey: ['customers-stats'],
    queryFn: async () => {
      const { count: totalCustomers, error } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;

      return {
        totalCustomers: totalCustomers || 0
      };
    }
  });
};
