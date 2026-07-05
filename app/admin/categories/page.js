'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    setSlug(val.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const handleEditNameChange = (e) => {
    const val = e.target.value;
    setEditName(val);
    setEditSlug(val.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug })
    });
    if (res.ok) {
      setName('');
      setSlug('');
      fetchCategories();
    } else {
      alert('Failed to add category');
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditSlug(cat.slug);
  };

  const handleSaveEdit = async () => {
    const res = await fetch(`/api/categories/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName, slug: editSlug })
    });
    if (res.ok) {
      setEditingId(null);
      fetchCategories();
    } else {
      alert('Failed to update category');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this category? All posts in this category might be affected.')) {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCategories();
      } else {
        alert('Failed to delete category');
      }
    }
  };

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Manage Categories</h1>
        <Link href="/admin/dashboard" className="btn">Back to Dashboard</Link>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Add New Category</h3>
        <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
          <input 
            placeholder="Name (e.g. Technology)" 
            value={name} 
            onChange={handleNameChange} 
            required 
            style={{ padding: '10px', flex: 1, border: '1px solid #ccc' }}
          />
          <input 
            placeholder="Slug (e.g. technology)" 
            value={slug} 
            onChange={e => setSlug(e.target.value)} 
            required 
            style={{ padding: '10px', flex: 1, border: '1px solid #ccc' }}
          />
          <button type="submit" className="btn">Add</button>
        </div>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '12px' }}>Name</th>
            <th style={{ padding: '12px' }}>Slug</th>
            <th style={{ padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px' }}>
                {editingId === cat.id ? (
                  <input 
                    value={editName} 
                    onChange={handleEditNameChange} 
                    style={{ padding: '5px', width: '100%' }} 
                  />
                ) : (
                  cat.name
                )}
              </td>
              <td style={{ padding: '12px' }}>
                {editingId === cat.id ? (
                  <input 
                    value={editSlug} 
                    onChange={e => setEditSlug(e.target.value)} 
                    style={{ padding: '5px', width: '100%' }} 
                  />
                ) : (
                  cat.slug
                )}
              </td>
              <td style={{ padding: '12px' }}>
                {editingId === cat.id ? (
                  <>
                    <button onClick={handleSaveEdit} style={{ color: '#137333', background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px' }}>Save</button>
                    <button onClick={() => setEditingId(null)} style={{ color: '#777', background: 'none', border: 'none', cursor: 'pointer' }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(cat)} style={{ color: '#0be6af', background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px' }}>Edit</button>
                    <button onClick={() => handleDelete(cat.id)} style={{ color: '#c5221f', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
