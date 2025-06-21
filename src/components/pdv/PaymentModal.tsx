
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DollarSign, CreditCard, Smartphone } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onConfirmPayment: (paymentData: {
    method: string;
    receivedAmount?: number;
    changeAmount?: number;
  }) => void;
  isProcessing: boolean;
}

export const PaymentModal = ({ 
  isOpen, 
  onClose, 
  total, 
  onConfirmPayment, 
  isProcessing 
}: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [receivedAmount, setReceivedAmount] = useState<string>('');
  const [error, setError] = useState<string>('');

  const receivedValue = parseFloat(receivedAmount) || 0;
  const changeAmount = receivedValue - total;

  const handleConfirm = () => {
    setError('');

    if (paymentMethod === 'cash') {
      if (!receivedAmount || receivedValue < total) {
        setError('Valor recebido deve ser igual ou maior que o total');
        return;
      }
    }

    onConfirmPayment({
      method: paymentMethod,
      receivedAmount: paymentMethod === 'cash' ? receivedValue : total,
      changeAmount: paymentMethod === 'cash' ? Math.max(0, changeAmount) : 0
    });
  };

  const handleClose = () => {
    if (!isProcessing) {
      setPaymentMethod('cash');
      setReceivedAmount('');
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Finalizar Pagamento</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Total */}
          <div className="text-center py-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Total a pagar</p>
            <p className="text-3xl font-bold text-green-600">
              R$ {total.toFixed(2)}
            </p>
          </div>

          {/* Método de Pagamento */}
          <div className="space-y-3">
            <Label>Método de Pagamento</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                className="flex flex-col h-20"
                onClick={() => setPaymentMethod('cash')}
              >
                <DollarSign className="h-6 w-6 mb-1" />
                <span className="text-xs">Dinheiro</span>
              </Button>
              
              <Button
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                className="flex flex-col h-20"
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard className="h-6 w-6 mb-1" />
                <span className="text-xs">Cartão</span>
              </Button>
              
              <Button
                variant={paymentMethod === 'pix' ? 'default' : 'outline'}
                className="flex flex-col h-20"
                onClick={() => setPaymentMethod('pix')}
              >
                <Smartphone className="h-6 w-6 mb-1" />
                <span className="text-xs">PIX</span>
              </Button>
            </div>
          </div>

          {/* Valor Recebido (apenas para dinheiro) */}
          {paymentMethod === 'cash' && (
            <div className="space-y-3">
              <Label htmlFor="receivedAmount">Valor Recebido</Label>
              <Input
                id="receivedAmount"
                type="number"
                step="0.01"
                min="0"
                value={receivedAmount}
                onChange={(e) => setReceivedAmount(e.target.value)}
                placeholder="0,00"
                className="text-right text-lg"
              />
              
              {receivedAmount && receivedValue >= total && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Troco:</span>
                    <span className="text-lg font-bold text-green-600">
                      R$ {changeAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Resumo do Pagamento */}
          {paymentMethod !== 'cash' && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                {paymentMethod === 'card' && 'Insira ou aproxime o cartão na máquina'}
                {paymentMethod === 'pix' && 'Aguarde a confirmação do pagamento via PIX'}
              </p>
            </div>
          )}

          {/* Erro */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Separator />

          {/* Botões */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              onClick={handleConfirm}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processando...' : 'Confirmar Pagamento'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
