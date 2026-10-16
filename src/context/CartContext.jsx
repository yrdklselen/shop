import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('nova_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [useNovaPoints, setUseNovaPoints] = useState(false);

  useEffect(() => {
    localStorage.setItem('nova_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const addToCart = (product, quantity = 1, deliveryType = 'delivery') => {
    setCartItems(prev => {
      const index = prev.findIndex(item => item.product.id === product.id);
      if (index > -1) {
        const updated = [...prev];
        updated[index].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, quantity, deliveryType }];
      }
    });

    showToast(`"${product.name}" sepete eklendi!`);
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const updateDeliveryType = (productId, type) => {
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, deliveryType: type } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedPromo(null);
    setUseNovaPoints(false);
  };

  // Calculations
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Promo code discount (e.g. NOVA10 = %10 discount)
  let promoDiscount = 0;
  if (appliedPromo && appliedPromo.code === 'NOVA10') {
    promoDiscount = Math.round(subtotal * 0.1);
  }

  // NovaPoints discount (245 TL if enabled)
  const pointsDiscount = useNovaPoints ? Math.min(245, subtotal) : 0;

  const grandTotal = Math.max(0, subtotal - promoDiscount - pointsDiscount);

  const applyPromoCode = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'NOVA10') {
      setAppliedPromo({ code: 'NOVA10', discountPercent: 10, label: '%10 Özel Hoş Geldin İndirimi' });
      showToast('NOVA10 promosyon kodu uygulandı!');
      return { success: true, message: '%10 indirim uygulandı' };
    }
    return { success: false, message: 'Geçersiz indirim kodu' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addToCart,
        removeFromCart,
        updateQuantity,
        updateDeliveryType,
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
        grandTotal,
        toastMessage
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
