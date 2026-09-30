import React, { useState } from 'react';
import { Product, ProductVariant } from '../../types/ecommerce';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Package,
  Plus,
  Minus,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, storeSettings, reviews, addReview } = useStore();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product?.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  if (!product) return null;

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = currentStock <= 0;

  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(
      {
        productId: product.id,
        variantId: selectedVariant?.id,
        variantTitle: selectedVariant?.name,
        name: product.name,
        price: currentPrice,
        image: product.images[0],
        maxStock: currentStock,
      },
      quantity
    );
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    addReview({
      productId: product.id,
      author: reviewAuthor.trim(),
      rating: reviewRating,
      title: reviewTitle.trim() || 'Verified Purchase Review',
      comment: reviewComment.trim(),
      verified: true,
    });

    setReviewSuccess(true);
    setReviewAuthor('');
    setReviewTitle('');
    setReviewComment('');
    setTimeout(() => {
      setReviewSuccess(false);
      setShowReviewForm(false);
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-neutral-500 hover:text-neutral-900 bg-white/80 hover:bg-white rounded-full transition-colors shadow-xs"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-8">
          {/* Top Gallery & Contiguous Purchase Module */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Gallery Left */}
            <div className="space-y-3">
              <div className="aspect-[4/3] bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200/80">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-600 pt-2">
                <div className="flex items-center gap-2 p-2 bg-neutral-50 rounded border border-neutral-200/60">
                  <Truck className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
                  <span>Ships in plastic-free packaging</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-neutral-50 rounded border border-neutral-200/60">
                  <RotateCcw className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
                  <span>30-Day returns & exchanges</span>
                </div>
              </div>
            </div>

            {/* Contiguous Purchase Module Right */}
            <div className="flex flex-col justify-between space-y-5">
              <div>
                {/* Category & Rating */}
                <div className="flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-wider mb-2">
                  <span>{product.category}</span>
                  <span aria-hidden="true">·</span>
                  <div className="flex items-center gap-1 text-neutral-800 normal-case font-medium">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="tabular-nums">{product.rating.toFixed(1)}</span>
                    <span className="text-neutral-400">({product.reviewCount} reviews)</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 leading-tight">
                  {product.name}
                </h2>

                {/* Pricing with Tabular Figures */}
                <div className="flex items-baseline gap-3 mt-3">
                  <span className="text-2xl font-bold text-neutral-950 tabular-nums">
                    {storeSettings.currencySymbol}
                    {currentPrice.toFixed(2)}
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > currentPrice && (
                    <span className="text-sm text-neutral-400 line-through tabular-nums">
                      {storeSettings.currencySymbol}
                      {product.compareAtPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-xs text-neutral-500">
                    Tax included · Free shipping over ${storeSettings.freeShippingThreshold}
                  </span>
                </div>
              </div>

              {/* Description Prose */}
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {product.description}
              </p>

              {/* Variant Selector (if variants exist) */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-neutral-200">
                  <span className="text-xs font-semibold text-neutral-800 block">
                    Select Option / Edition:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => {
                          setSelectedVariant(v);
                          setQuantity(1);
                        }}
                        className={`p-2.5 text-xs text-left rounded border transition-all ${
                          selectedVariant?.id === v.id
                            ? 'border-neutral-950 bg-neutral-950 text-white font-medium shadow-xs'
                            : 'border-neutral-300 bg-white text-neutral-800 hover:border-neutral-400'
                        }`}
                      >
                        <span className="block font-medium truncate">{v.name}</span>
                        <span className="text-[11px] opacity-80 tabular-nums">
                          {storeSettings.currencySymbol}
                          {v.price.toFixed(2)} · {v.stock > 0 ? `${v.stock} in stock` : 'Sold out'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Indicator */}
              <div className="text-xs">
                {isOutOfStock ? (
                  <span className="text-neutral-500 font-medium">Currently Sold Out</span>
                ) : currentStock <= product.lowStockThreshold ? (
                  <span className="text-amber-700 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    Low stock: Only {currentStock} units remaining
                  </span>
                ) : (
                  <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    In stock, ready to dispatch from studio
                  </span>
                )}
              </div>

              {/* Quantity Stepper & Add to Bag CTA */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center border border-neutral-300 rounded-md bg-neutral-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-2.5 text-neutral-600 hover:text-neutral-950 disabled:opacity-30"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-semibold tabular-nums text-neutral-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                    disabled={quantity >= currentStock || isOutOfStock}
                    className="p-2.5 text-neutral-600 hover:text-neutral-950 disabled:opacity-30"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3 px-6 rounded-md font-medium text-xs tracking-wide transition-all flex items-center justify-center gap-2 ${
                    addedAnimation
                      ? 'bg-emerald-600 text-white'
                      : isOutOfStock
                      ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                      : 'bg-neutral-950 text-white hover:bg-neutral-800 shadow-md'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Technical / Studio Specifications */}
              <div className="pt-4 border-t border-neutral-200 text-xs text-neutral-500 space-y-1">
                {product.origin && (
                  <p>
                    <span className="font-medium text-neutral-800">Studio Origin:</span> {product.origin}
                  </p>
                )}
                {product.weight && (
                  <p>
                    <span className="font-medium text-neutral-800">Item Weight:</span> {product.weight}
                  </p>
                )}
                <p>
                  <span className="font-medium text-neutral-800">SKU:</span> {selectedVariant ? selectedVariant.sku : product.sku}
                </p>
              </div>
            </div>
          </div>

          {/* Social Proof & Customer Reviews Section */}
          <div className="pt-8 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-neutral-900">
                  Customer Reviews
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Real feedback from collectors and everyday users
                </p>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-3 py-1.5 text-xs font-medium text-neutral-800 border border-neutral-300 rounded hover:bg-neutral-50 transition-colors"
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            </div>

            {/* Write Review Form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="mb-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-800">Submit Your Experience</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-0.5 text-neutral-300 hover:text-amber-400"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Name (e.g. Maya R.)"
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                  <input
                    type="text"
                    placeholder="Review Headline (optional)"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <textarea
                  required
                  rows={3}
                  placeholder="Share details about the craftsmanship, feel, or everyday use..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />

                <div className="flex items-center justify-between">
                  {reviewSuccess ? (
                    <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Thank you! Your review was published.
                    </span>
                  ) : <span />}

                  <button
                    type="submit"
                    className="px-4 py-2 bg-neutral-900 text-white rounded text-xs font-medium hover:bg-neutral-800 transition-colors"
                  >
                    Post Review
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            {productReviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {productReviews.map((r) => (
                  <div key={r.id} className="p-4 bg-neutral-50/70 border border-neutral-200/70 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-neutral-800">{r.title}</span>
                      </div>
                      <span className="text-[11px] text-neutral-400">{r.date}</span>
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed">{r.comment}</p>

                    <div className="text-[11px] text-neutral-500 flex items-center gap-1">
                      <span>{r.author}</span>
                      {r.verified && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-700 font-medium">Verified Collector</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-500 italic py-4">
                Be the first to leave a review for this piece!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
