import Image from 'next/image';

const projects = [
  {
    name: 'Abigail',
    description: 'The Hungarian Oracle. Personalised Gypsy card readings powered by ancient Hungarian tradition.',
    url: 'https://abigail.dbcdatastudio.com',
    label: 'abigail.dbcdatastudio.com',
    tag: 'Live',
  },
  {
    name: 'Calculadora de Lucro',
    description: 'Free profit calculator for Brazilian marketplace sellers on Shopee, Mercado Livre and Pix.',
    url: 'https://calculadora.dbcdatastudio.com',
    label: 'calculadora.dbcdatastudio.com',
    tag: 'Live',
  },
];

export default function Page() {
  return (
    <main style={styles.main}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <Image
            src="/logo.jpg"
            alt="DBC Data Studio"
            width={40}
            height={40}
            style={{ borderRadius: '8px', objectFit: 'cover' }}
            priority
          />
          <span style={styles.wordmark}>DBC Data Studio</span>
        </div>
      </header>

      {/* Hero */}
      <section style={styles.hero}>
        <p style={styles.heroEyebrow}>Independent digital products</p>
        <h1 style={styles.heroTitle}>We build focused,<br />useful software.</h1>
        <p style={styles.heroSub}>
          Small tools and services designed to solve real problems.
        </p>
      </section>

      {/* Divider */}
      <div style={styles.divider} />

      {/* Projects */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Products</h2>
        <div style={styles.grid}>
          {projects.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card"
            >
              <div style={styles.cardTop}>
                <span style={styles.cardName}>{p.name}</span>
                <span style={styles.tag}>{p.tag}</span>
              </div>
              <p style={styles.cardDesc}>{p.description}</p>
              <span style={styles.cardUrl}>{p.label} ↗</span>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <span style={styles.footerLeft}>© {new Date().getFullYear()} DBC Data Studio</span>
          <a href="mailto:contact@dbcdatastudio.com" style={styles.footerLink} className="footer-link">
            contact@dbcdatastudio.com
          </a>
        </div>
      </footer>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '720px',
    margin: '0 auto',
    padding: '0 24px',
  },
  header: {
    padding: '32px 0 0',
  },
  headerInner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  wordmark: {
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '0.02em',
    color: '#111827',
  },
  hero: {
    paddingTop: '80px',
    paddingBottom: '64px',
  },
  heroEyebrow: {
    fontSize: '12px',
    fontWeight: 500,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: '#9ca3af',
    marginBottom: '20px',
  },
  heroTitle: {
    fontSize: 'clamp(32px, 5vw, 52px)',
    fontWeight: 700,
    lineHeight: 1.15,
    letterSpacing: '-0.02em',
    color: '#111827',
    marginBottom: '20px',
  },
  heroSub: {
    fontSize: '18px',
    color: '#6b7280',
    maxWidth: '480px',
    lineHeight: 1.7,
  },
  divider: {
    height: '1px',
    background: '#e5e7eb',
    marginBottom: '48px',
  },
  section: {
    flex: 1,
    paddingBottom: '80px',
  },
  sectionTitle: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: '#9ca3af',
    marginBottom: '24px',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  cardName: {
    fontSize: '17px',
    fontWeight: 600,
    color: '#111827',
  },
  tag: {
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.05em',
    background: '#f0fdf4',
    color: '#16a34a',
    border: '1px solid #bbf7d0',
    borderRadius: '20px',
    padding: '2px 10px',
  },
  cardDesc: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: 1.65,
    marginBottom: '16px',
  },
  cardUrl: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#9ca3af',
    fontFamily: 'var(--font-mono)',
  },
  footer: {
    borderTop: '1px solid #e5e7eb',
    padding: '24px 0 32px',
    marginTop: 'auto',
  },
  footerInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap' as const,
    gap: '8px',
  },
  footerLeft: {
    fontSize: '13px',
    color: '#9ca3af',
  },
  footerLink: {
    fontSize: '13px',
    color: '#6b7280',
    textDecoration: 'none',
    transition: 'color 0.15s',
  },
};
