import React, { useState, useEffect } from 'react';
import {
  Layers,
  Smartphone,
  Headphones,
  Shirt,
  Coffee,
  SlidersHorizontal,
  RefreshCw,
  Search,
  CheckCircle2,
  PackageOpen
} from 'lucide-react';
import { fetchProducts, fetchCategories } from '../../services/api';
import { useStore } from '../../context/StoreContext';
import ProductCard from '../ProductCard/ProductCard';
import './ProductGrid.scss';

export default function ProductGrid({ onQuickView }) {
  const { selectedStore } = useStore();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);

  // Load Categories via native fetch
  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await fetchCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCategories();
  }, []);

  // Load Products via native fetch when filters change
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await fetchProducts({
          category: selectedCategory,
          storeId: selectedStore?.id,
          inStockOnly: inStockOnly,
          sortBy: sortBy
        });
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [selectedCategory, selectedStore, inStockOnly, sortBy]);

  // Icon mapping for categories
  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone size={16} />;
      case 'Headphones':
        return <Headphones size={16} />;
      case 'Shirt':
        return <Shirt size={16} />;
      case 'Coffee':
        return <Coffee size={16} />;
      default:
        return <Layers size={16} />;
    }
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <section className="catalog-section" id="catalog-section">
      <div className="grid-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="title-group">
            <span className="section-eyebrow">
              <Layers size={14} />
              Özel Mağaza Kataloğu
            </span>
            <h2 className="section-title">En Yeni ve Popüler Ürünler</h2>
            <p className="section-desc">
              Tüm ürünlerimiz resmi distribütör garantili olup, seçili mağazalarımızda hemen teslime hazırdır.
            </p>
          </div>
        </div>

        {/* Filter Controls Card */}
        <div className="catalog-controls-card">
          <div className="catalog-top-bar">
            {/* Category Filter Pills */}
            <div className="category-pills-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-tab-btn ${selectedCategory === cat.slug ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.slug)}
                >
                  {getCategoryIcon(cat.icon)}
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="sort-group">
              <SlidersHorizontal size={16} color="var(--text-muted)" />
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Öne Çıkanlar</option>
                <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                <option value="rating">En Yüksek Puanlılar</option>
                <option value="discount">En Çok İndirimdekiler</option>
              </select>
            </div>
          </div>

          {/* Secondary Store Inventory Toggle Bar */}
          <div className="catalog-secondary-bar">
            <div
              className="store-stock-toggle"
              onClick={() => setInStockOnly(!inStockOnly)}
            >
              <div
                className={`toggle-switch-track ${inStockOnly ? 'is-checked' : ''}`}
              >
                <div className="toggle-switch-thumb" />
              </div>
              <span className="toggle-label">
                Sadece <strong>{selectedStore ? selectedStore.name : 'Seçili Mağaza'}</strong>'da stokta olanları göster
              </span>
            </div>

            <div className="results-count-text">
              Toplam <strong>{products.length}</strong> ürün listeleniyor
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="catalog-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="shimmer-loading"
                style={{ height: '380px', borderRadius: '18px' }}
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="catalog-empty-card">
            <PackageOpen size={48} className="empty-icon" />
            <h3 className="empty-title">Ürün Bulunamadı</h3>
            <p className="empty-desc">
              {inStockOnly
                ? `Bu kategorideki ürünler şu an ${selectedStore?.name} şubesinde tükenmiş görünüyor. Şubeyi değiştirebilir veya filtreyi kaldırabilirsiniz.`
                : 'Seçili filtrelere uygun ürün bulunamadı. Lütfen filtrelerinizi sıfırlayın.'}
            </p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetFilters}
            >
              <RefreshCw size={15} />
              <span>Filtreleri Sıfırla</span>
            </button>
          </div>
        ) : (
          <div className="catalog-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
