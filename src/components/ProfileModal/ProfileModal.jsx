import React, { useState } from 'react';
import {
  X,
  User,
  ShoppingBag,
  MapPin,
  Store,
  Sparkles,
  CheckCircle2,
  Clock,
  Truck,
  Plus,
  Save,
  Phone,
  Mail
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useStore } from '../../context/StoreContext';
import './ProfileModal.scss';

export default function ProfileModal() {
  const {
    user,
    isProfileOpen,
    closeProfile,
    updateProfile,
    setDefaultAddress,
    addAddress
  } = useUser();

  const { stores, selectedStore, selectStore } = useStore();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'addresses', 'store', 'profile'
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Address form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCity, setNewCity] = useState('İstanbul');
  const [newDistrict, setNewDistrict] = useState('');
  const [newFullAddress, setNewFullAddress] = useState('');

  if (!isProfileOpen || !user) return null;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      phone: editPhone,
      email: editEmail
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleAddNewAddress = (e) => {
    e.preventDefault();
    if (!newTitle || !newFullAddress) return;
    addAddress({
      title: newTitle,
      city: newCity,
      district: newDistrict || newCity,
      fullAddress: newFullAddress,
      isDefault: false
    });
    setShowAddressForm(false);
    setNewTitle('');
    setNewDistrict('');
    setNewFullAddress('');
  };

  return (
    <div className="modal-overlay" onClick={closeProfile}>
      <div
        className="profile-modal-container animate-modal-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Profile Hero Header */}
        <div className="profile-banner">
          <div className="user-hero-group">
            <img
              src={user.avatar}
              alt={user.name}
              className="profile-avatar"
            />
            <div className="user-meta">
              <h3 className="user-name">{user.name}</h3>
              <div className="user-subline">
                <span className="tier-badge">
                  <Sparkles size={11} style={{ display: 'inline', marginRight: 3 }} />
                  {user.tier}
                </span>
                <span className="points-badge">
                  {user.points.toLocaleString()} NovaPuan ({user.pointsValue} ₺)
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="close-btn"
            onClick={closeProfile}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="profile-tabs-bar">
          <button
            type="button"
            className={`prof-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={15} />
            <span>Siparişlerim ({user.recentOrders?.length || 0})</span>
          </button>

          <button
            type="button"
            className={`prof-tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            <MapPin size={15} />
            <span>Kayıtlı Adreslerim ({user.addresses?.length || 0})</span>
          </button>

          <button
            type="button"
            className={`prof-tab-btn ${activeTab === 'store' ? 'active' : ''}`}
            onClick={() => setActiveTab('store')}
          >
            <Store size={15} />
            <span>Tercih Ettiğim Mağaza</span>
          </button>

          <button
            type="button"
            className={`prof-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={15} />
            <span>Hesap Bilgilerim</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="profile-body-content">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div>
              {user.recentOrders?.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-top">
                    <div className="order-id-group">
                      <div className="order-id">{order.id}</div>
                      <div className="order-date">{order.date} • {order.deliveryMethod}</div>
                    </div>
                    <span
                      className={`order-status-badge ${order.status === 'Teslim Edildi' ? 'delivered' : 'in-transit'}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Step Progress */}
                  <div className="order-tracker-bar">
                    <div className="tracker-step">
                      <div className="step-dot active">✓</div>
                      <span className="step-label active">Onaylandı</span>
                    </div>
                    <div className="tracker-step">
                      <div className="step-dot active">✓</div>
                      <span className="step-label active">Hazırlandı</span>
                    </div>
                    <div className="tracker-step">
                      <div className={`step-dot ${order.statusStep >= 3 ? 'active' : ''}`}>
                        {order.statusStep >= 3 ? '✓' : '3'}
                      </div>
                      <span className={`step-label ${order.statusStep >= 3 ? 'active' : ''}`}>
                        {order.statusStep === 3 ? 'Yolda / Mağazada' : 'Dağıtımda'}
                      </span>
                    </div>
                    <div className="tracker-step">
                      <div className={`step-dot ${order.statusStep >= 4 ? 'active' : ''}`}>
                        {order.statusStep >= 4 ? '✓' : '4'}
                      </div>
                      <span className={`step-label ${order.statusStep >= 4 ? 'active' : ''}`}>
                        Teslim Edildi
                      </span>
                    </div>
                  </div>

                  {/* Item List */}
                  <div className="order-items-list">
                    {order.items?.map((it, idx) => (
                      <div key={idx} className="order-item-row">
                        <img src={it.image} alt={it.name} className="thumb" />
                        <div className="item-name">
                          {it.name} <span style={{ color: 'var(--text-muted)' }}>x{it.quantity}</span>
                        </div>
                        <div className="item-price">
                          {(it.price * it.quantity).toLocaleString('tr-TR')} ₺
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div>
              <div className="address-grid">
                {user.addresses?.map((addr) => (
                  <div
                    key={addr.id}
                    className={`address-card ${addr.isDefault ? 'is-default' : ''}`}
                  >
                    <div className="addr-head">
                      <span className="addr-title">{addr.title}</span>
                      {addr.isDefault && (
                        <span className="default-tag">Varsayılan</span>
                      )}
                    </div>
                    <p className="addr-text">{addr.fullAddress}</p>
                    {!addr.isDefault && (
                      <button
                        type="button"
                        className="btn-set-default"
                        onClick={() => setDefaultAddress(addr.id)}
                      >
                        Varsayılan Teslimat Adresi Yap
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Address Toggle */}
              {showAddressForm ? (
                <form
                  onSubmit={handleAddNewAddress}
                  className="profile-form"
                  style={{
                    padding: '1.25rem',
                    borderRadius: '16px',
                    background: 'var(--bg-surface-alt)',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Yeni Adres Ekle</h4>
                  <div className="form-group">
                    <label>Adres Başlığı (Örn: Yazlık, Annem)</label>
                    <input
                      type="text"
                      placeholder="Adres Başlığı"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Şehir</label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Açık Adres</label>
                    <input
                      type="text"
                      placeholder="Mahalle, Cadde, No, Daire"
                      value={newFullAddress}
                      onChange={(e) => setNewFullAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Kaydet
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowAddressForm(false)}
                    >
                      İptal
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddressForm(true)}
                >
                  <Plus size={16} />
                  <span>Yeni Adres Ekle</span>
                </button>
              )}
            </div>
          )}

          {/* TAB 3: PREFERRED STORE */}
          {activeTab === 'store' && (
            <div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                Hızlı Click & Collect teslimatları için birincil mağazanızı belirleyin:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {stores.map((st) => {
                  const isCurrent = selectedStore?.id === st.id;
                  return (
                    <div
                      key={st.id}
                      style={{
                        padding: '1rem',
                        borderRadius: '14px',
                        background: 'var(--bg-surface-alt)',
                        border: isCurrent ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                        cursor: 'pointer'
                      }}
                      onClick={() => selectStore(st)}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>
                        {st.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                        {st.city} • {st.district}
                      </div>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: isCurrent ? 'var(--primary)' : 'var(--text-secondary)'
                        }}
                      >
                        {isCurrent ? '✓ Aktif Mağazanız' : 'Bu Mağazayı Seç'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: ACCOUNT DETAILS */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="profile-form">
              <div className="form-group">
                <label>Ad Soyad</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>E-posta Adresi</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Telefon Numarası</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  <span>Bilgileri Güncelle</span>
                </button>
                {saveSuccess && (
                  <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>
                    ✓ Profil güncellendi!
                  </span>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
