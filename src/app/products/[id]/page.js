import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AddToCart from "@/components/AddToCart";

// Force refresh so data is always new
export const revalidate = 0;

export default async function ProductPage(props) {
  const params = await props.params;
  const { id } = params;

  // 1. Fetch the specific product
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white relative">
      
      {/* --- CLEAN BACK BUTTON --- */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition">
          ← Back
        </Link>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 p-6 md:py-20 pt-24">
        
        {/* LEFT: Image */}
        <div className="bg-gray-100 aspect-[4/5] relative">
           <img 
             src={product.image_url} 
             alt={product.name} 
             className="w-full h-full object-cover"
           />
        </div>

        {/* RIGHT: Details */}
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-2">
              {product.name}
            </h1>
            <p className="text-xl font-bold text-gray-900">£{product.price}</p>
          </div>

          <div className="space-y-4 border-t border-b border-gray-100 py-8">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Description</p>
            <p className="text-sm text-gray-700 leading-relaxed uppercase">
              {product.description || "No description available."}
            </p>
          </div>

          <AddToCart product={product} />
          
          <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center">
            Free shipping on all orders over £120
          </p>
        </div>
      </div>
    </div>
  );
} 