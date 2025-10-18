import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <div className="border rounded overflow-hidden shadow-sm hover:shadow-md transition">
      <Link to={`/product/${product._id ?? product.id}`}>
        <img
          src={product.images?.[0] ?? 'https://picsum.photos/seed/default/600/600'}
          alt={product.title}
          className="w-full h-56 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/product/${product._id ?? product.id}`}>
          <h3 className="font-medium">{product.title}</h3>
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-bold">${Number(product.price).toFixed(2)}</span>
          <span className="text-sm text-gray-500">{product.countInStock} in stock</span>
        </div>
      </div>
    </div>
  );
}
