
import React from 'react';
import ClientHeader from '@/components/client/ClientHeader';
import Footer from '@/components/shared/Footer';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ClientHeader />
      <main className="flex-grow container mx-auto px-4 py-6 sm:px-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default ClientLayout;
