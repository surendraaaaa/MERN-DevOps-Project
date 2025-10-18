import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem('cart');
      if (!raw) return { items: [], totalItems: 0, totalPrice: 0 };
      return JSON.parse(raw);
    } catch {
      return { items: [], totalItems: 0, totalPrice: 0 };
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  function recalc(items) {
    const totalItems = items.reduce((s, i) => s + i.qty, 0);
    const totalPrice = items.reduce((s, i) => s + i.qty * i.price, 0);
    return { items, totalItems, totalPrice };
  }

  function add(item, qty = 1) {
    setCart((prev) => {
      const found = prev.items.find((i) => i.product === item._id || i.product === item.id);
      let items;
      if (found) {
        items = prev.items.map((i) =>
          i.product === (item._id ?? item.id) ? { ...i, qty: i.qty + qty } : i
        );
      } else {
        items = [...prev.items, { product: item._id ?? item.id, title: item.title, price: item.price, image: item.images?.[0] ?? '', qty }];
      }
      return recalc(items);
    });
  }

  function remove(productId) {
    setCart((prev) => recalc(prev.items.filter((i) => i.product !== productId)));
  }

  function updateQty(productId, qty) {
    setCart((prev) =>
      recalc(prev.items.map((i) => (i.product === productId ? { ...i, qty: Number(qty) } : i)))
    );
  }

  function clear() {
    setCart({ items: [], totalItems: 0, totalPrice: 0 });
  }

  return (
    <CartContext.Provider value={{ cart, add, remove, updateQty, clear }}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
