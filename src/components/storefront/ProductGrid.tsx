import React, { useState, useMemo } from 'react';
import { Product } from '../../types/ecommerce';
import { INITIAL_CATEGORIES } from '../../data/initialData';
import { ProductCard } from './ProductCard';
import { Filter, SlidersHorizontal, Search, RefreshCw } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenDetails: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
  onOpenDetails,
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesTags = p.tags.some((t) => t.toLowerCase().includes(query));
        const matchesSku = p.sku.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesTags && !matchesSku) {
          return false;
        }
      }
      // In-stock only
      if (inStockOnly && p.stock <= 0) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });
  }, [products, selectedCategory, searchQuery, inStockOnly, sortBy]);

  return (
    <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Section Header with Category Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-200">
        <div>
          <span className="text-xs uppercase tracking-widest text-neutral-500 font-medium">
            Curated Small-Batch Goods
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 mt-1">
            Studio Collection
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} crafted for long-lasting enjoyment.
          </p>
        </div>

        {/* Category Filter Tabs (Interactive segmented buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {INITIAL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/80'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Control Bar: In Stock Toggle, Sort, Search Status */}
      <div className="py-4 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-600">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 w-3.5 h-3.5"
            />
            <span className="font-medium">In-Stock Only</span>
          </label>

          {searchQuery && (
            <div className="flex items-center gap-1.5 text-neutral-700 bg-neutral-100 px-2 py-1 rounded">
              <span>Matching &ldquo;{searchQuery}&rdquo;</span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-neutral-400 hover:text-neutral-900 font-bold ml-1"
              >
                &times;
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-neutral-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-white border border-neutral-300 rounded px-2.5 py-1 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900 cursor-pointer"
          >
            <option value="featured">Featured / Curated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest Releases</option>
          </select>
        </div>
      </div>

      {/* Grid or Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center justify-center bg-white border border-neutral-200 rounded-lg p-8">
          <Search className="w-10 h-10 text-neutral-400 stroke-1 mb-3" />
          <h3 className="text-base font-semibold text-neutral-900">No matching goods found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mt-1">
            Try adjusting your search criteria, selecting a different category, or resetting active filters.
          </p>
          <button
            onClick={() => {
              onSelectCategory('all');
              setSearchQuery('');
              setInStockOnly(false);
            }}
            className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded text-xs font-medium hover:bg-neutral-800 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </section>
  );
};
