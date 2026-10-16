import React from 'react';
import {
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  Store,
  Truck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import './HeroBanner.scss';

export default function HeroBanner({ onOpenSearch, onScrollToCatalog }) {
  const { selectedStore, selectedCity, openStoreModal } = useStore();

  return (
    <section className="hero-banner">
      <div className="grid-container">
        <div className="hero-grid">
          {/* Left Column: Headline & CTA */}
          <div className="hero-content">
            <div className="hero-eyebrow">
              <Sparkles size={14} />
              <span>Yeni Nesil Hibrit Perakende Deneyimi</span>
            </div>

            <h1 className="hero-title">
              Mağazadan Kapınıza, <br />
              <span className="highlight">Aynı Gün Hızında.</span>
            </h1>

            <p className="hero-description">
              {selectedCity} ve Türkiye genelindeki seçkin mağazalarımızdan ister 
              <strong> 2 saatte hemen teslim alın</strong> (Click & Collect), ister 
              aynı gün kapınıza teslim edelim.
            </p>

            <div className="hero-actions-row">
              <button
                type="button"
                className="btn btn-primary"
                onClick={onScrollToCatalog}
              >
                <span>Koleksiyonu Keşfet</span>
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                className="btn btn-glass"
                onClick={onOpenSearch}
              >
                <span>Ürün veya Mağaza Ara</span>
              </button>

              <div className="store-location-badge">
                <MapPin size={16} color="var(--primary)" />
                <span>
                  Konum: <strong>{selectedCity}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Perks Card */}
          <div className="hero-visual-card">
            <div className="visual-card-header">
              <div className="card-tag">
                <Zap size={13} />
                <span>Nova Omnichannel Ağı</span>
              </div>
              <span className="store-live-counter">10 Flagship Nokta</span>
            </div>

            <div className="hero-perks-grid">
              <div className="perk-box">
                <div className="perk-icon-wrap">
                  <Clock size={18} />
                </div>
                <div className="perk-title">Click & Collect</div>
                <div className="perk-sub">2 Saatte Mağazadan Teslim</div>
              </div>

              <div className="perk-box">
                <div className="perk-icon-wrap">
                  <Truck size={18} />
                </div>
                <div className="perk-title">Express Kurye</div>
                <div className="perk-sub">Aynı Gün Kapınızda</div>
              </div>

              <div className="perk-box">
                <div className="perk-icon-wrap">
                  <ShieldCheck size={18} />
                </div>
                <div className="perk-title">Resmi Distribütör</div>
                <div className="perk-sub">2 Yıl Birebir Değişim</div>
              </div>

              <div className="perk-box">
                <div className="perk-icon-wrap">
                  <Sparkles size={18} />
                </div>
                <div className="perk-title">NovaClub Puan</div>
                <div className="perk-sub">Her Alışverişte %10 Puan</div>
              </div>
            </div>

            {/* Quick Switch Store Bar */}
            <div className="hero-store-bar">
              <div className="store-label-group">
                <Store size={16} className="bar-pin" />
                <span className="bar-name">
                  {selectedStore ? selectedStore.name : `${selectedCity} Mağazası`}
                </span>
              </div>
              <span
                className="btn-quick-switch"
                onClick={openStoreModal}
              >
                Değiştir →
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
