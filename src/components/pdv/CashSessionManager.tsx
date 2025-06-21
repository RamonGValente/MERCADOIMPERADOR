
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { DollarSign, Lock, Unlock } from 'lucide-react';

interface CashSessionManagerProps {
  currentSession: any;
  onSessionCreated: (session: any) => void;
}

export const CashSessionManager = ({ currentSession, onSessionCreated }: CashSessionManagerProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [openingAmount, setOpeningAmount] = useState('');
  const [closingAmount, setClosingAmount] = useState('');
  const [notes, setNotes] = useState('');

  // Mutation para abrir caixa
  const openCashMutation = useMutation({
    mutationFn: async (data: { openingAmount: number; notes?: string }) => {
      const { data: session, error } = await supabase
        .from('cash_sessions')
        .insert({
          user_id: user?.id,
          opening_amount: data.openingAmount,
          notes: data.notes,
          status: 'open'
        })
        .select()
        .single();

      if (error) throw error;
      return session;
    },
    onSuccess: (session) => {
      toast({
        title: "Caixa aberto com sucesso!",
        description: `Valor inicial: R$ ${openingAmount}`,
      });
      onSessionCreated(session);
      setShowOpenModal(false);
      setOpeningAmount('');
      setNotes('');
      queryClient.invalidateQueries({ queryKey: ['activeCashSession'] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao abrir caixa",
        description: "Não foi possível abrir a sessão de caixa. Tente novamente.",
        variant: "destructive"
      });
      console.error('Error opening cash session:', error);
    }
  });

  // Mutation para fechar caixa
  const closeCashMutation = useMutation({
    mutationFn: async (data: { closingAmount: number; notes?: string }) => {
      const { data: session, error } = await supabase
        .from('cash_sessions')
        .update({
          closed_at: new Date().toISOString(),
          closing_amount: data.closingAmount,
          notes: data.notes,
          status: 'closed'
        })
        .eq('id', currentSession.id)
        .select()
        .single();

      if (error) throw error;
      return session;
    },
    onSuccess: () => {
      toast({
        title: "Caixa fechado com sucesso!",
        description: `Valor final: R$ ${closingAmount}`,
      });
      onSessionCreated(null);
      setShowCloseModal(false);
      setClosingAmount('');
      setNotes('');
      queryClient.invalidateQueries({ queryKey: ['activeCashSession'] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao fechar caixa",
        description: "Não foi possível fechar a sessão de caixa. Tente novamente.",
        variant: "destructive"
      });
      console.error('Error closing cash session:', error);
    }
  });

  const handleOpenCash = () => {
    const amount = parseFloat(openingAmount);
    if (isNaN(amount) || amount < 0) {
      toast({
        title: "Valor inválido",
        description: "Digite um valor válido para abertura do caixa.",
        variant: "destructive"
      });
      return;
    }

    openCashMutation.mutate({
      openingAmount: amount,
      notes: notes.trim() || undefined
    });
  };

  const handleCloseCash = () => {
    const amount = parseFloat(closingAmount);
    if (isNaN(amount) || amount < 0) {
      toast({
        title: "Valor inválido",
        description: "Digite um valor válido para fechamento do caixa.",
        variant: "destructive"
      });
      return;
    }

    closeCashMutation.mutate({
      closingAmount: amount,
      notes: notes.trim() || undefined
    });
  };

  if (!currentSession) {
    return (
      <Dialog open={showOpenModal} onOpenChange={setShowOpenModal}>
        <DialogTrigger asChild>
          <Button className="bg-green-600 hover:bg-green-700">
            <Unlock className="h-4 w-4 mr-2" />
            Abrir Caixa
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Abrir Sessão de Caixa</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="openingAmount">Valor Inicial do Caixa</Label>
              <Input
                id="openingAmount"
                type="number"
                step="0.01"
                min="0"
                value={openingAmount}
                onChange={(e) => setOpeningAmount(e.target.value)}
                placeholder="0,00"
                className="text-right"
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observações sobre a abertura do caixa..."
                rows={3}
              />
            </div>
            
            <div className="flex space-x-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowOpenModal(false)}
                disabled={openCashMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1"
                onClick={handleOpenCash}
                disabled={openCashMutation.isPending}
              >
                {openCashMutation.isPending ? 'Abrindo...' : 'Abrir Caixa'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <DollarSign className="h-3 w-3 mr-1" />
        Caixa Aberto
      </Badge>
      
      <Dialog open={showCloseModal} onOpenChange={setShowCloseModal}>
        <DialogTrigger asChild>
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
            <Lock className="h-4 w-4 mr-2" />
            Fechar Caixa
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fechar Sessão de Caixa</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Resumo da Sessão</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Valor inicial:</span>
                  <span>R$ {currentSession.opening_amount?.toFixed(2) || '0,00'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total de vendas:</span>
                  <span>R$ {currentSession.total_sales?.toFixed(2) || '0,00'}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span>Valor esperado:</span>
                  <span>R$ {((currentSession.opening_amount || 0) + (currentSession.total_sales || 0)).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
            
            <div>
              <Label htmlFor="closingAmount">Valor Final do Caixa</Label>
              <Input
                id="closingAmount"
                type="number"
                step="0.01"
                min="0"
                value={closingAmount}
                onChange={(e) => setClosingAmount(e.target.value)}
                placeholder="0,00"
                className="text-right"
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observações sobre o fechamento do caixa..."
                rows={3}
              />
            </div>
            
            <div className="flex space-x-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowCloseModal(false)}
                disabled={closeCashMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handleCloseCash}
                disabled={closeCashMutation.isPending}
              >
                {closeCashMutation.isPending ? 'Fechando...' : 'Fechar Caixa'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
