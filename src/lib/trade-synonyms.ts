export interface TradeSynonymCategory {
  category: string
  synonyms: Record<string, string>
}

export const TRADE_SYNONYM_CATEGORIES: Record<string, Record<string, string>> = {
  Electronics: {
    laptop: "portable automatic data processing machines",
    macbook: "portable automatic data processing machines",
    computer: "automatic data processing machines",
    mobile: "telephones for cellular networks",
    smartphone: "telephones for cellular networks",
    iphone: "telephones for cellular networks",
    led: "light-emitting diode (LED) light sources",
    display: "monitors and projectors",
    semiconductor: "diodes, transistors and similar semiconductor devices",
  },
  Textile: {
    tshirt: "t-shirts, singlets and other vests, knitted or crocheted",
    shirt: "t-shirts, singlets and other vests, knitted or crocheted",
    "cotton shirt": "shirts of cotton",
    denim: "woven fabrics of cotton, containing 85% or more by weight of cotton",
    "woven fabric": "woven fabrics of synthetic staple fibres",
    yarn: "yarn of synthetic staple fibres",
    garments: "garments, knitted or crocheted",
    polyester: "polyester staple fibres",
  },
  Plastic: {
    "plastic bottle": "carboys, bottles, flasks and similar articles of plastics",
    polymers: "polymers of ethylene, in primary forms",
    pvc: "polymers of vinyl chloride, in primary forms",
    "packaging film": "self-adhesive plates, sheets, film, foil, tape, strip",
    polyethylene: "polyethylene in primary forms",
    acrylic: "acrylic polymers in primary forms",
  },
  Steel: {
    "steel pipe": "tubes, pipes and hollow profiles, of iron or steel",
    "iron rod": "bars and rods, of iron or non-alloy steel",
    "stainless steel": "flat-rolled products of stainless steel",
    wire: "wire of iron or non-alloy steel",
    rebar: "bars and rods of iron or non-alloy steel, hot-rolled",
    "sheet metal": "flat-rolled products of iron or non-alloy steel",
  },
  Agriculture: {
    wheat: "wheat and meslin",
    rice: "rice in the husk (paddy or rough)",
    fertilizer: "mineral or chemical fertilisers",
    seeds: "seeds, fruit and spores, of a kind used for sowing",
    "raw cotton": "cotton, not carded or combed",
    tobacco: "unmanufactured tobacco; tobacco refuse",
  },
  Food: {
    "palm oil": "palm oil and its fractions, whether or not refined",
    "refined sugar": "cane or beet sugar and chemically pure sucrose",
    spices: "pepper of the genus piper; dried or crushed or ground",
    dairy: "milk and cream, concentrated or containing added sugar",
    "powdered milk": "milk and cream in powder, granules or other solid forms",
    cocoa: "cocoa beans, whole or broken, raw or roasted",
  },
  Medical: {
    syringe: "syringes, needles, catheters, cannulae and the like",
    vaccine: "vaccines, toxins, cultures of micro-organisms",
    pharmaceutical: "medicaments consisting of mixed or unmixed products for therapeutic uses",
    "surgical glove": "articles of apparel and clothing accessories, for all purposes, of vulcanised rubber",
    antibiotics: "antibiotics",
    stethoscope: "instruments and appliances used in medical, surgical, dental or veterinary sciences",
  },
  Machinery: {
    generator: "electric generating sets and rotary converters",
    "electric motor": "electric motors and generators",
    "water pump": "pumps for liquids, whether or not fitted with a measuring device",
    "hydraulic press": "presses for working metal or metal carbides",
    crane: "derricks; cranes, including cable cranes",
    compressor: "air or vacuum pumps, air or other gas compressors and fans",
  },
  Automobile: {
    "electric car": "motor vehicles for the transport of ten or more persons",
    motorcycle: "motorcycles (including mopeds) and cycles fitted with an auxiliary motor",
    tyres: "new pneumatic tyres, of rubber",
    "brake pads": "brakes and servo-brakes; parts thereof",
    chassis: "chassis fitted with engines, for motor vehicles",
    "ev battery": "electric accumulators, including separators therefor",
  },
  Chemical: {
    "caustic soda": "sodium hydroxide (caustic soda)",
    "sulfuric acid": "sulphuric acid; oleum",
    solvents: "organic composite solvents and thinners",
    dyes: "synthetic organic colouring matter",
    resins: "synthetic resins",
    pesticides: "insecticides, rodenticides, fungicides, herbicides",
  },
}

export function expandTradeSynonym(query: string): {
  searchTerm: string
  matchedKeyword?: string
  matchedCategory?: string
} {
  const normalized = query.trim().toLowerCase()

  for (const [categoryName, synonyms] of Object.entries(TRADE_SYNONYM_CATEGORIES)) {
    for (const [key, expansion] of Object.entries(synonyms)) {
      if (normalized.includes(key)) {
        return {
          searchTerm: expansion,
          matchedKeyword: key,
          matchedCategory: categoryName,
        }
      }
    }
  }

  return { searchTerm: query }
}
