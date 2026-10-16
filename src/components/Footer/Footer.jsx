import React, { useState } from 'react';
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  ShoppingBag,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import './Footer.scss';

export default function Footer({ onOpenSearch }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="site-footer">
      <div className="grid-container">
        {/* 4 Pillars Trust Bar */}
        <div className="trust-bar">
          <div className="trust-item">
            <div className="icon-box">
              <Truck size={22} />
            </div>
            <div className="trust-text">
              <div className="title">Aynı Gün Teslimat</div>
              <div className="desc">Seçili şehirlerde saat 16:00'ya kadar kapınızda veya 2 saatte mağazada.</div>
            </div>
          </div>

          <div className="trust-item">
            <div className="icon-box">
              <ShieldCheck size={22} />
            </div>
            <div className="trust-text">
              <div className="title">%100 Orijinal Ürün</div>
              <div className="desc">Doğrudan yetkili distribütör garantisi ve birebir değişim desteği.</div>
            </div>
          </div>

          <div className="trust-item">
            <div className="icon-box">
              <RotateCcw size={22} />
            </div>
            <div className="trust-text">
              <div className="title">14 Gün Kolay İade</div>
              <div className="desc">Dilediğiniz Nova mağazasından anında ücretsiz iade veya değişim.</div>
            </div>
          </div>

          <div className="trust-item">
            <div className="icon-box">
              <Headphones size={22} />
            </div>
            <div className="trust-text">
              <div className="title">7/24 Nova Asistan</div>
              <div className="desc">Uzman teknoloji ve ürün danışmanlarıyla anında canlı destek.</div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="footer-links-grid">
          {/* Brand Info */}
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingBag size={18} />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                NOVA
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
              Yeni nesil hibrit perakende deneyimi. İstanbul, Ankara, İzmir, Bursa ve Antalya mağazalarımızla dijital ve fiziksel alışverişi birleştiriyoruz.
            </p>
          </div>

          {/* Quick Categories */}
          <div className="footer-col">
            <h4 className="col-title">Kategoriler</h4>
            <ul className="footer-links">
              <li><a href="#catalog-section">Teknoloji & Akıllı Yaşam</a></li>
              <li><a href="#catalog-section">Ses & Hi-Fi Akustik</a></li>
              <li><a href="#catalog-section">Moda & Aksesuar</a></li>
              <li><a href="#catalog-section">Ev & Nitelikli Gurme</a></li>
              <li><a href="#catalog-section">Yeni Gelenler</a></li>
            </ul>
          </div>

          {/* Flagship Locations */}
          <div className="footer-col">
            <h4 className="col-title">Mağazalarımız</h4>
            <ul className="footer-links">
              <li><a href="#stores-section">İstanbul - Zorlu Center Flagship</a></li>
              <li><a href="#stores-section">İstanbul - Kanyon & Bağdat Cad.</a></li>
              <li><a href="#stores-section">Ankara - Panora & Tunalı Hilmi</a></li>
              <li><a href="#stores-section">İzmir - İstinyePark & Alsancak</a></li>
              <li><a href="#stores-section">Bursa & Antalya Şubeleri</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-col">
            <h4 className="col-title">NovaClub Bülteni</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Özel indirimler, lansmanlar ve üyelere özel avantajlardan ilk siz haberdar olun.
            </p>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <div className="input-row">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary">
                  <ArrowRight size={16} />
                </button>
              </div>
              {subscribed && (
                <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>
                  ✓ NovaClub bültenine başarıyla abone oldunuz!
                </span>
              )}
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <div>
            © 2026 NOVA Perakende Mağazacılık A.Ş. Tüm hakları saklıdır.
          </div>
          <div className="payment-icons">
            <span>Visa</span> • <span>Mastercard</span> • <span>Troy</span> • <span>BKM Express</span> • <span>Taksit İmkanı</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
