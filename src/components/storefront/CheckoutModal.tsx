import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CustomerAddress, Order } from '../../types/ecommerce';
import {
  X,
  CheckCircle2,
  CreditCard,
  Truck,
  ShieldCheck,
  Printer,
  ArrowRight,
  ExternalLink,
  ShoppingBag,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartDiscountTotal,
    cartTaxTotal,
    storeSettings,
    appliedDiscount,
    createOrder,
    lastPlacedOrder,
    setLastPlacedOrder,
    setActiveView,
    setMerchantTab,
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Customer Form State
  const [formData, setFormData] = useState<CustomerAddress>({
    name: 'Eleanor Sterling',
    email: 'eleanor.sterling@craftlover.com',
    phone: '+1 (415) 555-0198',
    address: '450 Hayes Street, Suite 3',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94102',
    country: 'United States',
  });

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'pickup'>('standard');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'cod'>('card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  if (!isCheckoutOpen) return null;

  // Compute shipping fee based on selected method and threshold
  let shippingTotal = 0;
  let shippingLabel = 'Standard Carbon-Neutral';
  if (shippingMethod === 'standard') {
    shippingTotal = cartSubtotal >= storeSettings.freeShippingThreshold ? 0 : storeSettings.standardShippingFee;
    shippingLabel = 'Standard Carbon-Neutral (3-5 Business Days)';
  } else if (shippingMethod === 'express') {
    shippingTotal = storeSettings.expressShippingFee;
    shippingLabel = 'Express Air Courier (1-2 Business Days)';
  } else if (shippingMethod === 'pickup') {
    shippingTotal = 0;
    shippingLabel = 'Studio Curbside Pickup (Ojai, CA)';
  }

  const orderFinalTotal = Number(
    (Math.max(0, cartSubtotal - cartDiscountTotal) + shippingTotal + cartTaxTotal).toFixed(2)
  );

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const orderItems = cart.map((c) => ({
        productId: c.productId,
        productName: c.name,
        variantTitle: c.variantTitle,
        price: c.price,
        quantity: c.quantity,
        image: c.image,
      }));

      const newOrder = createOrder({
        customer: formData,
        items: orderItems,
        shippingMethod: shippingLabel,
        shippingTotal,
        paymentMethod: paymentMethod === 'cod' ? 'cod' : paymentMethod === 'apple_pay' ? 'apple_pay' : 'card',
        notes: 'Handled with organic cotton bag wrapping',
        source: 'online',
      });

      setIsSubmitting(false);
      setStep(3); // Completed step
    }, 600);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setLastPlacedOrder(null);
    setStep(1);
  };

  const handleViewInMerchant = () => {
    setIsCheckoutOpen(false);
    setActiveView('merchant');
    setMerchantTab('orders');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div>
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-medium">
              {storeSettings.storeName} Checkout
            </span>
            <h2 className="text-base sm:text-lg font-serif font-bold text-neutral-900">
              {step === 3 ? 'Order Confirmed' : 'Secure Studio Checkout'}
            </h2>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* STEP 3: Order Completed Receipt */}
          {step === 3 && lastPlacedOrder ? (
            <div className="text-center space-y-6 py-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-serif font-bold text-neutral-900">
                  Thank You, {lastPlacedOrder.customer.name}!
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-md mx-auto">
                  Your order <strong className="text-neutral-950 font-mono">{lastPlacedOrder.orderNumber}</strong> has been received by our studio workshop. A confirmation receipt was dispatched to <strong>{lastPlacedOrder.customer.email}</strong>.
                </p>
              </div>

              {/* Order Receipt Box */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-5 text-left text-xs space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-neutral-200 font-medium">
                  <div>
                    <span className="text-neutral-500">Order Reference:</span>
                    <span className="font-mono ml-1 font-bold text-neutral-900">{lastPlacedOrder.orderNumber}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-neutral-500">Delivery:</span>
                    <span className="ml-1 text-neutral-800">{lastPlacedOrder.shippingMethod}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {lastPlacedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <img src={it.image} alt={it.productName} className="w-8 h-8 rounded object-cover border" />
                        <div>
                          <span className="font-medium text-neutral-900">{it.productName}</span>
                          {it.variantTitle && <span className="text-neutral-500 block text-[11px]">{it.variantTitle}</span>}
                        </div>
                      </div>
                      <span className="tabular-nums font-medium text-neutral-900">
                        {it.quantity} &times; ${it.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="pt-3 border-t border-neutral-200 space-y-1 text-right">
                  <div className="flex justify-between text-neutral-500">
                    <span>Subtotal</span>
                    <span className="tabular-nums text-neutral-900">${lastPlacedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  {lastPlacedOrder.discountTotal > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Promo Discount ({lastPlacedOrder.discountCode})</span>
                      <span className="tabular-nums">-${lastPlacedOrder.discountTotal.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-500">
                    <span>Shipping</span>
                    <span className="tabular-nums text-neutral-900">
                      {lastPlacedOrder.shippingTotal === 0 ? 'FREE' : `$${lastPlacedOrder.shippingTotal.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Estimated Tax</span>
                    <span className="tabular-nums text-neutral-900">${lastPlacedOrder.taxTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-neutral-950 pt-2 border-t border-neutral-200">
                    <span>Total Charged</span>
                    <span className="tabular-nums">${lastPlacedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Shipping address recap */}
                <div className="pt-3 border-t border-neutral-200 text-neutral-600">
                  <span className="font-semibold text-neutral-800 block mb-0.5">Shipping Destination:</span>
                  <p>{lastPlacedOrder.customer.address}, {lastPlacedOrder.customer.city}, {lastPlacedOrder.customer.state} {lastPlacedOrder.customer.postalCode}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-medium rounded-md flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>

                <button
                  onClick={handleViewInMerchant}
                  className="w-full sm:w-auto px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-md flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <span>View in Merchant Hub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* STEP 1 & 2: Address & Payment */
            <div className="space-y-6">
              {/* Stepper Progress */}
              <div className="flex items-center justify-between text-xs border-b border-neutral-200 pb-3">
                <span className={`font-semibold ${step === 1 ? 'text-neutral-950' : 'text-emerald-700'}`}>
                  1. Shipping & Details
                </span>
                <span className="text-neutral-300">&rarr;</span>
                <span className={`font-semibold ${step === 2 ? 'text-neutral-950' : 'text-neutral-400'}`}>
                  2. Payment & Method
                </span>
              </div>

              {step === 1 ? (
                /* Step 1: Customer Details */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-neutral-700 block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-neutral-700 block mb-1">
                        Email Address (for order updates) *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-neutral-700 block mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-neutral-700 block mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-neutral-700 block mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-medium text-neutral-700 block mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-neutral-700 block mb-1">
                        State / Province *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-neutral-700 block mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Shipping Method Selector */}
                  <div className="pt-3 border-t border-neutral-200 space-y-2">
                    <label className="text-xs font-semibold text-neutral-900 block">
                      Choose Shipping Courier:
                    </label>
                    <div className="space-y-2">
                      <label
                        className={`flex items-center justify-between p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                          shippingMethod === 'standard'
                            ? 'border-neutral-900 bg-neutral-50/80 ring-1 ring-neutral-900'
                            : 'border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="shippingMethod"
                            checked={shippingMethod === 'standard'}
                            onChange={() => setShippingMethod('standard')}
                            className="text-neutral-900 focus:ring-neutral-900"
                          />
                          <div>
                            <span className="font-semibold text-neutral-900 block">
                              Standard Carbon-Neutral Delivery
                            </span>
                            <span className="text-neutral-500 text-[11px]">
                              3-5 Business Days · 100% recyclable packing
                            </span>
                          </div>
                        </div>
                        <span className="font-semibold tabular-nums text-neutral-900">
                          {cartSubtotal >= storeSettings.freeShippingThreshold ? 'FREE' : `$${storeSettings.standardShippingFee.toFixed(2)}`}
                        </span>
                      </label>

                      <label
                        className={`flex items-center justify-between p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                          shippingMethod === 'express'
                            ? 'border-neutral-900 bg-neutral-50/80 ring-1 ring-neutral-900'
                            : 'border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="shippingMethod"
                            checked={shippingMethod === 'express'}
                            onChange={() => setShippingMethod('express')}
                            className="text-neutral-900 focus:ring-neutral-900"
                          />
                          <div>
                            <span className="font-semibold text-neutral-900 block">
                              Express Air Courier
                            </span>
                            <span className="text-neutral-500 text-[11px]">
                              1-2 Business Days · Priority dispatch
                            </span>
                          </div>
                        </div>
                        <span className="font-semibold tabular-nums text-neutral-900">
                          ${storeSettings.expressShippingFee.toFixed(2)}
                        </span>
                      </label>

                      {storeSettings.pickupEnabled && (
                        <label
                          className={`flex items-center justify-between p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                            shippingMethod === 'pickup'
                              ? 'border-neutral-900 bg-neutral-50/80 ring-1 ring-neutral-900'
                              : 'border-neutral-200 hover:bg-neutral-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name="shippingMethod"
                              checked={shippingMethod === 'pickup'}
                              onChange={() => setShippingMethod('pickup')}
                              className="text-neutral-900 focus:ring-neutral-900"
                            />
                            <div>
                              <span className="font-semibold text-neutral-900 block">
                                Studio Curbside Pickup
                              </span>
                              <span className="text-neutral-500 text-[11px]">
                                Ready in 2 hours at {storeSettings.address}
                              </span>
                            </div>
                          </div>
                          <span className="font-semibold text-emerald-700">FREE</span>
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-2.5 bg-neutral-900 text-white rounded-md text-xs font-medium hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <span>Continue to Payment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Step 2: Payment Selector & Final Authorization */
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-900 block">
                      Select Payment Method:
                    </label>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-3 text-xs rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-colors ${
                          paymentMethod === 'card'
                            ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                            : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span className="font-medium">Credit Card</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('apple_pay')}
                        className={`p-3 text-xs rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-colors ${
                          paymentMethod === 'apple_pay'
                            ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                            : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        <span className="text-base font-bold leading-none">Pay</span>
                        <span className="font-medium text-[11px]">Instant Token</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-3 text-xs rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-colors ${
                          paymentMethod === 'cod'
                            ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                            : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        <Truck className="w-4 h-4" />
                        <span className="font-medium text-[11px]">Pay on Delivery</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Form Simulation */}
                  {paymentMethod === 'card' && (
                    <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          Encrypted 256-Bit Test Sandbox
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setCardNumber('4242 4242 4242 4242');
                            setCardExpiry('10/28');
                            setCardCvc('999');
                          }}
                          className="text-[11px] text-amber-700 hover:text-amber-900 underline font-medium"
                        >
                          Autofill Sample Test Card
                        </button>
                      </div>

                      <div>
                        <label className="text-[11px] text-neutral-600 block mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full text-xs font-mono p-2 bg-white border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-neutral-600 block mb-1">
                            Expiration (MM/YY)
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full text-xs font-mono p-2 bg-white border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-neutral-600 block mb-1">
                            Security Code (CVC)
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-full text-xs font-mono p-2 bg-white border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Summary Bar */}
                  <div className="p-3 bg-neutral-100/70 rounded-md text-xs flex justify-between items-center">
                    <div>
                      <span className="text-neutral-500">Total Due Today:</span>
                      <span className="ml-2 font-bold text-sm text-neutral-950 tabular-nums">
                        ${orderFinalTotal.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-500">
                      {cart.reduce((s, i) => s + i.quantity, 0)} items in shipment
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-neutral-600 hover:text-neutral-950 font-medium"
                    >
                      &larr; Back to Shipping
                    </button>

                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-neutral-950 text-white rounded-md text-xs font-medium hover:bg-neutral-800 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-md"
                    >
                      {isSubmitting ? (
                        <span>Processing Order...</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Authorize & Place Order (${orderFinalTotal.toFixed(2)})</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
