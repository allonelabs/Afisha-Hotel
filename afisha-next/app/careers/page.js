'use client';
import styles from './careers.module.css';

const jobs = [
  { title: 'Front Desk Manager', dept: 'Operations', type: 'Full-time', desc: 'Lead our front desk team in delivering exceptional first impressions to every guest.' },
  { title: 'Sous Chef', dept: 'Kino Restaurant', type: 'Full-time', desc: 'Work alongside our Head Chef to create Georgian-inspired fine dining experiences.' },
  { title: 'Spa Therapist', dept: 'Wellness', type: 'Full-time', desc: 'Provide premium spa treatments in our wellness center.' },
  { title: 'Sommelier', dept: 'Marani Wine Bar', type: 'Full-time', desc: 'Curate and present our Georgian and international wine collection.' },
  { title: 'Events Coordinator', dept: 'Events', type: 'Full-time', desc: 'Plan and execute memorable events, from private screenings to corporate gatherings.' },
  { title: 'Night Auditor', dept: 'Operations', type: 'Part-time', desc: 'Ensure smooth overnight operations and accurate financial reporting.' },
];

const values = [
  { title: 'Cinematic Excellence', desc: 'We approach every detail with the precision of a film director.' },
  { title: 'Georgian Warmth', desc: 'Our heritage of hospitality runs deep in everything we do.' },
  { title: 'Creative Growth', desc: 'We invest in our team\'s development and encourage fresh ideas.' },
];

export default function CareersPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a href="/" className={styles.logo}><img src="https://cdn.prod.website-files.com/669a26f7d42524ab776f6ebf/66f5b9c4bd8e0267ee3b80bf_Afisha_Logo_White.png" alt="Afisha" /></a>
        <a href="/" className={styles.back}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg> Back to Hotel</a>
      </header>

      <div className={styles.hero}>
        <p className={styles.label}>Join Us</p>
        <h1 className={styles.title}>Careers</h1>
        <p className={styles.subtitle}>Be part of Tbilisi&apos;s most cinematic hotel experience</p>
      </div>

      <div className={styles.content}>
        <div className={styles.valuesGrid}>
          {values.map((v, i) => (
            <div key={i} className={styles.valueCard}>
              <h3 className={styles.valueTitle}>{v.title}</h3>
              <p className={styles.valueDesc}>{v.desc}</p>
            </div>
          ))}
        </div>

        <h2 className={styles.sectionTitle}>Open Positions</h2>

        <div className={styles.jobList}>
          {jobs.map((j, i) => (
            <div key={i} className={styles.job}>
              <div className={styles.jobInfo}>
                <h3 className={styles.jobTitle}>{j.title}</h3>
                <div className={styles.jobMeta}>
                  <span>{j.dept}</span>
                  <span className={styles.dot} />
                  <span>{j.type}</span>
                </div>
                <p className={styles.jobDesc}>{j.desc}</p>
              </div>
              <a href="mailto:Info@hotelafisha.com?subject=Application: {j.title}" className={styles.applyBtn}>Apply</a>
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <p>Don&apos;t see a role that fits? Send us your CV at <a href="mailto:Info@hotelafisha.com">Info@hotelafisha.com</a></p>
        </div>
      </div>

      <footer className={styles.footer}>Hotel Afisha, 5 Petre Melikishvili Street, Tbilisi, Georgia 0108</footer>
    </div>
  );
}
