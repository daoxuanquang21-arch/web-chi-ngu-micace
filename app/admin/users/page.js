'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ email: '', password: '', userRole: 'AUTHOR' });
  const [showPassword, setShowPassword] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editRole, setEditRole] = useState('');
  const [editPassword, setEditPassword] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      setFormData({ email: '', password: '', userRole: 'AUTHOR' });
      fetchUsers();
    } else {
      const errData = await res.json();
      alert(`Failed to add user: ${errData.error}`);
    }
  };

  const handleEdit = (u) => {
    setEditingId(u.id);
    setEditRole(u.role);
    setEditPassword('');
  };

  const handleSaveEdit = async () => {
    const res = await fetch(`/api/users/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userRole: editRole, password: editPassword })
    });
    if (res.ok) {
      setEditingId(null);
      fetchUsers();
    } else {
      const errData = await res.json();
      alert(`Failed to update user: ${errData.error}`);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchUsers();
      } else {
        const errData = await res.json();
        alert(`Failed to delete user: ${errData.error}`);
      }
    }
  };

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Manage Users</h1>
        <Link href="/admin/dashboard" className="btn">Back to Dashboard</Link>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Add New User</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '15px', marginTop: '15px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
            <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required style={{ padding: '10px', width: '100%', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? "text" : "password"} placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required style={{ padding: '10px', width: '100%', boxSizing: 'border-box', paddingRight: '45px', border: '1px solid #ccc', borderRadius: '4px' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#555', padding: '5px' }}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold' }}>Role</label>
            <select value={formData.userRole} onChange={e => setFormData({...formData, userRole: e.target.value})} style={{ padding: '10px', width: '100%', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}>
              <option value="AUTHOR">Author</option>
              <option value="EDITOR">Editor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn" style={{ padding: '10px 20px', height: '41px' }}>Add</button>
        </div>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '12px' }}>Email</th>
            <th style={{ padding: '12px' }}>Role</th>
            <th style={{ padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px' }}>{u.email}</td>
              <td style={{ padding: '12px' }}>
                {editingId === u.id ? (
                  <select value={editRole} onChange={e => setEditRole(e.target.value)} style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}>
                    <option value="AUTHOR">Author</option>
                    <option value="EDITOR">Editor</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                ) : (
                  <span style={{ padding: '3px 8px', background: '#ddd', borderRadius: '4px', fontSize: '12px' }}>{u.role}</span>
                )}
              </td>
              <td style={{ padding: '12px' }}>
                {editingId === u.id ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input 
                      type="text" 
                      placeholder="Đổi mật khẩu (Bỏ trống nếu giữ nguyên)" 
                      value={editPassword} 
                      onChange={e => setEditPassword(e.target.value)} 
                      style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '4px', width: '250px' }} 
                    />
                    <button onClick={handleSaveEdit} style={{ color: '#137333', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
                    <button onClick={() => setEditingId(null)} style={{ color: '#777', background: 'none', border: 'none', cursor: 'pointer' }}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => handleEdit(u)} style={{ color: '#0be6af', background: 'none', border: 'none', cursor: 'pointer', marginRight: '15px' }}>Edit</button>
                    <button onClick={() => handleDelete(u.id)} style={{ color: '#c5221f', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
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
