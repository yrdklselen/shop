import React, { useState, useEffect } from 'react';
import { Sparkles, Compass, UserCheck } from 'lucide-react';
import { fetchRecommendedProducts } from '../../services/api';
import { useUser } from '../../context/UserContext';
import ProductCard from '../ProductCard/ProductCard';
import './RecommendedSection.scss';

export default function RecommendedSection({ onQuickView }) {
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchRecommendedProducts();
        setRecommended(data);
      } catch (err) {
        console.error('Error fetching recommended items:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || recommended.length === 0) return null;

  return (
    <section className="recommended-section">
      <div className="grid-container">
        {/* Personalized Welcome Box */}
        <div className="recommended-banner-box">
          <div className="banner-top-row">
            <div className="user-greeting-badge">
              <UserCheck size={14} />
              <span>
                {user ? `${user.name} İçin Özel Seçimler` : 'Sizin İçin Önerilenler'}
              </span>
            </div>
            <span className="ai-tag">Nova Akıllı Eşleştirme</span>
          </div>

          <h2 className="banner-headline">
            Favorilerinize ve İlgi Alanlarınıza Özel Tavsiyeler
          </h2>
          <p className="banner-subtext">
            Koleksiyonumuzdaki en yüksek müşteri memnuniyetine sahip, seçili mağazalarınızda hemen teslim alabileceğiniz ayrıcalıklı ürünler.
          </p>
        </div>

        {/* CSS Grid for Recommended Cards */}
        <div className="recommended-grid">
          {recommended.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
