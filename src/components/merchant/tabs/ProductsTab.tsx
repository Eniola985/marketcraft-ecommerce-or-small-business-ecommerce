import React, { useState, useMemo } from 'react';
import { useStore } from '../../../context/StoreContext';
import { Product, ProductVariant } from '../../../types/ecommerce';
import { INITIAL_CATEGORIES } from '../../../data/initialData';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  AlertTriangle,
  Check,
  X,
  Package,
  ArrowUpDown,
  ShoppingBag,
} from 'lucide-react';

interface ProductsTabProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    updateStock,
    storeSettings,
  } = useStore();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    category: 'ceramics',
    description: '',
    price: 35.0,
    costPrice: 12.0,
    compareAtPrice: 0,
    sku: '',
    barcode: '',
    stock: 20,
    lowStockThreshold: 5,
    imageUrl: '',
    status: 'active' as 'active' | 'draft' | 'archived',
    weight: '0.5 kg',
    origin: 'Handmade Studio',
  });

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, categoryFilter, search]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'ceramics',
      description: '',
      price: 35.0,
      costPrice: 12.0,
      compareAtPrice: 0,
      sku: `SKU-${Date.now().toString().slice(-4)}`,
      barcode: '',
      stock: 20,
      lowStockThreshold: 5,
      imageUrl: products[0]?.images[0] || '',
      status: 'active',
      weight: '0.5 kg',
      origin: 'Studio Made',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      description: p.description,
      price: p.price,
      costPrice: p.costPrice,
      compareAtPrice: p.compareAtPrice || 0,
      sku: p.sku,
      barcode: p.barcode || '',
      stock: p.stock,
      lowStockThreshold: p.lowStockThreshold,
      imageUrl: p.images[0] || '',
      status: p.status,
      weight: p.weight || '',
      origin: p.origin || '',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: Number(formData.price),
        costPrice: Number(formData.costPrice),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
        sku: formData.sku,
        barcode: formData.barcode,
        stock: Number(formData.stock),
        lowStockThreshold: Number(formData.lowStockThreshold),
        images: [formData.imageUrl || products[0]?.images[0]],
        status: formData.status,
        weight: formData.weight,
        origin: formData.origin,
      });
    } else {
      addProduct({
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: Number(formData.price),
        costPrice: Number(formData.costPrice),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
        sku: formData.sku || `SKU-${Date.now().toString().slice(-4)}`,
        barcode: formData.barcode,
        stock: Number(formData.stock),
        lowStockThreshold: Number(formData.lowStockThreshold),
        images: [formData.imageUrl || products[0]?.images[0]],
        status: formData.status,
        tags: ['New Release', 'Handcrafted'],
        weight: formData.weight,
        origin: formData.origin,
      });
    }

    setIsAddModalOpen(false);
  };

  // Profit Margin calculation
  const calculatedMargin =
    formData.price > 0
      ? Math.round(((formData.price - formData.costPrice) / formData.price) * 100)
      : 0;
  const calculatedProfit = (formData.price - formData.costPrice).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Inventory & Catalog</h2>
          <p className="text-xs text-neutral-500">
            Manage product variations, selling prices, wholesale costs, and live stock.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-medium flex items-center gap-1.5 self-start sm:self-auto transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by title, SKU, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-8 pr-4 py-2 bg-white border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white border border-neutral-300 text-xs rounded-md px-3 py-2 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900"
        >
          {INITIAL_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 font-medium border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Item Details</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Retail Price</th>
                <th className="py-3 px-4">Cost Price</th>
                <th className="py-3 px-4">Profit Margin</th>
                <th className="py-3 px-4 text-center">In-Stock Qty</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {filteredProducts.map((p) => {
                const marginPercent =
                  p.price > 0 ? Math.round(((p.price - p.costPrice) / p.price) * 100) : 0;
                const profitPerUnit = (p.price - p.costPrice).toFixed(2);
                const isLow = p.stock <= p.lowStockThreshold;

                return (
                  <tr key={p.id} className="hover:bg-neutral-50/70 transition-colors">
                    {/* Item */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-10 rounded object-cover border border-neutral-200 shrink-0"
                        />
                        <div>
                          <span className="font-semibold text-neutral-900 block line-clamp-1">
                            {p.name}
                          </span>
                          <span className="text-[11px] text-neutral-400 capitalize">
                            {p.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-600">
                      {p.sku}
                    </td>

                    {/* Retail Price */}
                    <td className="py-3 px-4 font-semibold text-neutral-900 tabular-nums">
                      {storeSettings.currencySymbol}{p.price.toFixed(2)}
                      {p.compareAtPrice && (
                        <span className="text-[10px] text-neutral-400 line-through block font-normal">
                          {storeSettings.currencySymbol}{p.compareAtPrice.toFixed(2)}
                        </span>
                      )}
                    </td>

                    {/* Cost */}
                    <td className="py-3 px-4 text-neutral-500 tabular-nums">
                      {storeSettings.currencySymbol}{p.costPrice.toFixed(2)}
                    </td>

                    {/* Profit Margin */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-emerald-700 tabular-nums">
                        {marginPercent}%
                      </span>
                      <span className="text-[10px] text-neutral-400 block tabular-nums">
                        +${profitPerUnit}/unit
                      </span>
                    </td>

                    {/* Stock with Steppers */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 border border-neutral-200 rounded px-1.5 py-0.5 bg-neutral-50">
                        <button
                          onClick={() => updateStock(p.id, -1)}
                          className="text-neutral-500 hover:text-neutral-900 p-0.5 font-bold"
                          title="Reduce stock by 1"
                        >
                          -
                        </button>
                        <span
                          className={`font-mono font-semibold px-1 text-xs tabular-nums ${
                            isLow ? 'text-amber-700 font-bold' : 'text-neutral-800'
                          }`}
                        >
                          {p.stock}
                        </span>
                        <button
                          onClick={() => updateStock(p.id, 1)}
                          className="text-neutral-500 hover:text-neutral-900 p-0.5 font-bold"
                          title="Increase stock by 1"
                        >
                          +
                        </button>
                      </div>

                      {isLow && (
                        <span className="block text-[10px] text-amber-600 font-medium mt-0.5">
                          Low Stock
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          p.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-neutral-500">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1 hover:text-neutral-900 rounded hover:bg-neutral-100 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => duplicateProduct(p.id)}
                          className="p-1 hover:text-neutral-900 rounded hover:bg-neutral-100 transition-colors"
                          title="Duplicate Item"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${p.name}"?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-xl rounded-xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
          >
            <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <h3 className="font-semibold text-neutral-900 text-sm sm:text-base">
                {editingProduct ? 'Edit Product Item' : 'Add New Artisan Product'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="overflow-y-auto p-6 space-y-4 text-xs">
              <div>
                <label className="font-medium text-neutral-700 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hand-Thrown Oatmeal Serving Bowl"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none bg-white"
                  >
                    <option value="ceramics">Ceramics & Tableware</option>
                    <option value="textiles">Textiles & Living</option>
                    <option value="apothecary">Apothecary & Scents</option>
                    <option value="stationery">Leather & Stationery</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-neutral-700 block mb-1">Product Narrative / Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe material origin, dimensions, and craft details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                />
              </div>

              {/* Pricing & Profit Economics */}
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-900">Unit Economics & Pricing</span>
                  <span className="text-[11px] text-emerald-700 font-semibold tabular-nums">
                    Margin: {calculatedMargin}% (${calculatedProfit} profit/unit)
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-medium text-neutral-700 block mb-1">Selling Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2 border border-neutral-300 rounded bg-white tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-neutral-700 block mb-1">Cost / Unit ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.costPrice}
                      onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2 border border-neutral-300 rounded bg-white tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-neutral-700 block mb-1">Compare-At ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Optional"
                      value={formData.compareAtPrice || ''}
                      onChange={(e) => setFormData({ ...formData, compareAtPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2 border border-neutral-300 rounded bg-white tabular-nums"
                    />
                  </div>
                </div>
              </div>

              {/* Stock Inventory */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Current Stock Qty *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 border border-neutral-300 rounded tabular-nums"
                  />
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Low-Stock Alert Threshold</label>
                  <input
                    type="number"
                    value={formData.lowStockThreshold}
                    onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 border border-neutral-300 rounded tabular-nums"
                  />
                </div>
              </div>

              {/* Preset Image Asset Picker */}
              <div>
                <label className="font-medium text-neutral-700 block mb-1">Product Studio Photography</label>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {products.map((p, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setFormData({ ...formData, imageUrl: p.images[0] })}
                      className={`relative w-14 h-14 rounded overflow-hidden border-2 transition-all shrink-0 ${
                        formData.imageUrl === p.images[0]
                          ? 'border-neutral-900 ring-2 ring-neutral-900/30'
                          : 'border-neutral-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-900 text-white rounded font-medium hover:bg-neutral-800 transition-colors"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
