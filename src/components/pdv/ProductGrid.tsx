
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Package } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  onAddToCart: (product: Product) => void;
}

export const ProductGrid = ({ products, isLoading, onAddToCart }: ProductGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-4">
              <div className="bg-gray-200 h-24 rounded mb-3"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <Package className="h-16 w-16 mb-4 opacity-50" />
        <p className="text-lg font-medium">Nenhum produto encontrado</p>
        <p className="text-sm">Ajuste os filtros ou adicione novos produtos</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <Card 
          key={product.id} 
          className="hover:shadow-md transition-shadow cursor-pointer group"
          onClick={() => onAddToCart(product)}
        >
          <CardContent className="p-4">
            <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Package className="h-12 w-12 text-gray-400" />
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-sm leading-tight line-clamp-2">
                {product.name}
              </h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-green-600">
                    R$ {product.price.toFixed(2)}
                  </p>
                  {product.stock_quantity !== null && (
                    <p className="text-xs text-gray-500">
                      Estoque: {product.stock_quantity}
                    </p>
                  )}
                </div>
                
                <Button 
                  size="sm" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {product.unit_type && (
                <Badge variant="outline" className="text-xs">
                  {product.unit_type === 'unit' ? 'Unidade' : 'Peso'}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
