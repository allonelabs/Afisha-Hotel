'use client';

import { useState, useEffect } from 'react';
import styles from './booking.module.css';

export default function BookingPage() {
  const [rooms, setRooms] = useState([]);
  const [step, setStep] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/rooms').then(r => r.json()).then(setRooms);
  }, []);
  const [success, setSuccess] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const fmt = (d) => d.toISOString().split('T')[0];
  const fmtShort = (d) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const [form, setForm] = useState({
    firstName: '', lastName: '', adults: '2', children: '0',
    arrivalTime: '03:00 pm', specialRequest: '',
    countryCode: '+995', phone: '', email: '',
    cardName: '', cardNumber: '', cardExpiry: '', cardCvv: '',
    checkin: fmt(today), checkout: fmt(tomorrow), promoCode: '',
  });

  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    // Card formatting
    if (field === 'cardNumber') {
      value = value.replace(/\D/g, '').substring(0, 16).replace(/(.{4})/g, '$1 ').trim();
    }
    if (field === 'cardExpiry') {
      let v = value.replace(/\D/g, '').substring(0, 4);
      if (v.length > 2) v = v.substring(0, 2) + ' / ' + v.substring(2);
      value = v;
    }
    if (field === 'cardCvv') {
      value = value.replace(/\D/g, '').substring(0, 4);
    }
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: false }));
  };

  const selectRoom = (room) => {
    setSelectedRoom(room);
    setTimeout(() => setStep(2), 300);
  };

  const tax = selectedRoom ? Math.round(selectedRoom.price * 0.18) : 0;
  const total = selectedRoom ? selectedRoom.price + tax : 0;

  const submit = async () => {
    const required = ['firstName', 'lastName', 'phone', 'email', 'cardName', 'cardNumber', 'cardExpiry', 'cardCvv'];
    const newErrors = {};
    required.forEach(f => { if (!form[f].trim()) newErrors[f] = true; });
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          room: selectedRoom.name,
          price: total,
        }),
      });
      if (res.ok) {
        setSuccess(true);
      }
    } catch (e) {
      alert('Something went wrong. Please try again.');
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <a href="/" className={styles.logo}>
            <img src="https://cdn.prod.website-files.com/669a26f7d42524ab776f6ebf/66f5b9c4bd8e0267ee3b80bf_Afisha_Logo_White.png" alt="Afisha" />
          </a>
        </header>
        <div className={styles.successBox}>
          <div className={styles.successIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 13l4 4L19 7"/></svg>
          </div>
          <h1>Booking Confirmed</h1>
          <p>Thank you, {form.firstName}! Your reservation for the <strong>{selectedRoom.name}</strong> has been received.</p>
          <p className={styles.successDetail}>A confirmation email has been sent to <strong>{form.email}</strong></p>
          <div className={styles.successSummary}>
            <div><span>Check-in</span><strong>{fmtShort(new Date(form.checkin))}</strong></div>
            <div><span>Check-out</span><strong>{fmtShort(new Date(form.checkout))}</strong></div>
            <div><span>Total</span><strong>USD {total}</strong></div>
          </div>
          <a href="/" className={styles.btn}>
            <span>Back to Hotel</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a href="/" className={styles.logo}>
          <img src="https://cdn.prod.website-files.com/669a26f7d42524ab776f6ebf/66f5b9c4bd8e0267ee3b80bf_Afisha_Logo_White.png" alt="Afisha" />
        </a>
        <a href="/" className={styles.back}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to Hotel
        </a>
      </header>

      <div className={styles.pageTitle}>
        <h1>{step === 1 ? 'Choose Your Room' : 'Complete Your Booking'}</h1>
        <p>{step === 1 ? 'Select from our curated collection of rooms and suites.' : `${selectedRoom?.name} — $${selectedRoom?.price} per night`}</p>
      </div>

      {/* Steps */}
      <div className={styles.steps}>
        <div className={`${styles.step} ${step >= 1 ? (step > 1 ? styles.completed : styles.active) : ''}`}>
          <span className={styles.stepNumber}>{step > 1 ? '✓' : '1'}</span> Room
        </div>
        <span className={styles.stepLine} />
        <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>
          <span className={styles.stepNumber}>2</span> Details
        </div>
        <span className={styles.stepLine} />
        <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>
          <span className={styles.stepNumber}>3</span> Payment
        </div>
      </div>

      {/* Step 1: Room Grid */}
      {step === 1 && (
        <div className={styles.roomsGrid}>
          {rooms.map(room => (
            <div key={room.id} className={`${styles.room} ${selectedRoom?.id === room.id ? styles.selected : ''}`} onClick={() => selectRoom(room)}>
              <div className={styles.roomImg}>
                <img src={room.img} alt={room.name} />
                <div className={styles.roomBadge}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg>
                </div>
              </div>
              <div className={styles.roomBody}>
                <h3 className={styles.roomName}>{room.name}</h3>
                <p className={styles.roomDesc}>{room.desc}</p>
                <span className={styles.roomPrice}>${room.price} <small>/ night</small></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Step 2: Booking Form */}
      {step === 2 && (
        <div className={styles.bookingLayout}>
          <div className={styles.formsColumn}>
            {/* Guest Details */}
            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>Guest Details</h3>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>First Name <span className={styles.req}>*</span></label>
                  <input className={errors.firstName ? styles.error : ''} value={form.firstName} onChange={e => update('firstName', e.target.value)} placeholder="First Name" />
                </div>
                <div className={styles.field}>
                  <label>Last Name <span className={styles.req}>*</span></label>
                  <input className={errors.lastName ? styles.error : ''} value={form.lastName} onChange={e => update('lastName', e.target.value)} placeholder="Last Name" />
                </div>
              </div>
              <div className={styles.row4}>
                <div className={styles.field}>
                  <label>Adults</label>
                  <select value={form.adults} onChange={e => update('adults', e.target.value)}>
                    <option>1</option><option>2</option><option>3</option><option>4</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Children</label>
                  <select value={form.children} onChange={e => update('children', e.target.value)}>
                    <option>0</option><option>1</option><option>2</option><option>3</option>
                  </select>
                </div>
                <div className={`${styles.field} ${styles.span2}`}>
                  <label>Estimated Arrival</label>
                  <select value={form.arrivalTime} onChange={e => update('arrivalTime', e.target.value)}>
                    {['12:00 pm','01:00 pm','02:00 pm','03:00 pm','04:00 pm','05:00 pm','06:00 pm','07:00 pm','08:00 pm','09:00 pm','10:00 pm','11:00 pm'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className={styles.row}>
                <div className={`${styles.field} ${styles.full}`}>
                  <label>Special Request</label>
                  <textarea value={form.specialRequest} onChange={e => update('specialRequest', e.target.value)} placeholder="Any special requests or preferences..." />
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>Contact Details</h3>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Phone <span className={styles.req}>*</span></label>
                  <div className={styles.phoneGroup}>
                    <select value={form.countryCode} onChange={e => update('countryCode', e.target.value)}>
                      <option value="+995">+995</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+49">+49</option>
                      <option value="+33">+33</option>
                      <option value="+971">+971</option>
                      <option value="+7">+7</option>
                      <option value="+90">+90</option>
                    </select>
                    <input className={errors.phone ? styles.error : ''} value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="Contact no" />
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Email <span className={styles.req}>*</span></label>
                  <input type="email" className={errors.email ? styles.error : ''} value={form.email} onChange={e => update('email', e.target.value)} placeholder="example@email.com" />
                </div>
              </div>
            </div>

            <button className={styles.btnGhost} onClick={() => setStep(1)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Change Room
            </button>
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            {/* Summary */}
            <div className={styles.summaryCard}>
              <div className={styles.summaryRoom}>
                <img src={selectedRoom.img} alt={selectedRoom.name} />
                <div>
                  <div className={styles.summaryRoomName}>{selectedRoom.name}</div>
                  <div className={styles.summaryRoomType}>1 Night</div>
                </div>
              </div>
              <div className={styles.summaryDates}>
                <div>
                  <div className={styles.dateLabel}>Check In</div>
                  <div className={styles.dateValue}>{fmtShort(new Date(form.checkin))}</div>
                </div>
                <div>
                  <div className={styles.dateLabel}>Check Out</div>
                  <div className={styles.dateValue}>{fmtShort(new Date(form.checkout))}</div>
                </div>
              </div>
              <div className={styles.summaryLine}><span>Room rate</span><span>USD {selectedRoom.price}</span></div>
              <div className={styles.summaryLine}><span>Taxes & fees</span><span>USD {tax}</span></div>
              <div className={styles.summaryTotal}><span>Total</span><span>USD {total}</span></div>
            </div>

            {/* Promo */}
            <div className={styles.promo}>
              Do you have a promo code? <a onClick={() => setPromoOpen(!promoOpen)}>Click here</a>
              {promoOpen && (
                <div className={styles.promoInput}>
                  <input value={form.promoCode} onChange={e => update('promoCode', e.target.value)} placeholder="Enter code" />
                  <button>Apply</button>
                </div>
              )}
            </div>

            {/* Credit Card */}
            <div className={styles.cardPanel}>
              <h4 className={styles.cardTitle}>Credit Card</h4>
              <div className={styles.row}>
                <div className={`${styles.field} ${styles.full}`}>
                  <label>Name on Card <span className={styles.req}>*</span></label>
                  <input className={errors.cardName ? styles.error : ''} value={form.cardName} onChange={e => update('cardName', e.target.value)} placeholder="Name On Card" />
                </div>
              </div>
              <div className={styles.row}>
                <div className={`${styles.field} ${styles.full}`}>
                  <label>Card Number <span className={styles.req}>*</span></label>
                  <input className={errors.cardNumber ? styles.error : ''} value={form.cardNumber} onChange={e => update('cardNumber', e.target.value)} placeholder="XXXX XXXX XXXX XXXX" maxLength={19} />
                </div>
              </div>
              <div className={styles.rowExpCvv}>
                <div className={styles.field}>
                  <label>Expiry <span className={styles.req}>*</span></label>
                  <input className={errors.cardExpiry ? styles.error : ''} value={form.cardExpiry} onChange={e => update('cardExpiry', e.target.value)} placeholder="MM / YY" maxLength={7} />
                </div>
                <div className={`${styles.field} ${styles.cvv}`}>
                  <label>CVV <span className={styles.req}>*</span></label>
                  <input className={errors.cardCvv ? styles.error : ''} value={form.cardCvv} onChange={e => update('cardCvv', e.target.value)} placeholder="***" maxLength={4} />
                </div>
              </div>
              <p className={styles.disclaimer}>The cardholder and guest names indicated in the reservation must be identical. All non-refundable reservations must be paid upon booking. All refundable reservations must be fully paid 2 days before arrival.</p>
              <div className={styles.cardLogos}>
                <span>VISA</span><span>MC</span><span>AMEX</span>
              </div>
            </div>

            {/* Final Total + Submit */}
            <div className={styles.finalTotal}>
              <span>Total</span><span>USD {total}</span>
            </div>
            <button className={styles.btnAccent} onClick={submit} disabled={submitting}>
              <span>{submitting ? 'Processing...' : 'Confirm & Pay'}</span>
              {!submitting && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16"><path d="M5 12h14M13 6l6 6-6 6"/></svg>}
            </button>
          </div>
        </div>
      )}

      <footer className={styles.footer}>
        Hotel Afisha, 5 Petre Melikishvili Street, Tbilisi, K&apos;alak&apos;i T&apos;bilisi, Georgia 0108
      </footer>
    </div>
  );
}
