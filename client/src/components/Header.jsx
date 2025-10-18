import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-semibold text-sky-600">
          Shoply
        </Link>

        <nav className="flex items-center space-x-4">
          <Link to="/cart" className="relative">
            Cart
            {cart.totalItems > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                {cart.totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm">Hi, {user.name}</span>
              {user.isAdmin && (
                <button
                  onClick={() => navigate('/admin')}
                  className="text-sm px-2 py-1 border rounded"
                >
                  Admin
                </button>
              )}
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="text-sm px-2 py-1 border rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-sm px-2 py-1 border rounded">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
