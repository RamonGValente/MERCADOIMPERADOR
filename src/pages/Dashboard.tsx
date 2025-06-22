
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp, 
  DollarSign,
  Settings,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { QuickActions } from '@/components/dashboard/QuickActions';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const menuItems = [
    {
      title: 'Vendas / PDV',
      description: 'Sistema de ponto de venda',
      icon: ShoppingCart,
      path: '/pdv',
      color: 'bg-green-500'
    },
    {
      title: 'Produtos',
      description: 'Gerenciar produtos e categorias',
      icon: Package,
      path: '/products',
      color: 'bg-blue-500'
    },
    {
      title: 'Clientes',
      description: 'Cadastro de clientes',
      icon: Users,
      path: '/customers',
      color: 'bg-purple-500'
    },
    {
      title: 'Pedidos',
      description: 'Acompanhar pedidos',
      icon: TrendingUp,
      path: '/orders',
      color: 'bg-orange-500'
    },
    {
      title: 'Financeiro',
      description: 'Controle financeiro',
      icon: DollarSign,
      path: '/financial',
      color: 'bg-emerald-500'
    },
    {
      title: 'Configurações',
      description: 'Configurações do sistema',
      icon: Settings,
      path: '/settings',
      color: 'bg-gray-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-orange-600">Mercado Imperador</h1>
              <p className="text-sm text-gray-600">Bem-vindo, {user?.email}</p>
            </div>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Visão geral do seu negócio</p>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Orders - Takes 2 columns */}
          <div className="lg:col-span-2">
            <RecentOrders />
          </div>
          
          {/* Quick Actions - Takes 1 column */}
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>

        {/* Menu Grid */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Módulos do Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card 
                  key={item.path} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(item.path)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${item.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
