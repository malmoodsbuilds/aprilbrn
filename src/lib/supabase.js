// 1. IMPORT THE TOOL
// We are bringing in a specific tool called 'createClient' from the Supabase package we installed.
// This is like buying a "phone" so we can call the database.
import { createClient } from '@supabase/supabase-js';

// 2. GET THE ADDRESS (URL)
// We go into your secure .env.local file and grab the "Project URL".
// This tells the code WHERE your database lives on the internet (the "Euro" server).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// 3. GET THE KEY (API KEY)
// We go into your .env.local file and grab the "Anon Key".
// This is the "password" or "keycard" that lets this code enter the database.
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 4. CREATE AND EXPORT THE CONNECTION
// We use the URL and Key to create a live connection to Supabase.
// We save this connection as 'supabase' and "export" it.
// "Export" means we can now use this specific connection on any other page of our website (like the Homepage or Cart).
export const supabase = createClient(supabaseUrl, supabaseKey);