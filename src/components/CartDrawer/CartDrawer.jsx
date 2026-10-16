import React, { useState } from 'react';
import {
  ShoppingBag,
  X,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  Store,
  Truck,
  CheckCircle2
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { useUser } from '../../context/UserContext';
import './CartDrawer.scss';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItemsCount,
    subtotal,
    promoDiscount,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    useNovaPoints,
    setUseNovaPoints,
    pointsDiscount,
    grandTotal
  } = useCart();

  const { selectedStore } = useStore();
  const { user } = useUser();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  if (!isCartOpen) return null;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    if (!res.success) {
      setPromoError('Geçersiz indirim kodu. "NOVA10" kodunu deneyin.');
    } else {
      setPromoError('');
      setPromoInput('');
    }
  };

  const handleCheckout = () => {
    const newOrdNum = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderNumber(newOrdNum);
    setOrderComplete(true);
    clearCart();
  };

  return (
    <div className="cart-drawer-overlay" onClick={closeCart}>
      <div
        className="cart-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="cart-header">
          <div className="header-title-box">
            <ShoppingBag size={20} color="var(--primary)" />
            <h3 className="title">Alışveriş Sepeti</h3>
            <span className="count-tag">{totalItemsCount}</span>
          </div>
          <button
            type="button"
            className="close-btn"
            onClick={closeCart}
          >
            <X size={18} />
          </button>
        </div>

        {/* Checkout Success View */}
        {orderComplete ? (
          <div className="cart-items-scroll">
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <CheckCircle2 size={54} color="#10b981" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Siparişiniz Alındı!
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                Sipariş Numaranız: <strong>{orderNumber}</strong>. Detayları profilinizdeki "Siparişlerim" sekmesinden takip edebilirsiniz.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setOrderComplete(false);
                  closeCart();
                }}
              >
                Alışverişe Devam Et
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="cart-items-scroll">
              {cartItems.length === 0 ? (
                <div className="empty-cart-view">
                  <ShoppingBag size={52} className="empty-icon" />
                  <h4 className="empty-title">Sepetiniz Boş</h4>
                  <p>
                    Özenle seçilmiş teknoloji, moda ve gurme koleksiyonumuzu keşfedin.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={closeCart}
                  >
                    Alışverişe Başla
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.product.id} className="cart-item-card">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="item-image"
                    />

                    <div className="item-info">
                      <div className="item-name">{item.product.name}</div>

                      <div className="item-delivery-pill">
                        {item.deliveryType === 'pickup' ? (
                          <>
                            <Store size={12} />
                            <span>{selectedStore?.name} Teslim</span>
                          </>
                        ) : (
                          <>
                            <Truck size={12} />
                            <span>Adrese Express Teslimat</span>
                          </>
                        )}
                      </div>

                      <div className="item-bottom-row">
                        <div className="item-price">
                          {(item.product.price * item.quantity).toLocaleString('tr-TR')} ₺
                        </div>

                        <div className="cart-stepper">
                          <button
                            type="button"
                            className="btn-step"
                            onClick={() => updateQuantity(item.product.id, -1)}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="qty-num">{item.quantity}</span>
                          <button
                            type="button"
                            className="btn-step"
                            onClick={() => updateQuantity(item.product.id, 1)}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn-remove-item"
                      onClick={() => removeFromCart(item.product.id)}
                      title="Ürünü Sil"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer with Calculations & Checkout */}
            {cartItems.length > 0 && (
              <div className="cart-footer">
                {/* NovaPoints Loyalty Balance Switch */}
                {user && (
                  <label className="novapoints-box">
                    <div className="points-label">
                      <Sparkles size={15} />
                      <span>{user.points.toLocaleString()} NovaPuan Kullan ({user.pointsValue} ₺)</span>
                    </div>
                    <input
                      type="checkbox"
                      className="points-checkbox"
                      checked={useNovaPoints}
                      onChange={(e) => setUseNovaPoints(e.target.checked)}
                    />
                  </label>
                )}

                {/* Promo Code Input */}
                <form className="promo-input-row" onSubmit={handleApplyPromo}>
                  <input
                    type="text"
                    placeholder="İndirim Kodu (örn: NOVA10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                  />
                  <button type="submit" className="btn btn-secondary btn-apply-promo">
                    Uygula
                  </button>
                </form>

                {promoError && (
                  <span style={{ fontSize: '0.75rem', color: '#f43f5e' }}>{promoError}</span>
                )}

                {appliedPromo && (
                  <div className="promo-applied-tag">
                    <span>{appliedPromo.label} uygulandı</span>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      style={{ color: '#f43f5e', cursor: 'pointer', fontSize: '0.75rem' }}
                    >
                      Kaldır
                    </button>
                  </div>
                )}

                {/* Calculation Summary */}
                <div className="summary-calc">
                  <div className="calc-row">
                    <span>Ara Toplam</span>
                    <span>{subtotal.toLocaleString('tr-TR')} ₺</span>
                  </div>

                  {promoDiscount > 0 && (
                    <div className="calc-row discount">
                      <span>Promosyon İndirimi (%10)</span>
                      <span>-{promoDiscount.toLocaleString('tr-TR')} ₺</span>
                    </div>
                  )}

                  {pointsDiscount > 0 && (
                    <div className="calc-row discount">
                      <span>NovaPuan İndirimi</span>
                      <span>-{pointsDiscount.toLocaleString('tr-TR')} ₺</span>
                    </div>
                  )}

                  <div className="calc-row">
                    <span>Kargo & Teslimat</span>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>Ücretsiz</span>
                  </div>

                  <div className="calc-row total-row">
                    <span>Genel Toplam</span>
                    <span>{grandTotal.toLocaleString('tr-TR')} ₺</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-checkout"
                  onClick={handleCheckout}
                >
                  <span>Siparişi Onayla ve Tamamla</span>
                  <ArrowRight size={17} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
