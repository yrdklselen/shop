import React from 'react';
import {
  Heart,
  ShoppingBag,
  Star,
  CheckCircle2,
  AlertCircle,
  Eye,
  Store
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useStore } from '../../context/StoreContext';
import './ProductCard.scss';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { selectedStore } = useStore();

  const favorited = isFavorite(product.id);

  // Check if product is in stock at the currently selected store
  const isInSelectedStore = selectedStore
    ? product.inStockStores.includes(selectedStore.id)
    : true;

  return (
    <div className="product-card">
      <div className="card-media-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-img"
          loading="lazy"
        />

        {/* Badges */}
        <div className="card-top-badges">
          {product.badge && (
            <span className="badge badge-primary">{product.badge}</span>
          )}
          {product.discountRate > 0 && (
            <span className="badge badge-hot">-%{product.discountRate}</span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          className={`btn-card-favorite ${favorited ? 'is-favorite' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product);
          }}
          title={favorited ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
        >
          <Heart size={18} fill={favorited ? '#f43f5e' : 'none'} />
        </button>

        {/* Quick View Trigger on Hover */}
        <button
          type="button"
          className="quick-view-overlay-btn"
          onClick={() => onQuickView(product)}
        >
          <Eye size={15} />
          <span>Hızlı İncele</span>
        </button>
      </div>

      <div className="card-body">
        {/* Store Stock Tag */}
        <div
          className={`store-stock-tag ${isInSelectedStore ? 'in-stock' : 'out-of-stock'}`}
        >
          {isInSelectedStore ? (
            <>
              <CheckCircle2 size={13} />
              <span>
                {selectedStore ? selectedStore.name : 'Mağazada'} Stokta
              </span>
            </>
          ) : (
            <>
              <AlertCircle size={13} />
              <span>Merkez Depodan Gönderim</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3
          className="product-title"
          onClick={() => onQuickView(product)}
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Ratings */}
        <div className="ratings-row">
          <div className="stars-group">
            <Star size={13} fill="#f59e0b" color="#f59e0b" />
          </div>
          <span className="rating-num">{product.rating}</span>
          <span>({product.reviewCount})</span>
        </div>

        {/* Footer: Price & Add to Cart */}
        <div className="card-footer-row">
          <div className="price-stack">
            {product.originalPrice > product.price && (
              <span className="original-price">
                {product.originalPrice.toLocaleString('tr-TR')} ₺
              </span>
            )}
            <span className="current-price">
              {product.price.toLocaleString('tr-TR')} ₺
            </span>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-add-cart"
            onClick={() => addToCart(product, 1, isInSelectedStore ? 'pickup' : 'delivery')}
            title="Sepete Ekle"
          >
            <ShoppingBag size={15} />
            <span>Ekle</span>
          </button>
        </div>
      </div>
    </div>
  );
}
