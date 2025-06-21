
import React from 'react';

interface PDVLayoutProps {
  children: React.ReactNode;
}

export const PDVLayout = ({ children }: PDVLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
};
