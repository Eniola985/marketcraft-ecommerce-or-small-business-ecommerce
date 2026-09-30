/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { PlatformNavbar } from './components/common/PlatformNavbar';
import { StorefrontLayout } from './components/storefront/StorefrontLayout';
import { MerchantLayout } from './components/merchant/MerchantLayout';
import { PosTerminal } from './components/pos/PosTerminal';

const MainAppContent: React.FC = () => {
  const { activeView } = useStore();

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col selection:bg-neutral-900 selection:text-white">
      {/* Universal Mode Bar (Storefront / Merchant Operations / Market POS) */}
      <PlatformNavbar />

      {/* Main View Router */}
      <div className="flex-1">
        {activeView === 'storefront' && <StorefrontLayout />}
        {activeView === 'merchant' && <MerchantLayout />}
        {activeView === 'pos' && <PosTerminal />}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
