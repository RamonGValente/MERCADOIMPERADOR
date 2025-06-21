
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCashSession = (userId?: string) => {
  const [currentCashSession, setCurrentCashSession] = useState<any>(null);

  // Query for active cash session
  const { data: activeCashSession } = useQuery({
    queryKey: ['activeCashSession'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cash_sessions')
        .select('*')
        .eq('status', 'open')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });

  useEffect(() => {
    setCurrentCashSession(activeCashSession);
  }, [activeCashSession]);

  return { currentCashSession, setCurrentCashSession };
};
