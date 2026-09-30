import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowDown, Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

interface StorefrontHeroProps {
  onExploreClick: () => void;
}

export const StorefrontHero: React.FC<StorefrontHeroProps> = ({ onExploreClick }) => {
  const { storeSettings } = useStore();

  return (
    <section className="relative w-full overflow-hidden bg-neutral-900 text-white">
      {/* Background Image with Scrim */}
      <div className="relative h-[440px] sm:h-[500px] w-full">
        <img
          src={storeSettings.heroImage}
          alt={storeSettings.storeName}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center brightness-90 filter"
        />
        {/* Measured Scrim for WCAG AA 4.5:1 Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/20" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
            <div className="max-w-2xl space-y-4">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-medium">
                Independent Artisan Studio & Craft Guild
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight text-balance">
                {storeSettings.heroTitle}
              </h1>

              <p className="text-sm sm:text-base text-neutral-200 leading-relaxed max-w-xl">
                {storeSettings.heroSubtitle}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={onExploreClick}
                  className="px-6 py-3 bg-white text-neutral-950 rounded-md font-medium text-xs tracking-wide hover:bg-neutral-100 transition-all flex items-center gap-2 shadow-lg"
                >
                  <span>Explore the Collection</span>
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                <div className="text-xs text-neutral-300 flex items-center gap-2">
                  <span>Standard dispatch within 24h</span>
                  <span aria-hidden="true">·</span>
                  <span>Free shipping over ${storeSettings.freeShippingThreshold}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Craft Adjacency Bar (Clean unboxed text) */}
      <div className="border-t border-neutral-800 bg-neutral-950/95 py-3.5 px-4 sm:px-6 text-xs text-neutral-300">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-semibold text-white block">Handcrafted in Batches</span>
              <span className="text-[11px] text-neutral-400">Zero mass assembly lines</span>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="font-semibold text-white block">100% Honest Materials</span>
              <span className="text-[11px] text-neutral-400">Pure flax, stoneware, beeswax</span>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <Truck className="w-4 h-4 text-sky-400 shrink-0" />
            <div>
              <span className="font-semibold text-white block">Carbon-Neutral Freight</span>
              <span className="text-[11px] text-neutral-400">100% recyclable kraft packaging</span>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <RefreshCw className="w-4 h-4 text-amber-300 shrink-0" />
            <div>
              <span className="font-semibold text-white block">30-Day Studio Guarantee</span>
              <span className="text-[11px] text-neutral-400">Hassle-free exchanges</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
