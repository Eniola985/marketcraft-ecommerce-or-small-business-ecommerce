import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { Discount } from '../../../types/ecommerce';
import { Tag, Plus, Trash2, Check, X, Sparkles, Copy } from 'lucide-react';

export const DiscountsTab: React.FC = () => {
  const { discounts, addDiscount, toggleDiscount, deleteDiscount, storeSettings } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form
  const [newDisc, setNewDisc] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 15,
    minSpend: 50.0,
    maxUses: 100,
    description: '',
    expiresAt: '',
    active: true,
  });

  const handleGenerateCode = () => {
    const prefixes = ['ARTISAN', 'STUDIO', 'CRAFT', 'SPRING', 'MAKERS', 'SPECIAL'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = [10, 15, 20, 25][Math.floor(Math.random() * 4)];
    setNewDisc({
      ...newDisc,
      code: `${randomPrefix}${randomNum}`,
      value: randomNum,
      description: `${randomNum}% off for seasonal promotion`,
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDisc.code.trim()) return;

    addDiscount({
      code: newDisc.code.toUpperCase().trim(),
      type: newDisc.type,
      value: Number(newDisc.value),
      minSpend: Number(newDisc.minSpend),
      maxUses: newDisc.maxUses ? Number(newDisc.maxUses) : undefined,
      description: newDisc.description.trim() || `${newDisc.value}% off promo code`,
      expiresAt: newDisc.expiresAt || undefined,
      active: true,
    });

    setIsAddModalOpen(false);
    setNewDisc({
      code: '',
      type: 'percentage',
      value: 15,
      minSpend: 50.0,
      maxUses: 100,
      description: '',
      expiresAt: '',
      active: true,
    });
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Promotions & Discount Codes</h2>
          <p className="text-xs text-neutral-500">
            Create coupon incentives for newsletters, pop-up events, and VIP client loyalty.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-medium flex items-center gap-1.5 self-start sm:self-auto transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Promo Code</span>
        </button>
      </div>

      {/* Discount Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {discounts.map((d) => (
          <div
            key={d.id}
            className={`p-5 rounded-lg border transition-all bg-white flex flex-col justify-between gap-4 ${
              d.active ? 'border-neutral-200 shadow-xs' : 'border-neutral-200/60 opacity-60 bg-neutral-50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm tracking-wide bg-neutral-100 text-neutral-900 px-2 py-1 rounded border border-neutral-300">
                    {d.code}
                  </span>
                  <button
                    onClick={() => copyToClipboard(d.code)}
                    className="text-neutral-400 hover:text-neutral-700 p-1"
                    title="Copy promo code"
                  >
                    {copiedCode === d.code ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <button
                  onClick={() => toggleDiscount(d.id)}
                  className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                    d.active
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {d.active ? 'Active' : 'Disabled'}
                </button>
              </div>

              <div className="text-xl font-bold text-neutral-950 tabular-nums">
                {d.type === 'percentage' ? `${d.value}% OFF` : `$${d.value}.00 OFF`}
              </div>

              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                {d.description}
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
              <div>
                <span className="block">
                  Min spend: <strong className="text-neutral-800 tabular-nums">${d.minSpend}</strong>
                </span>
                <span className="text-[11px]">
                  Redeemed <strong className="text-neutral-800 tabular-nums">{d.usedCount}</strong> times
                </span>
              </div>

              <button
                onClick={() => deleteDiscount(d.id)}
                className="text-neutral-400 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition-colors"
                title="Delete Discount"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="font-semibold text-neutral-900 text-sm">Create New Promo Code</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-medium text-neutral-700">Coupon Code *</label>
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    className="text-amber-700 hover:text-amber-900 flex items-center gap-1 font-semibold text-[11px]"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-Suggest Code</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. SPRING15"
                  value={newDisc.code}
                  onChange={(e) => setNewDisc({ ...newDisc, code: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 border border-neutral-300 rounded font-mono uppercase font-bold text-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Discount Type</label>
                  <select
                    value={newDisc.type}
                    onChange={(e: any) => setNewDisc({ ...newDisc, type: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newDisc.value}
                    onChange={(e) => setNewDisc({ ...newDisc, value: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 border border-neutral-300 rounded tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Minimum Spend ($)</label>
                  <input
                    type="number"
                    min={0}
                    value={newDisc.minSpend}
                    onChange={(e) => setNewDisc({ ...newDisc, minSpend: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 border border-neutral-300 rounded tabular-nums"
                  />
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Max Redemptions</label>
                  <input
                    type="number"
                    min={1}
                    value={newDisc.maxUses || ''}
                    onChange={(e) => setNewDisc({ ...newDisc, maxUses: parseInt(e.target.value) || 0 })}
                    placeholder="Unlimited"
                    className="w-full p-2.5 border border-neutral-300 rounded tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-neutral-700 block mb-1">Promo Description</label>
                <input
                  type="text"
                  placeholder="e.g. 15% off orders over $50 for craft market visitors"
                  value={newDisc.description}
                  onChange={(e) => setNewDisc({ ...newDisc, description: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded"
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
                  className="px-5 py-2 bg-neutral-900 text-white rounded font-medium hover:bg-neutral-800"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
