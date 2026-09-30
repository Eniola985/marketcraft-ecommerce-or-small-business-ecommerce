import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { Download, Upload, RefreshCw, Check, AlertCircle, Database } from 'lucide-react';

export const BackupTab: React.FC = () => {
  const {
    exportDataJSON,
    importDataJSON,
    resetDemoData,
    products,
    orders,
    customers,
  } = useStore();

  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<{ message: string; isError: boolean } | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleDownload = () => {
    const json = exportDataJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `marketcraft-store-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;
    const res = importDataJSON(importText);
    setImportStatus({
      message: res.message,
      isError: !res.success,
    });
    if (res.success) {
      setImportText('');
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all store data to default sample items? Any custom products or orders will be replaced.'
      )
    ) {
      resetDemoData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl text-xs">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">Store Data & Backup Management</h2>
        <p className="text-neutral-500">
          Export your product catalog, orders, and customer records for offline archival or data portability.
        </p>
      </div>

      {/* Snapshot Summary */}
      <div className="grid grid-cols-3 gap-3 p-4 bg-white border border-neutral-200 rounded-lg">
        <div>
          <span className="text-neutral-500 block">Catalog Inventory</span>
          <span className="text-base font-bold text-neutral-900 tabular-nums">{products.length} products</span>
        </div>
        <div>
          <span className="text-neutral-500 block">Orders Logged</span>
          <span className="text-base font-bold text-neutral-900 tabular-nums">{orders.length} orders</span>
        </div>
        <div>
          <span className="text-neutral-500 block">Customer Records</span>
          <span className="text-base font-bold text-neutral-900 tabular-nums">{customers.length} clients</span>
        </div>
      </div>

      {/* Export Section */}
      <div className="p-5 bg-white border border-neutral-200 rounded-lg space-y-3">
        <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
          <Download className="w-4 h-4 text-neutral-700" />
          <span>Export Store Database</span>
        </h3>
        <p className="text-neutral-600 leading-relaxed">
          Download a full JSON archive containing all products, variants, customer records, promotional coupons, and order history.
        </p>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded font-medium transition-colors flex items-center gap-2 shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download JSON Backup</span>
        </button>
      </div>

      {/* Import Section */}
      <form onSubmit={handleImport} className="p-5 bg-white border border-neutral-200 rounded-lg space-y-3">
        <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
          <Upload className="w-4 h-4 text-neutral-700" />
          <span>Restore Store from Backup</span>
        </h3>
        <p className="text-neutral-600">
          Paste your exported JSON backup file below to restore or synchronize your store:
        </p>

        <textarea
          rows={4}
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder="Paste JSON content here..."
          className="w-full p-2.5 border border-neutral-300 rounded font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-neutral-900"
        />

        {importStatus && (
          <div
            className={`p-2.5 rounded flex items-center gap-2 ${
              importStatus.isError ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {importStatus.isError ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            <span>{importStatus.message}</span>
          </div>
        )}

        <button
          type="submit"
          className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded font-medium transition-colors"
        >
          Restore JSON Data
        </button>
      </form>

      {/* Reset Section */}
      <div className="p-5 bg-rose-50/50 border border-rose-200/70 rounded-lg space-y-3">
        <h3 className="text-sm font-semibold text-rose-900 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-rose-600" />
          <span>Reset to Fresh Sample Catalog</span>
        </h3>
        <p className="text-rose-800">
          Reset all products, orders, and customer records back to pristine default artisan sample data.
        </p>

        {resetSuccess && (
          <p className="text-emerald-700 font-medium flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Sample studio data restored!
          </p>
        )}

        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium transition-colors shadow-xs"
        >
          Reset Store Data
        </button>
      </div>
    </div>
  );
};
