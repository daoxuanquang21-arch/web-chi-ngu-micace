"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchWidget() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} style={{ display: 'flex' }}>
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ flexGrow: 1, padding: '8px', border: '1px solid #ccc' }} 
        placeholder="Search..."
      />
      <button 
        type="submit" 
        style={{ padding: '8px 15px', border: '1px solid #ccc', borderLeft: 'none', background: '#f0f0f0', cursor: 'pointer', fontSize: '16px' }}
      >
        Search
      </button>
    </form>
  );
}
