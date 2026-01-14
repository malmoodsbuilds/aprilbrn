'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase'; // Ensure this path matches your project structure

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
      // 1. DIRECT INSERT TO SUPABASE
      // We insert directly into a table named 'newsletter' or 'subscribers'
      // MAKE SURE you have a table named 'newsletter' in Supabase with these columns.
      const { data, error } = await supabase
        .from('newsletter') // Change this to 'subscribers' if that's your table name
        .insert([
          { first_name: firstName, last_name: lastName, email: email }
        ]);

      if (error) throw error;

      // 2. SUCCESS
      setStatus('success');
      setFirstName('');
      setLastName('');
      setEmail('');

    } catch (error) {
      console.error('Submission Error:', error);
      setStatus('error');
      // Show the actual error message so we know what's wrong
      setErrorMessage(error.message || "Connection failed. Please try again.");
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