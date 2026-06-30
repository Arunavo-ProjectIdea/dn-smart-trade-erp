export interface HSCode {
  id: string
  code: string
  name: string
  category: string
  description: string
  uom: string // Unit of Measurement
  cd: number // Customs Duty %
  vat: number // VAT %
  rd: number // Regulatory Duty %
  ait: number // AIT %
  sd: number // Supplementary Duty %
  policyNotes: string
  requiredDocuments: string[]
}

const categories = [
  "Electronics",
  "Textile",
  "Food",
  "Machinery",
  "Chemicals",
  "Medical Equipment",
  "Automobile Parts"
]

const baseData = [
  { code: "01012100", name: "Pure-bred breeding horses", catIdx: 0, uom: "Number", cd: 5, vat: 15, rd: 0, ait: 5, sd: 0 },
  { code: "10061000", name: "Rice in the husk (paddy or rough)", catIdx: 1, uom: "kg", cd: 25, vat: 15, rd: 3, ait: 5, sd: 0 },
  { code: "18069000", name: "Chocolate and other food preparations containing cocoa", catIdx: 2, uom: "kg", cd: 25, vat: 15, rd: 3, ait: 5, sd: 20 },
  { code: "27090000", name: "Petroleum oils and oils obtained from bituminous minerals, crude", catIdx: 3, uom: "Barrel", cd: 5, vat: 15, rd: 0, ait: 5, sd: 0 },
  { code: "30049099", name: "Other medicaments", catIdx: 4, uom: "kg", cd: 5, vat: 0, rd: 0, ait: 5, sd: 0 },
  { code: "39269099", name: "Other articles of plastics", catIdx: 5, uom: "kg", cd: 25, vat: 15, rd: 3, ait: 5, sd: 0 },
  { code: "61091000", name: "T-shirts, singlets and other vests, of cotton, knitted or crocheted", catIdx: 6, uom: "Number", cd: 25, vat: 15, rd: 3, ait: 5, sd: 20 },
  { code: "64039900", name: "Other footwear with outer soles of rubber, plastics, leather", catIdx: 7, uom: "Pairs", cd: 25, vat: 15, rd: 3, ait: 5, sd: 20 },
  { code: "72104990", name: "Flat-rolled products of iron or non-alloy steel, plated or coated with zinc", catIdx: 8, uom: "kg", cd: 10, vat: 15, rd: 3, ait: 5, sd: 0 },
  { code: "85171200", name: "Smartphones", catIdx: 9, uom: "Number", cd: 10, vat: 15, rd: 3, ait: 5, sd: 20 },
  { code: "87032390", name: "Motor cars and other motor vehicles (1500cc to 3000cc)", catIdx: 10, uom: "Number", cd: 25, vat: 15, rd: 3, ait: 5, sd: 200 },
  { code: "90011000", name: "Optical fibres, optical fibre bundles and cables", catIdx: 11, uom: "kg", cd: 15, vat: 15, rd: 0, ait: 5, sd: 0 },
  { code: "95030090", name: "Tricycles, scooters, pedal cars and similar wheeled toys", catIdx: 12, uom: "Number", cd: 25, vat: 15, rd: 3, ait: 5, sd: 20 }
]

export const mockHSCodes: HSCode[] = []

// Base ones
baseData.forEach((item) => {
  mockHSCodes.push({
    id: `HS-${item.code}`,
    code: item.code,
    name: item.name,
    category: categories[item.catIdx],
    description: `Specific description for ${item.name}. Regulates import controls.`,
    uom: item.uom,
    cd: item.cd,
    vat: item.vat,
    rd: item.rd,
    ait: item.ait,
    sd: item.sd,
    policyNotes: "Subject to random customs inspection. Clearance may require physical verification.",
    requiredDocuments: ["Commercial Invoice", "Packing List", "Bill of Lading", "Certificate of Origin"]
  })
})

// Generate remainder to reach 50
for (let i = mockHSCodes.length; i < 50; i++) {
  const catIdx = i % categories.length
  const codeStr = `8${i.toString().padStart(3, '0')}${(i * 10).toString().padStart(4, '0')}`
  const isHighTax = i % 4 === 0
  
  mockHSCodes.push({
    id: `HS-${codeStr}`,
    code: codeStr,
    name: `Generic Industrial Product Type ${i}`,
    category: categories[catIdx],
    description: `Standard classification for industrial product type ${i}. Used primarily in manufacturing.`,
    uom: i % 2 === 0 ? "kg" : "Number",
    cd: isHighTax ? 25 : 10,
    vat: 15,
    rd: isHighTax ? 3 : 0,
    ait: 5,
    sd: isHighTax ? 20 : 0,
    policyNotes: "Standard import policy applies. Ensure proper valuation declaration.",
    requiredDocuments: ["Commercial Invoice", "Packing List", "Bill of Lading"]
  })
}
