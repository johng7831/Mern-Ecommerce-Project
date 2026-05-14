import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add product once per line item; change quantity on the cart page
  const addToCart = (product) => {
    setCartItems((prev) => {
      if (prev.some((item) => item._id === product._id)) {
        return prev;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const setItemQuantity = (productId, quantity) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item._id !== productId) return item;
        const max = typeof item.stock === "number" ? item.stock : 999;
        const next = Math.min(Math.max(1, quantity), Math.max(1, max));
        return { ...item, quantity: next };
      })
    );
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, setItemQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};