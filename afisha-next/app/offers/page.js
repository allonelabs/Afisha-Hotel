'use client';
import styles from './offers.module.css';

const offers = [
  {
    title: 'Extended Stay',
    tag: 'Long Stay',
    desc: 'Book 3 nights or more and enjoy 20% off your entire stay. Includes complimentary breakfast and late checkout.',
    price: 'From $144/night',
    img: 'https://cdn.prod.website-files.com/669a26f7d42524ab776f6ebf/67402dc9f0f0a08187dfc222_standard.jpg',
  },
  {
    title: 'Romance in Tbilisi',
    tag: 'Couples',
    desc: 'A curated experience for two — champagne on arrival, couples spa treatment, and dinner at Kino Restaurant.',
    price: 'From $520',
    img: 'https://cdn.prod.website-files.com/669a26f7d42524ab776f6ebf/67402fb0654d0668668046de_junior%20suite2.jpg',
  },
  {
    title: 'Cinema & Culture',
    tag: 'Experience',
    desc: 'Two nights in our heritage-inspired rooms with a private cinema screening, city walking tour, and wine tasting at Marani.',
    price: 'From $680',
    img: 'https://cdn.prod.website-files.com/669a26f7d42524ab776f6ebf/6740313460da430d0d25e34b_executive%20copy.jpg',
  },
  {
    title: 'Wellness Retreat',
    tag: 'Wellness',
    desc: 'Recharge with a 2-night stay including daily spa access, one full-body massage, healthy breakfast, and yoga session.',
    price: 'From $460',
    img: 'https://cdn.prod.website-files.com/669a26f7d42524ab776f6ebf/6741f02cf42e9a0efaa6cd6f_spa.jpg',
  },
  {
    title: 'Early Bird',
    tag: 'Advance',
    desc: 'Book 30 days in advance and save 15% on any room. Flexible cancellation up to 7 days before arrival.',
    price: 'From $153/night',
    img: 'https://cdn.prod.website-files.com/669a26f7d42524ab776f6ebf/67402ee9e943da7c3d131e1c_deluxe2.jpg',
  },
  {
    title: 'Business in Style',
    tag: 'Business',
    desc: 'Superior room with high-speed WiFi, conference room access, daily pressing service, and airport transfer.',
    price: 'From $380/night',
    img: 'https://cdn.prod.website-files.com/669a26f7d42524ab776f6ebf/6741f47d49dfd83b3de2e57a_conference2.jpg',
  },
];

export default function OffersPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a href="/" className={styles.logo}><img src="https://cdn.prod.website-files.com/669a26f7d42524ab776f6ebf/66f5b9c4bd8e0267ee3b80bf_Afisha_Logo_White.png" alt="Afisha" /></a>
        <a href="/" className={styles.back}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg> Back to Hotel</a>
      </header>

      <div className={styles.hero}>
        <p className={styles.label}>Exclusive</p>
        <h1 className={styles.title}>Special Offers</h1>
        <p className={styles.subtitle}>Curated packages for every kind of stay</p>
      </div>

      <div className={styles.grid}>
        {offers.map((o, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.cardImg}>
              <img src={o.img} alt={o.title} />
              <span className={styles.tag}>{o.tag}</span>
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{o.title}</h3>
              <p className={styles.cardDesc}>{o.desc}</p>
              <div className={styles.cardFooter}>
                <span className={styles.cardPrice}>{o.price}</span>
                <a href="/booking" className={styles.cardBtn}>Book Now</a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className={styles.footer}>Hotel Afisha, 5 Petre Melikishvili Street, Tbilisi, Georgia 0108</footer>
    </div>
  );
}
