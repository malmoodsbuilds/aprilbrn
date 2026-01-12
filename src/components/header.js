"use client"; 
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState } from "react"; // Added for mobile menu toggle

export default function Header() {
  const { cart, openCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const totalItems = cart ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <>
      {/* 1. FREE SHIPPING BAR */}
      <div className="bg-gray-100 text-black text-[10px] font-bold text-center py-2 uppercase tracking-widest border-b border-gray-200">
        Free Shipping on Orders Over £120
      </div>

      {/* 2. THE MAIN HEADER */}
      <header className="sticky top-0 z-50 bg-black border-b border-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex justify-between items-center relative">
          
          {/* LEFT: Nav (Desktop) + Hamburger (Mobile) */}
          <div className="flex-1 flex justify-start">
            {/* Desktop Links */}
            <nav className="hidden md:flex space-x-6 text-xs font-bold uppercase tracking-widest">
              <Link href="/new" className="hover:text-gray-400 text-white transition-colors">New</Link>
              <Link href="/shop/men" className="hover:text-gray-400 text-white transition-colors">Men</Link>
              <Link href="/shop/women" className="hover:text-gray-400 text-white transition-colors">Women</Link>
            </nav>

            {/* Mobile Hamburger Button (Visible only on mobile) */}
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {/* Simple Hamburger Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>

          {/* CENTER: LOGO */}
          {/* I removed absolute positioning for mobile to prevent overlap issues, 
              but kept it absolute for desktop to ensure perfect centering. */}
          <div className="flex-shrink-0 absolute left-1/2 transform -translate-x-1/2">
             <Link href="/">
               <img 
                 src="/APPPB.svg" 
                 alt="April Born" 
                 // FIXED: h-8 (32px) for mobile, h-12 (48px) for desktop. 
                 // Fits inside the h-16 (64px) container.
                 className="h-14 md:h-20 w-auto object-contain" 
               />
             </Link>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex-1 flex justify-end items-center space-x-4 md:space-x-6 text-xs font-bold uppercase tracking-widest">
            {/* Search Icon (Hidden text on super small screens, visible icon) */}
            <span className="cursor-pointer hover:text-gray-400 text-white transition-colors">
              <span className="hidden md:inline">Search</span>
              <span className="md:hidden">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                 </svg>
              </span>
            </span>

            <button onClick={openCart} className="cursor-pointer hover:text-gray-400 text-white transition-colors font-bold uppercase flex items-center gap-1">
              <span>Cart</span>
              <span>({totalItems})</span>
            </button>
          </div>
        </div>

        {/* 3. MOBILE MENU DROPDOWN (Optional: If you want links to appear when hamburger is clicked) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black border-t border-gray-800 absolute w-full left-0 px-6 py-4 flex flex-col space-y-4 text-xs font-bold uppercase tracking-widest">
            <Link href="/new" className="text-white hover:text-gray-400" onClick={() => setIsMobileMenuOpen(false)}>New</Link>
            <Link href="/shop/men" className="text-white hover:text-gray-400" onClick={() => setIsMobileMenuOpen(false)}>Men</Link>
            <Link href="/shop/women" className="text-white hover:text-gray-400" onClick={() => setIsMobileMenuOpen(false)}>Women</Link>
          </div>
        )}
      </header>
    </>
  );
} 