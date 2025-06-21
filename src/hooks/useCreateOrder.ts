
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import type { CartItem } from '@/types/cart';

interface CreateOrderData {
  subtotal: number;
  total: number;
  paymentMethod: string;
  receivedAmount: number;
  changeAmount: number;
  cart: CartItem[];
}

interface UseCreateOrderProps {
  currentCashSession: any;
  onSuccess: () => void;
}

export const useCreateOrder = ({ currentCashSession, onSuccess }: UseCreateOrderProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: CreateOrderData) => {
      // First, generate an order number
      const { data: orderNumber, error: orderNumberError } = await supabase
        .rpc('generate_order_number');

      if (orderNumberError) throw orderNumberError;

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          type: 'dine_in',
          subtotal: orderData.subtotal,
          total: orderData.total,
          payment_method: orderData.paymentMethod,
          payment_status: 'paid',
          status: 'completed',
          cash_session_id: currentCashSession?.id,
          received_amount: orderData.receivedAmount,
          change_amount: orderData.changeAmount,
          user_id: user?.id
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      const orderItems = orderData.cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.total
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order;
    },
    onSuccess: () => {
      toast({
        title: "Venda realizada com sucesso!",
        description: "O pedido foi processado e salvo no sistema.",
      });
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['activeCashSession'] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao processar venda",
        description: "Ocorreu um erro ao salvar o pedido. Tente novamente.",
        variant: "destructive"
      });
      console.error('Error creating order:', error);
    }
  });

  return { createOrderMutation };
};
