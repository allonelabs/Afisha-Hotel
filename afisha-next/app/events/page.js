'use client';
import { useState, useEffect } from 'react';
import styles from './events.module.css';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events').then(r => r.json()).then(data => {
      setEvents(data.sort((a, b) => new Date(a.date) - new Date(b.date)));
      setLoading(false);
    });
  }, []);

  const fmtDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  const upcoming = events.filter(e => new Date(e.date) >= new Date());
  const past = events.filter(e => new Date(e.date) < new Date());

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a href="/" className={styles.logo}><img src="https://cdn.prod.website-files.com/669a26f7d42524ab776f6ebf/66f5b9c4bd8e0267ee3b80bf_Afisha_Logo_White.png" alt="Afisha" /></a>
        <a href="/" className={styles.back}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg> Back to Hotel</a>
      </header>

      <div className={styles.content}>
        <p className={styles.label}>Happenings</p>
        <h1 className={styles.title}>Events</h1>
        <p className={styles.subtitle}>Discover what&apos;s happening at Hotel Afisha</p>
      </div>

      <div className={styles.eventsWrap}>
        {loading ? (
          <p className={styles.empty}>Loading events...</p>
        ) : events.length === 0 ? (
          <p className={styles.empty}>No upcoming events at the moment. Check back soon.</p>
        ) : (
          <>
            {upcoming.length > 0 && (
              <>
                <h2 className={styles.sectionHead}>Upcoming</h2>
                <div className={styles.grid}>
                  {upcoming.map(ev => (
                    <div key={ev.id} className={styles.card}>
                      {ev.img && <img src={ev.img} alt={ev.title} className={styles.cardImg} />}
                      <div className={styles.cardBody}>
                        <span className={styles.cardDate}>{fmtDate(ev.date)}{ev.time ? ` — ${ev.time}` : ''}</span>
                        <h3 className={styles.cardTitle}>{ev.title}</h3>
                        {ev.desc && <p className={styles.cardDesc}>{ev.desc}</p>}
                        <span className={styles.cardLocation}>{ev.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {past.length > 0 && (
              <>
                <h2 className={styles.sectionHead} style={{ marginTop: '60px' }}>Past Events</h2>
                <div className={styles.grid}>
                  {past.map(ev => (
                    <div key={ev.id} className={`${styles.card} ${styles.pastCard}`}>
                      {ev.img && <img src={ev.img} alt={ev.title} className={styles.cardImg} />}
                      <div className={styles.cardBody}>
                        <span className={styles.cardDate}>{fmtDate(ev.date)}{ev.time ? ` — ${ev.time}` : ''}</span>
                        <h3 className={styles.cardTitle}>{ev.title}</h3>
                        {ev.desc && <p className={styles.cardDesc}>{ev.desc}</p>}
                        <span className={styles.cardLocation}>{ev.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <footer className={styles.footer}>Hotel Afisha, 5 Petre Melikishvili Street, Tbilisi, Georgia 0108</footer>
    </div>
  );
}
