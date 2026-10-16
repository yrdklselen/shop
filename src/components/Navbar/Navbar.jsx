import React from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  MapPin,
  Sun,
  Moon,
  Store,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useUser } from '../../context/UserContext';
import './Navbar.scss';

export default function Navbar({ onOpenSearch }) {
  const { isDark, toggleTheme } = useTheme();
  const { selectedStore, selectedCity, openStoreModal } = useStore();
  const { openCart, totalItemsCount } = useCart();
  const { openFavorites, favoriteCount } = useFavorites();
  const { user, openProfile } = useUser();

  return (
    <header className="navbar">
      <div className="grid-container">
        <div className="nav-inner">
          {/* Brand Logo */}
          <div className="brand-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="logo-badge">
              <ShoppingBag size={20} />
            </div>
            <div className="brand-title">
              NOVA
              <span className="brand-sub">Perakende</span>
            </div>
          </div>

          {/* Store / City Trigger Pill */}
          <button
            type="button"
            className="store-pill-trigger"
            onClick={openStoreModal}
            title="Şehir ve Mağaza Değiştir"
          >
            <MapPin size={17} className="pin-icon" />
            <div className="store-info-text">
              <span className="store-city">{selectedCity}</span>
              <span className="store-name">
                {selectedStore ? selectedStore.name : 'Mağaza Seçiniz'}
              </span>
            </div>
            <ChevronDown size={14} />
          </button>

          {/* Quick Search Trigger */}
          <div className="search-bar-trigger" onClick={onOpenSearch}>
            <Search size={17} />
            <span>Ürün, mağaza veya şehir ara...</span>
            <span className="search-kbd">⌘K</span>
          </div>

          {/* Actions: Theme Toggle, Wishlist, Cart, Profile */}
          <div className="nav-actions">
            {/* Mobile Search Button */}
            <button
              type="button"
              className="btn btn-icon btn-glass mobile-search-btn"
              onClick={onOpenSearch}
              style={{ display: 'none' }}
              title="Arama Yap"
            >
              <Search size={19} />
            </button>

            {/* Dark / Light Mode Switch */}
            <button
              type="button"
              className="btn btn-icon btn-glass theme-toggle-btn"
              onClick={toggleTheme}
              title={isDark ? 'Açık Mod' : 'Koyu Mod'}
            >
              {isDark ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            {/* Favorites Wishlist */}
            <div className="action-badge-wrap">
              <button
                type="button"
                className="btn btn-icon btn-glass"
                onClick={openFavorites}
                title="Favorilerim"
              >
                <Heart size={19} />
              </button>
              {favoriteCount > 0 && (
                <span className="badge-counter">{favoriteCount}</span>
              )}
            </div>

            {/* Cart Drawer */}
            <div className="action-badge-wrap">
              <button
                type="button"
                className="btn btn-icon btn-glass"
                onClick={openCart}
                title="Sepetim"
              >
                <ShoppingBag size={19} />
              </button>
              {totalItemsCount > 0 && (
                <span className="badge-counter">{totalItemsCount}</span>
              )}
            </div>

            {/* Connected User Profile */}
            {user && (
              <button
                type="button"
                className="user-profile-btn"
                onClick={openProfile}
                title="Kullanıcı Profili ve Siparişlerim"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="user-avatar-img"
                />
                <div className="user-details">
                  <span className="user-name">{user.name}</span>
                  <span className="user-tier">
                    <Sparkles size={11} style={{ display: 'inline', marginRight: 2 }} />
                    {user.tier}
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
