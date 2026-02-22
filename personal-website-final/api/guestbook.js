import { createClient } from '@supabase/supabase-js';

// Connect to Supabase using environment variables
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // GET METHOD: Retrieve comments from the database
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('guestbook').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // POST METHOD: Add a new comment to the database
  if (req.method === 'POST') {
    const { name, message } = req.body;
    const { data, error } = await supabase.from('guestbook').insert([{ name, message }]);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ success: true });
  }
  
  return res.status(405).json({ message: 'Method Not Allowed' });
}