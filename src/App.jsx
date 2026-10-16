import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { UserProvider } from './context/UserContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { CartProvider, useCart } from './context/CartContext';

import Navbar from './components/Navbar/Navbar';
import HeroBanner from './components/HeroBanner/HeroBanner';
import RecommendedSection from './components/RecommendedSection/RecommendedSection';
import ProductGrid from './components/ProductGrid/ProductGrid';
import StoreLocator from './components/StoreLocator/StoreLocator';
import Footer from './components/Footer/Footer';

import SearchModal from './components/SearchModal/SearchModal';
import StoreSelectorModal from './components/StoreSelector/StoreSelectorModal';
import ProductDetailModal from './components/ProductDetailModal/ProductDetailModal';
import CartDrawer from './components/CartDrawer/CartDrawer';
import FavoritesModal from './components/FavoritesModal/FavoritesModal';
import ProfileModal from './components/ProfileModal/ProfileModal';

import { CheckCircle2 } from 'lucide-react';
import './styles/main.scss';
import './App.scss';

function ShopApp() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState(null);
  const { toastMessage } = useCart();
  const { selectStore } = useStore();

  const handleScrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-wrapper">
      {/* Sticky Glass Navbar */}
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main Content Sections */}
      <main className="main-content">
        {/* Hero Banner with Perks */}
        <HeroBanner
          onOpenSearch={() => setIsSearchOpen(true)}
          onScrollToCatalog={handleScrollToCatalog}
        />

        {/* Personalized Recommended Products ("Önerilenler" - Connected to user profile) */}
        <RecommendedSection
          onQuickView={(product) => setSelectedProductForDetail(product)}
        />

        {/* Main Product Catalog with Categories & Store Stock Filter */}
        <ProductGrid
          onQuickView={(product) => setSelectedProductForDetail(product)}
        />

        {/* Retail Store Branches Locator with City Filter */}
        <StoreLocator />
      </main>

      {/* Modern Footer with Trust Pillars & Newsletter */}
      <Footer onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Global Interactive Modals & Drawers */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(product) => setSelectedProductForDetail(product)}
        onSelectStore={(store) => selectStore(store)}
      />

      <StoreSelectorModal />

      <ProductDetailModal
        product={selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
      />

      <CartDrawer />

      <FavoritesModal
        onQuickView={(product) => setSelectedProductForDetail(product)}
      />

      <ProfileModal />

      {/* Real-time Toast Notifications */}
      {toastMessage && (
        <div className="global-toast-notification">
          <CheckCircle2 size={18} className="toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <UserProvider>
          <FavoritesProvider>
            <CartProvider>
              <ShopApp />
            </CartProvider>
          </FavoritesProvider>
        </UserProvider>
      </StoreProvider>
    </ThemeProvider>
  );
}
