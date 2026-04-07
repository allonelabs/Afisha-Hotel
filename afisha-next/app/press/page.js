'use client';
import styles from './press.module.css';

const mentions = [
  { source: 'Design Hotels', date: '2026', title: 'Hotel Afisha Named Among Top 10 Design Hotels in the Caucasus', type: 'Feature' },
  { source: 'Condé Nast Traveler', date: '2025', title: 'Tbilisi\'s Cinema-Inspired Hotel Redefines Georgian Hospitality', type: 'Review' },
  { source: 'Wallpaper*', date: '2025', title: 'Where Georgian Heritage Meets Contemporary Luxury', type: 'Feature' },
  { source: 'Forbes Georgia', date: '2025', title: 'Hotel Afisha: The Five-Star Vision Behind Tbilisi\'s Cultural Revival', type: 'Interview' },
];

export default function PressPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a href="/" className={styles.logo}><img src="https://cdn.prod.website-files.com/669a26f7d42524ab776f6ebf/66f5b9c4bd8e0267ee3b80bf_Afisha_Logo_White.png" alt="Afisha" /></a>
        <a href="/" className={styles.back}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg> Back to Hotel</a>
      </header>

      <div className={styles.hero}>
        <p className={styles.label}>Media</p>
        <h1 className={styles.title}>Press</h1>
        <p className={styles.subtitle}>Hotel Afisha in the media</p>
      </div>

      <div className={styles.content}>
        <div className={styles.mentions}>
          {mentions.map((m, i) => (
            <div key={i} className={styles.mention}>
              <div className={styles.mentionLeft}>
                <span className={styles.mentionType}>{m.type}</span>
                <h3 className={styles.mentionTitle}>{m.title}</h3>
                <span className={styles.mentionSource}>{m.source} — {m.date}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.pressKit}>
          <h2 className={styles.sectionTitle}>Press Kit</h2>
          <p className={styles.sectionDesc}>For press inquiries, high-resolution images, and brand assets, please contact our communications team.</p>
          <div className={styles.contactCard}>
            <div>
              <span className={styles.contactLabel}>Press Contact</span>
              <p>Info@hotelafisha.com</p>
            </div>
            <div>
              <span className={styles.contactLabel}>Phone</span>
              <p>+995 322 200 22 44</p>
            </div>
            <div>
              <span className={styles.contactLabel}>Address</span>
              <p>5 Petre Melikishvili St, Tbilisi 0108, Georgia</p>
            </div>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>Hotel Afisha, 5 Petre Melikishvili Street, Tbilisi, Georgia 0108</footer>
    </div>
  );
}
