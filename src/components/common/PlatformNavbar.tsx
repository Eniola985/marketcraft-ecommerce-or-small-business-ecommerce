import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Store, LayoutDashboard, Calculator, ShoppingBag, Eye, Sparkles } from 'lucide-react';

export const PlatformNavbar: React.FC = () => {
  const { activeView, setActiveView, cartCount, orders, products, storeSettings } = useStore();

  const pendingOrdersCount = orders.filter((o) => o.status === 'processing' || o.status === 'pending').length;
  const lowStockCount = products.filter((p) => p.stock <= p.lowStockThreshold).length;

  return (
    <header className="sticky top-0 z-50 bg-neutral-900 text-neutral-100 border-b border-neutral-800 text-xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-4">
        {/* Brand & Platform Mode Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-amber-500 rounded flex items-center justify-center font-bold text-neutral-950 text-xs">
              M
            </div>
            <span className="font-semibold tracking-tight text-white text-sm">MarketCraft</span>
          </div>
          <span className="text-neutral-500">|</span>
          <span className="hidden sm:inline text-neutral-400 truncate max-w-[140px] md:max-w-[200px]">
            {storeSettings.storeName}
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-neutral-800/80 p-0.5 rounded-lg border border-neutral-700/60">
          <button
            onClick={() => setActiveView('storefront')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeView === 'storefront'
                ? 'bg-neutral-950 text-white shadow-sm ring-1 ring-neutral-700'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-amber-400" />
            <span>Storefront</span>
            {cartCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-neutral-950 text-[10px] font-bold rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('merchant')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeView === 'merchant'
                ? 'bg-neutral-950 text-white shadow-sm ring-1 ring-neutral-700'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
            <span>Merchant Hub</span>
            {pendingOrdersCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold rounded-full border border-emerald-500/30">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('pos')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeView === 'pos'
                ? 'bg-neutral-950 text-white shadow-sm ring-1 ring-neutral-700'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Market POS</span>
            <span className="sm:hidden">POS</span>
          </button>
        </div>

        {/* Right Status Actions */}
        <div className="flex items-center gap-3">
          {lowStockCount > 0 && (
            <button
              onClick={() => {
                setActiveView('merchant');
              }}
              className="hidden lg:flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors"
              title={`${lowStockCount} items low in stock`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>{lowStockCount} low stock</span>
            </button>
          )}

          {activeView === 'merchant' ? (
            <button
              onClick={() => setActiveView('storefront')}
              className="flex items-center gap-1.5 px-2.5 py-1 text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700/80 rounded border border-neutral-700 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Preview Store</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveView('merchant')}
              className="flex items-center gap-1.5 px-2.5 py-1 text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700/80 rounded border border-neutral-700 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Manage Store</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
