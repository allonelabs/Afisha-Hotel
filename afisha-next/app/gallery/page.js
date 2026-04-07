'use client';
import { useState } from 'react';
import styles from './gallery.module.css';

const images = [
  { src: 'https://cdn.prod.website-files.com/669a26f7d42524ab776f6ebf/67402dc9f0f0a08187dfc222_standard.jpg', cat: 'Rooms', title: 'Studio Room' },
  { src: 'https://cdn.prod.website-files.com/669a26f7d42524ab776f6ebf/67402ee9e943da7c3d131e1c_deluxe2.jpg', cat: 'Rooms', title: 'Deluxe Room' },
  { src: 'https://cdn.prod.website-files.com/669a26f7d42524ab776f6ebf/67403096dd808218743f514d_superior.jpg', cat: 'Rooms', title: 'Superior Room' },
  { src: 'https://cdn.prod.website-files.com/669a26f7d42524ab776f6ebf/67402fb0654d0668668046de_junior%20suite2.jpg', cat: 'Rooms', title: 'Junior Suite' },
  { src: 'https://cdn.prod.website-files.com/669a26f7d42524ab776f6ebf/6740313460da430d0d25e34b_executive%20copy.jpg', cat: 'Rooms', title: 'Executive Suite' },
  { src: 'https://cdn.prod.website-files.com/669a26f7d42524ab776f6ebf/674046c2bd82d8e8e5ecfda1_kino2.jpg', cat: 'Dining', title: 'Kino Restaurant' },
  { src: 'https://cdn.prod.website-files.com/669a26f7d42524ab776f6ebf/67404708f0f0a08187ebc9f5_marani.jpg', cat: 'Dining', title: 'Marani Wine Bar' },
  { src: 'https://cdn.prod.website-files.com/669a26f7d42524ab776f6ebf/6740475a40cf4e47f3f44a2f_terrace.jpg', cat: 'Dining', title: 'The Terrace' },
  { src: 'https://cdn.prod.website-files.com/669a26f7d42524ab776f6ebf/6741f02cf42e9a0efaa6cd6f_spa.jpg', cat: 'Wellness', title: 'Spa & Wellness' },
  { src: 'https://cdn.prod.website-files.com/669a26f7d42524ab776f6ebf/6741f47d49dfd83b3de2e57a_conference2.jpg', cat: 'Wellness', title: 'Fitness & Conference' },
  { src: 'https://cdn.prod.website-files.com/669a26f7d42524ab776f6ebf/6741f09eba2d3950a3c43fea_massage2.jpg', cat: 'Wellness', title: 'Massage Room' },
  { src: '/media/cinema-room.jpg', cat: 'Hotel', title: 'Cinema Heritage Hall' },
  { src: '/media/philharmonic.jpg', cat: 'Hotel', title: 'Tbilisi Philharmonic' },
  { src: 'https://cdn.prod.website-files.com/669a26f7d42524ab776f6ebf/674050ac1ed98879b3d3e6c2_cta-bg.jpg', cat: 'Hotel', title: 'Hotel Ambiance' },
];

const categories = ['All', 'Rooms', 'Dining', 'Wellness', 'Hotel'];

export default function GalleryPage() {
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  const filtered = filter === 'All' ? images : images.filter(i => i.cat === filter);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a href="/" className={styles.logo}><img src="https://cdn.prod.website-files.com/669a26f7d42524ab776f6ebf/66f5b9c4bd8e0267ee3b80bf_Afisha_Logo_White.png" alt="Afisha" /></a>
        <a href="/" className={styles.back}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg> Back to Hotel</a>
      </header>

      <div className={styles.hero}>
        <p className={styles.label}>Explore</p>
        <h1 className={styles.title}>Gallery</h1>
        <p className={styles.subtitle}>A visual journey through Hotel Afisha</p>
      </div>

      <div className={styles.filters}>
        {categories.map(c => (
          <button key={c} className={`${styles.filterBtn} ${filter === c ? styles.active : ''}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map((img, i) => (
          <div key={i} className={styles.item} onClick={() => setLightbox(img)}>
            <img src={img.src} alt={img.title} />
            <div className={styles.overlay}>
              <span className={styles.itemCat}>{img.cat}</span>
              <span className={styles.itemTitle}>{img.title}</span>
            </div>
          </div>
        ))}
      </div>

      {lightbox && (
        <div className={styles.lightbox} onClick={() => setLightbox(null)}>
          <button className={styles.lbClose}>&times;</button>
          <img src={lightbox.src} alt={lightbox.title} onClick={e => e.stopPropagation()} />
          <p className={styles.lbCaption}>{lightbox.title}</p>
        </div>
      )}

      <footer className={styles.footer}>Hotel Afisha, 5 Petre Melikishvili Street, Tbilisi, Georgia 0108</footer>
    </div>
  );
}
