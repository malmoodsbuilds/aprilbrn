"use client";
import { useCart } from "@/context/CartContext";
import Link from "next/link"; // Tool for clicking links


export default function CartModal() {
  // Get all the tools built in the Context
  const { cart, isCartOpen, closeCart, increaseQty, decreaseQty, removeFromCart } = useCart();

  // If the "Brain" says closed, it'll show nothing
  if (!isCartOpen) return null;

  // Calculate the total price automatically
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    // 1. THE LAYOUT CONTAINER (Fixed to screen)
    <div className="fixed inset-0 z-[100] flex justify-end">
      
      {/* Dark Background (Clicking it closes the cart) */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={closeCart}
      ></div>

      {/* 2. THE SLIDE-OUT PANEL (White, Right side) */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-8 flex flex-col">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h2 className="text-xl font-black uppercase tracking-tighter">Your Cart</h2>
          <button onClick={closeCart} className="text-xl font-bold hover:text-gray-500">✕</button>
        </div>

        {/* 3. THE ITEM LIST */}
        <div className="flex-1 overflow-y-auto space-y-8">
          {cart.length === 0 ? (
            <p className="text-gray-500 uppercase tracking-widest text-xs">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-6">
                
                {/* A. PRODUCT IMAGE */}
                <div className="w-24 h-32 bg-gray-100 flex-shrink-0 border border-gray-200">
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* B. DETAILS & CONTROLS */}
                <div className="flex-1 flex flex-col justify-between py-1">
                   
                   {/* Name & Price */}
                   <div>
                     <h3 className="text-sm font-black uppercase tracking-wide leading-tight mb-1">{item.name}</h3>
                     <p className="text-sm text-gray-500 font-medium">£{item.price}</p>
                   </div>

                   {/* CONTROLS ROW */}
                   <div className="flex items-center justify-between mt-2">
                     
                     {/* Plus / Minus Box */}
                     <div className="flex items-center border border-black px-2 py-1 gap-4">
                        <button 
                          onClick={() => decreaseQty(item.id)}
                          className="text-sm font-bold hover:text-gray-500 px-1"
                        >-</button>
                        
                        <span className="text-xs font-bold">{item.quantity}</span>
                        
                        <button 
                          onClick={() => increaseQty(item.id)}
                          className="text-sm font-bold hover:text-gray-500 px-1"
                        >+</button>
                     </div>

                     {/* Trash Bin Icon (SVG) */}
                     <button 
                       onClick={() => removeFromCart(item.id)} 
                       className="text-gray-400 hover:text-red-600 transition"
                       title="Remove Item"
                     >
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                         <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                       </svg>
                     </button>

                   </div>
                </div>
              </div>
            ))
          )}
        </div>


          {/* Footer (Total & Checkout) */}
        <div className="border-t pt-6 mt-6">
          <div className="flex justify-between text-lg font-black uppercase mb-6 tracking-tight">
            <span>Total</span>
            <span>£{total}</span>
          </div>

          {/* I am wrapping the button in a Link so it goes to /checkout */}
          {/* onClick={closeCart} ensures the slide-out menu closes when you leave */}
          <Link href="/checkout" onClick={closeCart}>
            <button className="w-full bg-black text-white py-4 uppercase font-bold tracking-widest hover:bg-zinc-800 transition">
              Checkout
            </button>
          </Link>
          
        </div>
        </div>

      </div>
    
  );
}