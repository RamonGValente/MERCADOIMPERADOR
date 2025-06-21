
import React, { useState } from 'react';
import { ProductSection } from './ProductSection';
import { CartSection } from './CartSection';
import { PaymentModal } from './PaymentModal';
import { useCart } from '@/hooks/useCart';
import { useCreateOrder } from '@/hooks/useCreateOrder';
import type { Database } from '@/integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];

interface PDVMainProps {
  currentCashSession: any;
}

export const PDVMain = ({ currentCashSession }: PDVMainProps) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { cart, addToCart, updateCartQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  
  const { createOrderMutation } = useCreateOrder({
    currentCashSession,
    onSuccess: () => {
      clearCart();
      setShowPaymentModal(false);
    }
  });

  const handlePayment = (paymentData: any) => {
    createOrderMutation.mutate({
      subtotal: cartTotal,
      total: cartTotal,
      paymentMethod: paymentData.method,
      receivedAmount: paymentData.receivedAmount,
      changeAmount: paymentData.changeAmount,
      cart
    });
  };

  return (
    <>
      <div className="flex h-[calc(100vh-120px)]">
        <ProductSection onAddToCart={addToCart} />
        <CartSection
          cart={cart}
          cartTotal={cartTotal}
          onUpdateQuantity={updateCartQuantity}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
          onShowPayment={() => setShowPaymentModal(true)}
        />
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        total={cartTotal}
        onConfirmPayment={handlePayment}
        isProcessing={createOrderMutation.isPending}
      />
    </>
  );
};
