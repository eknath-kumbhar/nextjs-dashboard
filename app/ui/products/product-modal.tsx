'use client';

import { useEffect, useMemo, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Product } from '@/app/lib/definitions';

export default function ProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panelRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Recreated only when the displayed price changes, not on every re-render.
  const formattedPrice = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(product.price),
    [product.price],
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        tabIndex={-1}
        className="relative max-h-full w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-lg outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-48 w-full rounded-md object-contain bg-gray-50"
        />

        <h2 id="product-modal-title" className="mt-4 text-xl font-semibold">
          {product.title}
        </h2>
        <p className="mt-2 text-sm text-gray-600">{product.description}</p>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <dt className="text-gray-500">Price</dt>
            <dd className="font-medium">{formattedPrice}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Category</dt>
            <dd className="font-medium">{product.category}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Brand</dt>
            <dd className="font-medium">{product.brand}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Rating</dt>
            <dd className="font-medium">{product.rating}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Stock</dt>
            <dd className="font-medium">{product.stock}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
