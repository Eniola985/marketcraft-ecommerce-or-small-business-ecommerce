import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, Search, X } from 'lucide-react';

interface StorefrontHeaderProps {
  onSelectCategory: (catId: string) => void;
  activeCategory: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const StorefrontHeader: React.FC<StorefrontHeaderProps> = ({
  onSelectCategory,
  activeCategory,
  searchQuery,
  setSearchQuery,
}) => {
  const { storeSettings, cartCount, setIsCartOpen } = useStore();
  const [showSearch, setShowSearch] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  return (
    <header className="w-full bg-white border-b border-neutral-200 sticky top-12 z-40 transition-all">
      {/* Optional Slim Announcement Banner */}
      {storeSettings.announcementBar.enabled && !announcementDismissed && (
        <div className="bg-neutral-900 text-neutral-200 px-4 py-1.5 text-xs text-center relative font-medium flex items-center justify-center">
          <span>{storeSettings.announcementBar.text}</span>
          <button
            onClick={() => setAnnouncementDismissed(true)}
            className="absolute right-4 text-neutral-400 hover:text-white p-0.5"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Bar Contract: Zone 1 (Brand) — Zone 2 (4-6 Nav Links) — Zone 3 (Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            onSelectCategory('all');
            setSearchQuery('');
          }}
          className="text-xl sm:text-2xl font-serif font-semibold tracking-tight text-neutral-950 text-left hover:opacity-90 transition-opacity"
        >
          {storeSettings.storeName}
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600">
          <button
            onClick={() => onSelectCategory('all')}
            className={`transition-colors hover:text-neutral-950 ${
              activeCategory === 'all' && !searchQuery ? 'text-neutral-950 font-semibold border-b-2 border-neutral-950 pb-0.5' : ''
            }`}
          >
            All Goods
          </button>
          <button
            onClick={() => onSelectCategory('ceramics')}
            className={`transition-colors hover:text-neutral-950 ${
              activeCategory === 'ceramics' ? 'text-neutral-950 font-semibold border-b-2 border-neutral-950 pb-0.5' : ''
            }`}
          >
            Ceramics
          </button>
          <button
            onClick={() => onSelectCategory('textiles')}
            className={`transition-colors hover:text-neutral-950 ${
              activeCategory === 'textiles' ? 'text-neutral-950 font-semibold border-b-2 border-neutral-950 pb-0.5' : ''
            }`}
          >
            Textiles
          </button>
          <button
            onClick={() => onSelectCategory('apothecary')}
            className={`transition-colors hover:text-neutral-950 ${
              activeCategory === 'apothecary' ? 'text-neutral-950 font-semibold border-b-2 border-neutral-950 pb-0.5' : ''
            }`}
          >
            Apothecary
          </button>
          <button
            onClick={() => onSelectCategory('stationery')}
            className={`transition-colors hover:text-neutral-950 ${
              activeCategory === 'stationery' ? 'text-neutral-950 font-semibold border-b-2 border-neutral-950 pb-0.5' : ''
            }`}
          >
            Stationery
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Search & Cart Drawer trigger) */}
        <div className="flex items-center gap-3">
          {showSearch ? (
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                autoFocus
                className="w-40 sm:w-56 pl-8 pr-7 py-1.5 text-xs bg-neutral-100 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5" />
              <button
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery('');
                }}
                className="absolute right-2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-full transition-colors"
              aria-label="Open search"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-neutral-900 text-white rounded-md text-xs font-medium hover:bg-neutral-800 transition-colors whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            <span className="tabular-nums font-semibold bg-neutral-800 text-neutral-100 px-1.5 py-0.5 rounded text-[11px]">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
