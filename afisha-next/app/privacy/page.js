'use client';
import styles from './privacy.module.css';

const sections = [
  {
    title: '1. Information We Collect',
    content: `When you make a reservation or interact with our website, we may collect the following information:

• Full name, email address, phone number
• Payment information (card number is not stored — only the last 4 digits for reference)
• Check-in/check-out dates and room preferences
• Special requests and dietary requirements
• IP address and browser information (collected automatically)
• Communication history with our team`
  },
  {
    title: '2. How We Use Your Information',
    content: `We use the information we collect to:

• Process and manage your hotel reservations
• Communicate booking confirmations and updates
• Provide personalized guest services during your stay
• Send promotional offers and newsletters (only with your consent)
• Improve our website and guest experience
• Comply with legal obligations and resolve disputes`
  },
  {
    title: '3. Data Protection',
    content: `Hotel Afisha is committed to protecting your personal data. We implement appropriate technical and organizational measures including:

• Encrypted data transmission (SSL/TLS)
• Secure storage of personal information
• Limited access to personal data on a need-to-know basis
• Regular security assessments and updates
• Staff training on data protection practices`
  },
  {
    title: '4. Sharing Your Information',
    content: `We do not sell your personal information. We may share your data with:

• Payment processors to complete transactions
• Government authorities when required by law
• Service providers who assist in hotel operations (under strict confidentiality agreements)

All third parties are required to maintain the confidentiality and security of your information.`
  },
  {
    title: '5. Cookies',
    content: `Our website uses cookies to:

• Remember your language preference
• Maintain your session during booking
• Analyze website traffic and usage patterns

You can control cookie settings through your browser preferences. Disabling cookies may affect some website functionality.`
  },
  {
    title: '6. Your Rights',
    content: `Under applicable data protection laws, you have the right to:

• Access the personal data we hold about you
• Request correction of inaccurate information
• Request deletion of your personal data
• Withdraw consent for marketing communications
• Lodge a complaint with a supervisory authority

To exercise any of these rights, please contact us at Info@hotelafisha.com.`
  },
  {
    title: '7. Data Retention',
    content: `We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. Booking records are typically retained for 3 years after your stay.`
  },
  {
    title: '8. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.`
  },
  {
    title: '9. Contact Us',
    content: `If you have questions about this Privacy Policy or our data practices, please contact us:

Hotel Afisha
5 Petre Melikishvili Street
Tbilisi 0108, Georgia
Email: Info@hotelafisha.com
Phone: +995 322 200 22 44`
  },
];

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a href="/" className={styles.logo}><img src="https://cdn.prod.website-files.com/669a26f7d42524ab776f6ebf/66f5b9c4bd8e0267ee3b80bf_Afisha_Logo_White.png" alt="Afisha" /></a>
        <a href="/" className={styles.back}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg> Back to Hotel</a>
      </header>

      <div className={styles.hero}>
        <p className={styles.label}>Legal</p>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.subtitle}>Last updated: April 2026</p>
      </div>

      <div className={styles.content}>
        <p className={styles.intro}>Hotel Afisha (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or stay at our hotel.</p>

        {sections.map((s, i) => (
          <div key={i} className={styles.section}>
            <h2 className={styles.sectionTitle}>{s.title}</h2>
            <div className={styles.sectionContent}>{s.content}</div>
          </div>
        ))}
      </div>

      <footer className={styles.footer}>Hotel Afisha, 5 Petre Melikishvili Street, Tbilisi, Georgia 0108</footer>
    </div>
  );
}
