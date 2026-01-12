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

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  // 3. Save to Database
  const { error } = await supabase
    .from('newsletter')
    .insert([{ first_name: firstName, last_name: lastName, email: email }]);

  if (error) {
    if (error.code === '23505') { 
       return NextResponse.json({ message: 'You are already on the list!' });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 4. Send the "Trapstar Style" Email
  try {
    await transporter.sendMail({
      from: `"April Born" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Welcome to the Movement 🕯️',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin: 0; padding: 0; background-color: #000000; font-family: Arial, sans-serif; color: #ffffff;">
          
          <div style="max-width: 600px; margin: 0 auto; background-color: #000000; padding: 40px 20px;">
            
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="letter-spacing: 5px; font-size: 24px; margin: 0;">APRIL BORN</h1>
            </div>

            <div style="width: 100%; height: 300px; background-color: #222; margin-bottom: 30px; display: flex; align-items: center; justify-content: center;">
               <img 
                 src="https://via.placeholder.com/600x400/333333/ffffff?text=APRIL+BORN+VISUALS" 
                 alt="April Born Collection" 
                 style="width: 100%; height: auto; display: block;"
               />
            </div>

            <div style="text-align: center; padding: 0 20px;">
              <p style="font-size: 16px; line-height: 1.6; color: #cccccc;">
                We would like to thank you for joining the movement.
              </p>
              <p style="font-size: 16px; line-height: 1.6; color: #cccccc;">
                You are now officially part of the family. Expect early access to drops, exclusive content, and members-only benefits.
              </p>
            </div>

            <div style="text-align: center; margin-top: 40px; border-top: 1px solid #333; padding-top: 30px;">
              <p style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #666;">Your Welcome Gift</p>
              <div style="background-color: #ffffff; color: #000000; padding: 15px 30px; display: inline-block; font-size: 20px; font-weight: bold; letter-spacing: 3px; margin-top: 10px;">
                APRIL10
              </div>
              <p style="font-size: 12px; color: #666; margin-top: 10px;">Use this code at checkout for 10% off.</p>
            </div>

            <div style="text-align: center; margin-top: 50px; font-size: 10px; color: #444;">
              &copy; 2026 APRIL BORN. LONDON.
            </div>

          </div>
        </body>
        </html>
      `,
    });
  } catch (err) {
    console.error('Email failed:', err);
  }

  return NextResponse.json({ message: 'Success' });
} 