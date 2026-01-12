'use client'; // I am telling Next.js: "This code happens on the user's browser, not the server."
import { useState } from 'react';

export default function NewsletterForm() {
  // 1. SETTING UP MY MEMORY (STATE)
  // I need places to store what the user types before I send it.
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  
  // I need a way to track what is happening right now (Is it loading? Did it work?)
  const [status, setStatus] = useState('idle'); // Options: 'idle', 'loading', 'success', 'error'

  // 2. THE ACTION (WHAT HAPPENS WHEN THEY CLICK BUTTON)
  const handleSubmit = async (e) => {
    e.preventDefault(); // I stop the page from refreshing (the default browser behavior)
    setStatus('loading'); // I tell the button to show "Processing..."

    // 3. SENDING THE DATA
    // I am sending a message to my backend API (/api/newsletter) with the 3 pieces of info.
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ firstName, lastName, email }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json(); // I read the answer from the server

    // 4. CHECKING THE RESULT
    if (res.ok) {
      // If the server said "OK", I switch to success mode and clear the form.
      setStatus('success');
      setFirstName('');
      setLastName('');
      setEmail('');
    } else {
      // If the server complained (e.g., "Email already exists"), I show an error.
      setStatus('error');
      alert(data.message || "Something went wrong.");
    }
  };

  // 5. SUCCESS SCREEN
  // If the status is 'success', I hide the form and show this "Thank You" message instead.
  if (status === 'success') {
    return (
      <div className="p-4 bg-gray-900 border border-gray-800 text-center">
        <p className="text-white text-xs font-bold uppercase tracking-widest mb-2">Welcome to the family</p>
        <p className="text-gray-400 text-[10px] uppercase">Use code: <span className="text-white font-bold">APRIL10</span></p>
      </div>
    );
  }

  // 6. THE FORM LAYOUT
  // This is what the user sees normally.
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {/* FIRST NAME INPUT */}
        <input 
          type="text" 
          placeholder="First Name" 
          value={firstName} // I force the box to display what is in my memory
          onChange={(e) => setFirstName(e.target.value)} // When they type, I update my memory
          required
          className="w-full bg-black border border-gray-700 text-white text-xs p-3 uppercase outline-none focus:border-gray-500 transition"
        />
        {/* LAST NAME INPUT */}
        <input 
          type="text" 
          placeholder="Last Name" 
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="w-full bg-black border border-gray-700 text-white text-xs p-3 uppercase outline-none focus:border-gray-500 transition"
        />
      </div>
      
      {/* EMAIL INPUT */}
      <input 
        type="email" 
        placeholder="Email Address" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full bg-black border border-gray-700 text-white text-xs p-3 uppercase outline-none focus:border-gray-500 transition"
      />
      
      {/* SUBMIT BUTTON */}
      <button 
        type="submit" 
        disabled={status === 'loading'} // I disable the button while it's loading so they can't click twice
        className="w-full bg-white text-black font-bold uppercase text-xs py-3 tracking-widest hover:bg-gray-200 transition disabled:opacity-50"
      >
        {status === 'loading' ? 'Processing...' : 'Get Code'}
      </button>
    </form>
  );
} 