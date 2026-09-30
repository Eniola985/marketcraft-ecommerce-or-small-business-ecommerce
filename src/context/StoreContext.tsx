import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Product,
  Order,
  Customer,
  Discount,
  StoreSettings,
  CartItem,
  Review,
  OrderStatus,
  PaymentStatus,
} from '../types/ecommerce';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_DISCOUNTS,
  INITIAL_STORE_SETTINGS,
  INITIAL_REVIEWS,
} from '../data/initialData';

interface StoreContextType {
  // Navigation & UI state
  activeView: 'merchant' | 'storefront' | 'pos';
  setActiveView: (view: 'merchant' | 'storefront' | 'pos') => void;
  merchantTab: 'overview' | 'products' | 'orders' | 'customers' | 'discounts' | 'customizer' | 'backup';
  setMerchantTab: (tab: 'overview' | 'products' | 'orders' | 'customers' | 'discounts' | 'customizer' | 'backup') => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;

  // Data
  products: Product[];
  orders: Order[];
  customers: Customer[];
  discounts: Discount[];
  storeSettings: StoreSettings;
  reviews: Review[];

  // Product Operations
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'slug' | 'rating' | 'reviewCount'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  updateStock: (id: string, delta: number) => void;

  // Order Operations
  createOrder: (orderData: {
    customer: Order['customer'];
    items: Order['items'];
    shippingMethod: string;
    shippingTotal: number;
    paymentMethod: Order['paymentMethod'];
    notes?: string;
    source?: 'online' | 'pos';
  }) => Order;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updateOrderTracking: (id: string, carrier: string, trackingNumber: string) => void;
  cancelOrder: (id: string) => void;

  // Customer Operations
  addCustomer: (customer: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'lastOrderDate'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;

  // Discount Operations
  addDiscount: (discount: Omit<Discount, 'id' | 'usedCount'>) => void;
  toggleDiscount: (id: string) => void;
  deleteDiscount: (id: string) => void;

  // Review Operations
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;

  // Store Settings
  updateStoreSettings: (updates: Partial<StoreSettings>) => void;

  // Shopping Cart & Checkout
  cart: CartItem[];
  addToCart: (item: {
    productId: string;
    variantId?: string;
    variantTitle?: string;
    name: string;
    price: number;
    image: string;
    maxStock: number;
  }, quantity?: number) => void;
  updateCartQty: (productId: string, variantId: string | undefined, qty: number) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  clearCart: () => void;
  appliedDiscount: Discount | null;
  applyDiscountCode: (code: string) => { success: boolean; message: string };
  removeDiscountCode: () => void;

  // Calculated Cart Totals
  cartSubtotal: number;
  cartDiscountTotal: number;
  cartShippingTotal: number;
  cartTaxTotal: number;
  cartFinalTotal: number;
  cartCount: number;

  // Backup & Reset
  resetDemoData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => { success: boolean; message: string };
}

const STORAGE_KEY = 'marketcraft_app_data_v1';

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [activeView, setActiveView] = useState<'merchant' | 'storefront' | 'pos'>('storefront');
  const [merchantTab, setMerchantTab] = useState<'overview' | 'products' | 'orders' | 'customers' | 'discounts' | 'customizer' | 'backup'>('overview');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Core Data loaded from localStorage if available
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_products`);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_orders`);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_customers`);
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [discounts, setDiscounts] = useState<Discount[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_discounts`);
      return saved ? JSON.parse(saved) : INITIAL_DISCOUNTS;
    } catch {
      return INITIAL_DISCOUNTS;
    }
  });

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
      return saved ? JSON.parse(saved) : INITIAL_STORE_SETTINGS;
    } catch {
      return INITIAL_STORE_SETTINGS;
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_reviews`);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_cart`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_products`, JSON.stringify(products));
      localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(orders));
      localStorage.setItem(`${STORAGE_KEY}_customers`, JSON.stringify(customers));
      localStorage.setItem(`${STORAGE_KEY}_discounts`, JSON.stringify(discounts));
      localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(storeSettings));
      localStorage.setItem(`${STORAGE_KEY}_reviews`, JSON.stringify(reviews));
      localStorage.setItem(`${STORAGE_KEY}_cart`, JSON.stringify(cart));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [products, orders, customers, discounts, storeSettings, reviews, cart]);

  // Cart Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const cartDiscountTotal = useMemo(() => {
    if (!appliedDiscount) return 0;
    if (cartSubtotal < appliedDiscount.minSpend) return 0;
    if (appliedDiscount.type === 'percentage') {
      return Number(((cartSubtotal * appliedDiscount.value) / 100).toFixed(2));
    } else {
      return Math.min(appliedDiscount.value, cartSubtotal);
    }
  }, [cartSubtotal, appliedDiscount]);

  const cartShippingTotal = useMemo(() => {
    if (cart.length === 0) return 0;
    // Check if free shipping threshold met
    if (cartSubtotal >= storeSettings.freeShippingThreshold) {
      return 0;
    }
    return storeSettings.standardShippingFee;
  }, [cart, cartSubtotal, storeSettings]);

  const cartTaxTotal = useMemo(() => {
    const taxableAmount = Math.max(0, cartSubtotal - cartDiscountTotal);
    return Number((taxableAmount * storeSettings.taxRate).toFixed(2));
  }, [cartSubtotal, cartDiscountTotal, storeSettings.taxRate]);

  const cartFinalTotal = useMemo(() => {
    return Number((Math.max(0, cartSubtotal - cartDiscountTotal) + cartShippingTotal + cartTaxTotal).toFixed(2));
  }, [cartSubtotal, cartDiscountTotal, cartShippingTotal, cartTaxTotal]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Product Operations
  const addProduct = (newProdData: Omit<Product, 'id' | 'createdAt' | 'slug' | 'rating' | 'reviewCount'>): Product => {
    const id = `prod-${Date.now()}`;
    const slug = newProdData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const product: Product = {
      ...newProdData,
      id,
      slug,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [product, ...prev]);
    return product;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // also remove from cart if present
    setCart((prev) => prev.filter((item) => item.productId !== id));
  };

  const duplicateProduct = (id: string) => {
    const original = products.find((p) => p.id === id);
    if (!original) return;
    const duplicated: Product = {
      ...original,
      id: `prod-${Date.now()}`,
      name: `${original.name} (Copy)`,
      slug: `${original.slug}-copy`,
      sku: `${original.sku}-COPY`,
      createdAt: new Date().toISOString(),
      reviewCount: 0,
      rating: 5.0,
    };
    setProducts((prev) => [duplicated, ...prev]);
  };

  const updateStock = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStock = Math.max(0, p.stock + delta);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
  };

  // Order Operations
  const createOrder = (orderData: {
    customer: Order['customer'];
    items: Order['items'];
    shippingMethod: string;
    shippingTotal: number;
    paymentMethod: Order['paymentMethod'];
    notes?: string;
    source?: 'online' | 'pos';
  }): Order => {
    const orderNumber = orderData.source === 'pos'
      ? `#POS-${Math.floor(1000 + Math.random() * 9000)}`
      : `#MC-${Math.floor(1000 + Math.random() * 9000)}`;

    const subtotal = orderData.items.reduce((s, it) => s + it.price * it.quantity, 0);

    let discountTotal = 0;
    if (appliedDiscount && subtotal >= appliedDiscount.minSpend) {
      if (appliedDiscount.type === 'percentage') {
        discountTotal = Number(((subtotal * appliedDiscount.value) / 100).toFixed(2));
      } else {
        discountTotal = Math.min(appliedDiscount.value, subtotal);
      }
    }

    const taxable = Math.max(0, subtotal - discountTotal);
    const taxTotal = Number((taxable * storeSettings.taxRate).toFixed(2));
    const total = Number((taxable + orderData.shippingTotal + taxTotal).toFixed(2));

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      customer: orderData.customer,
      items: orderData.items,
      subtotal,
      discountTotal,
      discountCode: appliedDiscount?.code,
      shippingTotal: orderData.shippingTotal,
      shippingMethod: orderData.shippingMethod,
      taxTotal,
      total,
      status: 'processing',
      paymentStatus: 'paid',
      paymentMethod: orderData.paymentMethod,
      notes: orderData.notes,
      source: orderData.source || 'online',
    };

    // 1. Decrement inventory
    setProducts((prev) =>
      prev.map((prod) => {
        const matchingItem = orderData.items.find((item) => item.productId === prod.id);
        if (matchingItem) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - matchingItem.quantity),
          };
        }
        return prod;
      })
    );

    // 2. Increment coupon used count if used
    if (appliedDiscount) {
      setDiscounts((prev) =>
        prev.map((d) => (d.id === appliedDiscount.id ? { ...d, usedCount: d.usedCount + 1 } : d))
      );
      setAppliedDiscount(null);
    }

    // 3. Upsert customer CRM record
    setCustomers((prev) => {
      const existing = prev.find((c) => c.email.toLowerCase() === orderData.customer.email.toLowerCase());
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                totalOrders: c.totalOrders + 1,
                totalSpent: Number((c.totalSpent + total).toFixed(2)),
                lastOrderDate: new Date().toISOString().split('T')[0],
                tag: c.totalOrders + 1 >= 3 ? 'VIP' : 'Repeat',
              }
            : c
        );
      } else {
        const newCust: Customer = {
          id: `cust-${Date.now()}`,
          name: orderData.customer.name,
          email: orderData.customer.email,
          phone: orderData.customer.phone || '—',
          city: `${orderData.customer.city || 'Local'}, ${orderData.customer.state || ''}`.trim(),
          country: orderData.customer.country || 'United States',
          totalOrders: 1,
          totalSpent: total,
          lastOrderDate: new Date().toISOString().split('T')[0],
          tag: 'New',
        };
        return [newCust, ...prev];
      }
    });

    // 4. Save order to state
    setOrders((prev) => [newOrder, ...prev]);

    // 5. Clear cart
    setCart([]);
    setLastPlacedOrder(newOrder);

    return newOrder;
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const updateOrderTracking = (id: string, carrier: string, trackingNumber: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, carrier, trackingNumber, status: 'shipped' } : o))
    );
  };

  const cancelOrder = (id: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'cancelled' } : o)));
  };

  // Customer Operations
  const addCustomer = (customerData: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'lastOrderDate'>) => {
    const newCust: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: new Date().toISOString().split('T')[0],
    };
    setCustomers((prev) => [newCust, ...prev]);
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  // Discount Operations
  const addDiscount = (discountData: Omit<Discount, 'id' | 'usedCount'>) => {
    const newDisc: Discount = {
      ...discountData,
      id: `disc-${Date.now()}`,
      usedCount: 0,
      code: discountData.code.toUpperCase().trim(),
    };
    setDiscounts((prev) => [newDisc, ...prev]);
  };

  const toggleDiscount = (id: string) => {
    setDiscounts((prev) => prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d)));
  };

  const deleteDiscount = (id: string) => {
    setDiscounts((prev) => prev.filter((d) => d.id !== id));
  };

  // Reviews
  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };
    setReviews((prev) => [newRev, ...prev]);

    // Recalculate product rating
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === reviewData.productId) {
          const productReviews = [...reviews.filter((r) => r.productId === p.id), newRev];
          const avgRating = Number(
            (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
          );
          return {
            ...p,
            rating: avgRating,
            reviewCount: productReviews.length,
          };
        }
        return p;
      })
    );
  };

  // Store Settings
  const updateStoreSettings = (updates: Partial<StoreSettings>) => {
    setStoreSettings((prev) => ({ ...prev, ...updates }));
  };

  // Cart Operations
  const addToCart = (
    item: {
      productId: string;
      variantId?: string;
      variantTitle?: string;
      name: string;
      price: number;
      image: string;
      maxStock: number;
    },
    quantity: number = 1
  ) => {
    setCart((prev) => {
      const matchIndex = prev.findIndex(
        (ci) => ci.productId === item.productId && ci.variantId === item.variantId
      );

      if (matchIndex > -1) {
        const existing = prev[matchIndex];
        const newQty = Math.min(existing.quantity + quantity, item.maxStock);
        const updated = [...prev];
        updated[matchIndex] = { ...existing, quantity: newQty };
        return updated;
      } else {
        return [
          ...prev,
          {
            ...item,
            quantity: Math.min(quantity, item.maxStock),
          },
        ];
      }
    });
    setIsCartOpen(true);
  };

  const updateCartQty = (productId: string, variantId: string | undefined, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.variantId === variantId) {
          return { ...item, quantity: Math.min(qty, item.maxStock) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.variantId === variantId))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyDiscountCode = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const found = discounts.find((d) => d.code === cleanCode && d.active);

    if (!found) {
      return { success: false, message: 'Invalid or expired promotional code.' };
    }

    if (found.maxUses && found.usedCount >= found.maxUses) {
      return { success: false, message: 'This promotion has reached its maximum redemptions.' };
    }

    if (cartSubtotal < found.minSpend) {
      return {
        success: false,
        message: `Minimum spend of $${found.minSpend.toFixed(2)} required for this discount.`,
      };
    }

    setAppliedDiscount(found);
    return {
      success: true,
      message: `Code ${found.code} applied: ${found.type === 'percentage' ? `${found.value}% off` : `$${found.value} off`}!`,
    };
  };

  const removeDiscountCode = () => {
    setAppliedDiscount(null);
  };

  // Reset & Backup
  const resetDemoData = () => {
    localStorage.clear();
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCustomers(INITIAL_CUSTOMERS);
    setDiscounts(INITIAL_DISCOUNTS);
    setStoreSettings(INITIAL_STORE_SETTINGS);
    setReviews(INITIAL_REVIEWS);
    setCart([]);
    setAppliedDiscount(null);
  };

  const exportDataJSON = () => {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      storeSettings,
      products,
      orders,
      customers,
      discounts,
      reviews,
    };
    return JSON.stringify(payload, null, 2);
  };

  const importDataJSON = (jsonStr: string): { success: boolean; message: string } => {
    try {
      const data = JSON.parse(jsonStr);
      if (!data.products || !Array.isArray(data.products)) {
        return { success: false, message: 'Invalid format: missing products array.' };
      }
      if (data.products) setProducts(data.products);
      if (data.orders) setOrders(data.orders);
      if (data.customers) setCustomers(data.customers);
      if (data.discounts) setDiscounts(data.discounts);
      if (data.storeSettings) setStoreSettings(data.storeSettings);
      if (data.reviews) setReviews(data.reviews);
      return { success: true, message: 'Store database restored successfully!' };
    } catch (e: any) {
      return { success: false, message: `Failed to parse JSON: ${e.message}` };
    }
  };

  return (
    <StoreContext.Provider
      value={{
        activeView,
        setActiveView,
        merchantTab,
        setMerchantTab,
        selectedProductId,
        setSelectedProductId,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        lastPlacedOrder,
        setLastPlacedOrder,

        products,
        orders,
        customers,
        discounts,
        storeSettings,
        reviews,

        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        updateStock,

        createOrder,
        updateOrderStatus,
        updateOrderTracking,
        cancelOrder,

        addCustomer,
        updateCustomer,

        addDiscount,
        toggleDiscount,
        deleteDiscount,

        addReview,

        updateStoreSettings,

        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        appliedDiscount,
        applyDiscountCode,
        removeDiscountCode,

        cartSubtotal,
        cartDiscountTotal,
        cartShippingTotal,
        cartTaxTotal,
        cartFinalTotal,
        cartCount,

        resetDemoData,
        exportDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
