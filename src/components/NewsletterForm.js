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

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          first_name: firstName, 
          last_name: lastName, 
          email: email 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Server error");
      }

      // SUCCESS - No alert box, just state change
      setStatus('success');
      setFirstName('');
      setLastName('');
      setEmail('');

    } catch (error) {
      console.error('Submission Error:', error);
      setStatus('error');
      
      // Handle duplicate emails gracefully without popups
      if (error.message && error.message.includes("duplicate key")) {
         setErrorMessage("You are already subscribed.");
      } else {
         setErrorMessage(error.message || "Connection failed. Please try again.");
      }
    }
  };

  // SUCCESS STATE - This shows "Welcome to the family" instead of the form
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