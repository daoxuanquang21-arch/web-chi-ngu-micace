import { getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

export default async function Home() {
  const allPostsData = await getSortedPostsData();
  
  if (allPostsData.length === 0) {
    return <div className="container" style={{ marginTop: '40px' }}>No posts found.</div>;
  }

  const featuredPost = allPostsData[0];
  const listPosts = allPostsData.slice(1);

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      
      {/* Hero Banner */}
      <div className="hero-banner" style={{ backgroundImage: `url(${featuredPost.coverImage})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <Link href={`/category/${featuredPost.category?.slug || 'uncategorized'}`}>
            <div className="hero-category">
              <span>{featuredPost.category?.name || 'Uncategorized'}</span>
            </div>
          </Link>
          <h2 className="hero-title">
            <Link href={`/post/${featuredPost.id}`}>{featuredPost.title}</Link>
          </h2>
          <p className="hero-excerpt">{featuredPost.excerpt}</p>
        </div>
      </div>

      <div className="grid grid-cols-3">
        <div className="main-content-area" style={{ gridColumn: 'span 2' }}>
          <h2 style={{ borderBottom: '2px solid #000', paddingBottom: '10px', textTransform: 'uppercase' }}>
            Latest <span>Articles</span>
          </h2>
          
          <div className="post-list" style={{ marginTop: '20px' }}>
            {listPosts.map(({ id, date, title, excerpt, coverImage, category }) => (
              <article key={id} style={{ marginBottom: '30px', display: 'flex', gap: '20px' }}>
                <div style={{ flex: '0 0 300px' }}>
                  <img src={coverImage} alt={title} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                </div>
                <div>
                  <Link href={`/category/${category?.slug || 'uncategorized'}`}>
                    <span className="bg-accent" style={{ color: '#fff', padding: '3px 8px', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                      {category?.name || 'Uncategorized'}
                    </span>
                  </Link>
                  <h3 className="post-title" style={{ marginTop: '10px', fontSize: '24px' }}>
                    <Link href={`/post/${id}`}>{title}</Link>
                  </h3>
                  <p className="text-light" style={{ fontSize: '14px', marginBottom: '10px' }}>{date}</p>
                  <p>{excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        
        <Sidebar />
      </div>
    </div>
  );
}
