import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://bmllzvsnxfevbkdmbclt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbGx6dnNueGZldmJrZG1iY2x0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNzEzMjgsImV4cCI6MjA5Nzg0NzMyOH0.D40TZ44yiSKvHphDoQIJHGwPnkheE6usKz8CKFQqhxc'
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
