import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

// 1. TURNING ON THE TOOLS
// I am switching on the Stripe machine using the secret key I locked in my safe (.env.local)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 2. HIRING THE POSTMAN (Nodemailer)
// I am telling the system to use Gmail as my delivery service.
// I give the driver my email (ID) and the Special App Password (Permit) so they are allowed to send mail for me.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // My Gmail address from the safe
    pass: process.env.GMAIL_PASS, // My Special Google App Password from the safe
  },
});

// 3. OPENING THE SERVICE WINDOW
// This function IS the window. When Stripe "knocks" on my door (sends a POST request), this specific code wakes up.
export async function POST(req) {
  const body = await req.text(); // I grab the package they handed me
  const sig = req.headers.get('stripe-signature'); // I look for the "Wax Seal" stamped on the outside

  let event;

  // 4. THE SECURITY GUARD (Verification)
  // I am checking if the "Wax Seal" matches my Secret Handshake key. 
  // If it doesn't match, I scream "IMPOSTER!" and slam the door (throw error).
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`⚠️  Fake or broken package detected.`, err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // 5. SORTING THE MAIL
  // Stripe sends notifications for everything. I am looking at the subject line.
  // I only care if the subject is "Checkout Session Completed". If it's anything else, I ignore it.
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // 6. READING THE RECEIPT
    // I am pulling the specific details I want (Name, Price, Address) out of the box.
    const customerEmail = session.customer_details?.email;
    const customerName = session.customer_details?.name || 'Valued Customer';
    const amountTotal = session.amount_total ? session.amount_total / 100 : 0; // Convert cents to dollars
    
    // (Safety check: sometimes people buy digital items and have no address, so I handle that here)
    const shipping = session.shipping_details?.address || {};
    const addressString = `${shipping.line1 || ''}, ${shipping.city || ''}, ${shipping.postal_code || ''}`;

    console.log(`💰 Money received from ${customerName}! sending the letter now...`);

    // 7. SENDING THE LETTER
    // I write the letter and hand it to my Postman (Transporter).
    // I tell him: "Deliver this to ME (malakaimoodie@gmail.com)."
    try {
      await transporter.sendMail({
        from: `"My Store" <${process.env.GMAIL_USER}>`, 
        to: 'malakaimoodie@gmail.com', // WHERE I WANT TO RECEIVE THE EMAIL
        subject: `New Order: $${amountTotal} from ${customerName}`,
        html: `
          <h1>New Order Received!</h1>
          <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
          <p><strong>Amount:</strong> $${amountTotal}</p>
          <p><strong>Shipping Address:</strong><br>${addressString}</p>
        `,
      });
      console.log('✅ Success! The email is on its way.');
    } catch (error) {
      console.error('❌ The Postman crashed:', error);
    }
  }

  // 8. CLOSING THE WINDOW
  // Gives Stripe a "Thumbs Up" (200 OK) so they know I received the message and stop calling me.
  return NextResponse.json({ received: true });
} 