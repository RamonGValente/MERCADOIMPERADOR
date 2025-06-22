
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Package, Users, TrendingUp } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-orange-600 mb-4">
              Mercado Imperador
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Sistema completo de gestão para seu mercado
            </p>
            <Button 
              onClick={() => navigate('/auth')} 
              size="lg"
              className="bg-orange-600 hover:bg-orange-700"
            >
              Fazer Login
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Funcionalidades do Sistema
          </h2>
          <p className="text-gray-600">
            Tudo que você precisa para gerenciar seu mercado
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <div className="p-2 bg-green-100 rounded-lg w-fit">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>PDV Completo</CardTitle>
              <CardDescription>
                Sistema de ponto de venda com gestão de caixa
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="p-2 bg-blue-100 rounded-lg w-fit">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Gestão de Produtos</CardTitle>
              <CardDescription>
                Controle completo do seu estoque e produtos
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="p-2 bg-purple-100 rounded-lg w-fit">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Cadastro de Clientes</CardTitle>
              <CardDescription>
                Gerencie seus clientes e histórico de compras
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="p-2 bg-orange-100 rounded-lg w-fit">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Relatórios</CardTitle>
              <CardDescription>
                Acompanhe vendas e performance do negócio
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
