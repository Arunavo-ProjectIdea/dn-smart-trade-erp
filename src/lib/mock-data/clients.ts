import { StatusType } from "@/components/erp/status-badge"

export interface Client {
  id: string
  companyName: string
  contactPerson: string
  phone: string
  email: string
  address: string
  tradeLicenseNumber: string
  binNumber: string
  tinNumber: string
  clientType: "Importer" | "Exporter" | "Both"
  status: StatusType
  notes: string
  totalShipments: number
  activeShipments: number
  totalDocuments: number
}

export const mockClients: Client[] = [
  {
    id: "CL-1001",
    companyName: "Global Logistics Inc.",
    contactPerson: "Jane Smith",
    phone: "+1 (555) 019-2831",
    email: "jane.smith@globallogistics.com",
    address: "123 Port Road, Suite 400, Seattle, WA 98101",
    tradeLicenseNumber: "TL-84729103",
    binNumber: "BIN-4920193",
    tinNumber: "TIN-99283011",
    clientType: "Both",
    status: "Active",
    notes: "Premium client. Negotiated 5% discount on all freight charges.",
    totalShipments: 142,
    activeShipments: 3,
    totalDocuments: 87,
  },
  {
    id: "CL-1002",
    companyName: "Pacific Traders LLC",
    contactPerson: "Michael Chen",
    phone: "+1 (555) 847-9920",
    email: "m.chen@pacifictraders.com",
    address: "88 Ocean Drive, Los Angeles, CA 90001",
    tradeLicenseNumber: "TL-55829104",
    binNumber: "BIN-7728190",
    tinNumber: "TIN-88291038",
    clientType: "Importer",
    status: "Active",
    notes: "Specializes in electronics imports from Southeast Asia.",
    totalShipments: 89,
    activeShipments: 1,
    totalDocuments: 45,
  },
  {
    id: "CL-1003",
    companyName: "EuroFreight Partners",
    contactPerson: "Sarah Johnson",
    phone: "+44 20 7123 4567",
    email: "s.johnson@eurofreight.co.uk",
    address: "15 London Bridge St, London, UK",
    tradeLicenseNumber: "TL-EU-99201",
    binNumber: "BIN-EU-33920",
    tinNumber: "TIN-EU-44920",
    clientType: "Exporter",
    status: "Pending",
    notes: "Awaiting final compliance checks before clearing first shipment.",
    totalShipments: 0,
    activeShipments: 0,
    totalDocuments: 3,
  },
  {
    id: "CL-1004",
    companyName: "Apex Manufacturing",
    contactPerson: "David Wilson",
    phone: "+1 (555) 338-2910",
    email: "dwilson@apex-mfg.com",
    address: "400 Industrial Pkwy, Detroit, MI 48201",
    tradeLicenseNumber: "TL-11029384",
    binNumber: "BIN-2203948",
    tinNumber: "TIN-3304958",
    clientType: "Exporter",
    status: "Inactive",
    notes: "Account suspended due to non-payment of invoices.",
    totalShipments: 24,
    activeShipments: 0,
    totalDocuments: 12,
  },
  {
    id: "CL-1005",
    companyName: "Sunset Imports Co.",
    contactPerson: "Maria Garcia",
    phone: "+1 (555) 773-8291",
    email: "maria@sunsetimports.com",
    address: "992 Trade Ave, Miami, FL 33101",
    tradeLicenseNumber: "TL-88291045",
    binNumber: "BIN-5592018",
    tinNumber: "TIN-4482910",
    clientType: "Importer",
    status: "Active",
    notes: "Focuses on agricultural imports. Requires rapid customs clearance.",
    totalShipments: 312,
    activeShipments: 5,
    totalDocuments: 156,
  },
]

// Add 20 more generic generated clients for pagination testing
for (let i = 6; i <= 25; i++) {
  mockClients.push({
    id: `CL-10${i.toString().padStart(2, '0')}`,
    companyName: `TradeCorp Logistics ${i}`,
    contactPerson: `Contact Person ${i}`,
    phone: `+1 (555) 000-${1000 + i}`,
    email: `contact${i}@tradecorp.com`,
    address: `${i * 10} Business Blvd, Suite ${i}, Metropolis`,
    tradeLicenseNumber: `TL-0000${i}`,
    binNumber: `BIN-0000${i}`,
    tinNumber: `TIN-0000${i}`,
    clientType: i % 3 === 0 ? "Both" : (i % 2 === 0 ? "Importer" : "Exporter"),
    status: i % 7 === 0 ? "Inactive" : (i % 5 === 0 ? "Pending" : "Active"),
    notes: "Auto-generated mock client record.",
    totalShipments: i * 14,
    activeShipments: i % 4,
    totalDocuments: i * 8,
  })
}
