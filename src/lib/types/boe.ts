export type BOEStatus = 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Completed';

export interface ImporterInfo {
  clientName: string;
  companyName: string;
  bin: string;
  tin: string;
  address: string;
}

export interface ShipmentInfo {
  shipmentId: string;
  port: string;
  countryOfOrigin: string;
  carrier: string;
  containerNumber: string;
  arrivalDate: string;
}

export interface BOEProduct {
  id: string;
  productName: string;
  hsCode: string;
  quantity: number;
  unit: string;
  declaredValue: number;
  currency: string;
}

export interface DutyCalculation {
  importDuty: number;
  vat: number;
  ait: number;
  at: number;
  otherCharges: number;
  grandTotal: number;
}

export interface BOETimelineEvent {
  id: string;
  date: string;
  status: BOEStatus;
  note: string;
  author: string;
}

export interface BillOfEntry {
  id: string;
  boeNumber: string;
  status: BOEStatus;
  createdAt: string;
  updatedAt: string;
  importer: ImporterInfo;
  shipment: ShipmentInfo;
  products: BOEProduct[];
  duties: DutyCalculation;
  timeline: BOETimelineEvent[];
  notes?: string;
}
