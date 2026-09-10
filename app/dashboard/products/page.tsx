import { Suspense } from 'react';
import { Metadata } from 'next';
import ProductSearch from '@/app/ui/products/search';
import ProductGrid from '@/app/ui/products/product-grid';
import { ProductGridSkeleton } from '@/app/ui/skeletons';
import { lusitana } from '@/app/ui/fonts';

export const metadata: Metadata = {
  title: 'Products',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Products</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <ProductSearch placeholder="Search products..." />
      </div>
      <Suspense key={query + currentPage} fallback={<ProductGridSkeleton />}>
        <ProductGrid query={query} currentPage={currentPage} />
      </Suspense>
    </div>
  );
}
