
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  Settings, 
  FileText,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Novo Pedido',
      icon: Plus,
      description: 'Criar novo pedido no PDV',
      action: () => navigate('/pdv'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Gerenciar Produtos',
      icon: Package,
      description: 'Adicionar ou editar produtos',
      action: () => navigate('/products'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Ver Pedidos',
      icon: FileText,
      description: 'Visualizar todos os pedidos',
      action: () => navigate('/orders'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Configurações',
      icon: Settings,
      description: 'Configurar sistema',
      action: () => navigate('/settings'),
      color: 'bg-gray-500 hover:bg-gray-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                onClick={action.action}
                className={`${action.color} text-white h-auto p-4 flex flex-col items-center gap-2`}
              >
                <Icon className="h-6 w-6" />
                <div className="text-center">
                  <p className="font-semibold text-sm">{action.title}</p>
                  <p className="text-xs opacity-90">{action.description}</p>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
