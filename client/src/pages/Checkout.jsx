import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const { cart, clear } = useCart();
  const { user } = useAuth();
  const [shipping, setShipping] = useState({ address: '', city: '', postalCode: '', country: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';

  async function placeOrder() {
    if (!user) return navigate('/login');
    setLoading(true);
    try {
      const payload = {
        orderItems: cart.items.map((i) => ({ product: i.product, qty: i.qty, price: i.price, title: i.title, image: i.image })),
        shippingAddress: shipping,
        paymentMethod: 'mock',
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: cart.totalPrice
      };
      const { data } = await axios.post(`${apiBase}/orders`, payload);
      clear();
      navigate(`/order/${data._id || data.id}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Shipping</h3>
          <div className="space-y-2">
            <input placeholder="Address" value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} className="w-full border rounded px-3 py-2" />
            <input placeholder="City" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} className="w-full border rounded px-3 py-2" />
            <input placeholder="Postal code" value={shipping.postalCode} onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })} className="w-full border rounded px-3 py-2" />
            <input placeholder="Country" value={shipping.country} onChange={(e) => setShipping({ ...shipping, country: e.target.value })} className="w-full border rounded px-3 py-2" />
          </div>
        </div>

        <aside className="p-4 border rounded">
          <div className="mb-4">
            <div className="text-lg">Order summary</div>
            <div className="text-2xl font-bold">${cart.totalPrice.toFixed(2)}</div>
          </div>
          <button onClick={placeOrder} disabled={loading} className="w-full py-2 bg-sky-600 text-white rounded">
            {loading ? 'Placing order...' : 'Place order (mock)'}
          </button>
        </aside>
      </div>
    </div>
  );
}
