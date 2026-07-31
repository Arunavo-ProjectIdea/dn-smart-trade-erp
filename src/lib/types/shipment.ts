export type ShipmentStatus = 
  | 'Draft'
  | 'Pending'
  | 'Booked'
  | 'Processing'
  | 'In Transit'
  | 'Delayed'
  | 'At Port'
  | 'Customs Clearance'
  | 'Released'
  | 'Delivered'
  | 'Completed'
  | 'Cancelled';

export type TimelineEventStatus = 
  | 'Booked'
  | 'Picked Up'
  | 'At Origin Port'
  | 'Loaded'
  | 'In Transit'
  | 'Arrived'
  | 'Customs Clearance'
  | 'Released'
  | 'Delivered'
  | 'Completed';

export interface TimelineEvent {
  id: string;
  status: TimelineEventStatus;
  date: string;
  time: string;
  location: string;
  responsibleEmployee: string;
  notes: string;
}

export interface CargoProduct {
  id: string;
  name: string;
  hsCode: string;
  quantity: number;
  weight: number;
}

export interface Shipment {
  id: string;
  shipmentNumber: string;
  status: ShipmentStatus;
  
  // Step 1: Client Information
  clientId: string;
  clientName: string; // denormalized for easy listing
  importer: string;
  exporter: string;
  consignee: string;
  
  // Step 2: Shipment Information
  containerNumber: string;
  containerSize: string;
  containerType: string;
  shippingLine: string;
  vesselName: string;
  voyageNumber: string;
  originCountry: string;
  destinationCountry: string;
  loadingPort: string;
  dischargePort: string;
  arrivalPort: string;
  departureDate: string;
  eta: string;
  etd: string;
  incoterms: string;
  transportType: 'Sea' | 'Air' | 'Land';
  
  // Step 3: Cargo Information
  products: CargoProduct[];
  hsCodes: string[];
  grossWeight: number; // in kg
  netWeight: number; // in kg
  packageCount: number;
  packageType: string;
  description: string;
  
  // Step 4: Customs
  boeId?: string;
  boeNumber?: string;
  dutyAmount?: number;
  customsStatus: string;
  clearanceStatus: string;
  
  // Step 5: Timeline
  timeline: TimelineEvent[];
  
  // Assiged employee
  assignedEmployeeId: string;
  assignedEmployeeName: string;

  createdAt: string;
  updatedAt: string;
}
