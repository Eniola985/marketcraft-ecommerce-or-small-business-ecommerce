import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  Check,
  Truck,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQty,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDiscountTotal,
    cartShippingTotal,
    cartTaxTotal,
    cartFinalTotal,
    storeSettings,
    appliedDiscount,
    applyDiscountCode,
    removeDiscountCode,
    setIsCheckoutOpen,
  } = useStore();

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  if (!isCartOpen) return null;

  const freeShippingDelta = Math.max(0, storeSettings.freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(
    100,
    Math.round((cartSubtotal / storeSettings.freeShippingThreshold) * 100)
  );

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;
    const res = applyDiscountCode(promoCodeInput);
    setPromoFeedback({
      message: res.message,
      isError: !res.success,
    });
    if (res.success) {
      setPromoCodeInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950/60 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-neutral-900" />
            <h2 className="font-semibold text-neutral-900 text-sm sm:text-base">
              Your Shopping Bag
            </h2>
            <span className="text-xs text-neutral-500 font-mono">
              ({cart.reduce((s, i) => s + i.quantity, 0)})
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-md transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200 text-xs">
          <div className="flex items-center justify-between mb-1.5 font-medium">
            <div className="flex items-center gap-1.5 text-neutral-800">
              <Truck className="w-3.5 h-3.5 text-amber-600" />
              {freeShippingDelta === 0 ? (
                <span className="text-emerald-700 font-semibold">
                  You unlocked Free Carbon-Neutral Shipping!
                </span>
              ) : (
                <span>
                  Add <strong className="tabular-nums font-bold text-neutral-950">${freeShippingDelta.toFixed(2)}</strong> more for Free Shipping
                </span>
              )}
            </div>
            <span className="tabular-nums text-neutral-500">{freeShippingProgress}%</span>
          </div>
          <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                freeShippingDelta === 0 ? 'bg-emerald-600' : 'bg-neutral-900'
              }`}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Itemized List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-neutral-100">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={`${item.productId}-${item.variantId || 'base'}`} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                {/* Thumbnail */}
                <div className="w-18 h-18 bg-neutral-100 rounded-md overflow-hidden shrink-0 border border-neutral-200/60">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs font-semibold text-neutral-900 leading-snug line-clamp-1">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.productId, item.variantId)}
                        className="text-neutral-400 hover:text-rose-600 p-1 -mr-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.variantTitle && (
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {item.variantTitle}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* Stepper */}
                    <div className="flex items-center border border-neutral-300 rounded bg-neutral-50">
                      <button
                        onClick={() => updateCartQty(item.productId, item.variantId, item.quantity - 1)}
                        className="p-1 text-neutral-600 hover:text-neutral-900"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-medium tabular-nums text-neutral-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQty(item.productId, item.variantId, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="p-1 text-neutral-600 hover:text-neutral-900 disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price calculation */}
                    <span className="text-xs font-semibold text-neutral-950 tabular-nums">
                      {storeSettings.currencySymbol}
                      {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center flex flex-col items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-neutral-300 stroke-1 mb-2" />
              <p className="text-sm font-medium text-neutral-900">Your bag is empty</p>
              <p className="text-xs text-neutral-500 mt-1 max-w-[200px]">
                Explore our studio handcrafted goods to fill your basket.
              </p>
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50 space-y-4">
            {/* Promo Code Input */}
            <div>
              {appliedDiscount ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>
                      Code <strong>{appliedDiscount.code}</strong> applied ({appliedDiscount.type === 'percentage' ? `${appliedDiscount.value}% off` : `$${appliedDiscount.value} off`})
                    </span>
                  </div>
                  <button
                    onClick={removeDiscountCode}
                    className="text-emerald-700 hover:text-emerald-950 font-bold ml-2"
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder="Promo code (e.g. WELCOME10)"
                    className="flex-1 text-xs px-3 py-2 bg-white border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-neutral-900 uppercase"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-neutral-900 text-white text-xs font-medium rounded hover:bg-neutral-800 transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {promoFeedback && !appliedDiscount && (
                <p className={`text-[11px] mt-1 ${promoFeedback.isError ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {promoFeedback.message}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-neutral-600 border-t border-neutral-200 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums font-medium text-neutral-900">
                  {storeSettings.currencySymbol}{cartSubtotal.toFixed(2)}
                </span>
              </div>

              {cartDiscountTotal > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Savings</span>
                  <span className="tabular-nums">
                    -{storeSettings.currencySymbol}{cartDiscountTotal.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="tabular-nums font-medium text-neutral-900">
                  {cartShippingTotal === 0 ? 'FREE' : `${storeSettings.currencySymbol}${cartShippingTotal.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Tax ({(storeSettings.taxRate * 100).toFixed(0)}%)</span>
                <span className="tabular-nums font-medium text-neutral-900">
                  {storeSettings.currencySymbol}{cartTaxTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-sm font-bold text-neutral-950 pt-2 border-t border-neutral-200">
                <span>Total</span>
                <span className="tabular-nums">
                  {storeSettings.currencySymbol}{cartFinalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3 px-4 bg-neutral-950 text-white rounded-md font-medium text-xs tracking-wide hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
