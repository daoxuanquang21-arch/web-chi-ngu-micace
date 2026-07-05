'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    ['link', 'image'],
    ['clean']
  ],
};

const generateSlug = (text) => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

export default function Editor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const isEditing = !!id;

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    slugManuallyEdited: false,
    categoryId: '',
    status: 'DRAFT',
    date: new Date().toISOString().split('T')[0],
    coverImage: '',
    excerpt: '',
    content: ''
  });

  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(setCategories);
  }, []);

  useEffect(() => {
    if (isEditing) {
      fetch(`/api/posts`).then(res => res.json()).then(posts => {
        const post = posts.find(p => p.id === id);
        if (post) {
          setFormData({
            title: post.title,
            slug: post.id,
            slugManuallyEdited: true,
            categoryId: post.categoryId || '',
            status: post.status || 'DRAFT',
            date: post.date || new Date().toISOString().split('T')[0],
            coverImage: post.coverImage,
            excerpt: post.excerpt,
            content: post.content
          });
        }
      });
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setFormData(prev => {
      const next = { ...prev, title: newTitle };
      if (!isEditing && !prev.slugManuallyEdited) {
        next.slug = generateSlug(newTitle);
      }
      return next;
    });
  };

  const handleSlugChange = (e) => {
    setFormData(prev => ({ ...prev, slug: e.target.value, slugManuallyEdited: true }));
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: uploadData,
    });

    if (res.ok) {
      const data = await res.json();
      setFormData(prev => ({ ...prev, coverImage: data.url }));
    } else {
      alert('Image upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postId = formData.slug || generateSlug(formData.title);

    const payload = {
      id: postId,
      title: formData.title,
      categoryId: formData.categoryId,
      status: formData.status,
      date: formData.date,
      coverImage: formData.coverImage,
      excerpt: formData.excerpt,
      content: formData.content
    };

    const url = isEditing ? `/api/posts/${id}` : '/api/posts';
    const method = isEditing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      router.push('/admin/dashboard');
    } else {
      alert('Error saving post');
    }
  };

  const inputStyle = { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '15px' };

  return (
    <div className="container" style={{ marginTop: '40px', paddingBottom: '100px' }}>
      <h1>{isEditing ? 'Edit Post' : 'Create New Post'}</h1>
      
      <form onSubmit={handleSubmit} style={{ marginTop: '30px' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Title</label>
        <input name="title" value={formData.title} onChange={handleTitleChange} required style={inputStyle} />

        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Slug (URL)</label>
        <input name="slug" value={formData.slug} onChange={handleSlugChange} required style={inputStyle} />

        <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Category</label>
            <select name="categoryId" value={formData.categoryId} onChange={handleChange} required style={inputStyle}>
              <option value="" disabled>Select a category...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Status</label>
            <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required style={inputStyle} />
          </div>
        </div>

        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Cover Image</label>
        <div style={{ marginBottom: '15px' }}>
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginBottom: '10px', display: 'block' }} />
          {formData.coverImage && (
             <img src={formData.coverImage} alt="Cover Preview" style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', borderRadius: '4px' }} />
          )}
        </div>

        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Excerpt (Short description)</label>
        <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }} />

        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Content</label>
        <div style={{ marginBottom: '60px', height: '300px' }}>
          <ReactQuill theme="snow" value={formData.content} onChange={handleContentChange} style={{ height: '100%' }} modules={quillModules} />
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button type="submit" className="btn">Save Post</button>
          <button type="button" className="btn" style={{ background: '#777' }} onClick={() => router.push('/admin/dashboard')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
