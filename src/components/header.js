"use client"; 
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { cart, openCart } = useCart();
  const totalItems = cart ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <>
      {/* 1. FREE SHIPPING BAR (Moved here so it's global) */}
      <div className="bg-gray-100 text-black text-[10px] font-bold text-center py-2 uppercase tracking-widest border-b border-gray-200">
        Free Shipping on Orders Over £120
      </div>

      {/* 2. THE MAIN HEADER */}
      <header className="sticky top-0 z-50 bg-black border-b border-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          
          {/* LEFT: Nav */}
          <nav className="hidden md:flex space-x-6 text-xs font-bold uppercase tracking-widest">
            <Link href="/new" className="hover:text-gray-400">New</Link>
            <Link href="/shop/men" className="hover:text-gray-400">Men</Link>
            <Link href="/shop/women" className="hover:text-gray-400">Women</Link>
          </nav>

          {/* CENTER: YOUR SVG LOGO */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
             <Link href="/">
               <img 
                 src="/APPPB.svg" 
                 alt="April Born" 
                 className="h-20 md:h-40 w-auto" 
               />
             </Link>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center space-x-6 text-xs font-bold uppercase tracking-widest">
            <span className="cursor-pointer hover:text-gray-400">Search</span>
            <button onClick={openCart} className="cursor-pointer hover:text-gray-400 font-bold uppercase">
              Cart ({totalItems})
            </button>
          </div>
        </div>
      </header>
    </>
  );
} 