import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types/ecommerce';
import { INITIAL_CATEGORIES } from '../../data/initialData';
import {
  Calculator,
  Search,
  Plus,
  Minus,
  Trash2,
  DollarSign,
  CreditCard,
  Printer,
  CheckCircle2,
  X,
  Store,
  ArrowLeft,
} from 'lucide-react';

interface PosCartItem {
  product: Product;
  quantity: number;
}

export const PosTerminal: React.FC = () => {
  const { products, createOrder, storeSettings, setActiveView } = useStore();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [posCart, setPosCart] = useState<PosCartItem[]>([]);
  const [cashTendered, setCashTendered] = useState<number | ''>('');
  const [paymentType, setPaymentType] = useState<'cash' | 'card'>('card');
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  // Filter products for POS
  const filteredProducts = products.filter((p) => {
    if (p.status !== 'active') return false;
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.barcode && p.barcode.includes(q))
      );
    }
    return true;
  });

  const addToPosCart = (product: Product) => {
    if (product.stock <= 0) return;
    setPosCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx > -1) {
        const item = prev[idx];
        if (item.quantity >= product.stock) return prev;
        const updated = [...prev];
        updated[idx] = { ...item, quantity: item.quantity + 1 };
        return updated;
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  const updatePosQty = (productId: string, delta: number) => {
    setPosCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: Math.min(newQty, item.product.stock),
            };
          }
          return item;
        })
        .filter(Boolean) as PosCartItem[];
    });
  };

  const subtotal = posCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = Number((subtotal * storeSettings.taxRate).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  const changeDue =
    typeof cashTendered === 'number' && cashTendered >= total
      ? Number((cashTendered - total).toFixed(2))
      : 0;

  const handleCheckout = () => {
    if (posCart.length === 0) return;

    const items = posCart.map((i) => ({
      productId: i.product.id,
      productName: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
      image: i.product.images[0],
    }));

    const newOrder = createOrder({
      customer: {
        name: 'In-Store Walk-in Customer',
        email: 'pos.register@marketcraft.local',
        phone: '—',
        address: 'Walk-in / Pop-up Market Stall',
        city: 'Ojai',
        state: 'CA',
        postalCode: '93023',
        country: 'United States',
      },
      items,
      shippingMethod: 'Immediate In-Person Handover',
      shippingTotal: 0,
      paymentMethod: paymentType === 'cash' ? 'pos_cash' : 'card',
      notes: `POS In-Person Sale (${paymentType === 'cash' ? `Tendered $${cashTendered}, Change $${changeDue}` : 'Contactless Card'})`,
      source: 'pos',
    });

    setCompletedOrder({
      order: newOrder,
      tendered: cashTendered,
      change: changeDue,
      paymentType,
    });

    setPosCart([]);
    setCashTendered('');
  };

  return (
    <div className="h-[calc(100vh-3rem)] bg-neutral-900 text-neutral-100 flex flex-col overflow-hidden text-xs">
      {/* Top POS Header */}
      <div className="h-12 bg-neutral-950 border-b border-neutral-800 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('storefront')}
            className="flex items-center gap-1.5 text-neutral-400 hover:text-white px-2 py-1 rounded hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Register</span>
          </button>
          <span className="text-neutral-700">|</span>
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-white">Market & Counter POS Terminal</span>
            <span className="text-[10px] text-neutral-500 font-mono">
              Terminal #01 · {storeSettings.storeName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-neutral-400">
          <span>Register Active</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* Split POS Screen */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left 65%: Product Quick Tile Catalog */}
        <div className="flex-1 flex flex-col border-r border-neutral-800 bg-neutral-900 overflow-hidden">
          {/* Controls: Search & Category Tabs */}
          <div className="p-3 border-b border-neutral-800 flex gap-2 shrink-0 bg-neutral-950/60">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tap to search goods or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-sky-500"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              {INITIAL_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-2 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === c.id
                      ? 'bg-sky-600 text-white font-semibold'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Tiles Grid */}
          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredProducts.map((p) => {
              const inStock = p.stock > 0;
              return (
                <button
                  key={p.id}
                  onClick={() => addToPosCart(p)}
                  disabled={!inStock}
                  className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                    inStock
                      ? 'bg-neutral-800 border-neutral-700 hover:border-sky-500 hover:bg-neutral-750 active:scale-98'
                      : 'bg-neutral-900 border-neutral-800 opacity-40 cursor-not-allowed'
                  }`}
                >
                  <div className="aspect-[4/3] rounded overflow-hidden mb-2 bg-neutral-900 border border-neutral-700/60">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold text-white text-xs leading-snug line-clamp-1">
                      {p.name}
                    </h4>
                    <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">
                      {p.sku}
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-neutral-700/60 flex items-center justify-between">
                    <span className="font-bold text-sky-400 text-xs tabular-nums">
                      ${p.price.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {inStock ? `${p.stock} left` : 'Out of stock'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 35%: Current Ticket / Register */}
        <div className="w-80 md:w-96 bg-neutral-950 flex flex-col justify-between shrink-0">
          {/* Ticket Header */}
          <div className="p-3.5 border-b border-neutral-800 flex items-center justify-between">
            <h3 className="font-semibold text-white text-xs flex items-center gap-1.5">
              <span>Current Register Ticket</span>
              <span className="text-neutral-500 font-mono font-normal">
                ({posCart.reduce((s, i) => s + i.quantity, 0)} items)
              </span>
            </h3>

            {posCart.length > 0 && (
              <button
                onClick={() => setPosCart([])}
                className="text-neutral-500 hover:text-rose-400 text-[11px]"
              >
                Clear Ticket
              </button>
            )}
          </div>

          {/* Ticket Items */}
          <div className="flex-1 overflow-y-auto p-3 divide-y divide-neutral-900">
            {posCart.length > 0 ? (
              posCart.map((item) => (
                <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-neutral-200 block truncate">
                      {item.product.name}
                    </span>
                    <span className="text-[11px] text-neutral-500 tabular-nums">
                      ${item.product.price.toFixed(2)} each
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center border border-neutral-800 rounded bg-neutral-900">
                      <button
                        onClick={() => updatePosQty(item.product.id, -1)}
                        className="px-2 py-1 text-neutral-400 hover:text-white"
                      >
                        -
                      </button>
                      <span className="w-6 text-center tabular-nums font-mono text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updatePosQty(item.product.id, 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="px-2 py-1 text-neutral-400 hover:text-white disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>

                    <span className="w-16 text-right font-bold text-white tabular-nums">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500 space-y-2">
                <Calculator className="w-8 h-8 stroke-1 text-neutral-600" />
                <p>Register ticket is empty</p>
                <p className="text-[11px] max-w-[200px]">
                  Tap product tiles on the left to add items to the current sale.
                </p>
              </div>
            )}
          </div>

          {/* Ticket Totals & Payment Execution */}
          {posCart.length > 0 && (
            <div className="p-4 border-t border-neutral-800 bg-neutral-900/80 space-y-3">
              {/* Financial Lines */}
              <div className="space-y-1 text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium text-neutral-200">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Tax ({(storeSettings.taxRate * 100).toFixed(0)}%)</span>
                  <span className="tabular-nums font-medium text-neutral-200">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-1 border-t border-neutral-800">
                  <span>Total Due</span>
                  <span className="tabular-nums text-sky-400">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method Switcher */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setPaymentType('card')}
                  className={`py-2 rounded font-medium flex items-center justify-center gap-1.5 transition-colors ${
                    paymentType === 'card'
                      ? 'bg-sky-600 text-white font-bold'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Card / Tap</span>
                </button>

                <button
                  onClick={() => setPaymentType('cash')}
                  className={`py-2 rounded font-medium flex items-center justify-center gap-1.5 transition-colors ${
                    paymentType === 'cash'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Cash Payment</span>
                </button>
              </div>

              {/* Cash Tendered Calculator if Cash Selected */}
              {paymentType === 'cash' && (
                <div className="p-2.5 bg-neutral-950 rounded border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Cash Tendered ($):</span>
                    <input
                      type="number"
                      step="1"
                      value={cashTendered}
                      onChange={(e) => setCashTendered(parseFloat(e.target.value) || '')}
                      placeholder={total.toFixed(2)}
                      className="w-24 p-1 bg-neutral-900 border border-neutral-700 rounded text-right font-mono font-bold text-white text-xs"
                    />
                  </div>

                  {/* Fast Bills */}
                  <div className="flex gap-1.5">
                    {[20, 50, 100].map((bill) => (
                      <button
                        key={bill}
                        type="button"
                        onClick={() => setCashTendered(bill)}
                        className="flex-1 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded font-mono text-[11px]"
                      >
                        ${bill}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setCashTendered(Math.ceil(total))}
                      className="flex-1 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded font-mono text-[11px]"
                    >
                      Exact
                    </button>
                  </div>

                  {typeof cashTendered === 'number' && cashTendered >= total && (
                    <div className="flex justify-between items-center text-xs font-bold text-emerald-400 pt-1 border-t border-neutral-800">
                      <span>Change Due:</span>
                      <span className="tabular-nums font-mono text-sm">${changeDue.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Complete Sale Button */}
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Sale (${total.toFixed(2)})</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* POS Completed Receipt Modal */}
      {completedOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setCompletedOrder(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-neutral-950 w-full max-w-sm rounded-xl p-6 shadow-2xl space-y-4 text-xs font-mono"
          >
            <div className="text-center space-y-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="font-bold font-sans text-base">{storeSettings.storeName}</h3>
              <p className="text-[11px] text-neutral-500 font-sans">{storeSettings.address}</p>
              <div className="border-b border-dashed border-neutral-300 py-1" />
              <p className="font-bold text-neutral-800">
                Receipt: {completedOrder.order.orderNumber}
              </p>
              <p className="text-[10px] text-neutral-500">
                {new Date(completedOrder.order.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="space-y-1 divide-y divide-neutral-100 py-1">
              {completedOrder.order.items.map((it: any, idx: number) => (
                <div key={idx} className="flex justify-between py-1">
                  <span className="font-sans truncate max-w-[180px]">{it.quantity}x {it.productName}</span>
                  <span className="tabular-nums">${(it.quantity * it.price).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-neutral-300 pt-2 space-y-1 text-right">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${completedOrder.order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax:</span>
                <span>${completedOrder.order.taxTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-1 border-t border-neutral-200">
                <span>Total Paid:</span>
                <span>${completedOrder.order.total.toFixed(2)}</span>
              </div>
              {completedOrder.paymentType === 'cash' && (
                <>
                  <div className="flex justify-between text-neutral-600 text-[11px]">
                    <span>Cash Tendered:</span>
                    <span>${completedOrder.tendered}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-700">
                    <span>Change Returned:</span>
                    <span>${completedOrder.change.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-neutral-100 hover:bg-neutral-200 rounded font-sans font-medium flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={() => setCompletedOrder(null)}
                className="flex-1 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded font-sans font-medium"
              >
                Next Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
