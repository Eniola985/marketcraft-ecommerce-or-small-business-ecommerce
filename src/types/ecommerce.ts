export interface ProductVariant {
  id: string;
  name: string; // e.g., "Terracotta / 12oz" or "Small"
  sku: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  costPrice: number; // For small business profit margin tracking
  sku: string;
  barcode?: string;
  stock: number;
  lowStockThreshold: number;
  images: string[];
  variants?: ProductVariant[];
  status: 'active' | 'draft' | 'archived';
  tags: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
  weight?: string;
  origin?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  itemCount?: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  variantTitle?: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CustomerAddress {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'refunded';
export type PaymentMethod = 'card' | 'cod' | 'apple_pay' | 'pos_cash';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: CustomerAddress;
  items: OrderItem[];
  subtotal: number;
  discountTotal: number;
  discountCode?: string;
  shippingTotal: number;
  shippingMethod: string;
  taxTotal: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  trackingNumber?: string;
  carrier?: string;
  notes?: string;
  source: 'online' | 'pos';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  tag: 'VIP' | 'Repeat' | 'New' | 'Wholesale';
  notes?: string;
}

export interface Discount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // percentage (e.g. 15 for 15%) or fixed dollar amount (e.g. 10)
  minSpend: number;
  usedCount: number;
  maxUses?: number;
  active: boolean;
  expiresAt?: string;
  description: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  currencySymbol: string;
  currencyCode: string;
  taxRate: number; // e.g. 0.07 for 7%
  freeShippingThreshold: number;
  standardShippingFee: number;
  expressShippingFee: number;
  pickupEnabled: boolean;
  announcementBar: {
    enabled: boolean;
    text: string;
    linkText?: string;
  };
  contactEmail: string;
  phone: string;
  address: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  policies: {
    shipping: string;
    returns: string;
    privacy: string;
  };
}

export interface CartItem {
  productId: string;
  variantId?: string;
  variantTitle?: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
  maxStock: number;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
}
