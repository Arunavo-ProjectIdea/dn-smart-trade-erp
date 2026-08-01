import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zsfnmzfqqilyeywbghzh.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZm5temZxcWlseWV5d2JnaHpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2ODk4MzEsImV4cCI6MjEwMDI2NTgzMX0._uPOej25tpElFWR9nPNtx2_WIwtS7PUCPivsllFc7dc'
)

async function testSelect() {
  const { data, error } = await supabase.from('clients').select('trade_license_number');
  console.log("Data:", data);
  console.log("Error:", error);
}

testSelect();
