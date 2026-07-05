'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await fetch('/api/posts');
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      fetchPosts();
    }
  };

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Admin Dashboard</h1>
        <div>
          <Link href="/admin/users" className="btn" style={{ marginRight: '10px', background: '#333' }}>Users</Link>
          <Link href="/admin/categories" className="btn" style={{ marginRight: '10px', background: '#333' }}>Categories</Link>
          <Link href="/admin/editor" className="btn">Create New Post</Link>
        </div>
      </div>

      {loading ? <p>Loading...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px' }}>Title</th>
              <th style={{ padding: '12px' }}>Author</th>
              <th style={{ padding: '12px' }}>Category</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Date</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{post.title}</td>
                <td style={{ padding: '12px' }}>{post.author?.username || 'Unknown'}</td>
                <td style={{ padding: '12px' }}>{post.category?.name || 'Uncategorized'}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ 
                    padding: '3px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px',
                    background: post.status === 'PUBLISHED' ? '#e6f4ea' : '#fce8e6',
                    color: post.status === 'PUBLISHED' ? '#137333' : '#c5221f'
                  }}>
                    {post.status}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>{post.date}</td>
                <td style={{ padding: '12px' }}>
                  <Link href={`/admin/editor?id=${post.id}`} style={{ color: '#0be6af', marginRight: '15px' }}>Edit</Link>
                  <button onClick={() => handleDelete(post.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
