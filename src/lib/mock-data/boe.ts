

export type BOEStatus = "Draft" | "Submitted" | "Under Verification" | "Approved" | "Rejected"

export interface BOEItem {
  id: string
  hsCode: string
  description: string
  qty: number
  unit: string
  unitPrice: number
  value: number // qty * unitPrice
  dutyRate: number // in percentage, e.g. 25
  dutyAmount: number // value * exchangeRate * (dutyRate/100)
}

export interface BillOfEntry {
  id: string
  boeNumber: string
  boeDate: string
  port: string
  customHouse: string
  entryType: "Home Consumption" | "Bond" | "Ex-bond"
  importType: "Commercial" | "Non-commercial"
  lcNumber: string
  lcDate: string
  countryOfOrigin: string
  countryOfExport: string

  // Importer details
  importerId?: string
  importerName: string
  binNumber: string
  tinNumber: string
  address: string

  // Exporter/Supplier details
  supplierName: string
  supplierCountry: string
  supplierAddress: string

  // Shipment & Invoice Details
  vesselName: string
  voyageNo: string
  igmNumber: string
  igmDate: string
  invoiceNumber: string
  invoiceDate: string
  blNumber: string
  blDate: string
  grossWeight: number
  netWeight: number
  currency: string
  exchangeRate: number
  invoiceValue: number // sum of items value
  freight: number
  insurance: number
  cifValue: number // invoiceValue + freight + insurance

  // Items
  items: BOEItem[]

  // Duties
  assessableValue: number // cifValue * exchangeRate
  customDuty: number
  supplementaryDuty: number
  vat: number
  ait: number
  at: number
  grandTotal: number

  // Documents
  documents: {
    commercialInvoice: boolean
    packingList: boolean
    billOfLading: boolean
    insurance: boolean
    lcCopy: boolean
    certificateOfOrigin: boolean
  }

  remarks: string
  status: BOEStatus
  createdAt: string
  updatedAt: string
}

export interface HSCodeInfo {
  code: string
  description: string
  category: string
  dutyRate: number // percent
}

export const mockHSCodes: HSCodeInfo[] = [
  { code: "8471.30.00", description: "Portable automatic data processing machines (Laptops, Tablets)", category: "Machinery/Electronics", dutyRate: 25.0 },
  { code: "8517.12.00", description: "Smartphones and mobile communication devices", category: "Electronics", dutyRate: 15.0 },
  { code: "9403.30.00", description: "Wooden furniture of a kind used in offices", category: "Furniture", dutyRate: 32.5 },
  { code: "8504.40.30", description: "Static converters and power adapters", category: "Electronics", dutyRate: 10.0 },
  { code: "8703.23.19", description: "Motor cars and other motor vehicles (>1500cc)", category: "Automotive", dutyRate: 100.0 },
  { code: "3926.90.99", description: "Other articles of plastics", category: "Plastics", dutyRate: 5.0 },
  { code: "3004.90.99", description: "Other medicaments consisting of mixed or unmixed products for therapeutic uses", category: "Pharmaceuticals", dutyRate: 0.0 },
  { code: "1006.30.90", description: "Semi-milled or wholly milled rice, whether or not polished or glazed", category: "Agriculture", dutyRate: 5.0 }
]

export const mockPorts = [
  "Chattogram Port (CGP)",
  "Dhaka Airport (DAC)",
  "Mongla Port (MGP)",
  "Benapole Land Port (BEN)",
  "Pangaon Inland Container Terminal"
]

export const mockCustomHouses = [
  "Chattogram Customs House",
  "Dhaka Customs House",
  "Mongla Customs House",
  "Benapole Customs House",
  "ICD Kamalapur Customs"
]

const initialBOEs: BillOfEntry[] = [
  {
    id: "BOE-2026-2041",
    boeNumber: "BOE-2026-2041",
    boeDate: "2026-06-12",
    port: "Chattogram Port (CGP)",
    customHouse: "Chattogram Customs House",
    entryType: "Home Consumption",
    importType: "Commercial",
    lcNumber: "LC-99823019",
    lcDate: "2026-05-15",
    countryOfOrigin: "South Korea",
    countryOfExport: "South Korea",
    importerId: "CL-1001",
    importerName: "Global Logistics Inc.",
    binNumber: "BIN-4920193",
    tinNumber: "TIN-99283011",
    address: "123 Port Road, Suite 400, Seattle, WA 98101",
    supplierName: "Samsung Korea Ltd",
    supplierCountry: "South Korea",
    supplierAddress: "Samsung IT Tower, Seoul",
    vesselName: "MV Ocean Express",
    voyageNo: "VY-092",
    igmNumber: "IGM-9029102",
    igmDate: "2026-06-10",
    invoiceNumber: "INV-102",
    invoiceDate: "2026-05-20",
    blNumber: "BL-99201029",
    blDate: "2026-05-25",
    grossWeight: 4500,
    netWeight: 4000,
    currency: "USD",
    exchangeRate: 110,
    invoiceValue: 83000,
    freight: 2500,
    insurance: 800,
    cifValue: 86300,
    items: [
      {
        id: "item-1",
        hsCode: "8471.30.00",
        description: "Portable automatic data processing machines (Laptops, Tablets)",
        qty: 100,
        unit: "PCS",
        unitPrice: 800,
        value: 80000,
        dutyRate: 25.0,
        dutyAmount: 2200000 // 80000 * 110 * 0.25
      },
      {
        id: "item-2",
        hsCode: "8504.40.30",
        description: "Static converters and power adapters",
        qty: 100,
        unit: "PCS",
        unitPrice: 30,
        value: 3000,
        dutyRate: 10.0,
        dutyAmount: 33000 // 3000 * 110 * 0.1
      }
    ],
    assessableValue: 9493000, // 86300 * 110
    customDuty: 2233000, // CD sum
    supplementaryDuty: 1172600, // (9493000 + 2233000) * 0.1
    vat: 1934790, // (9493000 + 2233000 + 1172600) * 0.15
    ait: 474650, // 9493000 * 0.05
    at: 474650, // 9493000 * 0.05
    grandTotal: 6289690, // Sum of duties
    documents: {
      commercialInvoice: true,
      packingList: true,
      billOfLading: true,
      insurance: true,
      lcCopy: true,
      certificateOfOrigin: true
    },
    remarks: "Shipment cleared in good order. Duty paid in full.",
    status: "Approved",
    createdAt: "2026-06-12T10:00:00Z",
    updatedAt: "2026-06-15T16:30:00Z"
  },
  {
    id: "BOE-2026-2042",
    boeNumber: "BOE-2026-2042",
    boeDate: "2026-06-15",
    port: "Dhaka Airport (DAC)",
    customHouse: "Dhaka Customs House",
    entryType: "Home Consumption",
    importType: "Commercial",
    lcNumber: "LC-88371092",
    lcDate: "2026-06-01",
    countryOfOrigin: "China",
    countryOfExport: "China",
    importerId: "CL-1002",
    importerName: "Pacific Traders LLC",
    binNumber: "BIN-7728190",
    tinNumber: "TIN-88291038",
    address: "88 Ocean Drive, Los Angeles, CA 90001",
    supplierName: "Shenzhen Electronics Group",
    supplierCountry: "China",
    supplierAddress: "Industrial Area Block B, Shenzhen",
    vesselName: "Air Cargo SQ-442",
    voyageNo: "VY-442",
    igmNumber: "IGM-8827391",
    igmDate: "2026-06-14",
    invoiceNumber: "INV-108",
    invoiceDate: "2026-06-05",
    blNumber: "BL-CH-992019",
    blDate: "2026-06-08",
    grossWeight: 240,
    netWeight: 220,
    currency: "USD",
    exchangeRate: 110,
    invoiceValue: 15000,
    freight: 1200,
    insurance: 300,
    cifValue: 16500,
    items: [
      {
        id: "item-1",
        hsCode: "8517.12.00",
        description: "Smartphones and mobile communication devices",
        qty: 30,
        unit: "PCS",
        unitPrice: 500,
        value: 15000,
        dutyRate: 15.0,
        dutyAmount: 247500 // 15000 * 110 * 0.15
      }
    ],
    assessableValue: 1815000, // 16500 * 110
    customDuty: 247500,
    supplementaryDuty: 206250, // (1815000 + 247500) * 0.1
    vat: 340312.5, // (1815000 + 247500 + 206250) * 0.15
    ait: 90750, // 1815000 * 0.05
    at: 90750, // 1815000 * 0.05
    grandTotal: 975562.5,
    documents: {
      commercialInvoice: true,
      packingList: true,
      billOfLading: true,
      insurance: true,
      lcCopy: false,
      certificateOfOrigin: true
    },
    remarks: "Pending visual verification of cargo weights.",
    status: "Submitted",
    createdAt: "2026-06-15T09:12:00Z",
    updatedAt: "2026-06-15T09:15:00Z"
  },
  {
    id: "BOE-2026-2043",
    boeNumber: "BOE-2026-2043",
    boeDate: "2026-06-18",
    port: "Chattogram Port (CGP)",
    customHouse: "Chattogram Customs House",
    entryType: "Home Consumption",
    importType: "Commercial",
    lcNumber: "LC-77283921",
    lcDate: "2026-06-05",
    countryOfOrigin: "Japan",
    countryOfExport: "Japan",
    importerId: "CL-1005",
    importerName: "Sunset Imports Co.",
    binNumber: "BIN-5592018",
    tinNumber: "TIN-4482910",
    address: "992 Trade Ave, Miami, FL 33101",
    supplierName: "Tokyo Auto Export Corp",
    supplierCountry: "Japan",
    supplierAddress: "Ginza 2-Chome, Chuo-ku, Tokyo",
    vesselName: "MV Ocean Highway",
    voyageNo: "VY-12",
    igmNumber: "IGM-9831920",
    igmDate: "2026-06-17",
    invoiceNumber: "INV-120",
    invoiceDate: "2026-06-08",
    blNumber: "BL-JP-88291",
    blDate: "2026-06-10",
    grossWeight: 1800,
    netWeight: 1650,
    currency: "USD",
    exchangeRate: 110,
    invoiceValue: 24000,
    freight: 3000,
    insurance: 600,
    cifValue: 27600,
    items: [
      {
        id: "item-1",
        hsCode: "8703.23.19",
        description: "Motor cars and other motor vehicles (>1500cc)",
        qty: 1,
        unit: "PCS",
        unitPrice: 24000,
        value: 24000,
        dutyRate: 100.0,
        dutyAmount: 2640000 // 24000 * 110 * 1.0
      }
    ],
    assessableValue: 3036000, // 27600 * 110
    customDuty: 2640000,
    supplementaryDuty: 567600, // (3036000 + 2640000) * 0.1
    vat: 936540, // (3036000 + 2640000 + 567600) * 0.15
    ait: 151800, // 3036000 * 0.05
    at: 151800, // 3036000 * 0.05
    grandTotal: 4447740,
    documents: {
      commercialInvoice: true,
      packingList: true,
      billOfLading: true,
      insurance: true,
      lcCopy: true,
      certificateOfOrigin: true
    },
    remarks: "Draft completed. Ready for submittal.",
    status: "Draft",
    createdAt: "2026-06-18T14:22:00Z",
    updatedAt: "2026-06-18T14:22:00Z"
  }
]

export function getBOEs(): BillOfEntry[] {
  if (typeof window === "undefined") return initialBOEs
  
  const saved = localStorage.getItem("mock_boes")
  if (!saved) {
    localStorage.setItem("mock_boes", JSON.stringify(initialBOEs))
    return initialBOEs
  }
  
  return JSON.parse(saved)
}

export function saveBOEs(boes: BillOfEntry[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("mock_boes", JSON.stringify(boes))
  }
}

export function getBOEById(id: string): BillOfEntry | undefined {
  const boes = getBOEs()
  return boes.find(b => b.id === id)
}

export function saveBOE(boe: BillOfEntry): void {
  const boes = getBOEs()
  const index = boes.findIndex(b => b.id === boe.id)
  
  if (index !== -1) {
    boes[index] = { ...boe, updatedAt: new Date().toISOString() }
  } else {
    // Generate code
    const lastId = boes.length > 0 ? boes[boes.length - 1].id : "BOE-2026-2000"
    const match = lastId.match(/(\d+)$/)
    const nextNum = match ? parseInt(match[0]) + 1 : 2041
    const newId = `BOE-2026-${nextNum}`
    boes.push({
      ...boe,
      id: newId,
      boeNumber: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }
  
  saveBOEs(boes)
}

export function deleteBOE(id: string): void {
  const boes = getBOEs()
  const filtered = boes.filter(b => b.id !== id)
  saveBOEs(filtered)
}
