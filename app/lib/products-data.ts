import { Product } from './definitions';

const DUMMYJSON_BASE_URL = 'https://dummyjson.com/products';
const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [300, 900];

export type ProductsPage = {
  products: Product[];
  total: number;
  limit: number;
  skip: number;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Retries on network errors/5xx; 4xx responses are treated as non-retriable.
async function fetchWithRetry(url: string): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(url, { cache: 'no-store' });

      if (response.ok) {
        return response;
      }

      if (response.status >= 400 && response.status < 500) {
        throw new Error(`Products request failed with status ${response.status}.`);
      }

      lastError = new Error(`Products request failed with status ${response.status}.`);
    } catch (error) {
      lastError = error;
    }

    if (attempt < MAX_ATTEMPTS) {
      await sleep(RETRY_DELAYS_MS[attempt - 1]);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Failed to fetch products.');
}

export async function fetchProducts(
  query: string,
  currentPage: number,
  limit = 10,
): Promise<ProductsPage> {
  const skip = (currentPage - 1) * limit;
  const url = query
    ? `${DUMMYJSON_BASE_URL}/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`
    : `${DUMMYJSON_BASE_URL}?limit=${limit}&skip=${skip}`;

  try {
    const response = await fetchWithRetry(url);
    return (await response.json()) as ProductsPage;
  } catch (error) {
    console.error('fetchProducts failed:', error);
    throw new Error('Failed to load products. Please try again later.');
  }
}
