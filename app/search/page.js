import { getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = params.q?.toLowerCase() || '';
  const allPosts = await getSortedPostsData();
  
  const searchResults = allPosts.filter(post => 
    post.title.toLowerCase().includes(query) || 
    post.excerpt.toLowerCase().includes(query)
  );

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <header className="category-header" style={{ marginBottom: '40px', borderBottom: '5px solid #000', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '48px', textTransform: 'uppercase', margin: 0 }}>
          Search Results for: <span className="text-primary">{params.q}</span>
        </h1>
      </header>

      <div className="grid grid-cols-3">
        <div className="main-content-area" style={{ gridColumn: 'span 2' }}>
          <div className="post-list">
            {searchResults.length === 0 ? (
              <p>No posts found for "{params.q}".</p>
            ) : (
              searchResults.map(({ id, date, title, excerpt, coverImage, category }) => (
                <article key={id} style={{ marginBottom: '30px', display: 'flex', gap: '20px' }}>
                  <div style={{ flex: '0 0 300px' }}>
                    <img src={coverImage} alt={title} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <Link href={`/category/${category}`}>
                      <span className="bg-accent" style={{ color: '#fff', padding: '3px 8px', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        {category.replace('-', ' ')}
                      </span>
                    </Link>
                    <h3 className="post-title" style={{ marginTop: '10px', fontSize: '24px' }}>
                      <Link href={`/post/${id}`}>{title}</Link>
                    </h3>
                    <p className="text-light" style={{ fontSize: '14px', marginBottom: '10px' }}>{date}</p>
                    <p>{excerpt}</p>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
        
        <Sidebar />
      </div>
    </div>
  );
}
