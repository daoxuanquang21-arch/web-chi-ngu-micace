import { getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

export async function generateStaticParams() {
  const posts = await getSortedPostsData();
  const categories = [...new Set(posts.map(post => post.category))];
  
  return categories.map((category) => ({
    slug: category,
  }));
}

export default async function Category({ params }) {
  // Await the params object before using its properties
  const { slug } = await params;
  const allPosts = await getSortedPostsData();
  const categoryPosts = allPosts.filter(post => post.category === slug);
  const categoryName = slug.replace('-', ' ');

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <header className="category-header" style={{ marginBottom: '40px', borderBottom: '5px solid #000', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '48px', textTransform: 'uppercase', margin: 0 }}>
          Category: <span className="text-primary">{categoryName}</span>
        </h1>
      </header>

      <div className="grid grid-cols-3">
        <div className="main-content-area" style={{ gridColumn: 'span 2' }}>
          <div className="post-list">
            {categoryPosts.length === 0 ? (
              <p>No posts found in this category.</p>
            ) : (
              categoryPosts.map(({ id, date, title, excerpt, coverImage, category }) => (
                <article key={id} style={{ marginBottom: '30px', display: 'flex', gap: '20px' }}>
                  <div style={{ flex: '0 0 300px' }}>
                    <img src={coverImage} alt={title} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <h3 style={{ marginTop: '0', fontSize: '24px' }}>
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
