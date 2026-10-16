import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Package, Store, ArrowRight } from 'lucide-react';
import { fetchProducts, fetchStores } from '../../services/api';
import './SearchModal.scss';

export default function SearchModal({
  isOpen,
  onClose,
  onSelectProduct,
  onSelectStore
}) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'products', 'stores'
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle global keyboard shortcut Cmd+K or Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Perform search query via client-side fetch API
  useEffect(() => {
    if (!isOpen) return;

    let isCancelled = false;
    async function searchData() {
      setLoading(true);
      try {
        const [prodResults, storeResults] = await Promise.all([
          fetchProducts({ query }),
          fetchStores({ query })
        ]);
        if (!isCancelled) {
          setProducts(prodResults);
          setStores(storeResults);
        }
      } catch (err) {
        console.error('Search query error:', err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    const timer = setTimeout(searchData, 150);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [query, isOpen]);

  if (!isOpen) return null;

  const popularChips = [
    'Kablosuz Kulaklık',
    'Titanyum Saat',
    'Zorlu Center',
    'Espresso Makinesi',
    'Kadıköy',
    'Termos'
  ];

  const showProducts = activeTab === 'all' || activeTab === 'products';
  const showStores = activeTab === 'all' || activeTab === 'stores';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="search-modal-container animate-modal-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="search-header-box">
          <Search size={22} color="var(--primary)" />
          <input
            ref={inputRef}
            type="text"
            className="search-input-field"
            placeholder="Ürün adı, mağaza veya şehir yazın..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              className="close-search-btn"
              onClick={() => setQuery('')}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="search-filter-tabs">
          <button
            type="button"
            className={`search-tab-pill ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Tüm Sonuçlar ({products.length + stores.length})
          </button>
          <button
            type="button"
            className={`search-tab-pill ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Ürünler ({products.length})
          </button>
          <button
            type="button"
            className={`search-tab-pill ${activeTab === 'stores' ? 'active' : ''}`}
            onClick={() => setActiveTab('stores')}
          >
            Mağazalar & Şehirler ({stores.length})
          </button>
        </div>

        {/* Popular chips */}
        <div className="popular-searches">
          <span className="popular-label">Hızlı Arama:</span>
          {popularChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              className="popular-chip"
              onClick={() => setQuery(chip)}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="search-results-area">
          {loading ? (
            <div className="search-empty-state">
              <p>Sonuçlar taranıyor...</p>
            </div>
          ) : products.length === 0 && stores.length === 0 ? (
            <div className="search-empty-state">
              <Search size={36} className="empty-icon" />
              <p>"{query}" ile eşleşen ürün veya mağaza bulunamadı.</p>
            </div>
          ) : (
            <>
              {/* Product Results */}
              {showProducts && products.length > 0 && (
                <div className="results-group">
                  <div className="section-title-sm">
                    <Package size={15} />
                    <span>Ürünler ({products.length})</span>
                  </div>
                  {products.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="search-product-item"
                      onClick={() => {
                        onSelectProduct(item);
                        onClose();
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="search-item-thumb"
                      />
                      <div className="search-item-info">
                        <div className="item-name">{item.name}</div>
                        <div className="item-category">
                          {item.specs?.['Garanti'] || item.badge || 'Orijinal Ürün'}
                        </div>
                      </div>
                      <div className="search-item-price-box">
                        <div className="current-price">
                          {item.price.toLocaleString('tr-TR')} ₺
                        </div>
                        {item.discountRate > 0 && (
                          <span className="discount-pill">
                            -%{item.discountRate}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Store Results */}
              {showStores && stores.length > 0 && (
                <div className="results-group">
                  <div className="section-title-sm">
                    <Store size={15} />
                    <span>Mağazalar & Lokasyonlar ({stores.length})</span>
                  </div>
                  {stores.map((store) => (
                    <div
                      key={store.id}
                      className="search-store-item"
                      onClick={() => {
                        onSelectStore(store);
                        onClose();
                      }}
                    >
                      <div className="store-icon-wrap">
                        <MapPin size={20} />
                      </div>
                      <div className="store-item-content">
                        <div className="store-item-name">{store.name}</div>
                        <div className="store-item-location">
                          {store.city} • {store.district} • {store.hours}
                        </div>
                      </div>
                      <span className="select-store-pill">
                        Mağazayı Seç <ArrowRight size={12} style={{ display: 'inline', marginLeft: 4 }} />
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
