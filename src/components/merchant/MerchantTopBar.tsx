import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Store, Plus, ExternalLink, RefreshCw } from 'lucide-react';

interface MerchantTopBarProps {
  onAddProductClick?: () => void;
}

export const MerchantTopBar: React.FC<MerchantTopBarProps> = ({ onAddProductClick }) => {
  const { merchantTab, storeSettings, setActiveView, setMerchantTab } = useStore();

  const getBreadcrumbTitle = () => {
    switch (merchantTab) {
      case 'overview':
        return 'Executive Overview & Sales';
      case 'products':
        return 'Product Catalog & Inventory Health';
      case 'orders':
        return 'Order Processing & Fulfillment';
      case 'customers':
        return 'Customer Directory (CRM)';
      case 'discounts':
        return 'Promotions & Coupon Codes';
      case 'customizer':
        return 'Storefront Theme & Branding';
      case 'backup':
        return 'Database Backup & Restore';
      default:
        return 'Merchant Studio';
    }
  };

  return (
    <div className="h-14 bg-white border-b border-neutral-200 px-6 flex items-center justify-between">
      {/* Breadcrumb Trail */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-neutral-500 font-medium">Merchant Studio</span>
        <span className="text-neutral-300">/</span>
        <span className="text-neutral-900 font-semibold">{getBreadcrumbTitle()}</span>
      </div>

      {/* Action Zone */}
      <div className="flex items-center gap-3">
        {merchantTab === 'products' && onAddProductClick && (
          <button
            onClick={onAddProductClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        )}

        <button
          onClick={() => setActiveView('storefront')}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-300 hover:bg-neutral-50 text-neutral-800 rounded-md text-xs font-medium transition-colors"
        >
          <Store className="w-3.5 h-3.5 text-neutral-600" />
          <span>Customer View</span>
          <ExternalLink className="w-3 h-3 text-neutral-400" />
        </button>
      </div>
    </div>
  );
};
