
import React from 'react';
import { CashSessionManager } from './CashSessionManager';

interface NoCashSessionViewProps {
  onSessionCreated: (session: any) => void;
}

export const NoCashSessionView = ({ onSessionCreated }: NoCashSessionViewProps) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              PDV - Mercado Imperador
            </h1>
            <p className="text-gray-600 mb-6">
              Você precisa abrir uma sessão de caixa para começar a usar o PDV
            </p>
            <CashSessionManager 
              onSessionCreated={onSessionCreated}
              currentSession={null}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
