
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  cost_price: number | null;
  barcode: string | null;
  category_id: string | null;
  unit_type: string;
  stock_quantity: number;
  min_stock: number;
  is_active: boolean;
  categories?: { name: string };
}

interface Category {
  id: string;
  name: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    cost_price: '',
    barcode: '',
    category_id: '',
    unit_type: 'unit',
    stock_quantity: '',
    min_stock: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar produtos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
        barcode: formData.barcode || null,
        category_id: formData.category_id || null,
        unit_type: formData.unit_type,
        stock_quantity: parseFloat(formData.stock_quantity) || 0,
        min_stock: parseFloat(formData.min_stock) || 0
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        
        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Produto atualizado com sucesso!"
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        
        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Produto cadastrado com sucesso!"
        });
      }

      setDialogOpen(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar produto",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      cost_price: product.cost_price?.toString() || '',
      barcode: product.barcode || '',
      category_id: product.category_id || '',
      unit_type: product.unit_type,
      stock_quantity: product.stock_quantity.toString(),
      min_stock: product.min_stock.toString()
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Produto excluído com sucesso!"
      });

      fetchProducts();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir produto",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      cost_price: '',
      barcode: '',
      category_id: '',
      unit_type: 'unit',
      stock_quantity: '',
      min_stock: ''
    });
  };

  const openNewProductDialog = () => {
    setEditingProduct(null);
    resetForm();
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openNewProductDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Produto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="barcode">Código de Barras</Label>
                      <Input
                        id="barcode"
                        value={formData.barcode}
                        onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Preço de Venda *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cost_price">Preço de Custo</Label>
                      <Input
                        id="cost_price"
                        type="number"
                        step="0.01"
                        value={formData.cost_price}
                        onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit_type">Tipo de Unidade</Label>
                      <Select value={formData.unit_type} onValueChange={(value) => setFormData({ ...formData, unit_type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unit">Unidade</SelectItem>
                          <SelectItem value="weight">Peso (Kg)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category_id">Categoria</Label>
                      <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock_quantity">Estoque Atual</Label>
                      <Input
                        id="stock_quantity"
                        type="number"
                        step="0.001"
                        value={formData.stock_quantity}
                        onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="min_stock">Estoque Mínimo</Label>
                      <Input
                        id="min_stock"
                        type="number"
                        step="0.001"
                        value={formData.min_stock}
                        onChange={(e) => setFormData({ ...formData, min_stock: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingProduct ? 'Atualizar' : 'Cadastrar'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {product.categories?.name || 'Sem categoria'}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-green-600">
                    R$ {product.price.toFixed(2)}
                  </p>
                  {product.description && (
                    <p className="text-sm text-gray-600">{product.description}</p>
                  )}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Estoque: {product.stock_quantity}</span>
                    <span>Mín: {product.min_stock}</span>
                  </div>
                  {product.barcode && (
                    <p className="text-xs text-gray-500">Código: {product.barcode}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum produto cadastrado</p>
            <p className="text-gray-400">Clique em "Novo Produto" para começar</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;
