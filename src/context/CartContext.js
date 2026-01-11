"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // 1. The Cart State (The list of items)
  const [cart, setCart] = useState([]);
  
  // 2. The Menu State (Is the slide-out open or closed?)
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from computer memory (LocalStorage) on startup
  useEffect(() => {
    const savedCart = localStorage.getItem("aprilBornCart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save cart to computer memory whenever it changes
  useEffect(() => {
    localStorage.setItem("aprilBornCart", JSON.stringify(cart));
  }, [cart]);

  // --- ACTIONS ---

  // Add Item (Used on Product Page)
  const addToCart = (product) => {
    setCart((prev) => {
      // Check if item already exists
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        // If yes, just add 1 to quantity
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // If no, add it as a new item
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true); // Open the preview automatically
  };

  // NEW: Increase Quantity (+)
  const increaseQty = (id) => {
    setCart((prev) => prev.map((item) => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  // NEW: Decrease Quantity (-)
  const decreaseQty = (id) => {
    setCart((prev) => prev.map((item) => 
      // Don't go below 1 (Use the trash bin for that)
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  // Remove Item (Trash Bin)
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      isCartOpen, 
      addToCart, 
      increaseQty, // Exporting the new tools
      decreaseQty, 
      removeFromCart,
      openCart: () => setIsCartOpen(true), 
      closeCart: () => setIsCartOpen(false) 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
} 