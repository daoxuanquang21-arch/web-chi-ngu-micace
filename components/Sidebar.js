import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';
import SearchWidget from './SearchWidget';

export default async function Sidebar() {
  const allPostsData = await getSortedPostsData();

  return (
    <aside className="sidebar">
      <div className="widget search-widget" style={{ marginBottom: '40px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontSize: '16px' }}>Search</label>
        <SearchWidget />
      </div>

      <div className="widget recent-posts-widget" style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Recent Posts</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {allPostsData.slice(0, 5).map(post => (
            <li key={post.id} style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '16px', lineHeight: '1.4' }}>
              <Link href={`/post/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </div>

    </aside>
  );
}
