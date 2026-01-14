import Link from "next/link";
import { supabase } from "@/lib/supabase";
import NewsletterForm from "@/components/NewsletterForm"; // I am importing the tool I just built

// I force the page to never cache, so it always shows fresh product data.
export const revalidate = 0;

// --- FOOTER COMPONENT ---
// I have kept this component code exactly as is, but it is not rendered in the view below.
const Footer = () => {
  return (
    <footer className="bg-[#1c1c1c] text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* NEWSLETTER SECTION */}
        <div className="md:col-span-5">
          <h3 className="font-black uppercase italic text-2xl mb-4 tracking-tighter">Unlock 10% Off</h3>
          <p className="text-xs text-gray-400 mb-6 uppercase tracking-widest">Subscribe for early access.</p>
          <NewsletterForm />
        </div>

        {/* LINKS SECTION */}
        <div className="md:col-span-3 md:pl-8">
          <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-gray-300">Links</h4>
          <ul className="space-y-3 text-xs text-gray-400 font-medium uppercase tracking-wide">
            <li>FAQs</li><li>Shipping</li><li>Returns</li><li>Contact</li>
          </ul>
        </div>

        {/* SERVICE SECTION */}
        <div className="md:col-span-4">
          <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-gray-300">Service</h4>
          <div className="text-xs text-gray-400 space-y-2 mb-6 font-medium">
             <p>Service@AprilBorn.com</p>
             <p>Mon-Fri 9:30AM - 6PM</p>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-800 flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-wider">
        <p>© 2026 April Born.</p>
        <div className="flex space-x-2 opacity-50"><span>Visa</span> • <span>Mastercard</span> • <span>PayPal</span></div>
      </div>
    </footer>
  );
};

// --- MAIN HOMEPAGE ---
export default async function Home() {
  
  // 1. GET DATA
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true });

  // 2. DYNAMIC LAYOUT LOGIC
  let gridClass = "grid grid-cols-1 md:grid-cols-3 gap-8"; 

  if (products && (products.length === 2 || products.length === 4)) {
    gridClass = "grid grid-cols-1 md:grid-cols-2 gap-8";
  }

  // 3. SHOW THE PAGE
  // I have applied the footer background color (#1c1c1c) and white text here so the form looks correct.
  // Everything else (Hero, Products, Footer) is hidden.
  return ( 
    <main className="min-h-screen bg-[#1c1c1c] text-white flex flex-col items-center justify-center px-6">
      
      <div className="w-full max-w-2xl text-center">
        
        {/* I increased the text size slightly as requested, but kept the original font styles */}
        <h3 className="font-black uppercase italic text-4xl md:text-5xl mb-6 tracking-tighter">
          Unlock 10% Off
        </h3>
        
        <p className="text-sm md:text-base text-gray-400 mb-10 uppercase tracking-widest">
          Subscribe for early access.
        </p>
        
        {/* The component is placed here within the dark context it needs */}
        <div className="w-full">
            <NewsletterForm />
        </div>

      </div>

    </main>
  );
}