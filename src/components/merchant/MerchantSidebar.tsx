import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Palette,
  Database,
  Store,
  Calculator,
  AlertTriangle,
} from 'lucide-react';

interface NavItem {
  id: 'overview' | 'products' | 'orders' | 'customers' | 'discounts' | 'customizer' | 'backup';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeType?: 'warning' | 'info';
}

export const MerchantSidebar: React.FC = () => {
  const { merchantTab, setMerchantTab, orders, products, setActiveView, storeSettings } = useStore();

  const pendingOrders = orders.filter((o) => o.status === 'processing' || o.status === 'pending').length;
  const lowStock = products.filter((p) => p.stock <= p.lowStockThreshold).length;

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'products',
      label: 'Products & Inventory',
      icon: Package,
      badge: lowStock > 0 ? `${lowStock} low` : undefined,
      badgeType: 'warning',
    },
    {
      id: 'orders',
      label: 'Orders & Fulfillment',
      icon: ShoppingBag,
      badge: pendingOrders > 0 ? `${pendingOrders}` : undefined,
      badgeType: 'info',
    },
    { id: 'customers', label: 'Customers (CRM)', icon: Users },
    { id: 'discounts', label: 'Discounts & Promos', icon: Tag },
    { id: 'customizer', label: 'Storefront Theme', icon: Palette },
    { id: 'backup', label: 'Data & Backup', icon: Database },
  ];

  return (
    <aside className="w-64 bg-neutral-900 text-neutral-300 border-r border-neutral-800 flex flex-col justify-between shrink-0 min-h-[calc(100vh-3rem)]">
      {/* Top Section */}
      <div className="p-4 space-y-6">
        {/* Merchant Store Header */}
        <div className="px-2 py-1">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 block">
            Merchant Studio
          </span>
          <h2 className="text-base font-serif font-bold text-white truncate mt-0.5">
            {storeSettings.storeName}
          </h2>
          <span className="text-[11px] text-neutral-400">Independent Retail Hub</span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = merchantTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setMerchantTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-neutral-800 text-white font-semibold shadow-xs'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      item.badgeType === 'warning'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Switcher Card */}
      <div className="p-4 border-t border-neutral-800 space-y-2">
        <button
          onClick={() => setActiveView('pos')}
          className="w-full flex items-center justify-between px-3 py-2 bg-neutral-800 hover:bg-neutral-700/80 rounded-lg text-xs text-neutral-200 font-medium transition-colors border border-neutral-700/50"
        >
          <div className="flex items-center gap-2">
            <Calculator className="w-3.5 h-3.5 text-sky-400" />
            <span>Launch Market POS</span>
          </div>
          <span className="text-[10px] bg-sky-950 text-sky-300 px-1.5 py-0.5 rounded border border-sky-800">
            Register
          </span>
        </button>

        <button
          onClick={() => setActiveView('storefront')}
          className="w-full flex items-center justify-between px-3 py-2 bg-neutral-950 hover:bg-black rounded-lg text-xs text-amber-400 font-medium transition-colors border border-neutral-800"
        >
          <div className="flex items-center gap-2">
            <Store className="w-3.5 h-3.5" />
            <span>View Live Storefront</span>
          </div>
          <span className="text-[10px] text-neutral-400">&rarr;</span>
        </button>
      </div>
    </aside>
  );
};
