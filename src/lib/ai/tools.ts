import { SupabaseClient } from "@supabase/supabase-js";
import { expandTradeSynonym } from "@/lib/trade-synonyms";

export async function searchHSCodes(supabase: SupabaseClient, query: string): Promise<string> {
  const { searchTerm } = expandTradeSynonym(query.trim());
  const { data, error } = await supabase
    .rpc("match_hs_codes_ai", { search_term: searchTerm, match_limit: 5 });

  if (error || !data || data.length === 0) {
    return `No HS Codes found matching: ${query}`;
  }

  return `HS Codes matching "${query}":\n` + data.map((c: { hscode: string, tariff_description: string, category: string }) => `- ${c.hscode}: ${c.tariff_description} (Category: ${c.category})`).join("\n");
}

export async function getDutyInformation(supabase: SupabaseClient, hsCode: string): Promise<string> {
  const { data, error } = await supabase
    .from("hs_codes")
    .select("hscode, tariff_description, cd, sd, vat, ait, rd, at, tti")
    .eq("hscode", hsCode)
    .single();

  if (error || !data) {
    return `Could not find duty information for HS Code: ${hsCode}`;
  }

  return `Duty Information for ${hsCode} (${data.tariff_description}):
- CD (Customs Duty): ${data.cd}%
- SD (Supplementary Duty): ${data.sd}%
- VAT (Value Added Tax): ${data.vat}%
- AIT (Advance Income Tax): ${data.ait}%
- RD (Regulatory Duty): ${data.rd}%
- AT (Advance Tax): ${data.at}%
- TTI (Total Tax Incidence): ${data.tti}%`;
}

export async function getShipmentInformation(supabase: SupabaseClient, query: string): Promise<string> {
  // Search by shipment number or client name
  const { data, error } = await supabase
    .from("shipments")
    .select("shipment_number, status, loading_port, discharge_port, eta, client_name")
    .or(`shipment_number.ilike.%${query}%,client_name.ilike.%${query}%`)
    .limit(3);

  if (error || !data || data.length === 0) {
    return `No shipments found matching: ${query}`;
  }

  return `Shipment Details:\n` + data.map(s => `- Shipment ${s.shipment_number} for ${s.client_name}: Status is ${s.status}. Origin: ${s.loading_port}, Dest: ${s.discharge_port}. ETA: ${s.eta ? new Date(s.eta).toLocaleDateString() : 'N/A'}`).join("\n");
}

export async function getBOEInformation(supabase: SupabaseClient, query: string): Promise<string> {
  const { data, error } = await supabase
    .from("bills_of_entry")
    .select("boe_number, status, total_duty, assessment_date, shipments(shipment_number)")
    .ilike("boe_number", `%${query}%`)
    .limit(3);

  if (error || !data || data.length === 0) {
    return `No BOE found matching: ${query}`;
  }

  return `BOE Details:\n` + data.map(b => `- BOE ${b.boe_number}: Status is ${b.status}. Total Duty: ৳${b.total_duty}. Assessed: ${b.assessment_date ? new Date(b.assessment_date).toLocaleDateString() : 'N/A'}. Related Shipment: ${Array.isArray(b.shipments) ? b.shipments[0]?.shipment_number : (b.shipments as { shipment_number?: string })?.shipment_number || 'None'}`).join("\n");
}

export async function getClientInformation(supabase: SupabaseClient, query: string): Promise<string> {
  const { data, error } = await supabase
    .from("clients")
    .select("name, type, status, bin_number")
    .ilike("name", `%${query}%`)
    .limit(3);

  if (error || !data || data.length === 0) {
    return `No clients found matching: ${query}`;
  }

  return `Client Details:\n` + data.map(c => `- ${c.name} (${c.type}): Status is ${c.status}. BIN: ${c.bin_number}`).join("\n");
}
