import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default async function TrendingPosts() {
  const allPosts = await getSortedPostsData();
  const trendingPosts = allPosts.slice(0, 8); // Lấy 8 bài viết mới nhất/trending

  return (
    <div className="trending-section">
      <div className="trending-header">
        <div className="trending-badge">
          <span>Trending</span>
        </div>
      </div>
      
      <div className="trending-grid">
        {trendingPosts.map(post => (
          <article key={post.id} className="trending-post-card">
            <Link href={`/post/${post.id}`}>
              <div className="trending-post-image">
                <img src={post.coverImage} alt={post.title} />
              </div>
            </Link>
            <div className="trending-post-meta">
              <Link href={`/category/${post.category}`}>
                {post.category.replace('-', ' ')}
              </Link>
              {' / '}
              <span>{post.date}</span>
            </div>
            <h3 className="trending-post-title">
              <Link href={`/post/${post.id}`}>
                {post.title}
              </Link>
            </h3>
          </article>
        ))}
      </div>
    </div>
  );
}
