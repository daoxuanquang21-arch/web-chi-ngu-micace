import Link from 'next/link';

export default function Footer({ categories = [] }) {
  return (
    <footer className="site-footer">
      <div className="footer-top" style={{ padding: '60px 0', backgroundColor: '#111' }}>
        <div className="container text-center">
          <div className="footer-col">
            <Link href="/">
              <h2 className="logo-title footer-logo">Smart Tool Guides</h2>
            </Link>
            <p style={{ fontSize: '12px', color: '#888' }}>We provide in-depth reviews of the latest SaaS tools.</p>
          </div>
          <nav className="footer-nav">
            <ul>
              {categories.map(cat => (
                <li key={cat.id || cat.slug}><Link href={`/category/${cat.slug || cat.id}`}>{cat.name}</Link></li>
              ))}
            </ul>
          </nav>
          <div style={{ marginTop: '40px', color: '#777', fontSize: '11px' }}>
            Copyright &copy; {new Date().getFullYear()} Smart Tool Guides
          </div>
        </div>
      </div>
    </footer>
  );
}
