import { Database } from "@/types/database.types";

type DbShipmentStatus = Database["public"]["Enums"]["shipment_status"];

export const COMPLETED_SHIPMENT_STATUSES: DbShipmentStatus[] = ["Released", "Delivered"];
export const INACTIVE_SHIPMENT_STATUSES: DbShipmentStatus[] = ["Released", "Delivered"];

// Helper string for Supabase .not("status", "in", ...)
export const INACTIVE_SHIPMENT_STATUSES_SQL = `("${INACTIVE_SHIPMENT_STATUSES.join('","')}")`;
