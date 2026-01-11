import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

// --- SETTING: ALWAYS FRESH ---
// I am telling the website: "Don't save old versions. Check the database every single time."
export const revalidate = 0;

export default async function CategoryPage(props) {
  
  // 1. READ THE URL
  // I look at the browser bar to see if the user clicked "men" or "women".
  const params = await props.params;
  const category = params.category; 

  // 2. ASK THE DATABASE
  // "Hey Supabase, give me products that match this category OR are Unisex."
  // "Sort them Oldest -> Newest." (Hoodie stays on the Left, Jacket on the Right).
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .or(`category.eq.${category},category.eq.Unisex`) 
    .order('created_at', { ascending: true });

  // 3. MY SMART LAYOUT SYNTAX (The "Brain" of the Grid)
  // This logic counts how many items I have and picks the perfect layout automatically.
  
  // Start with the default: Mobile gets 1 column, Desktop gets 3.
  let gridClass = "grid grid-cols-1 gap-8"; 

  if (products && products.length === 1) {
    // SCENARIO: I only have 1 product.
    // Result: Center it in the middle of the screen. Don't stretch it too wide.
    gridClass += " md:grid-cols-1 max-w-sm mx-auto";
  
  } else if (products && (products.length === 2 || products.length === 4)) {
    // SCENARIO: I have 2 or 4 products (Symmetrical).
    // Result: Use 2 columns (50/50 split). This fixes the "White Space" issue.
    gridClass += " md:grid-cols-2 max-w-5xl mx-auto";
  
  } else {
    // SCENARIO: I have 3, 5, or more products.
    // Result: Use the classic 3-column streetwear grid.
    gridClass += " md:grid-cols-3";
  }

  return (
    <main className="min-h-screen bg-white relative">
      
      {/* --- BACK BUTTON --- */}
      {/* In the top-left corner, floating above everything (z-10). */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition">
          ← Back
        </Link>
      </div>

      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        
        {/* --- THE TITLE --- */}
        {/* Displays "MEN" or "WOMEN" in big italic letters */}
        <h1 className="text-4xl font-black uppercase italic mb-12 tracking-tighter">
          {category}
        </h1>
        
        {/* --- THE PRODUCT GRID --- */}
        {(!products || products.length === 0) ? (
          
          /* If the list is empty, just say so. */
          <p className="text-gray-500">No products found in this collection.</p>
        ) : (
          
          /* If I have products, use the 'gridClass' I calculated above. */
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
    </main>
  );
} 