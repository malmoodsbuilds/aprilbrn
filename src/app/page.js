import Link from "next/link";
import { supabase } from "@/lib/supabase";

// --- IMPORTANT SETTING ---
// Forces the page to refresh data every time you visit.
export const revalidate = 0;

// --- FOOTER COMPONENT ---
const Footer = () => {
  return (
    <footer className="bg-[#1c1c1c] text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <h3 className="font-black uppercase italic text-2xl mb-4 tracking-tighter">Unlock 10% Off</h3>
          <p className="text-xs text-gray-400 mb-6 uppercase tracking-widest">Subscribe for early access.</p>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
               <input type="text" placeholder="First Name" className="bg-black border border-gray-700 text-white text-xs p-3 uppercase outline-none"/>
               <input type="text" placeholder="Last Name" className="bg-black border border-gray-700 text-white text-xs p-3 uppercase outline-none"/>
            </div>
            <input type="email" placeholder="Email Address" className="w-full bg-black border border-gray-700 text-white text-xs p-3 uppercase outline-none"/>
            <button className="w-full bg-white text-black font-bold uppercase text-xs py-3 tracking-widest hover:bg-gray-200 transition">Get Code</button>
          </div>
        </div>
        <div className="md:col-span-3 md:pl-8">
          <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-gray-300">Links</h4>
          <ul className="space-y-3 text-xs text-gray-400 font-medium uppercase tracking-wide">
            <li>FAQs</li><li>Shipping</li><li>Returns</li><li>Contact</li>
          </ul>
        </div>
        <div className="md:col-span-4">
          <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-gray-300">Service</h4>
          <div className="text-xs text-gray-400 space-y-2 mb-6 font-medium">
             <p>Service@AprilBorn.com</p>
             <p>Mon-Fri 9:30AM - 6PM</p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-800 flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-wider">
        <p>© 2026 April Born.</p>
        <div className="flex space-x-2 opacity-50"><span>Visa</span> • <span>Mastercard</span> • <span>PayPal</span></div>
      </div>
    </footer>
  );
};

// --- MAIN HOMEPAGE ---
export default async function Home() {
  
  // 1. GET DATA (SORTING CHANGE)
  // I changed 'ascending' to TRUE.
  // This puts the Oldest item (Hoodie) first -> LEFT.
  // This puts the Newest item (Shirt) second -> RIGHT.
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true });


  // 2. DYNAMIC LAYOUT LOGIC (SIZE CHANGE)
  // This variable decides how many columns to show.
  
  // Start with the default: 3 Columns (for when you have lots of products)
  let gridClass = "grid grid-cols-1 md:grid-cols-3 gap-8"; 

  // CHECK: Do we have exactly 2 products?
  if (products && products.length === 2) {
    // If YES, switch to 2 Columns so they are equally spread out (50/50 split)
    gridClass = "grid grid-cols-1 md:grid-cols-2 gap-8";
  }
  
  // CHECK: Do we have exactly 4 products?
  if (products && products.length === 4) {
    // If YES, keep them 2x2 symmetrical
    gridClass = "grid grid-cols-1 md:grid-cols-2 gap-8";
  }

  // 3. SHOW THE PAGE
  return ( 
    <main className="min-h-screen bg-white">
      
      {/* HERO SECTION */}
      <div className="relative w-full h-[85vh] bg-gray-900">
        <img src="/hero.jpeg" alt="Campaign" className="w-full h-full object-cover" />
        <div className="absolute bottom-12 left-6 md:left-12 text-white">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic mb-4 drop-shadow-md">
            April Brn <br /> Pre-Spring '26
          </h2>
          <button className="bg-white text-black px-8 py-3 uppercase text-xs font-bold tracking-widest hover:bg-gray-200 transition">
            Shop Now
          </button>
        </div>
      </div>

      {/* LATEST DROP SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-black uppercase mb-10 tracking-tighter">Latest Drop</h2>
        
        {(!products || products.length === 0) ? (
          <p className="text-center text-gray-500">No products dropping soon.</p>
        ) : (
          
          /* USE THE DYNAMIC GRID CLASS HERE */
          <div className={gridClass}>
            
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="group block">
                
                {/* Product Image */}
                <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden mb-4 border border-gray-100">
                   <img 
                     src={product.image_url} 
                     alt={product.name} 
                     className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                   />
                </div>
                
                {/* Name & Price */}
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold uppercase tracking-wide">{product.name}</h3>
                  <p className="text-sm font-medium text-gray-500">£{product.price}</p>
                </div>

              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
} 