import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextResponse } from "next/server";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { email, firstName, lastName } = await req.json();
    console.log("1. Received request for:", email); // LOG ADDED

    // 1. Save to Supabase
    const { error: dbError } = await supabase
      .from("newsletter")
      .insert([{ email, first_name: firstName, last_name: lastName }]);

    if (dbError) {
      console.error("Supabase Error:", dbError); // LOG ADDED
      throw dbError;
    }
    console.log("2. Supabase insert successful"); // LOG ADDED

    // 2. Send "Welcome" Email to the Fan
    console.log("3. Attempting to send Welcome Email via Resend..."); // LOG ADDED
    
    // Capturing the result to log it
    const emailResult = await resend.emails.send({
      from: "April Born <newsletter@april-born.com>",
      to: email,
      subject: "Welcome to April Born",
      html: `
        <body style="margin: 0; padding: 0; background-color: #000000; color: #ffffff; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #000000; padding: 40px 20px;">
            
            <div style="text-align: center; margin-bottom: 40px;">
              <img 
                src="https://i.ibb.co/y3LyMgm/logo.png" 
                alt="APRIL BORN" 
                width="180" 
                style="display: block; margin: 0 auto;"
              />
            </div>

            <div style="margin-bottom: 40px;">
              <img 
                src="https://i.ibb.co/S4Bj9wg3/IMG-7384.jpg" 
                alt="Collection Preview" 
                style="width: 100%; height: auto; border: 1px solid #333333;" 
              />
            </div>

            <div style="text-align: center; padding: 0 10px;">
              <h2 style="font-size: 20px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px; color: #ffffff;">
                Welcome to the Movement
              </h2>
              <p style="color: #cccccc; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
                You are now on the list. We will notify you the moment the collection drops.
              </p>
              
              <div style="border-top: 1px solid #333333; border-bottom: 1px solid #333333; padding: 20px 0; margin: 30px 0;">
                <p style="font-size: 12px; color: #888888; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0;">
                  Your Welcome Code
                </p>
                <p style="font-size: 24px; font-weight: bold; color: #ffffff; letter-spacing: 3px; margin: 0;">
                  APRIL10
                </p>
              </div>
            </div>

            <div style="text-align: center; margin-top: 40px; color: #555555; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">
              © 2026 April Born. London.
            </div>
          </div>
        </body>
      `,
    });

    // LOGGING THE RESULT FROM RESEND
    console.log("4. Resend API Result:", JSON.stringify(emailResult, null, 2)); 

    // CHECK IF RESEND RETURNED AN ERROR OBJECT (Resend often returns 200 OK but includes an error object)
    if (emailResult.error) {
        console.error("CRITICAL: Resend returned an error:", emailResult.error);
        throw new Error(emailResult.error.message);
    }

    // 3. Send "Alert" Email to YOU (Notification)
    try {
      console.log("5. Sending Admin Notification..."); // LOG ADDED
      await resend.emails.send({
        from: 'April Born <newsletter@april-born.com>',
        to: 'malakaimoodie@gmail.com', // This is where the alert goes
        subject: 'New Subscriber Alert',
        html: `<p>New sign up received: <strong>${email}</strong></p>`
      });
      console.log("6. Admin Notification Sent"); // LOG ADDED
    } catch (err) {
      // If notification fails, we don't stop the user process
      console.log("Notification failed, but user signed up ok:", err);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter error FINAL CATCH:", error); // LOG ADDED
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 