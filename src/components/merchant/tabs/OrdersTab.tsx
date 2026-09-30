import React, { useState, useMemo } from 'react';
import { useStore } from '../../../context/StoreContext';
import { Order, OrderStatus } from '../../../types/ecommerce';
import {
  Search,
  Truck,
  CheckCircle,
  Clock,
  Printer,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const OrdersTab: React.FC = () => {
  const { orders, updateOrderStatus, updateOrderTracking, storeSettings } = useStore();

  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Tracking form modal state
  const [carrierInput, setCarrierInput] = useState('USPS Priority');
  const [trackingInput, setTrackingInput] = useState('');

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.email.toLowerCase().includes(q) ||
          (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [orders, statusFilter, search]);

  const handleOpenOrder = (o: Order) => {
    setSelectedOrder(o);
    setCarrierInput(o.carrier || 'USPS Priority');
    setTrackingInput(o.trackingNumber || `9400111${Math.floor(10000000000 + Math.random() * 90000000000)}`);
  };

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    updateOrderTracking(selectedOrder.id, carrierInput, trackingInput);
    setSelectedOrder({
      ...selectedOrder,
      carrier: carrierInput,
      trackingNumber: trackingInput,
      status: 'shipped',
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Orders & Fulfillment Queue</h2>
          <p className="text-xs text-neutral-500">
            Track customer deliveries, update shipping tracking numbers, and print packing slips.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-500">Total in queue:</span>
          <span className="font-bold text-neutral-900 tabular-nums">{orders.length} orders</span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              {st} {st !== 'all' && `(${orders.filter((o) => o.status === st).length})`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search order #, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 font-medium border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Order Reference</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4 text-right">Order Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-neutral-900">
                      {o.orderNumber}
                      <span className="block text-[10px] text-neutral-400 font-sans">
                        {new Date(o.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-neutral-900 block">{o.customer.name}</span>
                      <span className="text-[11px] text-neutral-400">{o.customer.email}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="capitalize text-[11px] text-neutral-600 font-medium">
                        {o.source === 'pos' ? 'Market Register' : 'Online Store'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-medium text-neutral-800">
                        {o.items.reduce((s, i) => s + i.quantity, 0)} units
                      </span>
                      <span className="block text-[11px] text-neutral-400 truncate max-w-[140px]">
                        {o.items.map((i) => i.productName).join(', ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-neutral-900 tabular-nums">
                      {storeSettings.currencySymbol}{o.total.toFixed(2)}
                    </td>

                    <td className="py-3 px-4">
                      <span className="capitalize text-emerald-700 font-medium text-[11px]">
                        {o.paymentMethod.replace('_', ' ')} · {o.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          o.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : o.status === 'shipped'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : o.status === 'processing'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenOrder(o)}
                        className="px-2.5 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded font-medium transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-500">
                    No orders match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Packing Slip Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-xs"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div>
                <span className="text-[11px] text-neutral-500 uppercase tracking-wider">
                  Order Management
                </span>
                <h3 className="font-serif font-bold text-neutral-900 text-base flex items-center gap-2">
                  <span>{selectedOrder.orderNumber}</span>
                  <span className="text-xs font-normal text-neutral-500">
                    ({new Date(selectedOrder.createdAt).toLocaleString()})
                  </span>
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-2.5 py-1 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-700 rounded text-xs flex items-center gap-1 font-medium transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Packing Slip</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 text-neutral-400 hover:text-neutral-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-6 space-y-6">
              {/* Status & Quick Transition */}
              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-neutral-500 block mb-0.5">Current Order Status:</span>
                  <span className="font-semibold uppercase tracking-wider text-xs text-neutral-900">
                    {selectedOrder.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'processing');
                      setSelectedOrder({ ...selectedOrder, status: 'processing' });
                    }}
                    className={`px-2.5 py-1 rounded font-medium ${
                      selectedOrder.status === 'processing'
                        ? 'bg-amber-600 text-white'
                        : 'bg-white border text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    Processing
                  </button>

                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'shipped');
                      setSelectedOrder({ ...selectedOrder, status: 'shipped' });
                    }}
                    className={`px-2.5 py-1 rounded font-medium ${
                      selectedOrder.status === 'shipped'
                        ? 'bg-sky-600 text-white'
                        : 'bg-white border text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    Shipped
                  </button>

                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'delivered');
                      setSelectedOrder({ ...selectedOrder, status: 'delivered' });
                    }}
                    className={`px-2.5 py-1 rounded font-medium ${
                      selectedOrder.status === 'delivered'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    Delivered
                  </button>
                </div>
              </div>

              {/* Carrier & Tracking Number Form */}
              <form onSubmit={handleSaveTracking} className="p-4 border border-neutral-200 rounded-lg space-y-3">
                <span className="font-semibold text-neutral-900 block">
                  Shipping Courier & Dispatch Tracking
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-neutral-600 block mb-1">Carrier Provider</label>
                    <select
                      value={carrierInput}
                      onChange={(e) => setCarrierInput(e.target.value)}
                      className="w-full p-2 border border-neutral-300 rounded bg-white"
                    >
                      <option value="USPS Priority">USPS Priority Mail</option>
                      <option value="USPS Ground Advantage">USPS Ground Advantage</option>
                      <option value="UPS Ground">UPS Ground</option>
                      <option value="FedEx Express">FedEx Express</option>
                      <option value="DHL Express">DHL Express</option>
                      <option value="Local Courier">Local Studio Courier</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-neutral-600 block mb-1">Tracking Number</label>
                    <input
                      type="text"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      placeholder="e.g. 9400 1118 9956 2534..."
                      className="w-full p-2 border border-neutral-300 rounded font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded font-medium transition-colors"
                  >
                    Save & Update Dispatch Notice
                  </button>
                </div>
              </form>

              {/* Customer & Shipping Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <div>
                  <span className="font-semibold text-neutral-900 block mb-1">Customer Contact</span>
                  <p className="font-medium text-neutral-800">{selectedOrder.customer.name}</p>
                  <p className="text-neutral-600">{selectedOrder.customer.email}</p>
                  <p className="text-neutral-600">{selectedOrder.customer.phone}</p>
                </div>

                <div>
                  <span className="font-semibold text-neutral-900 block mb-1">Shipping Destination</span>
                  <p className="text-neutral-700">{selectedOrder.customer.address}</p>
                  <p className="text-neutral-700">
                    {selectedOrder.customer.city}, {selectedOrder.customer.state} {selectedOrder.customer.postalCode}
                  </p>
                  <p className="text-neutral-500">{selectedOrder.customer.country}</p>
                </div>
              </div>

              {/* Itemized Goods */}
              <div className="space-y-3">
                <span className="font-semibold text-neutral-900 block">Itemized Package Content</span>
                <div className="border border-neutral-200 rounded-lg divide-y divide-neutral-100">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={it.image} alt={it.productName} className="w-10 h-10 rounded object-cover border" />
                        <div>
                          <span className="font-medium text-neutral-900 block">{it.productName}</span>
                          {it.variantTitle && (
                            <span className="text-[11px] text-neutral-500">{it.variantTitle}</span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="tabular-nums font-semibold text-neutral-900">
                          {it.quantity} &times; ${it.price.toFixed(2)}
                        </span>
                        <span className="block text-[11px] text-neutral-500 tabular-nums">
                          Line total: ${(it.quantity * it.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Totals */}
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1.5 text-right">
                <div className="flex justify-between text-neutral-500">
                  <span>Items Subtotal</span>
                  <span className="tabular-nums text-neutral-900">${selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                {selectedOrder.discountTotal > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount Coupon ({selectedOrder.discountCode})</span>
                    <span className="tabular-nums">-${selectedOrder.discountTotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-500">
                  <span>Shipping Fee</span>
                  <span className="tabular-nums text-neutral-900">
                    {selectedOrder.shippingTotal === 0 ? 'FREE' : `$${selectedOrder.shippingTotal.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Sales Tax</span>
                  <span className="tabular-nums text-neutral-900">${selectedOrder.taxTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-neutral-950 pt-2 border-t border-neutral-200">
                  <span>Final Charged Total</span>
                  <span className="tabular-nums">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
