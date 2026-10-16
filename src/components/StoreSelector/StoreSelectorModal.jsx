import React, { useState, useMemo } from 'react';
import {
  X,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  Star,
  Search,
  Truck,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import './StoreSelectorModal.scss';

export default function StoreSelectorModal() {
  const {
    stores,
    selectedCity,
    selectedStore,
    selectStore,
    changeCity,
    cities,
    isStoreModalOpen,
    closeStoreModal
  } = useStore();

  const [activeCityTab, setActiveCityTab] = useState(selectedCity || 'İstanbul');
  const [storeSearch, setStoreSearch] = useState('');

  // Filtered stores by city tab and search term
  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      const matchesCity =
        activeCityTab === 'Tüm Şehirler' ||
        store.city.toLowerCase() === activeCityTab.toLowerCase();

      const q = storeSearch.toLowerCase().trim();
      const matchesQuery =
        !q ||
        store.name.toLowerCase().includes(q) ||
        store.district.toLowerCase().includes(q) ||
        store.address.toLowerCase().includes(q);

      return matchesCity && matchesQuery;
    });
  }, [stores, activeCityTab, storeSearch]);

  if (!isStoreModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeStoreModal}>
      <div
        className="store-modal-container animate-modal-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="store-modal-header">
          <div className="header-text">
            <h3 className="modal-title">Mağazanızı ve Şehrinizi Seçin</h3>
            <p className="modal-subtitle">
              Siparişlerinizi 2 saatte mağazadan teslim alın veya aynı gün kurye ile getirelim.
            </p>
          </div>
          <button
            type="button"
            className="close-btn"
            onClick={closeStoreModal}
          >
            <X size={18} />
          </button>
        </div>

        {/* Controls: City Pills & Search Bar */}
        <div className="store-controls-bar">
          <div className="city-pills-row">
            {cities.map((city) => (
              <button
                key={city}
                type="button"
                className={`city-pill ${activeCityTab === city ? 'active' : ''}`}
                onClick={() => {
                  setActiveCityTab(city);
                  if (city !== 'Tüm Şehirler') changeCity(city);
                }}
              >
                {city}
              </button>
            ))}
          </div>

          <div className="store-search-field">
            <Search size={17} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Mağaza adı, AVM veya ilçe ara..."
              value={storeSearch}
              onChange={(e) => setStoreSearch(e.target.value)}
            />
            {storeSearch && (
              <button
                type="button"
                onClick={() => setStoreSearch('')}
                style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Stores Grid */}
        <div className="store-cards-scroll-body">
          {filteredStores.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <p>Bu filtreye uygun mağaza bulunamadı.</p>
            </div>
          ) : (
            <div className="store-grid-layout">
              {filteredStores.map((store) => {
                const isCurrent = selectedStore?.id === store.id;

                return (
                  <div
                    key={store.id}
                    className={`store-card ${isCurrent ? 'is-selected' : ''}`}
                  >
                    {isCurrent && (
                      <span className="selected-ribbon">
                        <CheckCircle2 size={12} style={{ display: 'inline', marginRight: 4 }} />
                        Seçili Mağazanız
                      </span>
                    )}

                    <img
                      src={store.image}
                      alt={store.name}
                      className="store-card-image"
                    />

                    <div className="store-card-body">
                      <div className="card-title-row">
                        <div className="store-card-name">{store.name}</div>
                        <div className="store-rating-badge">
                          <Star size={13} fill="#f59e0b" color="#f59e0b" />
                          <span>{store.rating}</span>
                        </div>
                      </div>

                      <div className="store-address">
                        <MapPin size={15} style={{ flexShrink: 0, marginTop: 2, color: 'var(--primary)' }} />
                        <span>{store.address}</span>
                      </div>

                      <div className="store-meta-features">
                        <span className="meta-chip">
                          <Clock size={12} />
                          {store.hours}
                        </span>
                        {store.clickAndCollect && (
                          <span className="meta-chip chip-success">
                            <CheckCircle2 size={12} />
                            Hemen Teslim Al
                          </span>
                        )}
                        {store.expressDelivery && (
                          <span className="meta-chip chip-success">
                            <Truck size={12} />
                            Express Kurye
                          </span>
                        )}
                        <span className="meta-chip">
                          <Phone size={12} />
                          {store.phone}
                        </span>
                      </div>

                      <div className="store-card-actions">
                        <button
                          type="button"
                          className={`btn btn-select-store ${isCurrent ? 'btn-secondary' : 'btn-primary'}`}
                          onClick={() => selectStore(store)}
                        >
                          {isCurrent ? 'Mevcut Mağazanız' : 'Bu Mağazayı Seç'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
