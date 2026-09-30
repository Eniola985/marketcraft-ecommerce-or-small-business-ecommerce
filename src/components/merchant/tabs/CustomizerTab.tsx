import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { Palette, Check, Store, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const CustomizerTab: React.FC = () => {
  const { storeSettings, updateStoreSettings, setActiveView } = useStore();

  const [formData, setFormData] = useState({ ...storeSettings });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Storefront Theme & Branding</h2>
          <p className="text-xs text-neutral-500">
            Customize boutique identity, hero banners, shipping thresholds, and studio policies.
          </p>
        </div>

        <button
          onClick={() => setActiveView('storefront')}
          className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-800 rounded-md text-xs font-medium flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <Store className="w-3.5 h-3.5 text-neutral-600" />
          <span>Preview Live Changes</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Brand & Studio Identity */}
        <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-4">
          <h3 className="text-sm font-semibold text-neutral-900 border-b border-neutral-100 pb-2">
            1. Brand Identity & Contact
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-neutral-700 block mb-1">Store / Studio Name *</label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full p-2.5 border border-neutral-300 rounded font-serif text-sm font-bold text-neutral-900"
              />
            </div>

            <div>
              <label className="font-medium text-neutral-700 block mb-1">Studio Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full p-2.5 border border-neutral-300 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-medium text-neutral-700 block mb-1">Contact Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full p-2.5 border border-neutral-300 rounded"
              />
            </div>

            <div>
              <label className="font-medium text-neutral-700 block mb-1">Studio Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 border border-neutral-300 rounded"
              />
            </div>

            <div>
              <label className="font-medium text-neutral-700 block mb-1">Workshop Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2.5 border border-neutral-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Hero Section & Top Announcement */}
        <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-4">
          <h3 className="text-sm font-semibold text-neutral-900 border-b border-neutral-100 pb-2">
            2. Hero Banner & Announcement Bar
          </h3>

          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-neutral-800 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.announcementBar.enabled}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      announcementBar: {
                        ...formData.announcementBar,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                />
                <span>Enable Top Announcement Banner</span>
              </label>
              <span className="text-[11px] text-neutral-500">Displays at top of storefront</span>
            </div>

            {formData.announcementBar.enabled && (
              <input
                type="text"
                value={formData.announcementBar.text}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    announcementBar: {
                      ...formData.announcementBar,
                      text: e.target.value,
                    },
                  })
                }
                className="w-full p-2 bg-white border border-neutral-300 rounded"
              />
            )}
          </div>

          <div>
            <label className="font-medium text-neutral-700 block mb-1">Hero Main Headline</label>
            <input
              type="text"
              value={formData.heroTitle}
              onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
              className="w-full p-2.5 border border-neutral-300 rounded font-serif text-sm font-medium"
            />
          </div>

          <div>
            <label className="font-medium text-neutral-700 block mb-1">Hero Subtitle Story</label>
            <textarea
              rows={2}
              value={formData.heroSubtitle}
              onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
              className="w-full p-2.5 border border-neutral-300 rounded"
            />
          </div>
        </div>

        {/* Shipping, Taxes & Currency Economics */}
        <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-4">
          <h3 className="text-sm font-semibold text-neutral-900 border-b border-neutral-100 pb-2">
            3. Shipping Rates & Tax Policy
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="font-medium text-neutral-700 block mb-1">Currency Symbol</label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                className="w-full p-2.5 border border-neutral-300 rounded text-center font-bold"
              />
            </div>

            <div>
              <label className="font-medium text-neutral-700 block mb-1">Sales Tax Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={(formData.taxRate * 100).toFixed(0)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    taxRate: (parseFloat(e.target.value) || 0) / 100,
                  })
                }
                className="w-full p-2.5 border border-neutral-300 rounded tabular-nums"
              />
            </div>

            <div>
              <label className="font-medium text-neutral-700 block mb-1">Free Ship Threshold ($)</label>
              <input
                type="number"
                value={formData.freeShippingThreshold}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    freeShippingThreshold: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full p-2.5 border border-neutral-300 rounded tabular-nums"
              />
            </div>

            <div>
              <label className="font-medium text-neutral-700 block mb-1">Standard Ship Fee ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.standardShippingFee}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    standardShippingFee: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full p-2.5 border border-neutral-300 rounded tabular-nums"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-neutral-800">
              <input
                type="checkbox"
                checked={formData.pickupEnabled}
                onChange={(e) => setFormData({ ...formData, pickupEnabled: e.target.checked })}
                className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
              />
              <span>Enable Local Studio Curbside Pickup (Free)</span>
            </label>
          </div>
        </div>

        {/* Studio Policies */}
        <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-4">
          <h3 className="text-sm font-semibold text-neutral-900 border-b border-neutral-100 pb-2">
            4. Studio Customer Policies
          </h3>

          <div>
            <label className="font-medium text-neutral-700 block mb-1">Shipping & Packaging Guarantee</label>
            <textarea
              rows={2}
              value={formData.policies.shipping}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  policies: { ...formData.policies, shipping: e.target.value },
                })
              }
              className="w-full p-2.5 border border-neutral-300 rounded"
            />
          </div>

          <div>
            <label className="font-medium text-neutral-700 block mb-1">30-Day Returns & Exchanges Policy</label>
            <textarea
              rows={2}
              value={formData.policies.returns}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  policies: { ...formData.policies, returns: e.target.value },
                })
              }
              className="w-full p-2.5 border border-neutral-300 rounded"
            />
          </div>
        </div>

        {/* Submit & Status Bar */}
        <div className="flex items-center justify-between pt-2">
          {saveSuccess ? (
            <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Theme and store settings updated successfully!</span>
            </span>
          ) : (
            <span className="text-neutral-500">Changes apply instantaneously across customer storefront.</span>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 bg-neutral-900 text-white rounded-md font-medium hover:bg-neutral-800 transition-colors shadow-sm"
          >
            Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
};
