
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { ShoppingCart, Plus, Minus, Trash2, DollarSign, CreditCard, Smartphone } from 'lucide-react';
import { ProductGrid } from '@/components/pdv/ProductGrid';
import { CartSummary } from '@/components/pdv/CartSummary';
import { PaymentModal } from '@/components/pdv/PaymentModal';
import { CashSessionManager } from '@/components/pdv/CashSessionManager';
import type { Database } from '@/integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

const PDV = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentCashSession, setCurrentCashSession] = useState<any>(null);

  // Query para buscar produtos
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  // Query para buscar categorias
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  // Query para buscar sessão de caixa ativa
  const { data: activeCashSession } = useQuery({
    queryKey: ['activeCashSession'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cash_sessions')
        .select('*')
        .eq('status', 'open')
        .eq('user_id', user?.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  useEffect(() => {
    setCurrentCashSession(activeCashSession);
  }, [activeCashSession]);

  // Filtrar produtos
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Adicionar produto ao carrinho
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { 
                ...item, 
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.price
              }
            : item
        );
      } else {
        return [...prevCart, {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          total: product.price
        }];
      }
    });
  };

  // Atualizar quantidade no carrinho
  const updateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { 
              ...item, 
              quantity: newQuantity,
              total: newQuantity * item.price
            }
          : item
      )
    );
  };

  // Remover do carrinho
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Limpar carrinho
  const clearCart = () => {
    setCart([]);
  };

  // Calcular total do carrinho
  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);

  // Mutation para criar pedido
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
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

      // Inserir itens do pedido
      const orderItems = cart.map(item => ({
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
      clearCart();
      setShowPaymentModal(false);
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

  const handlePayment = (paymentData: any) => {
    createOrderMutation.mutate({
      subtotal: cartTotal,
      total: cartTotal,
      paymentMethod: paymentData.method,
      receivedAmount: paymentData.receivedAmount,
      changeAmount: paymentData.changeAmount
    });
  };

  if (!currentCashSession) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                PDV - Mercado Imperador
              </h1>
              <p className="text-gray-600 mb-6">
                Você precisa abrir uma sessão de caixa para começar a usar o PDV
              </p>
              <CashSessionManager 
                onSessionCreated={setCurrentCashSession}
                currentSession={currentCashSession}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ShoppingCart className="h-8 w-8 text-orange-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PDV - Mercado Imperador</h1>
                <p className="text-sm text-gray-500">
                  Caixa: {currentCashSession?.user_id} | 
                  Aberto em: {new Date(currentCashSession?.opened_at).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <CashSessionManager 
                onSessionCreated={setCurrentCashSession}
                currentSession={currentCashSession}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Área de Produtos */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm h-full">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Produtos</h2>
                <div className="flex items-center space-x-4">
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
              </div>

              {/* Filtros de Categoria */}
              <div className="flex items-center space-x-2 overflow-x-auto">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  Todas
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="p-6 h-[calc(100%-140px)] overflow-y-auto">
              <ProductGrid 
                products={filteredProducts}
                isLoading={productsLoading}
                onAddToCart={addToCart}
              />
            </div>
          </div>
        </div>

        {/* Carrinho */}
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
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromCart(item.id)}
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
                        onClick={() => setShowPaymentModal(true)}
                        disabled={cart.length === 0}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Finalizar Venda
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={clearCart}
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
      </div>

      {/* Modal de Pagamento */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        total={cartTotal}
        onConfirmPayment={handlePayment}
        isProcessing={createOrderMutation.isPending}
      />
    </div>
  );
};

export default PDV;
