import * as fs from "fs"
import * as path from "path"
import { parse } from "csv-parse"
import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"

// Load env vars
dotenv.config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const BATCH_SIZE = 500

async function main() {
  const csvFilePath = path.join(process.cwd(), "data", "customs.csv")

  if (!fs.existsSync(csvFilePath)) {
    console.error(`CSV file not found at ${csvFilePath}. Please save the provided CSV there first.`)
    process.exit(1)
  }

  const rows: any[] = []
  
  console.log("Reading CSV file...")
  
  const parser = fs.createReadStream(csvFilePath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_quotes: true,
      relax_column_count: true
    })
  )

  for await (const record of parser) {
    rows.push(record)
  }
  
  console.log(`Successfully parsed ${rows.length} rows from CSV.`)
  
  let importedCount = 0
  let failedCount = 0

  // We map them before sending
  const mappedRows = rows.map((r) => {
    return {
      hscode: String(r.hscode || "").trim(),
      tariff_description: String(r.tariff_description || "").trim(),
      category: "Imported",
      uom: "kg",
      cd: parseFloat(r.cd) || 0,
      sd: parseFloat(r.sd) || 0,
      vat: parseFloat(r.vat) || 0,
      ait: parseFloat(r.ait) || 0,
      at: parseFloat(r.at) || 0,
      rd: parseFloat(r.rd) || 0,
      tti: parseFloat(r.tti) || 0,
    }
  })

  console.log(`Starting import to Supabase in batches of ${BATCH_SIZE}...`)
  
  for (let i = 0; i < mappedRows.length; i += BATCH_SIZE) {
    const batch = mappedRows.slice(i, i + BATCH_SIZE)
    
    console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} rows)...`)
    
    const { data, error } = await supabase
      .from("hs_codes")
      .insert(batch)
      .select()

    if (error) {
      console.error(`Error inserting batch ${Math.floor(i / BATCH_SIZE) + 1}:`, error.message)
      failedCount += batch.length
    } else {
      importedCount += batch.length
    }
  }

  console.log("-----------------------------------------")
  console.log("IMPORT COMPLETE")
  console.log(`Total Rows Processed: ${rows.length}`)
  console.log(`Imported / Updated Rows: ${importedCount}`)
  console.log(`Failed Rows: ${failedCount}`)
  console.log("-----------------------------------------")
}

main().catch(console.error)
