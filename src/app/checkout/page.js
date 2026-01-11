"use client"; 

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "@/components/PaymentForm"; // The file you created earlier

// Load Stripe outside of the component render to avoid recreating it
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
  const { cart } = useCart();
  const [clientSecret, setClientSecret] = useState("");

  // Calculate the total price based on the cart
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Create Payment Intent when the page loads (if cart is not empty)
  useEffect(() => {
    if (cart.length > 0) {
      // Calculate amount in pence for Stripe (e.g. £10.00 = 1000)
      const amountInPence = Math.round(total * 100);

      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInPence }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }
  }, [cart, total]);

  // Stripe Appearance Settings (to match your site)
  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#000000',
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontSizeBase: '14px',
    },
  };
  
  const options = {
    clientSecret,
    appearance,
  };

  // --- EMPTY CART CHECK ---
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
        <h1 className="text-2xl font-black uppercase mb-4">Your Cart is Empty</h1>
        <Link href="/" className="border-b-2 border-black font-bold uppercase tracking-widest">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black lg:grid lg:grid-cols-2">
      
      {/* LEFT COLUMN: The Information Form */}
      <div className="p-8 lg:p-20 lg:border-r border-gray-200">
        <div className="max-w-lg mx-auto">
          
          <Link href="/" className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8 block">
            ← Back to Cart
          </Link>

          <h1 className="text-3xl font-black uppercase tracking-tighter mb-8">Checkout</h1>

          {/* We keep the form structure, but the Payment part is now special */}
          <div className="space-y-6">
            
            {/* Contact Section */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Contact</h3>
              <input type="email" placeholder="Email Address" required className="w-full bg-gray-50 border border-gray-300 p-4 text-xs font-bold uppercase outline-none focus:border-black transition" />
            </div>

            {/* Shipping Section */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4 mt-8">Shipping Address</h3>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" required className="bg-gray-50 border border-gray-300 p-4 text-xs font-bold uppercase outline-none focus:border-black transition" />
                <input type="text" placeholder="Last Name" required className="bg-gray-50 border border-gray-300 p-4 text-xs font-bold uppercase outline-none focus:border-black transition" />
              </div>
              <input type="text" placeholder="Address" required className="w-full mt-4 bg-gray-50 border border-gray-300 p-4 text-xs font-bold uppercase outline-none focus:border-black transition" />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <input type="text" placeholder="City" required className="bg-gray-50 border border-gray-300 p-4 text-xs font-bold uppercase outline-none focus:border-black transition" />
                <input type="text" placeholder="Postcode" required className="bg-gray-50 border border-gray-300 p-4 text-xs font-bold uppercase outline-none focus:border-black transition" />
              </div>
            </div>

            {/* --- STRIPE PAYMENT SECTION --- */}
            <div className="mt-8">
               <h3 className="text-sm font-bold uppercase tracking-widest mb-4 mt-8">Payment</h3>
               
               {/* Show loading until Stripe is ready */}
               {!clientSecret && <p className="text-xs text-gray-400">Loading secure payment...</p>}

               {/* When ready, show the Credit Card Box */}
               {clientSecret && (
                 <Elements options={options} stripe={stripePromise}>
                   {/* We pass the total (in pence) to the form button */}
                   <PaymentForm amount={total * 100} />
                 </Elements>
               )}
            </div>

          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: The Order Summary (Same as before) */}
      <div className="bg-gray-50 p-8 lg:p-20 hidden lg:block sticky top-0 h-screen overflow-y-auto">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-8">Order Summary</h2>
          
          <div className="space-y-6 mb-8 border-b border-gray-200 pb-8">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-6">
                <div className="w-20 h-24 bg-white border border-gray-200 relative">
                   <img src={item.image_url} className="w-full h-full object-cover" />
                   <div className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                     {item.quantity}
                   </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold uppercase">{item.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">Size: M (Default)</p>
                </div>
                <p className="text-sm font-bold">£{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-sm font-medium text-gray-600">
             <div className="flex justify-between">
               <span>Subtotal</span>
               <span>£{total}</span>
             </div>
             <div className="flex justify-between">
               <span>Shipping</span>
               <span>Free</span>
             </div>
          </div>

          <div className="flex justify-between text-xl font-black uppercase mt-6 pt-6 border-t border-gray-200">
            <span>Total</span>
            <span>£{total}</span>
          </div>

        </div>
      </div>

    </main>
  );
} 