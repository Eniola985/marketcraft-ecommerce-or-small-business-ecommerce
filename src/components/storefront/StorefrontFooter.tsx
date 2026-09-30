import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Mail, Check, ShieldCheck, Heart, LayoutDashboard, X } from 'lucide-react';

export const StorefrontFooter: React.FC = () => {
  const { storeSettings, setActiveView } = useStore();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activePolicyModal, setActivePolicyModal] = useState<'shipping' | 'returns' | 'privacy' | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubscribed(true);
    setEmailInput('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="w-full bg-neutral-950 text-neutral-300 border-t border-neutral-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-neutral-800">
          {/* Col 1: Brand & Philosophy */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xl font-serif font-bold text-white tracking-tight">
              {storeSettings.storeName}
            </h3>
            <p className="text-neutral-400 max-w-sm leading-relaxed text-xs">
              {storeSettings.tagline} We partner directly with independent ceramicists, weavers, and herbalists to craft durable objects for quiet everyday rituals.
            </p>
            <div className="text-[11px] text-neutral-400 space-y-0.5 pt-2">
              <p>Studio: {storeSettings.address}</p>
              <p>Contact: {storeSettings.contactEmail} · {storeSettings.phone}</p>
            </div>
          </div>

          {/* Col 2: Studio Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Studio Policies
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button
                  onClick={() => setActivePolicyModal('shipping')}
                  className="hover:text-white transition-colors"
                >
                  Carbon-Neutral Shipping & Packaging
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicyModal('returns')}
                  className="hover:text-white transition-colors"
                >
                  30-Day Craft Guarantee & Returns
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicyModal('privacy')}
                  className="hover:text-white transition-colors"
                >
                  Privacy & Data Stewardship
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('merchant')}
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors pt-1"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Merchant Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Newsletter & Batch Dispatch */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Studio Gazette
            </h4>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Early notice when new ceramic kilns are unloaded and seasonal apothecary batches are poured.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-1.5">
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-white text-neutral-950 font-medium rounded hover:bg-neutral-200 transition-colors shrink-0"
                >
                  Join
                </button>
              </div>

              {subscribed && (
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Welcome! You will receive our seasonal release bulletin.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Quiet Sub-Footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <p>
            &copy; {new Date().getFullYear()} {storeSettings.storeName}. All rights reserved. Powered by MarketCraft Small Business Platform.
          </p>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>Handmade with care</span>
            <span aria-hidden="true">·</span>
            <span>Plastic-Free Delivery</span>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      {activePolicyModal && (
        <div
          className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActivePolicyModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-neutral-900 max-w-lg w-full rounded-xl p-6 shadow-2xl relative space-y-4"
          >
            <button
              onClick={() => setActivePolicyModal(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-serif font-bold capitalize">
              {activePolicyModal === 'shipping' && 'Shipping & Eco-Packaging Policy'}
              {activePolicyModal === 'returns' && '30-Day Studio Return Policy'}
              {activePolicyModal === 'privacy' && 'Customer Privacy & Data Policy'}
            </h3>

            <p className="text-xs text-neutral-600 leading-relaxed whitespace-pre-line">
              {storeSettings.policies[activePolicyModal]}
            </p>

            <div className="pt-2 text-right">
              <button
                onClick={() => setActivePolicyModal(null)}
                className="px-4 py-2 bg-neutral-900 text-white rounded text-xs font-medium hover:bg-neutral-800"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
