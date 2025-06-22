
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  DollarSign,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { useOrdersStats } from '@/hooks/useOrders';
import { useProductsStats } from '@/hooks/useProductsStats';
import { useCustomersStats } from '@/hooks/useCustomers';

export const StatsCards = () => {
  const { data: ordersStats, isLoading: ordersLoading } = useOrdersStats();
  const { data: productsStats, isLoading: productsLoading } = useProductsStats();
  const { data: customersStats, isLoading: customersLoading } = useCustomersStats();

  const isLoading = ordersLoading || productsLoading || customersLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vendas Hoje</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {(ordersStats?.todaySales || 0).toLocaleString('pt-BR', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pedidos Hoje</p>
              <p className="text-2xl font-bold text-gray-900">{ordersStats?.todayOrdersCount || 0}</p>
              <p className="text-xs text-gray-500">Total: {ordersStats?.totalOrders || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{customersStats?.totalCustomers || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Produtos</p>
              <p className="text-2xl font-bold text-gray-900">{productsStats?.activeProducts || 0}</p>
              {(productsStats?.lowStockCount || 0) > 0 && (
                <div className="flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                  <p className="text-xs text-red-500">{productsStats?.lowStockCount} baixo estoque</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
