import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { MerchantSidebar } from './MerchantSidebar';
import { MerchantTopBar } from './MerchantTopBar';
import { OverviewTab } from './tabs/OverviewTab';
import { ProductsTab } from './tabs/ProductsTab';
import { OrdersTab } from './tabs/OrdersTab';
import { CustomersTab } from './tabs/CustomersTab';
import { DiscountsTab } from './tabs/DiscountsTab';
import { CustomizerTab } from './tabs/CustomizerTab';
import { BackupTab } from './tabs/BackupTab';

export const MerchantLayout: React.FC = () => {
  const { merchantTab } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-3rem)] bg-neutral-100/70">
      {/* Sidebar */}
      <MerchantSidebar />

      {/* Main Merchant Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        <MerchantTopBar onAddProductClick={() => setIsAddModalOpen(true)} />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {merchantTab === 'overview' && <OverviewTab />}
          {merchantTab === 'products' && (
            <ProductsTab
              isAddModalOpen={isAddModalOpen}
              setIsAddModalOpen={setIsAddModalOpen}
            />
          )}
          {merchantTab === 'orders' && <OrdersTab />}
          {merchantTab === 'customers' && <CustomersTab />}
          {merchantTab === 'discounts' && <DiscountsTab />}
          {merchantTab === 'customizer' && <CustomizerTab />}
          {merchantTab === 'backup' && <BackupTab />}
        </main>
      </div>
    </div>
  );
};
