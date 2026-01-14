import Link from "next/link";
import { supabase } from "@/lib/supabase";
import NewsletterForm from "@/components/NewsletterForm";

// I am forcing the page to never cache so my product data is always fresh
export const revalidate = 0;

// I am using this component to hold my newsletter and social info
const Footer = () => {
  return (
    <footer className="bg-[#1c1c1c] text-white w-full py-24">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* I am centering and enlarging my newsletter section here */}
        <div className="flex flex-col items-center text-center">
          <h3 className="font-black uppercase italic text-5xl mb-6 tracking-tighter">
            Unlock 10% Off
          </h3>
          <p className="text-sm text-gray-400 mb-10 uppercase tracking-widest">
            I want people to subscribe here for early access
          </p>
          
          {/* I am making this form container much larger for a professional look */}
          <div className="w-full max-w-2xl transform scale-125 my-10">
            <NewsletterForm />
          </div>
        </div>

        {/* I am hiding these links for my launch but keeping the code here */}
        {/* <div className="md:col-span-3 md:pl-8">
          <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-gray-300">Links</h4>
          <ul className="space-y-3 text-xs text-gray-400 font-medium uppercase tracking-wide">
            <li>FAQs</li><li>Shipping</li><li>Returns</li><li>Contact</li>
          </ul>
        </div>
        */}

        {/* I am hiding the service section until I am ready to go live */}
        {/* <div className="md:col-span-4">
          <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-gray-300">Service</h4>
          <div className="text-xs text-gray-400 space-y-2 mb-6 font-medium">
             <p>Service@AprilBorn.com</p>
             <p>Mon-Fri 9:30AM - 6PM</p>
          </div>
        </div>
        */}
      </div>

      {/* I am keeping my brand slogan and copyright at the very bottom */}
      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-gray-800 flex flex-col items-center text-[10px] text-gray-500 uppercase tracking-wider">
        <p className="mb-2">born twice live forever</p>
        <p>© 2026 April Born.</p>
        <div className="flex space-x-2 opacity-50 mt-4">
          <span>Visa</span> • <span>Mastercard</span> • <span>PayPal</span>
        </div>
      </div>
    </footer>
  );
};

// I am defining my main home page structure here
export default async function Home() {
  
  // I am grabbing my product data from Supabase
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true });

  // I am setting up my dynamic grid logic for when I show products later
  let gridClass = "grid grid-cols-1 md:grid-cols-3 gap-8"; 

  if (products && (products.length === 2 || products.length === 4)) {
    gridClass = "grid grid-cols-1 md:grid-cols-2 gap-8";
  }

  return ( 
    <main className="min-h-screen bg-white flex flex-col">
      
      {/* I am keeping this header visible so users see the April Born brand */}
      <nav className="p-8 flex justify-between items-center border-b border-gray-100 bg-white">
        <h1 className="font-black italic text-2xl uppercase tracking-tighter">April Born</h1>
        <div className="hidden md:flex space-x-8 text-[11px] font-bold uppercase tracking-widest">
          <span>Men</span>
          <span>Women</span>
          <span>Search</span>
          <span>Quote</span>
        </div>
      </nav>

      {/* I am hiding the hero and product sections below until my full launch */}
      {/* <div className="relative w-full h-[85vh] bg-gray-900">
        <img src="/hero.jpeg" alt="Campaign" className="w-full h-full object-cover" />
        <div className="absolute bottom-12 left-6 md:left-12 text-white">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic mb-4 drop-shadow-md">
            April Brn <br /> Pre Spring '26
          </h2>
          <button className="bg-white text-black px-8 py-3 uppercase text-xs font-bold tracking-widest hover:bg-gray-200 transition">
            Shop Now
          </button>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-black uppercase mb-10 tracking-tighter">Latest Drop</h2>
        {(!products || products.length === 0) ? (
          <p className="text-center text-gray-500">No products dropping soon.</p>
        ) : (
          <div className={gridClass}>
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="group block">
                <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden mb-4 border border-gray-100">
                   <img 
                     src={product.image_url} 
                     alt={product.name} 
                     className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                   />
                </div>
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold uppercase tracking-wide">{product.name}</h3>
                  <p className="text-sm font-medium text-gray-500">£{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section> 
      */}

      {/* I am making this the central point of my page so the newsletter is slap bang in the middle */}
      <div className="flex-grow flex items-center justify-center bg-[#1c1c1c]">
        <Footer />
      </div>

    </main>
  );
} 