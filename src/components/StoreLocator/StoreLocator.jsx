import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  Star,
  Store,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import './StoreLocator.scss';

export default function StoreLocator() {
  const { stores, selectedStore, selectStore, cities } = useStore();
  const [activeCity, setActiveCity] = useState('Tüm Şehirler');

  const displayedStores = stores.filter(st =>
    activeCity === 'Tüm Şehirler' ? true : st.city === activeCity
  );

  return (
    <section className="store-locator-section" id="stores-section">
      <div className="grid-container">
        {/* Header */}
        <div className="section-header">
          <div className="title-group">
            <span className="section-eyebrow">
              <Store size={14} />
              Fiziksel Lokasyonlarımız
            </span>
            <h2 className="section-title">Şehrinizdeki Nova Mağazaları</h2>
            <p className="section-desc">
              Tüm mağazalarımızda deneyimleme alanları, aynı gün Click & Collect ve uzman teknik danışmanlarımız sizi bekliyor.
            </p>
          </div>
        </div>

        {/* City Filter Pills */}
        <div className="locator-top-bar">
          <div className="city-filter-chips">
            {cities.map((city) => (
              <button
                key={city}
                type="button"
                className={`city-tab-chip ${activeCity === city ? 'active' : ''}`}
                onClick={() => setActiveCity(city)}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* CSS Grid for Stores */}
        <div className="stores-grid">
          {displayedStores.map((st) => {
            const isCurrent = selectedStore?.id === st.id;

            return (
              <div
                key={st.id}
                className={`locator-store-card ${isCurrent ? 'is-active-store' : ''}`}
              >
                <img
                  src={st.image}
                  alt={st.name}
                  className="card-photo"
                  loading="lazy"
                />

                <div className="card-content">
                  <div className="store-name-row">
                    <h3 className="name">{st.name}</h3>
                    <div className="rating">
                      <Star size={13} fill="#f59e0b" color="#f59e0b" />
                      <span>{st.rating}</span>
                    </div>
                  </div>

                  <div className="location-sub">
                    <MapPin size={15} style={{ flexShrink: 0, marginTop: 2, color: 'var(--primary)' }} />
                    <span>{st.address}</span>
                  </div>

                  <div className="perks-row">
                    <span className="perk-tag">
                      <Clock size={11} style={{ display: 'inline', marginRight: 3 }} />
                      {st.hours}
                    </span>
                    {st.clickAndCollect && (
                      <span className="perk-tag" style={{ color: '#10b981' }}>
                        ✓ 2 Saatte Teslim
                      </span>
                    )}
                    <span className="perk-tag">
                      <Phone size={11} style={{ display: 'inline', marginRight: 3 }} />
                      {st.phone}
                    </span>
                  </div>

                  <button
                    type="button"
                    className={`btn btn-set-store ${isCurrent ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => selectStore(st)}
                  >
                    {isCurrent ? (
                      <>
                        <CheckCircle2 size={15} />
                        <span>Seçili Mağazanız</span>
                      </>
                    ) : (
                      <>
                        <span>Bu Mağazayı Seç</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
