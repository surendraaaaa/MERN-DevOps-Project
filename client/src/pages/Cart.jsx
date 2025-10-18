import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, remove, updateQty, clear } = useCart();
  const navigate = useNavigate();

  if (cart.items.length === 0)
    return (
      <div>
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <Link to="/" className="text-sky-600 mt-2 inline-block">Continue shopping</Link>
      </div>
    );

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.product} className="flex items-center gap-4 border rounded p-3">
              <img src={item.image || 'https://picsum.photos/seed/default/200/200'} alt={item.title} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-gray-500">${item.price.toFixed(2)}</div>
                <div className="mt-2 flex items-center gap-2">
                  <input type="number" min="1" value={item.qty} onChange={(e) => updateQty(item.product, e.target.value)} className="w-20 border rounded px-2 py-1" />
                  <button onClick={() => remove(item.product)} className="text-sm text-red-600">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="p-4 border rounded">
          <div className="mb-4">
            <div className="text-lg">Subtotal ({cart.totalItems} items)</div>
            <div className="text-2xl font-bold">${cart.totalPrice.toFixed(2)}</div>
          </div>
          <button onClick={() => navigate('/checkout')} className="w-full py-2 bg-sky-600 text-white rounded mb-2">
            Proceed to Checkout
          </button>
          <button onClick={() => clear()} className="w-full py-2 border rounded text-sm">Clear cart</button>
        </aside>
      </div>
    </div>
  );
}
