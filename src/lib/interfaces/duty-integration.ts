import { HSCode } from "../mock-data/hs-codes"

export interface CalculationInput {
  hsCodeId: string
  assessableValue: number
  quantity: number
  currency: "BDT" | "USD"
  exchangeRate: number
}

export interface DutyCalculationResult {
  input: CalculationInput
  hsCode: HSCode
  baseValueBDT: number
  customsDutyAmount: number
  supplementaryDutyAmount: number
  vatAmount: number
  aitAmount: number
  regulatoryDutyAmount: number
  totalTaxAmount: number
  grandTotalAmount: number
}

/**
 * Future interface for the BOE (Bill of Entry) module.
 * The BOE module can accept this payload to auto-fill tax declarations.
 */
export interface BOEIntegrationPayload {
  shipmentId: string
  calculationResult: DutyCalculationResult
  generatedAt: string
}

/**
 * Future interface for the AI Assistant module.
 * The AI Assistant can use this to explain tax breakdowns or suggest alternative codes.
 */
export interface AIAssistantContextPayload {
  contextType: "DUTY_CALCULATION" | "HS_CODE_LOOKUP"
  hsCode: HSCode
  calculationResult?: DutyCalculationResult
}
