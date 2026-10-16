// ==========================================
// CLIENT-SIDE DATA FETCHING SERVICE (FETCH API)
// ==========================================

/**
 * Native client-side fetch helper with error handling & simulated latency
 */
async function fetchJson(endpoint) {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Fetch Error on [${endpoint}]:`, error);
    throw error;
  }
}

/**
 * Fetch all categories
 */
export async function fetchCategories() {
  return await fetchJson('/api/categories.json');
}

/**
 * Fetch retail stores with optional city or search query filter
 */
export async function fetchStores(options = {}) {
  const stores = await fetchJson('/api/stores.json');
  const { city, query } = options;

  let filtered = [...stores];

  if (city && city !== 'all') {
    filtered = filtered.filter(
      store => store.city.toLowerCase() === city.toLowerCase()
    );
  }

  if (query && query.trim() !== '') {
    const q = query.toLowerCase().trim();
    filtered = filtered.filter(
      store =>
        store.name.toLowerCase().includes(q) ||
        store.city.toLowerCase().includes(q) ||
        store.district.toLowerCase().includes(q) ||
        store.address.toLowerCase().includes(q)
    );
  }

  return filtered;
}

/**
 * Fetch products with extensive search, category, store-stock, and sorting filters
 */
export async function fetchProducts(options = {}) {
  const products = await fetchJson('/api/products.json');
  const {
    query = '',
    category = 'all',
    storeId = null,
    inStockOnly = false,
    sortBy = 'featured',
    maxPrice = null
  } = options;

  let filtered = [...products];

  // Search by keyword (product name, description, tags, specs)
  if (query && query.trim() !== '') {
    const q = query.toLowerCase().trim();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.features?.some(f => f.toLowerCase().includes(q))
    );
  }

  // Filter by category
  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }

  // Filter by store inventory (in-stock at selected retail store)
  if (storeId && inStockOnly) {
    filtered = filtered.filter(p => p.inStockStores.includes(storeId));
  }

  // Filter by maximum price
  if (maxPrice) {
    filtered = filtered.filter(p => p.price <= maxPrice);
  }

  // Sorting
  if (sortBy === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'discount') {
    filtered.sort((a, b) => b.discountRate - a.discountRate);
  }

  return filtered;
}

/**
 * Fetch recommended products (Önerilenler)
 */
export async function fetchRecommendedProducts() {
  const products = await fetchJson('/api/products.json');
  return products.filter(p => p.isRecommended || p.isTrending);
}

/**
 * Fetch connected user profile
 */
export async function fetchUserProfile() {
  return await fetchJson('/api/user.json');
}
