
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { CashSessionManager } from './CashSessionManager';

interface PDVHeaderProps {
  currentCashSession: any;
  onSessionChange: (session: any) => void;
}

export const PDVHeader = ({ currentCashSession, onSessionChange }: PDVHeaderProps) => {
  return (
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
              onSessionCreated={onSessionChange}
              currentSession={currentCashSession}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
