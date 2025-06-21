
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PDVHeader } from '@/components/pdv/PDVHeader';
import { PDVMain } from '@/components/pdv/PDVMain';
import { PDVLayout } from '@/components/pdv/PDVLayout';
import { NoCashSessionView } from '@/components/pdv/NoCashSessionView';
import { useCashSession } from '@/hooks/useCashSession';

const PDV = () => {
  const { user } = useAuth();
  const { currentCashSession, setCurrentCashSession } = useCashSession(user?.id);

  if (!currentCashSession) {
    return <NoCashSessionView onSessionCreated={setCurrentCashSession} />;
  }

  return (
    <PDVLayout>
      <PDVHeader 
        currentCashSession={currentCashSession} 
        onSessionChange={setCurrentCashSession}
      />
      <PDVMain currentCashSession={currentCashSession} />
    </PDVLayout>
  );
};

export default PDV;
