"use client"; 
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function AddButton({ product }) {
  const { addToCart } = useCart();
  const [btnText, setBtnText] = useState("Add to Cart");
  const [quantity, setQuantity] = useState(1); // Default is 1

  const handleClick = () => {
    // 1. Send Product AND Quantity to the brain
    addToCart(product, parseInt(quantity)); 
    
    // 2. Visual feedback
    setBtnText("Added!");
    setTimeout(() => setBtnText("Add to Cart"), 2000);
  };

  return (
    <div className="flex flex-col gap-4 w-full md:w-auto">
      
      {/* QUANTITY SELECTOR & BUTTON WRAPPER */}
      <div className="flex gap-4">
        
        {/* DROPDOWN (1-5) */}
        <select 
          value={quantity} 
          onChange={(e) => setQuantity(e.target.value)}
          className="bg-gray-100 border border-transparent focus:border-black outline-none px-4 py-4 font-bold"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>

        {/* MAIN BUTTON */}
        <button 
          onClick={handleClick}
          className="flex-1 bg-black text-white py-4 px-12 uppercase font-bold tracking-widest hover:bg-zinc-800 transition active:scale-95"
        >
          {btnText}
        </button>
      </div>

      {/* Helper text */}
      <p className="text-xs text-gray-500 uppercase tracking-wide">
        Selected Quantity: {quantity}
      </p>
    </div>
  );
}  