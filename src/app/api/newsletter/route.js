import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

// 1. Connect to Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 2. Setup Email Sender
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function POST(req) {
  const { firstName, lastName, email } = await req.json();

  // Basic validation
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  // 3. Save to Database
  const { error } = await supabase
    .from('newsletter')
    .insert([{ first_name: firstName, last_name: lastName, email: email }]);

  if (error) {
    if (error.code === '23505') { // Duplicate email error
       return NextResponse.json({ message: 'You are already on the list!' });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 4. Send the 10% OFF Code
  try {
    await transporter.sendMail({
      from: `"AprilBurn" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Your 10% OFF Code Inside! 🕯️',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h1>Welcome to the Family, ${firstName}!</h1>
          <p>Thanks for subscribing. Use this code at checkout for 10% off:</p>
          <div style="background: #000; color: #fff; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
            APRIL10
          </div>
          <p>We will notify you the moment the hoodies drop.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error('Email failed:', err);
  }

  return NextResponse.json({ message: 'Success' });
} 