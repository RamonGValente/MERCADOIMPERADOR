
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
      console.log('Creating order with data:', orderData);
      console.log('Current cash session:', currentCashSession);
      console.log('Current user:', user);

      // First, generate an order number
      const { data: orderNumber, error: orderNumberError } = await supabase
        .rpc('generate_order_number');

      if (orderNumberError) {
        console.error('Error generating order number:', orderNumberError);
        throw orderNumberError;
      }

      console.log('Generated order number:', orderNumber);

      const orderToInsert = {
        order_number: orderNumber,
        type: 'dine_in',
        subtotal: orderData.subtotal,
        total: orderData.total,
        payment_method: orderData.paymentMethod,
        payment_status: 'paid',
        status: 'pending', // Changed from 'completed' to 'pending'
        cash_session_id: currentCashSession?.id,
        received_amount: orderData.receivedAmount,
        change_amount: orderData.changeAmount,
        user_id: user?.id
      };

      console.log('Order to insert:', orderToInsert);

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderToInsert)
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        throw orderError;
      }

      console.log('Created order:', order);

      // Insert order items
      const orderItems = orderData.cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.total
      }));

      console.log('Order items to insert:', orderItems);

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        throw itemsError;
      }

      console.log('Order created successfully');
      return order;
    },
    onSuccess: () => {
      console.log('Order creation completed successfully');
      toast({
        title: "Venda realizada com sucesso!",
        description: "O pedido foi processado e salvo no sistema.",
      });
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['activeCashSession'] });
    },
    onError: (error) => {
      console.error('Error in order creation mutation:', error);
      toast({
        title: "Erro ao processar venda",
        description: "Ocorreu um erro ao salvar o pedido. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  return { createOrderMutation };
};
