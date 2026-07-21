import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. Lazy initialize state from localStorage so it survives page reloads
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("shopping_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      return [];
    }
  });

  // 2. Automatically sync to localStorage whenever cartItems updates
  useEffect(() => {
    try {
      localStorage.setItem("shopping_cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cartItems]);

  // Add product to cart (or update quantity if variant already exists)
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Determine unique ID based on cartItemId or fallback combinations
      const targetId =
        product.cartItemId ||
        `${product._id}-${product.selectedSize || ""}-${product.selectedColor || ""}`;

      const existingIndex = prevItems.findIndex((item) => {
        const itemId =
          item.cartItemId ||
          `${item._id}-${item.selectedSize || ""}-${item.selectedColor || ""}`;
        return itemId === targetId;
      });

      if (existingIndex > -1) {
        const updatedItems = [...prevItems];
        const currentQty = updatedItems[existingIndex].quantity || 1;
        const addQty = product.quantity || 1;
        
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: currentQty + addQty,
        };
        return updatedItems;
      }

      return [...prevItems, { ...product, cartItemId: targetId, quantity: product.quantity || 1 }];
    });
  };

  // Update item quantity directly
  const setItemQuantity = (identifier, quantity) => {
    if (quantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        const key = item.cartItemId || item._id;
        if (key === identifier) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  // Remove item from cart
  const removeFromCart = (identifier) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => (item.cartItemId || item._id) !== identifier)
    );
  };

  // Clear entire cart (useful for post-checkout)
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        setItemQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};