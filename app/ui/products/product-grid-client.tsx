'use client';

import { useMemo, useState } from 'react';
import { Product } from '@/app/lib/definitions';
import ProductModal from './product-modal';

export default function ProductGridClient({ products }: { products: Product[] }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Avoids re-scanning the array on re-renders unrelated to the selection change.
  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedId) ?? null,
    [products, selectedId],
  );

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => setSelectedId(product.id)}
            className="flex flex-col overflow-hidden rounded-xl bg-gray-50 p-2 text-left shadow-sm transition-colors hover:bg-gray-100"
          >
            <img
              src={product.thumbnail}
              alt={product.title}
              className="h-40 w-full rounded-md bg-white object-contain"
            />
            <span className="mt-3 truncate text-sm font-medium text-gray-900">
              {product.title}
            </span>
            <span className="mt-1 text-sm text-gray-500">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(product.price)}
            </span>
          </button>
        ))}
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  );
}
