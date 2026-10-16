import React, { useState, useEffect } from 'react';
import {
  Heart,
  X,
  ShoppingBag,
  Trash2,
  PackageOpen,
  ArrowRight
} from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import { useCart } from '../../context/CartContext';
import { fetchProducts } from '../../services/api';
import './FavoritesModal.scss';

export default function FavoritesModal({ onQuickView }) {
  const {
    favorites,
    isFavoritesOpen,
    closeFavorites,
    toggleFavorite,
    favoriteCount
  } = useFavorites();
  const { addToCart } = useCart();
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isFavoritesOpen) return;

    async function loadFavs() {
      setLoading(true);
      try {
        const all = await fetchProducts();
        const filtered = all.filter(p => favorites.includes(p.id));
        setFavoriteProducts(filtered);
      } catch (err) {
        console.error('Error loading favorite products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFavs();
  }, [favorites, isFavoritesOpen]);

  if (!isFavoritesOpen) return null;

  const handleAddAllToCart = () => {
    favoriteProducts.forEach(product => {
      addToCart(product, 1, 'delivery');
    });
    closeFavorites();
  };

  return (
    <div className="modal-overlay" onClick={closeFavorites}>
      <div
        className="favorites-modal-container animate-modal-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="fav-header">
          <div className="fav-title-box">
            <Heart size={20} color="#f43f5e" fill="#f43f5e" />
            <h3 className="title">Favori Ürünlerim</h3>
            <span className="fav-badge">{favoriteCount}</span>
          </div>
          <button
            type="button"
            className="close-btn"
            onClick={closeFavorites}
          >
            <X size={18} />
          </button>
        </div>

        <div className="fav-scroll-body">
          {favoriteProducts.length === 0 ? (
            <div className="empty-favs">
              <PackageOpen size={48} className="empty-icon" />
              <h4>Henüz Favori Ürününüz Yok</h4>
              <p>Beğendiğiniz ürünlerin üzerindeki kalp ikonuna tıklayarak listenize ekleyebilirsiniz.</p>
            </div>
          ) : (
            <div className="fav-items-grid">
              {favoriteProducts.map((product) => (
                <div key={product.id} className="fav-card">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="fav-img"
                    onClick={() => {
                      onQuickView(product);
                      closeFavorites();
                    }}
                    style={{ cursor: 'pointer' }}
                  />

                  <div className="fav-info">
                    <div
                      className="fav-name"
                      onClick={() => {
                        onQuickView(product);
                        closeFavorites();
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {product.name}
                    </div>
                    <div className="fav-price">
                      {product.price.toLocaleString('tr-TR')} ₺
                    </div>

                    <div className="fav-actions-row">
                      <button
                        type="button"
                        className="btn btn-primary btn-fav-cart"
                        onClick={() => addToCart(product, 1, 'delivery')}
                      >
                        <ShoppingBag size={13} />
                        <span>Sepete Ekle</span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-remove-fav"
                    onClick={() => toggleFavorite(product)}
                    title="Favorilerden Çıkar"
                  >
                    <Heart size={18} fill="#f43f5e" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {favoriteProducts.length > 0 && (
          <div className="fav-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddAllToCart}
            >
              <ShoppingBag size={16} />
              <span>Tümünü Sepete Ekle</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
