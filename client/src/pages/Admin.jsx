import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
      return;
    }
    axios.get(`${apiBase}/products`).then((res) => setProducts(res.data.products || res.data));
  }, [user]);

  async function deleteProduct(id) {
    if (!confirm('Delete product?')) return;
    await axios.delete(`${apiBase}/products/${id}`);
    setProducts((p) => p.filter((x) => x._id !== id));
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Admin — Products</h2>
      <div className="mb-4">
        <button onClick={() => alert('Use API or implement create UI')} className="px-3 py-1 border rounded">Create product</button>
      </div>
      <div className="space-y-2">
        {products.map((p) => (
          <div key={p._id} className="flex items-center justify-between border p-3 rounded">
            <div className="flex items-center gap-3">
              <img src={p.images?.[0] ?? 'https://picsum.photos/seed/default/80/80'} alt={p.title} className="w-16 h-16 object-cover rounded" />
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-sm text-gray-500">${p.price}</div>
              </div>
            </div>
            <div>
              <button onClick={() => alert('Edit UI not implemented')} className="px-3 py-1 mr-2 border rounded">Edit</button>
              <button onClick={() => deleteProduct(p._id)} className="px-3 py-1 border rounded text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
