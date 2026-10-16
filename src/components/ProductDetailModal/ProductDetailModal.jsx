import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  Truck,
  Store,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  Sparkles,
  MapPin
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useStore } from '../../context/StoreContext';
import './ProductDetailModal.scss';

export default function ProductDetailModal({ product, onClose }) {
  if (!product) return null;

  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { stores, selectedStore } = useStore();

  const [activeImage, setActiveImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [deliveryType, setDeliveryType] = useState('pickup'); // 'delivery' | 'pickup'

  const favorited = isFavorite(product.id);

  // Check if available in selected store
  const isAvailableInSelectedStore = selectedStore
    ? product.inStockStores.includes(selectedStore.id)
    : true;

  const handleAddToCart = () => {
    addToCart(product, quantity, deliveryType);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="product-detail-modal-card animate-modal-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="btn-modal-close"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        <div className="detail-modal-body">
          {/* Main 2-Column Grid */}
          <div className="detail-main-grid">
            {/* Gallery */}
            <div className="detail-gallery-column">
              <div className="main-image-frame">
                <img src={activeImage} alt={product.name} />
              </div>
              <div className="thumbnails-row">
                <div
                  className={`thumb-btn ${activeImage === product.image ? 'active' : ''}`}
                  onClick={() => setActiveImage(product.image)}
                >
                  <img src={product.image} alt="Ana Görsel" />
                </div>
                {product.secondaryImage && (
                  <div
                    className={`thumb-btn ${activeImage === product.secondaryImage ? 'active' : ''}`}
                    onClick={() => setActiveImage(product.secondaryImage)}
                  >
                    <img src={product.secondaryImage} alt="Detay Görseli" />
                  </div>
                )}
              </div>
            </div>

            {/* Info & Buy Controls */}
            <div className="detail-info-column">
              <div className="category-badge-row">
                <span className="badge badge-primary">{product.category}</span>
                {product.badge && (
                  <span className="badge badge-gold">{product.badge}</span>
                )}
              </div>

              <h2 className="detail-title">{product.name}</h2>

              <div className="detail-rating-row">
                <div className="stars">
                  <Star size={15} fill="#f59e0b" color="#f59e0b" />
                </div>
                <span className="rating-val">{product.rating}</span>
                <span className="review-num">({product.reviewCount} Değerlendirme)</span>
              </div>

              {/* Price Box */}
              <div className="detail-price-box">
                <span className="current-price-val">
                  {product.price.toLocaleString('tr-TR')} ₺
                </span>
                {product.originalPrice > product.price && (
                  <span className="old-price-val">
                    {product.originalPrice.toLocaleString('tr-TR')} ₺
                  </span>
                )}
                <div className="points-perk">
                  <Sparkles size={14} />
                  <span>+{Math.round(product.price * 0.1)} NovaPuan Kazan</span>
                </div>
              </div>

              <p className="detail-description">{product.description}</p>

              {/* Delivery Choice */}
              <div className="delivery-options-box">
                <div className="opt-title">Teslimat Yöntemi Tercihi</div>
                <div className="delivery-options-grid">
                  <div
                    className={`delivery-radio-card ${deliveryType === 'pickup' ? 'selected' : ''}`}
                    onClick={() => setDeliveryType('pickup')}
                  >
                    <Store size={18} color="var(--primary)" />
                    <div className="del-info">
                      <div className="del-name">Mağazadan Hemen Teslim</div>
                      <div className="del-desc">
                        {isAvailableInSelectedStore
                          ? `${selectedStore?.name} (2 Saatte Hazır)`
                          : 'Seçili mağazada tükenmiş'}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`delivery-radio-card ${deliveryType === 'delivery' ? 'selected' : ''}`}
                    onClick={() => setDeliveryType('delivery')}
                  >
                    <Truck size={18} color="var(--primary)" />
                    <div className="del-info">
                      <div className="del-name">Adrese Express Kargo</div>
                      <div className="del-desc">Saat 16:00'ya kadar aynı gün kurye</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity Stepper & Add Button */}
              <div className="detail-purchase-row">
                <div className="qty-stepper">
                  <button
                    type="button"
                    className="btn-qty"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="qty-val">{quantity}</span>
                  <button
                    type="button"
                    className="btn-qty"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-add-detail"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag size={18} />
                  <span>Sepete Ekle • {(product.price * quantity).toLocaleString('tr-TR')} ₺</span>
                </button>

                <button
                  type="button"
                  className="btn btn-icon btn-glass"
                  onClick={() => toggleFavorite(product)}
                  title={favorited ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                >
                  <Heart
                    size={20}
                    fill={favorited ? '#f43f5e' : 'none'}
                    color={favorited ? '#f43f5e' : 'currentColor'}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Store Availability Table / Inventory Map */}
          <div className="store-availability-box">
            <div className="avail-header">
              <div className="avail-title">
                <Store size={18} color="var(--primary)" />
                <span>Canlı Mağaza Stok Durumu</span>
              </div>
              <span className="avail-note">10 Mağazamızdaki gerçek zamanlı envanter</span>
            </div>

            <div className="stores-pill-list">
              {stores.map((st) => {
                const inStock = product.inStockStores.includes(st.id);
                return (
                  <div key={st.id} className="store-avail-chip">
                    <span className="chip-name">
                      {st.city} - {st.name}
                    </span>
                    <span className={`chip-status ${inStock ? 'in-stock' : 'out-stock'}`}>
                      {inStock ? (
                        <>
                          <CheckCircle2 size={12} style={{ display: 'inline', marginRight: 3 }} />
                          Stokta Var
                        </>
                      ) : (
                        <>
                          <AlertCircle size={12} style={{ display: 'inline', marginRight: 3 }} />
                          Tükendi
                        </>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Technical Specs */}
          {product.specs && (
            <div className="specs-container">
              <h3 className="specs-title">Teknik Özellikler</h3>
              <table className="specs-table">
                <tbody>
                  {Object.entries(product.specs).map(([key, val]) => (
                    <tr key={key}>
                      <td className="spec-key">{key}</td>
                      <td className="spec-val">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
