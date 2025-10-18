import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';

  useEffect(() => {
    let mounted = true;
    axios.get(`${apiBase}/products`).then((res) => {
      if (mounted) setProducts(res.data.products || res.data);
    });
    return () => (mounted = false);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Featured products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p._id ?? p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
