import { getPostData, getAllPostIds } from '@/lib/posts';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TrendingPosts from '@/components/TrendingPosts';

export async function generateStaticParams() {
  const posts = await getAllPostIds();
  return posts.map((post) => ({
    slug: post.params.slug,
  }));
}

export default async function Post({ params }) {
  // Await the params object before using its properties
  const { slug } = await params;
  const postData = await getPostData(slug);

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <div className="grid grid-cols-3">
        <main className="main-content-area" style={{ gridColumn: 'span 2' }}>
          <article>
            {postData.category && (
              <Link href={`/category/${postData.category.slug}`}>
                <span className="bg-accent" style={{ color: '#fff', padding: '5px 10px', fontSize: '14px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                  {postData.category.name}
                </span>
              </Link>
            )}
            <h1 style={{ fontSize: '42px', marginTop: '20px', marginBottom: '20px' }}>{postData.title}</h1>
            
            <div className="post-meta" style={{ display: 'flex', gap: '20px', marginBottom: '30px', color: '#555', fontSize: '14px', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <span>By <strong>{postData.author?.username || 'Admin'}</strong></span>
              <span>{postData.date}</span>
            </div>

            {postData.coverImage && (
              <img src={postData.coverImage} alt={postData.title} style={{ width: '100%', height: 'auto', marginBottom: '30px' }} />
            )}

            <div className="post-content" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} style={{ fontSize: '18px', lineHeight: '1.8' }} />
          </article>
        </main>
        
        <Sidebar />
      </div>

      {/* Trending Posts Section */}
      <TrendingPosts />
    </div>
  );
}
