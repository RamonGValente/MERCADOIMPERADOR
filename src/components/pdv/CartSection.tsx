
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingCart, Plus, Minus, Trash2, DollarSign } from 'lucide-react';
import { CartSummary } from './CartSummary';
import type { CartItem } from '@/types/cart';

interface CartSectionProps {
  cart: CartItem[];
  cartTotal: number;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onShowPayment: () => void;
}

export const CartSection = ({ 
  cart, 
  cartTotal, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart, 
  onShowPayment 
}: CartSectionProps) => {
  return (
    <div className="w-96 p-6">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Carrinho</span>
            <Badge variant="secondary">{cart.length} {cart.length === 1 ? 'item' : 'itens'}</Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          {cart.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Carrinho vazio</p>
                <p className="text-sm">Adicione produtos para começar</p>
              </div>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 pr-2">
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-500">
                          R$ {item.price.toFixed(2)} cada
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onRemoveItem(item.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="ml-3 text-right">
                        <p className="font-medium text-sm">
                          R$ {item.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="mt-4 space-y-4">
                <Separator />
                <CartSummary subtotal={cartTotal} total={cartTotal} />
                
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={onShowPayment}
                    disabled={cart.length === 0}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Finalizar Venda
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={onClearCart}
                    disabled={cart.length === 0}
                  >
                    Limpar Carrinho
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
