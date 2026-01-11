import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/header"; 
import CartModal from "@/components/CartModal"; // <--- 1. IMPORT THE MODAL

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "APRIL BORN",
  description: "Luxury Streetwear",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* The Provider wraps everything so the 'Brain' works everywhere */}
        <CartProvider>
          
          {/* The Header (Top Bar) */}
          <Header />
          
          {/* 2. PLACE THE MODAL HERE */}
          {/* It is invisible until you click 'Cart' */}
          <CartModal /> 
          
          {/* The Page Content (Hero, Products, etc.) */}
          {children}
          
        </CartProvider>
      </body>
    </html>
  );
} 