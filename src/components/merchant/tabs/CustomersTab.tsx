import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { Customer } from '../../../types/ecommerce';
import { Search, Plus, Mail, Phone, MapPin, User, X } from 'lucide-react';

export const CustomersTab: React.FC = () => {
  const { customers, orders, addCustomer, storeSettings } = useStore();
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Customer Form State
  const [newCust, setNewCust] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    country: 'United States',
    tag: 'New' as 'VIP' | 'Repeat' | 'New' | 'Wholesale',
    notes: '',
  });

  const filteredCustomers = customers.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.tag.toLowerCase().includes(q)
    );
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCust.name.trim() || !newCust.email.trim()) return;

    addCustomer(newCust);
    setIsAddModalOpen(false);
    setNewCust({
      name: '',
      email: '',
      phone: '',
      city: '',
      country: 'United States',
      tag: 'New',
      notes: '',
    });
  };

  const customerOrders = selectedCustomer
    ? orders.filter(
        (o) => o.customer.email.toLowerCase() === selectedCustomer.email.toLowerCase()
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Customer Profiles & CRM</h2>
          <p className="text-xs text-neutral-500">
            Nurture repeat collectors, monitor lifetime spend, and log client preferences.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-medium flex items-center gap-1.5 self-start sm:self-auto transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Customer Record</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Search by customer name, email, or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs pl-8 pr-4 py-2 bg-white border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900"
        />
        <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
      </div>

      {/* Table */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 font-medium border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Segment</th>
                <th className="py-3 px-4 text-center">Orders Placed</th>
                <th className="py-3 px-4 text-right">Lifetime Spend</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-neutral-900 block">{c.name}</span>
                    <span className="text-[11px] text-neutral-400">{c.email}</span>
                  </td>

                  <td className="py-3 px-4 text-neutral-600">
                    {c.city}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        c.tag === 'VIP'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : c.tag === 'Repeat'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : c.tag === 'Wholesale'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {c.tag}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center font-semibold text-neutral-900 tabular-nums">
                    {c.totalOrders}
                  </td>

                  <td className="py-3 px-4 text-right font-bold text-neutral-900 tabular-nums">
                    {storeSettings.currencySymbol}{c.totalSpent.toFixed(2)}
                  </td>

                  <td className="py-3 px-4 text-neutral-500">
                    {c.lastOrderDate}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(c)}
                      className="px-2.5 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded font-medium transition-colors"
                    >
                      Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <div
          className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-xs"
          >
            <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <h3 className="font-semibold text-neutral-900 text-sm sm:text-base">
                Customer Dossier: {selectedCustomer.name}
              </h3>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-5">
              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-neutral-50 rounded-lg border">
                  <span className="text-neutral-500 block text-[11px]">Lifetime Spend</span>
                  <span className="text-base font-bold text-neutral-900 tabular-nums">
                    ${selectedCustomer.totalSpent.toFixed(2)}
                  </span>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg border">
                  <span className="text-neutral-500 block text-[11px]">Total Orders</span>
                  <span className="text-base font-bold text-neutral-900 tabular-nums">
                    {selectedCustomer.totalOrders}
                  </span>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg border">
                  <span className="text-neutral-500 block text-[11px]">Segment</span>
                  <span className="text-base font-bold text-amber-700">
                    {selectedCustomer.tag}
                  </span>
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-2 border-t border-neutral-200 pt-4">
                <div className="flex items-center gap-2 text-neutral-700">
                  <Mail className="w-4 h-4 text-neutral-400" />
                  <span>{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-700">
                  <Phone className="w-4 h-4 text-neutral-400" />
                  <span>{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-700">
                  <MapPin className="w-4 h-4 text-neutral-400" />
                  <span>{selectedCustomer.city}, {selectedCustomer.country}</span>
                </div>
              </div>

              {/* Notes */}
              {selectedCustomer.notes && (
                <div className="p-3 bg-amber-50/60 rounded border border-amber-200/80 text-amber-900">
                  <strong className="block mb-0.5 font-semibold">Merchant Notes:</strong>
                  <p>{selectedCustomer.notes}</p>
                </div>
              )}

              {/* Order History */}
              <div className="space-y-2 pt-2 border-t border-neutral-200">
                <span className="font-semibold text-neutral-900 block">Past Order History:</span>
                {customerOrders.length > 0 ? (
                  <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-lg overflow-hidden">
                    {customerOrders.map((o) => (
                      <div key={o.id} className="p-2.5 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-mono font-medium text-neutral-900">{o.orderNumber}</span>
                          <span className="text-neutral-400 ml-2">
                            {new Date(o.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-neutral-900 tabular-nums">
                            ${o.total.toFixed(2)}
                          </span>
                          <span className="ml-2 uppercase text-[10px] text-neutral-500 font-semibold">
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-500 italic">No previous orders recorded for this email.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden my-auto p-6 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="font-semibold text-neutral-900 text-sm">Create New Customer Record</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="font-medium text-neutral-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newCust.name}
                  onChange={(e) => setNewCust({ ...newCust, name: e.target.value })}
                  className="w-full p-2 border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="font-medium text-neutral-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newCust.email}
                  onChange={(e) => setNewCust({ ...newCust, email: e.target.value })}
                  className="w-full p-2 border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newCust.phone}
                    onChange={(e) => setNewCust({ ...newCust, phone: e.target.value })}
                    className="w-full p-2 border border-neutral-300 rounded"
                  />
                </div>
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">City, State</label>
                  <input
                    type="text"
                    value={newCust.city}
                    onChange={(e) => setNewCust({ ...newCust, city: e.target.value })}
                    className="w-full p-2 border border-neutral-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-neutral-700 block mb-1">Segment Tag</label>
                <select
                  value={newCust.tag}
                  onChange={(e: any) => setNewCust({ ...newCust, tag: e.target.value })}
                  className="w-full p-2 border border-neutral-300 rounded bg-white"
                >
                  <option value="New">New Customer</option>
                  <option value="Repeat">Repeat Buyer</option>
                  <option value="VIP">VIP Collector</option>
                  <option value="Wholesale">Wholesale Client</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-neutral-700 block mb-1">Studio Notes</label>
                <textarea
                  rows={2}
                  value={newCust.notes}
                  onChange={(e) => setNewCust({ ...newCust, notes: e.target.value })}
                  className="w-full p-2 border border-neutral-300 rounded"
                  placeholder="e.g. Inquired about custom pottery commissions"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 text-white rounded font-medium hover:bg-neutral-800"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
