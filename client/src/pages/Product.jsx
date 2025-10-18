import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';

  useEffect(() => {
    let mounted = true;
    axios.get(`${apiBase}/products/${id}`).then((res) => {
      if (mounted) setProduct(res.data);
    });
    return () => (mounted = false);
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <img
          src={product.images?.[0] ?? 'https://picsum.photos/seed/default/900/900'}
          alt={product.title}
          className="w-full h-96 object-cover rounded"
        />
        <h2 className="text-2xl font-semibold mt-4">{product.title}</h2>
        <p className="mt-2 text-gray-700">{product.description}</p>
      </div>

      <aside className="p-4 border rounded">
        <div className="text-xl font-bold mb-2">${Number(product.price).toFixed(2)}</div>
        <div className="mb-2">Stock: {product.countInStock}</div>

        <div className="flex items-center gap-2 mb-4">
          <label>Qty:</label>
          <input
            type="number"
            min="1"
            max={product.countInStock}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
            className="w-20 border rounded px-2 py-1"
          />
        </div>

        <button
          onClick={() => add(product, qty)}
          disabled={product.countInStock === 0}
          className="w-full px-4 py-2 bg-sky-600 text-white rounded disabled:opacity-50"
        >
          Add to cart
        </button>
      </aside>
    </div>
  );
}
