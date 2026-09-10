import { fetchProducts } from '@/app/lib/products-data';
import ProductGridClient from './product-grid-client';
import ProductPagination from './pagination';

const PRODUCTS_PER_PAGE = 10;

export default async function ProductGrid({
    query,
    currentPage,
}: {
    query: string;
    currentPage: number;
}) {
    const { products, total } = await fetchProducts(query, currentPage, PRODUCTS_PER_PAGE);
    const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);

    if (products.length === 0) {
        return (
            <p className="mt-6 text-gray-500">
                No products found{query ? ` for "${query}"` : ''}
            </p>
        );
    }
    

    return (
        <div className='mt-6'>
            {query && <p className="my-6 text-gray-500">
                {products.length} products found for {query}
            </p>}
            <ProductGridClient products={products} />
            <div className="mt-5 flex w-full justify-center">
                <ProductPagination totalPages={totalPages} />
            </div>
        </div>
    );
}
