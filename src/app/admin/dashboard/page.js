"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  // --- MY VARIABLES (STATE) ---
  // This holds the list of products I downloaded from the database
  const [products, setProducts] = useState([]);
  
  // This holds the file I just selected from my computer
  const [imageFile, setImageFile] = useState(null);
  
  // This holds the text I typed for Name and Price
  const [newItem, setNewItem] = useState({ name: "", price: "" });
  
  // These control the "Loading..." text and the button disabling
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // This tool lets me send the user to a different page
  const router = useRouter();

  // --- 1. SECURITY CHECK ---
  // This runs immediately when the page loads.
  // It checks if I have the "adminToken" cookie. If not, it kicks me back to login.
  useEffect(() => {
    const isIdsAdmin = document.cookie.includes("adminToken=true");
    if (!isIdsAdmin) {
      router.push("/admin/login");
    } else {
      fetchProducts(); // If I am admin, go get the products!
    }
  }, []);

  // --- 2. GET PRODUCTS ---
  // This asks Supabase for the list of products, newest first.
  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('id', { ascending: false });
    setProducts(data || []); // Save the data to my list
    setLoading(false); // Stop showing "Loading..."
  }

  // --- 3. UPLOAD AND SAVE (The Big Function) ---
  // This runs when I click "Save Product"
  async function handleAdd(e) {
    e.preventDefault(); // Stop the page from refreshing
    
    // Check if I forgot to type something
    if (!newItem.name || !newItem.price || !imageFile) return alert("Please fill all fields and pick an image!");

    setUploading(true); // Disable the button so I can't click it twice

    try {
      // STEP A: Upload the image file to the "products" bucket
      // I create a unique name using the time (Date.now) so files don't clash
      const fileName = `${Date.now()}-${imageFile.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('products') // IMPORTANT: This must match the bucket name I made in Supabase
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError; // If upload fails, stop here

      // STEP B: Get the public web link for that image
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);

      // STEP C: Save the product info + the new image link to the Database
      const { error: dbError } = await supabase.from('products').insert([
        { 
          name: newItem.name, 
          price: parseFloat(newItem.price), 
          image_url: publicUrl, // Using the link I just got
          description: "Luxury Streetwear item." 
        }
      ]);

      if (dbError) throw dbError; // If database fails, stop here

      // STEP D: Success! Reset everything.
      setNewItem({ name: "", price: "" });
      setImageFile(null); // Clear the file picker
      fetchProducts(); // Refresh the list so I see the new item immediately
      alert("Product Created Successfully!");

    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setUploading(false); // Re-enable the button
    }
  }

  // --- 4. DELETE PRODUCT ---
  async function handleDelete(id) {
    if (!confirm("Are you sure?")) return; // Ask me for confirmation
    
    // Delete from Supabase
    const { error } = await supabase.from('products').delete().eq('id', id);
    
    if (error) alert(error.message);
    else fetchProducts(); // Refresh the list to remove it from the screen
  }

  // If the page is still loading, just show this text
  if (loading) return <div className="min-h-screen bg-black text-white p-10 flex items-center justify-center">LOADING...</div>;

  // --- THE HTML PART (What I see) ---
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      
      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-10 border-b border-zinc-800 pb-6">
        <h1 className="text-2xl font-black uppercase tracking-widest">Admin Dashboard</h1>
        {/* LOGOUT BUTTON: Deletes the cookie and sends me home */}
        <button 
          onClick={() => { document.cookie = "adminToken=; max-age=0"; router.push("/"); }}
          className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-400 border border-red-900 px-4 py-2"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* LEFT COLUMN: The "Add Product" Form */}
        <div>
          <div className="bg-zinc-900 p-8 border border-zinc-800">
            <h2 className="text-lg font-bold uppercase tracking-widest mb-6">Add Product</h2>
            
            <form onSubmit={handleAdd} className="flex flex-col gap-6">
              
              {/* Product Name Input */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">Product Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Vintage Biker Jacket" 
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="w-full bg-black border border-zinc-700 p-4 text-white text-xs font-bold uppercase focus:border-white outline-none transition"
                />
              </div>

              {/* Price Input */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">Price (£)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 150.00" 
                  value={newItem.price}
                  onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                  className="w-full bg-black border border-zinc-700 p-4 text-white text-xs font-bold uppercase focus:border-white outline-none transition"
                />
              </div>

              {/* IMAGE PICKER (The Box I click) */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">Media</label>
                
                <div className="border-2 border-dashed border-zinc-700 bg-black p-8 text-center hover:border-white transition cursor-pointer relative">
                  {/* The invisible file input that handles the actual selection */}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {/* The text I see inside the box */}
                  <div className="pointer-events-none">
                    {imageFile ? (
                      <p className="text-green-500 font-bold uppercase text-xs">Selected: {imageFile.name}</p>
                    ) : (
                      <>
                        <p className="text-white font-bold uppercase text-xs mb-1">+ Upload Image</p>
                        <p className="text-gray-600 text-[10px] uppercase">Click or Drag file here</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Save Button (Changes text while uploading) */}
              <button 
                disabled={uploading}
                className={`text-black font-bold uppercase tracking-widest py-4 mt-2 transition ${uploading ? "bg-gray-500" : "bg-white hover:bg-gray-200"}`}
              >
                {uploading ? "Uploading..." : "Save Product"}
              </button>

            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: The List of Current Products */}
        <div>
          <h2 className="text-lg font-bold uppercase tracking-widest mb-6">Inventory ({products.length})</h2>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {products.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-zinc-900 p-3 border border-zinc-800">
                
                {/* Tiny Image Preview */}
                <div className="w-12 h-12 bg-black flex-shrink-0">
                  <img src={item.image_url} className="w-full h-full object-cover" alt="img" />
                </div>
                
                {/* Product Name & Price */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold uppercase truncate">{item.name}</h3>
                  <p className="text-[10px] text-gray-500">£{item.price}</p>
                </div>

                {/* Delete Button */}
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-white text-[10px] font-bold uppercase border border-zinc-800 hover:bg-red-600 px-3 py-2 transition"
                >
                  Delete
                </button>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
} 