"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], style: 'italic' });

export default function AdminLogin() {
  const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
      const [error, setError] = useState("");
        const router = useRouter();
        
          // --- SECURITY SETTINGS ---
            const MY_EMAIL = "malakaimoodie@gmail.com"; // <--- CHANGE THIS TO YOUR REAL EMAIL
              const MY_PASSWORD = "APRIL2026";         // <--- CHANGE THIS TO YOUR DESIRED PASSWORD
              
                const handleLogin = (e) => {
                    e.preventDefault(); 
                        
                            // CHECK BOTH EMAIL AND PASSWORD
                                if (email.toLowerCase() === MY_EMAIL.toLowerCase() && password === MY_PASSWORD) {
                                      // Success! Save token and enter
                                            document.cookie = "adminToken=true; path=/";
                                                  router.push("/admin/dashboard");
                                                      } else {
                                                            setError("INVALID EMAIL OR PASSWORD");
                                                                }
                                                                  };
                                                                  
                                                                    return (
                                                                        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
                                                                              
                                                                                    <h1 className={`${playfair.className} text-4xl mb-12`}>April Born</h1>
                                                                                    
                                                                                          <div className="w-full max-w-sm text-center">
                                                                                                  <h2 className="text-xl font-bold uppercase tracking-widest mb-8">Admin Access</h2>
                                                                                                  
                                                                                                          <form onSubmit={handleLogin} className="flex flex-col gap-4">
                                                                                                                    
                                                                                                                              {/* 1. EMAIL INPUT */}
                                                                                                                                        <input 
                                                                                                                                                    type="email" 
                                                                                                                                                                placeholder="ENTER EMAIL" 
                                                                                                                                                                            value={email}
                                                                                                                                                                                        onChange={(e) => setEmail(e.target.value)}
                                                                                                                                                                                                    className="bg-transparent border border-gray-700 text-white text-center p-4 uppercase tracking-widest focus:border-white outline-none transition"
                                                                                                                                                                                                              />
                                                                                                                                                                                                              
                                                                                                                                                                                                                        {/* 2. PASSWORD INPUT */}
                                                                                                                                                                                                                                  <input 
                                                                                                                                                                                                                                              type="password" 
                                                                                                                                                                                                                                                          placeholder="ENTER PASSWORD" 
                                                                                                                                                                                                                                                                      value={password}
                                                                                                                                                                                                                                                                                  onChange={(e) => setPassword(e.target.value)}
                                                                                                                                                                                                                                                                                              className="bg-transparent border border-gray-700 text-white text-center p-4 uppercase tracking-widest focus:border-white outline-none transition"
                                                                                                                                                                                                                                                                                                        />
                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                  {/* Error Message */}
                                                                                                                                                                                                                                                                                                                            {error && <p className="text-red-500 text-xs font-bold uppercase tracking-widest">{error}</p>}
                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                      <button 
                                                                                                                                                                                                                                                                                                                                                  type="submit"
                                                                                                                                                                                                                                                                                                                                                              className="bg-white text-black font-bold uppercase tracking-widest py-4 hover:bg-gray-200 transition"
                                                                                                                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                                                                                                    Enter
                                                                                                                                                                                                                                                                                                                                                                                              </button>
                                                                                                                                                                                                                                                                                                                                                                                                      </form>
                                                                                                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                                                                                                              <a href="/" className="block mt-8 text-xs text-gray-500 hover:text-white uppercase tracking-widest">
                                                                                                                                                                                                                                                                                                                                                                                                                        ← Return to Store
                                                                                                                                                                                                                                                                                                                                                                                                                                </a>
                                                                                                                                                                                                                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                            );
                                                                                                                                                                                                                                                                                                                                                                                                                                            } 