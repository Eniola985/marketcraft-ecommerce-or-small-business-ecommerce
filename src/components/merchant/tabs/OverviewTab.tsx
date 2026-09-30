import React from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Package,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Tag,
  CheckCircle,
  Clock,
  Truck,
  ArrowRight,
} from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const {
    orders,
    products,
    customers,
    storeSettings,
    setMerchantTab,
    updateStock,
    updateOrderStatus,
  } = useStore();

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const totalOrdersCount = orders.length;
  const averageOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

  // Inventory & Profit Margins
  const totalStockUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const totalRetailValuation = products.reduce((sum, p) => sum + p.stock * p.price, 0);
  const totalCostValuation = products.reduce((sum, p) => sum + p.stock * p.costPrice, 0);
  const overallMarginPercent =
    totalRetailValuation > 0
      ? Math.round(((totalRetailValuation - totalCostValuation) / totalRetailValuation) * 100)
      : 0;

  // Low stock products
  const lowStockProducts = products.filter((p) => p.stock <= p.lowStockThreshold);

  // Recent Orders (top 5)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Small Business Quick Status / Banner */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <strong className="font-semibold block sm:inline mr-1">
                Inventory Restock Notice:
              </strong>
              <span>
                {lowStockProducts.length} {lowStockProducts.length === 1 ? 'item is' : 'items are'} below minimum threshold ({lowStockProducts.map((p) => p.name).join(', ')}).
              </span>
            </div>
          </div>
          <button
            onClick={() => setMerchantTab('products')}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium whitespace-nowrap self-start sm:self-auto transition-colors"
          >
            Review Inventory
          </button>
        </div>
      )}

      {/* Primary KPI Grid (Tabular Numerals) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-1">
          <span className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
            Gross Sales
          </span>
          <div className="text-2xl font-bold text-neutral-900 tabular-nums">
            {storeSettings.currencySymbol}{totalRevenue.toFixed(2)}
          </div>
          <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium pt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+18.4% vs last period</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-1">
          <span className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
            Orders Processed
          </span>
          <div className="text-2xl font-bold text-neutral-900 tabular-nums">
            {totalOrdersCount}
          </div>
          <div className="text-[11px] text-neutral-500 pt-1">
            <span>{orders.filter((o) => o.status === 'processing').length} fulfillment queue</span>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-1">
          <span className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
            Avg. Order Value (AOV)
          </span>
          <div className="text-2xl font-bold text-neutral-900 tabular-nums">
            {storeSettings.currencySymbol}{averageOrderValue.toFixed(2)}
          </div>
          <div className="text-[11px] text-neutral-500 pt-1">
            <span>Free ship threshold: ${storeSettings.freeShippingThreshold}</span>
          </div>
        </div>

        {/* Gross Profit Margin */}
        <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-1">
          <span className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
            Average Profit Margin
          </span>
          <div className="text-2xl font-bold text-neutral-900 tabular-nums">
            {overallMarginPercent}%
          </div>
          <div className="text-[11px] text-neutral-500 pt-1">
            <span className="tabular-nums">
              Stock Retail: ${totalRetailValuation.toFixed(0)} · Cost: ${totalCostValuation.toFixed(0)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3): Recent Orders Table */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-lg overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">Recent Customer Orders</h3>
              <p className="text-xs text-neutral-500">Live order queue synced with customer checkout</p>
            </div>
            <button
              onClick={() => setMerchantTab('orders')}
              className="text-xs text-neutral-700 hover:text-neutral-950 font-medium flex items-center gap-1"
            >
              <span>View All ({orders.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-500 font-medium border-b border-neutral-200">
                <tr>
                  <th className="py-2.5 px-4">Order</th>
                  <th className="py-2.5 px-4">Customer</th>
                  <th className="py-2.5 px-4">Items</th>
                  <th className="py-2.5 px-4 text-right">Total</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-neutral-900">
                      {order.orderNumber}
                      <span className="block text-[10px] text-neutral-400 font-sans">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-neutral-900 block">{order.customer.name}</span>
                      <span className="text-[11px] text-neutral-500">{order.customer.city}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium">{order.items.length} items</span>
                      <span className="block text-[11px] text-neutral-400 truncate max-w-[140px]">
                        {order.items.map((i) => i.productName).join(', ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-neutral-900 tabular-nums">
                      {storeSettings.currencySymbol}{order.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          order.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : order.status === 'shipped'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : order.status === 'processing'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {order.status === 'processing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'shipped')}
                          className="px-2 py-1 bg-neutral-900 text-white rounded text-[11px] font-medium hover:bg-neutral-800 transition-colors"
                        >
                          Mark Shipped
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="px-2 py-1 bg-emerald-700 text-white rounded text-[11px] font-medium hover:bg-emerald-800 transition-colors"
                        >
                          Mark Delivered
                        </button>
                      )}
                      {order.status === 'delivered' && (
                        <span className="text-neutral-400 text-[11px]">Fulfilled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (1/3): Store Setup Progress & Low Stock Action */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-4">
            <h3 className="text-sm font-semibold text-neutral-900">Merchant Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => setMerchantTab('products')}
                className="w-full flex items-center justify-between p-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-md text-xs text-neutral-800 font-medium transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-3.5 h-3.5 text-neutral-700" />
                  <span>Add New Product to Catalog</span>
                </div>
                <ArrowRight className="w-3 h-3 text-neutral-400" />
              </button>

              <button
                onClick={() => setMerchantTab('discounts')}
                className="w-full flex items-center justify-between p-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-md text-xs text-neutral-800 font-medium transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-neutral-700" />
                  <span>Create Promotional Discount</span>
                </div>
                <ArrowRight className="w-3 h-3 text-neutral-400" />
              </button>

              <button
                onClick={() => setMerchantTab('customizer')}
                className="w-full flex items-center justify-between p-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-md text-xs text-neutral-800 font-medium transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 text-neutral-700" />
                  <span>Edit Storefront Branding & Shipping</span>
                </div>
                <ArrowRight className="w-3 h-3 text-neutral-400" />
              </button>
            </div>
          </div>

          {/* Independent Small Business Setup Checklist */}
          <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-3">
            <h3 className="text-sm font-semibold text-neutral-900">Store Readiness Checklist</h3>
            <p className="text-xs text-neutral-500">Ensure your boutique is fully prepped for customers</p>

            <ul className="space-y-2.5 text-xs pt-1">
              <li className="flex items-center gap-2 text-emerald-700 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Product Catalog Configured ({products.length} live)</span>
              </li>
              <li className="flex items-center gap-2 text-emerald-700 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Sales Tax Rate Set ({(storeSettings.taxRate * 100).toFixed(0)}%)</span>
              </li>
              <li className="flex items-center gap-2 text-emerald-700 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Free Shipping Rule Active (&gt; ${storeSettings.freeShippingThreshold})</span>
              </li>
              <li className="flex items-center gap-2 text-emerald-700 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Recyclable Packaging Guarantee Published</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
