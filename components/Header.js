"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Header({ posts = [], categories = [] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <div className="header-left">
            <div className="hamburger-menu" onClick={() => setIsMenuOpen(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </div>
            <div className="logo">
              <Link href="/">
                <h1 className="logo-title">Smart Tool Guides</h1>
              </Link>
            </div>
          </div>
          
          <nav className="main-nav">
            <ul>
              {categories.map(cat => {
                const catPosts = posts.filter(p => p.category === cat.slug).slice(0, 5);
                return (
                  <li key={cat.id || cat.slug} className="menu-item-has-mega-menu">
                    <Link href={`/category/${cat.slug || cat.id}`}>{cat.name}</Link>
                    {catPosts.length > 0 && (
                      <div className="mega-menu">
                        <div className="container">
                          <div className="mega-menu-grid">
                            {catPosts.map(post => (
                              <div key={post.id} className="mega-menu-post">
                                <Link href={`/post/${post.id}`}>
                                  <img src={post.coverImage} alt={post.title} />
                                  <h4>{post.title}</h4>
                                </Link>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="header-right">
          </div>
        </div>
      </header>

      {/* Flyout Menu */}
      <div className={`flyout-overlay ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(false)}></div>
      <div className={`flyout-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="flyout-close" onClick={() => setIsMenuOpen(false)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
        <div className="flyout-logo">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            <img src="http://saasreview.co/wp-content/uploads/2023/02/Green-500px-1.png" alt="Smart Tool Guides" style={{ width: '150px' }} />
          </Link>
        </div>
        <nav className="flyout-nav">
          <ul>
            {categories.map(cat => (
              <li key={cat.id || cat.slug}><Link href={`/category/${cat.slug || cat.id}`} onClick={() => setIsMenuOpen(false)}>{cat.name}</Link></li>
            ))}
          </ul>
        </nav>
        <div className="flyout-social">
          <p>Connect with us</p>
        </div>
      </div>
    </>
  );
}
