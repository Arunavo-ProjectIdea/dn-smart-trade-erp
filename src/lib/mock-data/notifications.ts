export interface NotificationItem {
  id: string
  title: string
  description: string
  timestamp: string
  timeGroup: "Today" | "Yesterday" | "Earlier This Week"
  category: "Shipments" | "BOE Filings" | "Financial" | "Compliance" | "System"
  priority: "High" | "Medium" | "Low" | "Success"
  read: boolean
  link?: string
}

export const mockNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Shipment #SHP-8472 Cleared Customs",
    description: "Port Authority approved entry for Sunset Imports Co. container #CN-9021.",
    timestamp: "10 mins ago",
    timeGroup: "Today",
    category: "Shipments",
    priority: "Success",
    read: false,
    link: "/shipments",
  },
  {
    id: "notif-2",
    title: "BOE #BOE-2026-001 Inspection Required",
    description: "Customs official requested physical inspection of chemical cargo.",
    timestamp: "45 mins ago",
    timeGroup: "Today",
    category: "BOE Filings",
    priority: "High",
    read: false,
    link: "/boe",
  },
  {
    id: "notif-3",
    title: "Invoice #INV-2041 Paid by Global Logistics",
    description: "Payment of $45,000 received via wire transfer.",
    timestamp: "2 hours ago",
    timeGroup: "Today",
    category: "Financial",
    priority: "Success",
    read: true,
    link: "/documents",
  },
  {
    id: "notif-[4]",
    title: "EU Tariff Policy Update (2026 Q3)",
    description: "New duty rates applied to steel and aluminum product classifications.",
    timestamp: "5 hours ago",
    timeGroup: "Today",
    category: "Compliance",
    priority: "Medium",
    read: false,
    link: "/hs-codes",
  },
  {
    id: "notif-5",
    title: "Document Missing for Apex Manufacturing",
    description: "Certificate of Origin required before BOE-2026-003 clearance.",
    timestamp: "Yesterday, 4:15 PM",
    timeGroup: "Yesterday",
    category: "BOE Filings",
    priority: "High",
    read: true,
    link: "/boe",
  },
  {
    id: "notif-6",
    title: "Scheduled Server Maintenance Alert",
    description: "System database maintenance planned tonight at 02:00 UTC (15 mins downtime).",
    timestamp: "Yesterday, 11:30 AM",
    timeGroup: "Yesterday",
    category: "System",
    priority: "Low",
    read: true,
  },
  {
    id: "notif-7",
    title: "New Client Onboarded: Apex Trading LLC",
    description: "Client account verified and trade credentials activated.",
    timestamp: "Jul 18, 2026",
    timeGroup: "Earlier This Week",
    category: "Shipments",
    priority: "Success",
    read: true,
    link: "/clients",
  },
  {
    id: "notif-8",
    title: "Unusual Clearance Delay Detected",
    description: "Container #CN-4412 delayed at Shanghai port due to weather conditions.",
    timestamp: "Jul 17, 2026",
    timeGroup: "Earlier This Week",
    category: "Shipments",
    priority: "Medium",
    read: true,
    link: "/shipments",
  },
]
