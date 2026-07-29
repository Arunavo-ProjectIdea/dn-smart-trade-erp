import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://bmllzvsnxfevbkdmbclt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbGx6dnNueGZldmJrZG1iY2x0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNzEzMjgsImV4cCI6MjA5Nzg0NzMyOH0.D40TZ44yiSKvHphDoQIJHGwPnkheE6usKz8CKFQqhxc'
)

async function testSelect() {
  const { data, error } = await supabase.from('clients').select('trade_license_number');
  console.log("Data:", data);
  console.log("Error:", error);
}

testSelect();
