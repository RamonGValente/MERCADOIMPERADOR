
import React from 'react';
import { Separator } from '@/components/ui/separator';

interface CartSummaryProps {
  subtotal: number;
  discount?: number;
  deliveryFee?: number;
  total: number;
}

export const CartSummary = ({ 
  subtotal, 
  discount = 0, 
  deliveryFee = 0, 
  total 
}: CartSummaryProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Subtotal:</span>
        <span>R$ {subtotal.toFixed(2)}</span>
      </div>
      
      {discount > 0 && (
        <div className="flex justify-between text-sm text-green-600">
          <span>Desconto:</span>
          <span>-R$ {discount.toFixed(2)}</span>
        </div>
      )}
      
      {deliveryFee > 0 && (
        <div className="flex justify-between text-sm">
          <span>Taxa de entrega:</span>
          <span>R$ {deliveryFee.toFixed(2)}</span>
        </div>
      )}
      
      <Separator />
      
      <div className="flex justify-between font-bold text-lg">
        <span>Total:</span>
        <span className="text-green-600">R$ {total.toFixed(2)}</span>
      </div>
    </div>
  );
};
