import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

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

  // Save to Database
  const { error } = await supabase
    .from('newsletter')
    .insert([{ first_name: firstName, last_name: lastName, email: email }]);

  if (error) {
    if (error.code === '23505') return NextResponse.json({ message: 'Already subscribed!' });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send the Email
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
              <img 
                src="https://aprilbrn-fiul.vercel.app/logo.png" 
                alt="APRIL BORN" 
                width="150"
                style="display: block; margin: 0 auto;"
              />
            </div>

            <div style="width: 100%; margin-bottom: 30px;">
               <img 
                 src="https://via.placeholder.com/600x400/222222/666666?text=APRIL+BORN+COLLECTION" 
                 alt="Collection" 
                 style="width: 100%; height: auto; display: block;"
               />
            </div>

            <div style="text-align: center; padding: 0 10px;">
              <p style="font-size: 14px; line-height: 1.6; color: #cccccc; margin-bottom: 20px;">
                We would like to thank you for joining the movement.
              </p>
              <div style="border-top: 1px solid #333; margin: 20px 0;"></div>
              <p style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #666;">Your Welcome Code</p>
              
              <div style="background-color: #ffffff; color: #000000; padding: 15px 30px; display: inline-block; font-size: 20px; font-weight: bold; letter-spacing: 3px; margin: 15px 0;">
                APRIL10
              </div>
            </div>

            <div style="text-align: center; margin-top: 40px; font-size: 10px; color: #444;">
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