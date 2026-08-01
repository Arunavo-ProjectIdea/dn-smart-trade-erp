import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zsfnmzfqqilyeywbghzh.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZm5temZxcWlseWV5d2JnaHpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2ODk4MzEsImV4cCI6MjEwMDI2NTgzMX0._uPOej25tpElFWR9nPNtx2_WIwtS7PUCPivsllFc7dc'
)

async function testInsert() {
  const insertData = {
    company_name: "Acme",
    contact_person: "Walid",
    phone: "01908830733",
    email: "Walid8@GMAIL.COM",
    address: "BASABO",
    trade_license_number: "TL- 23445",
    bin_number: null,
    tin_number: null,
    client_type: "Importer",
    status: "Active",
    notes: ""
  };
  console.log("Attempting insert...");
  const { data, error } = await supabase.from('clients').insert(insertData).select();
  console.log("Data:", data);
  console.log("Error:", error);
}

testInsert();
