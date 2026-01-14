'use client';
import { useState } from 'react';

export default function NewsletterForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // --- DEBUG LOG START ---
    console.log("DEBUG: Submit initiated.");
    console.log("DEBUG: Form Data:", { firstName, lastName, email });
    // -----------------------

    try {
      console.log("DEBUG: Sending request to /api/newsletter...");
      
      // We use fetch to hit your route.js file
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // We send the data using snake_case keys to match your DB expectations
        body: JSON.stringify({ 
          first_name: firstName, 
          last_name: lastName, 
          email: email 
        }),
      });

      console.log("DEBUG: Response status:", res.status);
      
      const data = await res.json();
      console.log("DEBUG: Response data:", data);

      if (!res.ok) {
        // Handle explicit errors returned from route.js
        console.error("DEBUG: Server error detected.");
        throw new Error(data.error || "Server error");
      }

      // SUCCESS
      console.log("DEBUG: Success path triggered.");
      setStatus('success');
      setFirstName('');
      setLastName('');
      setEmail('');
      alert("Debug: Signup Successful! Check Supabase and your Email.");

    } catch (error) {
      console.error('DEBUG: Submission Error:', error);
      setStatus('error');
      
      // specific check for the duplicate key error to make it visible
      if (error.message && error.message.includes("duplicate key")) {
         alert("Debug Error: This email is already subscribed.");
         setErrorMessage("You are already subscribed.");
      } else {
         alert(`Debug Error: ${error.message}`);
         setErrorMessage(error.message || "Connection failed. Please try again.");
      }
    }
  };

  // SUCCESS STATE
  if (status === 'success') {
    return (
      <div className="p-4 bg-gray-900 border border-gray-800 text-center animate-fade-in">
        <p className="text-white text-xs font-bold uppercase tracking-widest mb-2">Welcome to the family</p>
        <p className="text-gray-400 text-[10px] uppercase">Use code: <span className="text-white font-bold">APRIL10</span></p>
      </div>
    );
  }

  // FORM STATE
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {status === 'error' && (
        <div className="text-red-500 text-[10px] uppercase tracking-wide text-center font-bold">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <input 
          type="text" 
          placeholder="First Name" 
          value={firstName} 
          onChange={(e) => setFirstName(e.target.value)} 
          required
          className="w-full bg-black border border-gray-700 text-white text-xs p-3 uppercase outline-none focus:border-gray-500 transition placeholder-gray-600"
        />
        <input 
          type="text" 
          placeholder="Last Name" 
          value={lastName} 
          onChange={(e) => setLastName(e.target.value)} 
          required
          className="w-full bg-black border border-gray-700 text-white text-xs p-3 uppercase outline-none focus:border-gray-500 transition placeholder-gray-600"
        />
      </div>
      
      <input 
        type="email" 
        placeholder="Email Address" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full bg-black border border-gray-700 text-white text-xs p-3 uppercase outline-none focus:border-gray-500 transition placeholder-gray-600"
      />
      
      <button 
        type="submit" 
        disabled={status === 'loading'} 
        className="w-full bg-white text-black font-bold uppercase text-xs py-3 tracking-widest hover:bg-gray-200 transition disabled:opacity-50"
      >
        {status === 'loading' ? 'Processing...' : 'Get Code'}
      </button>
    </form>
  );
} 