'use client';

import { useState, useEffect } from 'react';
import styles from './admin.module.css';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [bookings, setBookings] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [events, setEvents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({ name: '', country: '', text: '', rating: 5 });
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('dashboard');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomForm, setRoomForm] = useState({ name: '', price: '', img: '', desc: '' });
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({ title: '', date: '', time: '', location: 'Hotel Afisha', desc: '', img: '' });

  // Check auth on load
  useEffect(() => {
    fetch('/api/auth').then(r => {
      if (r.ok) { setAuthed(true); }
      setChecking(false);
    });
  }, []);

  const login = async (e) => {
    e.preventDefault();
    setLoginError('');
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
    } else {
      setLoginError('Incorrect password');
      setPassword('');
    }
  };

  const logout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    setAuthed(false);
    setPassword('');
  };

  // Fetch data
  useEffect(() => {
    if (!authed) return;
    fetchData();
  }, [authed]);

  const fetchData = async () => {
    setLoading(true);
    const [bRes, sRes, rRes, eRes, rvRes] = await Promise.all([
      fetch('/api/bookings'),
      fetch('/api/newsletter'),
      fetch('/api/rooms'),
      fetch('/api/events'),
      fetch('/api/reviews'),
    ]);
    const bData = await bRes.json();
    const sData = await sRes.json();
    const rData = await rRes.json();
    const eData = await eRes.json();
    const rvData = await rvRes.json();
    setBookings(bData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    setSubscribers(sData.sort((a, b) => new Date(b.subscribedAt) - new Date(a.subscribedAt)));
    setRooms(rData);
    setEvents(eData.sort((a, b) => new Date(a.date) - new Date(b.date)));
    setReviews(rvData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    setLoading(false);
  };

  // Room CRUD
  const openRoomForm = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setRoomForm({ name: room.name, price: String(room.price), img: room.img, desc: room.desc });
    } else {
      setEditingRoom(null);
      setRoomForm({ name: '', price: '', img: '', desc: '' });
    }
    setShowRoomForm(true);
  };

  const saveRoom = async () => {
    if (!roomForm.name || !roomForm.price) return;
    if (editingRoom) {
      await fetch(`/api/rooms/${editingRoom.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...roomForm, price: Number(roomForm.price) }) });
    } else {
      await fetch('/api/rooms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...roomForm, price: Number(roomForm.price) }) });
    }
    setShowRoomForm(false);
    fetchData();
  };

  const deleteRoom = async (id) => {
    await fetch(`/api/rooms/${id}`, { method: 'DELETE' });
    await fetchData();
  };

  // Event CRUD
  const openEventForm = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setEventForm({ title: event.title, date: event.date, time: event.time, location: event.location, desc: event.desc, img: event.img });
    } else {
      setEditingEvent(null);
      setEventForm({ title: '', date: '', time: '', location: 'Hotel Afisha', desc: '', img: '' });
    }
    setShowEventForm(true);
  };

  const saveEvent = async () => {
    if (!eventForm.title || !eventForm.date) return;
    if (editingEvent) {
      await fetch(`/api/events/${editingEvent.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(eventForm) });
    } else {
      await fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(eventForm) });
    }
    setShowEventForm(false);
    fetchData();
  };

  const deleteEvent = async (id) => {
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    await fetchData();
  };

  // Review CRUD
  const openReviewForm = (review = null) => {
    if (review) {
      setEditingReview(review);
      setReviewForm({ name: review.name, country: review.country, text: review.text, rating: review.rating });
    } else {
      setEditingReview(null);
      setReviewForm({ name: '', country: '', text: '', rating: 5 });
    }
    setShowReviewForm(true);
  };

  const updateReviewStatus = async (id, status) => {
    await fetch(`/api/reviews/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    await fetchData();
  };

  const saveReview = async () => {
    if (!reviewForm.name || !reviewForm.text) return;
    if (editingReview) {
      await fetch(`/api/reviews/${editingReview.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reviewForm) });
    } else {
      await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...reviewForm, status: 'approved' }) });
    }
    setShowReviewForm(false);
    await fetchData();
  };

  const deleteReview = async (id) => {
    await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    await fetchData();
  };

  const deleteSubscriber = async (email) => {
    await fetch('/api/newsletter', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    await fetchData();
  };

  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file, setter, field) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (res.ok) {
      setter(prev => ({ ...prev, [field]: data.url }));
    }
    setUploading(false);
  };

  const updateStatus = async (id, status) => {
    await fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchData();
    if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
  };

  const deleteBooking = async (id) => {
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    await fetchData();
    if (selected?.id === id) setSelected(null);
  };

  const statusColor = (s) => {
    if (s === 'confirmed') return '#4caf50';
    if (s === 'cancelled') return '#e74c3c';
    return '#c9a96e';
  };

  const fmtDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const fmtDateTime = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  // Stats
  const totalRevenue = bookings.filter(b => b.status === 'confirmed').reduce((s, b) => s + (b.price || 0), 0);
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.checkin === todayStr).length;

  const filteredBookings = filterStatus === 'all' ? bookings : bookings.filter(b => b.status === filterStatus);

  // Room stats
  const roomCounts = {};
  bookings.forEach(b => { roomCounts[b.room] = (roomCounts[b.room] || 0) + 1; });

  // ── LOGIN SCREEN ──
  if (checking) {
    return (
      <div className={styles.page}>
        <div className={styles.loginWrap}>
          <p style={{ color: 'var(--taupe)' }}>Checking session...</p>
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className={styles.page}>
        <div className={styles.loginWrap}>
          <div className={styles.loginBox}>
            <img src="https://cdn.prod.website-files.com/669a26f7d42524ab776f6ebf/66f5b9c4bd8e0267ee3b80bf_Afisha_Logo_White.png" alt="Afisha" className={styles.loginLogo} />
            <h1 className={styles.loginTitle}>Admin Panel</h1>
            <p className={styles.loginSub}>Enter your password to continue</p>
            <form onSubmit={login}>
              <input
                type="password"
                className={`${styles.loginInput} ${loginError ? styles.inputError : ''}`}
                value={password}
                onChange={e => { setPassword(e.target.value); setLoginError(''); }}
                placeholder="Password"
                autoFocus
              />
              {loginError && <p className={styles.loginErr}>{loginError}</p>}
              <button type="submit" className={styles.loginBtn}>
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── ADMIN DASHBOARD ──
  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <img src="https://cdn.prod.website-files.com/669a26f7d42524ab776f6ebf/66f5b9c4bd8e0267ee3b80bf_Afisha_Logo_White.png" alt="Afisha" className={styles.headerLogo} />
          <span className={styles.badge}>Admin</span>
        </div>
        <div className={styles.headerRight}>
          <a href="/" className={styles.headerLink}>View Site</a>
          <button onClick={logout} className={styles.logoutBtn}>Sign Out</button>
        </div>
      </header>

      {/* Navigation */}
      <nav className={styles.nav}>
        {['dashboard', 'bookings', 'rooms', 'events', 'reviews', 'subscribers'].map(t => (
          <button key={t} className={`${styles.navBtn} ${tab === t ? styles.navActive : ''}`} onClick={() => { setTab(t); setSelected(null); }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </nav>

      {loading ? (
        <p className={styles.loadingMsg}>Loading data...</p>
      ) : (
        <>
          {/* ── DASHBOARD TAB ── */}
          {tab === 'dashboard' && (
            <div className={styles.dashContent}>
              {/* Stats Row */}
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <span className={styles.statNum}>{bookings.length}</span>
                  <span className={styles.statLabel}>Total Bookings</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNum} style={{ color: '#c9a96e' }}>{pendingCount}</span>
                  <span className={styles.statLabel}>Pending</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNum} style={{ color: '#4caf50' }}>{confirmedCount}</span>
                  <span className={styles.statLabel}>Confirmed</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNum} style={{ color: '#e74c3c' }}>{cancelledCount}</span>
                  <span className={styles.statLabel}>Cancelled</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNum}>${totalRevenue}</span>
                  <span className={styles.statLabel}>Revenue (Confirmed)</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNum}>{todayBookings}</span>
                  <span className={styles.statLabel}>Check-ins Today</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNum}>{subscribers.length}</span>
                  <span className={styles.statLabel}>Newsletter Subscribers</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNum}>{Object.keys(roomCounts).length}</span>
                  <span className={styles.statLabel}>Room Types Booked</span>
                </div>
              </div>

              {/* Recent Bookings + Popular Rooms */}
              <div className={styles.dashGrid}>
                <div className={styles.dashPanel}>
                  <h3 className={styles.panelHead}>Recent Bookings</h3>
                  {bookings.length === 0 ? (
                    <p className={styles.emptyMsg}>No bookings yet</p>
                  ) : (
                    <div className={styles.recentList}>
                      {bookings.slice(0, 5).map(b => (
                        <div key={b.id} className={styles.recentItem} onClick={() => { setTab('bookings'); setSelected(b); }}>
                          <div>
                            <strong>{b.firstName} {b.lastName}</strong>
                            <span className={styles.recentSub}>{b.room} — {fmtDate(b.checkin)}</span>
                          </div>
                          <div className={styles.recentRight}>
                            <span className={styles.statusDot} style={{ background: statusColor(b.status) }} />
                            <span>${b.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className={styles.dashPanel}>
                  <h3 className={styles.panelHead}>Room Popularity</h3>
                  {Object.keys(roomCounts).length === 0 ? (
                    <p className={styles.emptyMsg}>No data yet</p>
                  ) : (
                    <div className={styles.roomStats}>
                      {Object.entries(roomCounts).sort((a, b) => b[1] - a[1]).map(([room, count]) => (
                        <div key={room} className={styles.roomStatRow}>
                          <span>{room}</span>
                          <div className={styles.roomBar}>
                            <div className={styles.roomBarFill} style={{ width: `${(count / bookings.length) * 100}%` }} />
                          </div>
                          <span className={styles.roomCount}>{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── BOOKINGS TAB ── */}
          {tab === 'bookings' && (
            <div className={styles.bookingsContent}>
              <div className={styles.bookingsMain}>
                <div className={styles.tableHeader}>
                  <h2 className={styles.panelHead}>All Bookings ({filteredBookings.length})</h2>
                  <div className={styles.filters}>
                    {['all', 'pending', 'confirmed', 'cancelled'].map(f => (
                      <button key={f} className={`${styles.filterBtn} ${filterStatus === f ? styles.filterActive : ''}`} onClick={() => setFilterStatus(f)}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredBookings.length === 0 ? (
                  <p className={styles.emptyMsg}>No bookings found</p>
                ) : (
                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Guest</th>
                          <th>Room</th>
                          <th>Check-in</th>
                          <th>Check-out</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.map(b => (
                          <tr key={b.id} className={selected?.id === b.id ? styles.activeRow : ''} onClick={() => setSelected(b)}>
                            <td>
                              <strong>{b.firstName} {b.lastName}</strong>
                              <span className={styles.cellSub}>{b.email}</span>
                            </td>
                            <td>{b.room}</td>
                            <td>{b.checkin}</td>
                            <td>{b.checkout}</td>
                            <td>${b.price}</td>
                            <td>
                              <span className={styles.statusBadge} style={{ background: statusColor(b.status) + '22', color: statusColor(b.status) }}>
                                {b.status}
                              </span>
                            </td>
                            <td>
                              <div className={styles.actions} onClick={e => e.stopPropagation()}>
                                {b.status === 'pending' && <button className={styles.actBtn} style={{ color: '#4caf50' }} onClick={() => updateStatus(b.id, 'confirmed')}>Confirm</button>}
                                {b.status !== 'cancelled' && <button className={styles.actBtn} style={{ color: '#e74c3c' }} onClick={() => updateStatus(b.id, 'cancelled')}>Cancel</button>}
                                <button className={styles.actBtn} style={{ color: '#666' }} onClick={() => deleteBooking(b.id)}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Detail Sidebar */}
              {selected && (
                <div className={styles.detailPanel}>
                  <div className={styles.detailHeader}>
                    <h3 className={styles.panelHead}>Booking Details</h3>
                    <button className={styles.closeBtn} onClick={() => setSelected(null)}>&times;</button>
                  </div>

                  <div className={styles.detailStatus}>
                    <span className={styles.statusBadge} style={{ background: statusColor(selected.status) + '22', color: statusColor(selected.status) }}>
                      {selected.status}
                    </span>
                    <span className={styles.detailId}>#{selected.id}</span>
                  </div>

                  <div className={styles.detailSection}>
                    <h4 className={styles.detailSectionTitle}>Guest Information</h4>
                    <div className={styles.detailGrid}>
                      <div className={styles.detailItem}><span className={styles.dLabel}>Name</span><span>{selected.firstName} {selected.lastName}</span></div>
                      <div className={styles.detailItem}><span className={styles.dLabel}>Email</span><span>{selected.email}</span></div>
                      <div className={styles.detailItem}><span className={styles.dLabel}>Phone</span><span>{selected.countryCode} {selected.phone}</span></div>
                      <div className={styles.detailItem}><span className={styles.dLabel}>Guests</span><span>{selected.adults} adults, {selected.children} children</span></div>
                    </div>
                  </div>

                  <div className={styles.detailSection}>
                    <h4 className={styles.detailSectionTitle}>Reservation</h4>
                    <div className={styles.detailGrid}>
                      <div className={styles.detailItem}><span className={styles.dLabel}>Room</span><span>{selected.room}</span></div>
                      <div className={styles.detailItem}><span className={styles.dLabel}>Total</span><span>${selected.price}</span></div>
                      <div className={styles.detailItem}><span className={styles.dLabel}>Check-in</span><span>{selected.checkin}</span></div>
                      <div className={styles.detailItem}><span className={styles.dLabel}>Check-out</span><span>{selected.checkout}</span></div>
                      <div className={styles.detailItem}><span className={styles.dLabel}>Arrival</span><span>{selected.arrivalTime}</span></div>
                      <div className={styles.detailItem}><span className={styles.dLabel}>Card</span><span>**** {selected.cardLast4}</span></div>
                    </div>
                  </div>

                  {selected.specialRequest && (
                    <div className={styles.detailSection}>
                      <h4 className={styles.detailSectionTitle}>Special Request</h4>
                      <p className={styles.detailNote}>{selected.specialRequest}</p>
                    </div>
                  )}

                  <div className={styles.detailSection}>
                    <p className={styles.detailMeta}>Booked on {fmtDateTime(selected.createdAt)}</p>
                  </div>

                  <div className={styles.detailActions}>
                    {selected.status === 'pending' && <button className={styles.detailActionBtn} style={{ background: '#4caf50' }} onClick={() => updateStatus(selected.id, 'confirmed')}>Confirm Booking</button>}
                    {selected.status !== 'cancelled' && <button className={styles.detailActionBtn} style={{ background: '#e74c3c' }} onClick={() => updateStatus(selected.id, 'cancelled')}>Cancel Booking</button>}
                    <button className={styles.detailActionBtn} style={{ background: 'rgba(245,240,235,0.08)', color: '#888' }} onClick={() => deleteBooking(selected.id)}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── ROOMS TAB ── */}
          {tab === 'rooms' && (
            <div className={styles.subContent}>
              <div className={styles.subPanel}>
                <div className={styles.tableHeader}>
                  <h2 className={styles.panelHead}>Rooms ({rooms.length})</h2>
                  <button className={styles.addBtn} onClick={() => openRoomForm()}>+ Add Room</button>
                </div>

                {showRoomForm && (
                  <div className={styles.formCard}>
                    <h3 className={styles.formCardTitle}>{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>
                    <div className={styles.formGrid}>
                      <div className={styles.formField}>
                        <label>Room Name *</label>
                        <input value={roomForm.name} onChange={e => setRoomForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Deluxe Suite" />
                      </div>
                      <div className={styles.formField}>
                        <label>Price per Night (USD) *</label>
                        <input type="number" value={roomForm.price} onChange={e => setRoomForm(p => ({ ...p, price: e.target.value }))} placeholder="e.g. 350" />
                      </div>
                      <div className={`${styles.formField} ${styles.formFull}`}>
                        <label>Image</label>
                        <div className={styles.imgUploadRow}>
                          <label className={styles.uploadBtn}>
                            {uploading ? 'Uploading...' : 'Upload Image'}
                            <input type="file" accept="image/*" hidden onChange={e => e.target.files[0] && uploadImage(e.target.files[0], setRoomForm, 'img')} />
                          </label>
                          <span className={styles.orText}>or</span>
                          <input value={roomForm.img} onChange={e => setRoomForm(p => ({ ...p, img: e.target.value }))} placeholder="Paste image URL..." style={{ flex: 1 }} />
                        </div>
                        {roomForm.img && <img src={roomForm.img} alt="Preview" className={styles.imgPreview} />}
                      </div>
                      <div className={`${styles.formField} ${styles.formFull}`}>
                        <label>Description</label>
                        <textarea value={roomForm.desc} onChange={e => setRoomForm(p => ({ ...p, desc: e.target.value }))} placeholder="Room description..." />
                      </div>
                    </div>
                    <div className={styles.formActions}>
                      <button className={styles.formCancel} onClick={() => setShowRoomForm(false)}>Cancel</button>
                      <button className={styles.formSave} onClick={saveRoom}>{editingRoom ? 'Update' : 'Add Room'}</button>
                    </div>
                  </div>
                )}

                <div className={styles.roomGrid}>
                  {rooms.map(room => (
                    <div key={room.id} className={styles.roomCard}>
                      {room.img && <img src={room.img} alt={room.name} className={styles.roomCardImg} />}
                      <div className={styles.roomCardBody}>
                        <h4 className={styles.roomCardName}>{room.name}</h4>
                        <p className={styles.roomCardPrice}>${room.price} <small>/ night</small></p>
                        <p className={styles.roomCardDesc}>{room.desc}</p>
                        <div className={styles.roomCardActions}>
                          <button onClick={() => openRoomForm(room)} className={styles.actBtn} style={{ color: 'var(--accent)' }}>Edit</button>
                          <button onClick={() => deleteRoom(room.id)} className={styles.actBtn} style={{ color: '#e74c3c' }}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── EVENTS TAB ── */}
          {tab === 'events' && (
            <div className={styles.subContent}>
              <div className={styles.subPanel}>
                <div className={styles.tableHeader}>
                  <h2 className={styles.panelHead}>Events ({events.length})</h2>
                  <button className={styles.addBtn} onClick={() => openEventForm()}>+ Add Event</button>
                </div>

                {showEventForm && (
                  <div className={styles.formCard}>
                    <h3 className={styles.formCardTitle}>{editingEvent ? 'Edit Event' : 'Add New Event'}</h3>
                    <div className={styles.formGrid}>
                      <div className={styles.formField}>
                        <label>Event Title *</label>
                        <input value={eventForm.title} onChange={e => setEventForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Jazz Night" />
                      </div>
                      <div className={styles.formField}>
                        <label>Date *</label>
                        <input type="date" value={eventForm.date} onChange={e => setEventForm(p => ({ ...p, date: e.target.value }))} />
                      </div>
                      <div className={styles.formField}>
                        <label>Time</label>
                        <input value={eventForm.time} onChange={e => setEventForm(p => ({ ...p, time: e.target.value }))} placeholder="e.g. 8:00 PM" />
                      </div>
                      <div className={styles.formField}>
                        <label>Location</label>
                        <input value={eventForm.location} onChange={e => setEventForm(p => ({ ...p, location: e.target.value }))} placeholder="Hotel Afisha" />
                      </div>
                      <div className={`${styles.formField} ${styles.formFull}`}>
                        <label>Image</label>
                        <div className={styles.imgUploadRow}>
                          <label className={styles.uploadBtn}>
                            {uploading ? 'Uploading...' : 'Upload Image'}
                            <input type="file" accept="image/*" hidden onChange={e => e.target.files[0] && uploadImage(e.target.files[0], setEventForm, 'img')} />
                          </label>
                          <span className={styles.orText}>or</span>
                          <input value={eventForm.img} onChange={e => setEventForm(p => ({ ...p, img: e.target.value }))} placeholder="Paste image URL..." style={{ flex: 1 }} />
                        </div>
                        {eventForm.img && <img src={eventForm.img} alt="Preview" className={styles.imgPreview} />}
                      </div>
                      <div className={`${styles.formField} ${styles.formFull}`}>
                        <label>Description</label>
                        <textarea value={eventForm.desc} onChange={e => setEventForm(p => ({ ...p, desc: e.target.value }))} placeholder="Event description..." />
                      </div>
                    </div>
                    <div className={styles.formActions}>
                      <button className={styles.formCancel} onClick={() => setShowEventForm(false)}>Cancel</button>
                      <button className={styles.formSave} onClick={saveEvent}>{editingEvent ? 'Update' : 'Add Event'}</button>
                    </div>
                  </div>
                )}

                {events.length === 0 && !showEventForm ? (
                  <p className={styles.emptyMsg}>No events yet. Click &quot;+ Add Event&quot; to create one.</p>
                ) : (
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Event</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Location</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map(ev => (
                        <tr key={ev.id}>
                          <td>
                            <strong>{ev.title}</strong>
                            {ev.desc && <span className={styles.cellSub}>{ev.desc.substring(0, 60)}{ev.desc.length > 60 ? '...' : ''}</span>}
                          </td>
                          <td>{ev.date}</td>
                          <td>{ev.time || '—'}</td>
                          <td>{ev.location}</td>
                          <td>
                            <div className={styles.actions}>
                              <button onClick={() => openEventForm(ev)} className={styles.actBtn} style={{ color: 'var(--accent)' }}>Edit</button>
                              <button onClick={() => deleteEvent(ev.id)} className={styles.actBtn} style={{ color: '#e74c3c' }}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ── REVIEWS TAB ── */}
          {tab === 'reviews' && (
            <div className={styles.subContent}>
              <div className={styles.subPanel}>
                <div className={styles.tableHeader}>
                  <h2 className={styles.panelHead}>Guest Reviews ({reviews.length})</h2>
                  <button className={styles.addBtn} onClick={() => openReviewForm()}>+ Add Review</button>
                </div>

                {showReviewForm && (
                  <div className={styles.formCard}>
                    <h3 className={styles.formCardTitle}>{editingReview ? 'Edit Review' : 'Add New Review'}</h3>
                    <div className={styles.formGrid}>
                      <div className={styles.formField}>
                        <label>Guest Name *</label>
                        <input value={reviewForm.name} onChange={e => setReviewForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Sophie Laurent" />
                      </div>
                      <div className={styles.formField}>
                        <label>Country</label>
                        <input value={reviewForm.country} onChange={e => setReviewForm(p => ({ ...p, country: e.target.value }))} placeholder="e.g. France" />
                      </div>
                      <div className={styles.formField}>
                        <label>Rating</label>
                        <select value={reviewForm.rating} onChange={e => setReviewForm(p => ({ ...p, rating: Number(e.target.value) }))}>
                          <option value={5}>5 Stars</option>
                          <option value={4}>4 Stars</option>
                          <option value={3}>3 Stars</option>
                        </select>
                      </div>
                      <div className={`${styles.formField} ${styles.formFull}`}>
                        <label>Review Text *</label>
                        <textarea value={reviewForm.text} onChange={e => setReviewForm(p => ({ ...p, text: e.target.value }))} placeholder="Guest review..." />
                      </div>
                    </div>
                    <div className={styles.formActions}>
                      <button className={styles.formCancel} onClick={() => setShowReviewForm(false)}>Cancel</button>
                      <button className={styles.formSave} onClick={saveReview}>{editingReview ? 'Update' : 'Add Review'}</button>
                    </div>
                  </div>
                )}

                {reviews.length === 0 && !showReviewForm ? (
                  <p className={styles.emptyMsg}>No reviews yet. Click &quot;+ Add Review&quot; to create one.</p>
                ) : (
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Guest</th>
                        <th>Country</th>
                        <th>Review</th>
                        <th>Rating</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map(rv => (
                        <tr key={rv.id}>
                          <td><strong>{rv.name}</strong></td>
                          <td>{rv.country || '—'}</td>
                          <td><span className={styles.cellSub}>{rv.text.substring(0, 80)}{rv.text.length > 80 ? '...' : ''}</span></td>
                          <td>{'★'.repeat(rv.rating)}</td>
                          <td>
                            <span className={styles.statusBadge} style={{ background: (rv.status === 'approved' ? '#4caf50' : '#c9a96e') + '22', color: rv.status === 'approved' ? '#4caf50' : '#c9a96e' }}>
                              {rv.status || 'pending'}
                            </span>
                          </td>
                          <td>
                            <div className={styles.actions}>
                              {rv.status !== 'approved' && <button onClick={() => updateReviewStatus(rv.id, 'approved')} className={styles.actBtn} style={{ color: '#4caf50' }}>Approve</button>}
                              {rv.status === 'approved' && <button onClick={() => updateReviewStatus(rv.id, 'pending')} className={styles.actBtn} style={{ color: '#c9a96e' }}>Hide</button>}
                              <button onClick={() => openReviewForm(rv)} className={styles.actBtn} style={{ color: 'var(--accent)' }}>Edit</button>
                              <button onClick={() => deleteReview(rv.id)} className={styles.actBtn} style={{ color: '#e74c3c' }}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ── SUBSCRIBERS TAB ── */}
          {tab === 'subscribers' && (
            <div className={styles.subContent}>
              <div className={styles.subPanel}>
                <h2 className={styles.panelHead}>Newsletter Subscribers ({subscribers.length})</h2>
                {subscribers.length === 0 ? (
                  <p className={styles.emptyMsg}>No subscribers yet. They will appear here when visitors subscribe through the footer.</p>
                ) : (
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Subscribed</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((s, i) => (
                        <tr key={i}>
                          <td>{s.email}</td>
                          <td>{fmtDateTime(s.subscribedAt)}</td>
                          <td><button onClick={() => deleteSubscriber(s.email)} className={styles.actBtn} style={{ color: '#e74c3c' }}>Delete</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
