import { Client } from "@/lib/mock-data/clients";
import { Database } from "@/lib/supabase/types";

type ClientRow = Database['public']['Tables']['clients']['Row'];

export function mapClient(row: ClientRow): Client {
  return {
    id: row.id,
    companyName: row.company_name,
    contactPerson: row.contact_person,
    phone: row.phone,
    email: row.email,
    address: row.address,
    tradeLicenseNumber: row.trade_license_number || "",
    binNumber: row.bin_number || "",
    tinNumber: row.tin_number || "",
    clientType: row.client_type || "Both",
    status: (row.status as "Active" | "Inactive" | "Pending") || "Pending",
    notes: row.notes || "",
    // We will initialize these to 0 as the current DB schema does not aggregate them
    // on the client row directly. Aggregations can be added later if needed.
    totalShipments: 0,
    activeShipments: 0,
    totalDocuments: 0,
  };
}

export function mapClientToInsert(client: Partial<Client>): Database['public']['Tables']['clients']['Insert'] {
  const insert: Database['public']['Tables']['clients']['Insert'] = {
    company_name: client.companyName!,
    contact_person: client.contactPerson!,
    phone: client.phone!,
    email: client.email!,
    address: client.address!,
    trade_license_number: client.tradeLicenseNumber || null,
    bin_number: client.binNumber || null,
    tin_number: client.tinNumber || null,
    client_type: client.clientType,
    status: client.status as "Active" | "Inactive" | "Pending",
    notes: client.notes,
  };
  if (client.id) {
    insert.id = client.id;
  }
  return insert;
}

export function mapClientToUpdate(client: Partial<Client>): Database['public']['Tables']['clients']['Update'] {
  return {
    company_name: client.companyName,
    contact_person: client.contactPerson,
    phone: client.phone,
    email: client.email,
    address: client.address,
    trade_license_number: client.tradeLicenseNumber || null,
    bin_number: client.binNumber || null,
    tin_number: client.tinNumber || null,
    client_type: client.clientType,
    status: client.status as "Active" | "Inactive" | "Pending",
    notes: client.notes,
  };
}
