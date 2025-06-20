
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, Users, TrendingUp } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <ShoppingCart className="h-8 w-8 text-orange-600" />
              <h1 className="text-2xl font-bold text-orange-600">Mercado Imperador</h1>
            </div>
            <Button onClick={() => navigate('/auth')}>
              Acessar Sistema
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Sistema de Gestão
            <span className="block text-orange-600">Mercado Imperador</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Solução completa para gerenciamento do seu estabelecimento. 
            Controle vendas, estoque, clientes e muito mais em uma única plataforma.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-4"
            onClick={() => navigate('/auth')}
          >
            Começar Agora
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Ponto de Venda</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Sistema PDV completo para vendas rápidas e eficientes
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Gestão de Estoque</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Controle completo do seu inventário e movimentações
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Cadastro e acompanhamento de clientes e vendas
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Relatórios</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Acompanhe o desempenho do seu negócio em tempo real
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pronto para começar?
          </h2>
          <p className="text-gray-600 mb-6">
            Cadastre-se agora e tenha acesso completo ao sistema de gestão
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-4"
            onClick={() => navigate('/auth')}
          >
            Criar Conta Grátis
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Mercado Imperador. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
