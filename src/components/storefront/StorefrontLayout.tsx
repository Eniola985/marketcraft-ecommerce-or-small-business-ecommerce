import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { StorefrontHeader } from './StorefrontHeader';
import { StorefrontHero } from './StorefrontHero';
import { ProductGrid } from './ProductGrid';
import { ProductDetailModal } from './ProductDetailModal';
import { CartDrawer } from './CartDrawer';
import { CheckoutModal } from './CheckoutModal';
import { StorefrontFooter } from './StorefrontFooter';
import { Product } from '../../types/ecommerce';

export const StorefrontLayout: React.FC = () => {
  const { products, selectedProductId, setSelectedProductId } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedProduct = products.find((p) => p.id === selectedProductId) || null;

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-between selection:bg-neutral-900 selection:text-white">
      <div>
        {/* Header */}
        <StorefrontHeader
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          activeCategory={selectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Hero Banner */}
        <StorefrontHero onExploreClick={scrollToCatalog} />

        {/* Catalog Grid */}
        <ProductGrid
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenDetails={(prod: Product) => setSelectedProductId(prod.id)}
        />
      </div>

      {/* Footer */}
      <StorefrontFooter />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProductId(null)}
      />

      {/* Cart Slide-Over Drawer */}
      <CartDrawer />

      {/* Checkout Modal & Confirmation */}
      <CheckoutModal />
    </div>
  );
};
