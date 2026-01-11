"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function AddToCart({ product }) {
  const { addToCart, openCart } = useCart();
  const [buttonText, setButtonText] = useState("Add to Cart");

  const handleAdd = () => {
    addToCart(product);
    setButtonText("Added!");
    openCart(); // Opens the cart drawer so they can see it
    
    // Reset button text after 2 seconds
    setTimeout(() => {
      setButtonText("Add to Cart");
    }, 2000);
  };

  return (
    <button
      onClick={handleAdd}
      className="w-full bg-black text-white font-bold uppercase text-xs py-4 tracking-widest hover:bg-gray-800 transition"
    >
      {buttonText}
    </button>
  );
}