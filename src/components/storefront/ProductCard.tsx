import React from 'react';
import { Product } from '../../types/ecommerce';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, Star, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { addToCart, storeSettings } = useStore();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock <= 0) return;

    // Pick first variant if present
    const firstVariant = product.variants?.[0];
    addToCart(
      {
        productId: product.id,
        variantId: firstVariant?.id,
        variantTitle: firstVariant?.name,
        name: product.name,
        price: firstVariant ? firstVariant.price : product.price,
        image: product.images[0],
        maxStock: firstVariant ? firstVariant.stock : product.stock,
      },
      1
    );
  };

  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
  const isOutOfStock = product.stock <= 0;

  return (
    <article
      onClick={() => onOpenDetails(product)}
      className="group flex flex-col bg-white border border-neutral-200/80 rounded-lg overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
    >
      {/* Product Image Stage (65-75% visual weight) */}
      <div className="relative aspect-[4/3] w-full bg-neutral-100 overflow-hidden">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 bg-neutral-100">
            <ShoppingBag className="w-8 h-8 stroke-1 mb-1" />
            <span className="text-xs">No image available</span>
          </div>
        )}

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3 gap-2">
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className="w-full py-2 px-3 bg-white text-neutral-900 font-medium text-xs rounded shadow-md hover:bg-neutral-900 hover:text-white transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Sold Out' : 'Quick Add'}</span>
          </button>
        </div>

        {/* Quiet Status Text (No pill sandwich) */}
        {isOutOfStock ? (
          <span className="absolute top-2.5 left-2.5 text-[11px] font-semibold tracking-wide text-neutral-500 uppercase bg-white/95 px-2 py-0.5 rounded">
            Sold Out
          </span>
        ) : isLowStock ? (
          <span className="absolute top-2.5 left-2.5 text-[11px] font-medium tracking-wide text-amber-700 bg-amber-50/95 border border-amber-200/60 px-2 py-0.5 rounded">
            Only {product.stock} left
          </span>
        ) : product.compareAtPrice ? (
          <span className="absolute top-2.5 left-2.5 text-[11px] font-medium tracking-wide text-rose-700 bg-rose-50/95 border border-rose-200/60 px-2 py-0.5 rounded">
            Special Run
          </span>
        ) : null}
      </div>

      {/* Card Content & Hierarchy */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Metadata line: Category · Rating */}
          <div className="flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-wider mb-1">
            <span className="truncate">{product.category}</span>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1 text-neutral-700 normal-case font-medium">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="tabular-nums">{product.rating.toFixed(1)}</span>
              <span className="text-neutral-400 text-[11px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-semibold text-neutral-900 text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-amber-800 transition-colors">
            {product.name}
          </h3>

          {/* Brief Snippet */}
          <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing Baseline with Tabular Figures */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold text-neutral-950 tabular-nums">
              {storeSettings.currencySymbol}
              {product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-neutral-400 line-through tabular-nums">
                {storeSettings.currencySymbol}
                {product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          <span className="text-[11px] text-neutral-500 flex items-center gap-1 hover:text-neutral-900">
            Details
            <Eye className="w-3 h-3" />
          </span>
        </div>
      </div>
    </article>
  );
};
