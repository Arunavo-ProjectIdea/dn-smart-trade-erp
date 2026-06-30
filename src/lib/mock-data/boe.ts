import { BillOfEntry } from '../types/boe';

export const mockBOEList: BillOfEntry[] = [
  {
    id: "boe-1",
    boeNumber: "BOE-2026-001",
    status: "Completed",
    createdAt: "2026-06-01T10:00:00Z",
    updatedAt: "2026-06-05T14:30:00Z",
    importer: {
      clientName: "Acme Corp",
      companyName: "Acme International Ltd.",
      bin: "123456789",
      tin: "987654321",
      address: "123 Business Rd, Dhaka, Bangladesh"
    },
    shipment: {
      shipmentId: "SHP-1001",
      port: "Chittagong Port",
      countryOfOrigin: "China",
      carrier: "Maersk",
      containerNumber: "MSKU1234567",
      arrivalDate: "2026-05-28T08:00:00Z"
    },
    products: [
      {
        id: "prod-1",
        productName: "Industrial Sewing Machine",
        hsCode: "8452.29.00",
        quantity: 50,
        unit: "Pieces",
        declaredValue: 25000,
        currency: "USD"
      },
      {
        id: "prod-2",
        productName: "Spare Needles",
        hsCode: "8452.30.00",
        quantity: 1000,
        unit: "Packets",
        declaredValue: 2000,
        currency: "USD"
      }
    ],
    duties: {
      importDuty: 2700,
      vat: 4050,
      ait: 1350,
      at: 0,
      otherCharges: 300,
      grandTotal: 8400
    },
    timeline: [
      {
        id: "tl-1",
        date: "2026-06-01T10:00:00Z",
        status: "Draft",
        note: "BOE drafted",
        author: "John Doe"
      },
      {
        id: "tl-2",
        date: "2026-06-02T11:15:00Z",
        status: "Submitted",
        note: "BOE submitted to customs authorities",
        author: "John Doe"
      },
      {
        id: "tl-3",
        date: "2026-06-03T09:00:00Z",
        status: "Under Review",
        note: "Customs review in progress",
        author: "Customs Officer"
      },
      {
        id: "tl-4",
        date: "2026-06-04T16:45:00Z",
        status: "Approved",
        note: "BOE approved by customs",
        author: "Customs Officer"
      },
      {
        id: "tl-5",
        date: "2026-06-05T14:30:00Z",
        status: "Completed",
        note: "Duties paid and goods cleared",
        author: "Finance Team"
      }
    ],
    notes: "Urgent shipment for summer collection."
  },
  {
    id: "boe-2",
    boeNumber: "BOE-2026-002",
    status: "Under Review",
    createdAt: "2026-06-15T09:30:00Z",
    updatedAt: "2026-06-16T11:00:00Z",
    importer: {
      clientName: "TechNova",
      companyName: "TechNova Solutions LLC",
      bin: "234567890",
      tin: "876543210",
      address: "45 Tech Park, Sylhet, Bangladesh"
    },
    shipment: {
      shipmentId: "SHP-1002",
      port: "Mongla Port",
      countryOfOrigin: "Taiwan",
      carrier: "Evergreen",
      containerNumber: "EGCU9876543",
      arrivalDate: "2026-06-12T07:30:00Z"
    },
    products: [
      {
        id: "prod-3",
        productName: "Laptop Computers",
        hsCode: "8471.30.00",
        quantity: 500,
        unit: "Pieces",
        declaredValue: 250000,
        currency: "USD"
      }
    ],
    duties: {
      importDuty: 12500,
      vat: 37500,
      ait: 12500,
      at: 0,
      otherCharges: 1500,
      grandTotal: 64000
    },
    timeline: [
      {
        id: "tl-6",
        date: "2026-06-15T09:30:00Z",
        status: "Draft",
        note: "BOE drafted",
        author: "Alice Smith"
      },
      {
        id: "tl-7",
        date: "2026-06-15T14:00:00Z",
        status: "Submitted",
        note: "BOE submitted",
        author: "Alice Smith"
      },
      {
        id: "tl-8",
        date: "2026-06-16T11:00:00Z",
        status: "Under Review",
        note: "Pending physical inspection",
        author: "Customs Officer"
      }
    ]
  },
  {
    id: "boe-3",
    boeNumber: "BOE-2026-003",
    status: "Draft",
    createdAt: "2026-06-25T15:20:00Z",
    updatedAt: "2026-06-25T15:20:00Z",
    importer: {
      clientName: "Global Trade Co",
      companyName: "Global Trade Syndicate",
      bin: "345678901",
      tin: "765432109",
      address: "88 Port Road, Chittagong, Bangladesh"
    },
    shipment: {
      shipmentId: "SHP-1005",
      port: "Chittagong Port",
      countryOfOrigin: "India",
      carrier: "MSC",
      containerNumber: "MSCU5556667",
      arrivalDate: "2026-06-24T12:00:00Z"
    },
    products: [
      {
        id: "prod-4",
        productName: "Cotton Yarn",
        hsCode: "5205.11.00",
        quantity: 20000,
        unit: "Kg",
        declaredValue: 60000,
        currency: "USD"
      }
    ],
    duties: {
      importDuty: 3000,
      vat: 9000,
      ait: 3000,
      at: 3000,
      otherCharges: 500,
      grandTotal: 18500
    },
    timeline: [
      {
        id: "tl-9",
        date: "2026-06-25T15:20:00Z",
        status: "Draft",
        note: "Initial data entry",
        author: "Bob Jones"
      }
    ]
  },
  {
    id: "boe-4",
    boeNumber: "BOE-2026-004",
    status: "Rejected",
    createdAt: "2026-05-10T09:00:00Z",
    updatedAt: "2026-05-12T10:30:00Z",
    importer: {
      clientName: "Foodies Ltd",
      companyName: "Foodies International",
      bin: "456789012",
      tin: "654321098",
      address: "21 Culinary Ave, Dhaka, Bangladesh"
    },
    shipment: {
      shipmentId: "SHP-0990",
      port: "Chittagong Port",
      countryOfOrigin: "Brazil",
      carrier: "Hapag-Lloyd",
      containerNumber: "HLCU1112223",
      arrivalDate: "2026-05-08T06:00:00Z"
    },
    products: [
      {
        id: "prod-5",
        productName: "Frozen Poultry",
        hsCode: "0207.14.00",
        quantity: 15000,
        unit: "Kg",
        declaredValue: 45000,
        currency: "USD"
      }
    ],
    duties: {
      importDuty: 11250,
      vat: 6750,
      ait: 2250,
      at: 0,
      otherCharges: 1000,
      grandTotal: 21250
    },
    timeline: [
      {
        id: "tl-10",
        date: "2026-05-10T09:00:00Z",
        status: "Draft",
        note: "BOE drafted",
        author: "Sarah Connor"
      },
      {
        id: "tl-11",
        date: "2026-05-10T11:00:00Z",
        status: "Submitted",
        note: "Submitted to customs",
        author: "Sarah Connor"
      },
      {
        id: "tl-12",
        date: "2026-05-12T10:30:00Z",
        status: "Rejected",
        note: "Rejected due to missing sanitary certificates",
        author: "Customs Officer"
      }
    ]
  }
];

export const getMockBOEById = (id: string) => {
  return mockBOEList.find(boe => boe.id === id || boe.boeNumber === id) || null;
};
