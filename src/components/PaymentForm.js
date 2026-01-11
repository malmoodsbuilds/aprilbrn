"use client";

import { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

export default function PaymentForm({ amount }) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Change this to wherever you want them to go AFTER paying
        return_url: `${window.location.origin}/success`, 
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 border border-gray-200 rounded-md">
        {/* This is the magic part that creates the Credit Card fields */}
        <PaymentElement />
      </div>

      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full bg-black text-white font-bold uppercase text-sm py-4 tracking-widest hover:bg-gray-800 transition disabled:opacity-50"
      >
        {isLoading ? "Processing..." : `Pay £${(amount / 100).toFixed(2)}`}
      </button>
      
      {/* Error Message Display */}
      {message && <div className="text-red-500 text-xs mt-2">{message}</div>}
    </form>
  );
} 