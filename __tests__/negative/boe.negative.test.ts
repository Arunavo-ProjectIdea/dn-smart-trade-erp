import { describe, it, expect } from "vitest"
import { createBOESchema, createBOEProductSchema } from "../../src/app/(app)/boe/schema"

describe("BOE Schema Negative Tests", () => {
  it("should reject negative financial values for createBOESchema", () => {
    const invalidBOE = {
      boeNumber: "BOE-123",
      shipmentId: "123e4567-e89b-12d3-a456-426614174000",
      importDuty: -100, // Invalid
      vat: -50,         // Invalid
      ait: -10,         // Invalid
      at: -5,           // Invalid
      otherCharges: -20,// Invalid
      grandTotal: -185  // Invalid
    }

    const result = createBOESchema.safeParse(invalidBOE)
    expect(result.success).toBe(false)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      expect(errors.importDuty).toContain("Import Duty must be positive")
      expect(errors.vat).toContain("VAT must be positive")
      expect(errors.ait).toContain("AIT must be positive")
      expect(errors.at).toContain("AT must be positive")
      expect(errors.otherCharges).toContain("Other charges must be positive")
      expect(errors.grandTotal).toContain("Grand Total must be positive")
    }
  })

  it("should reject missing required fields for createBOESchema", () => {
    const invalidBOE = {
      importDuty: 100
      // Missing boeNumber and shipmentId
    }

    const result = createBOESchema.safeParse(invalidBOE)
    expect(result.success).toBe(false)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      expect(errors.boeNumber).toBeDefined()
      expect(errors.shipmentId).toBeDefined()
    }
  })

  it("should reject invalid UUID for shipmentId", () => {
    const invalidBOE = {
      boeNumber: "BOE-123",
      shipmentId: "not-a-uuid", // Invalid UUID
    }

    const result = createBOESchema.safeParse(invalidBOE)
    expect(result.success).toBe(false)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      expect(errors.shipmentId).toContain("Invalid Shipment ID")
    }
  })

  it("should reject zero or negative quantities and declared values in createBOEProductSchema", () => {
    const invalidProduct = {
      boeId: "123e4567-e89b-12d3-a456-426614174000",
      productName: "Laptop",
      quantity: 0, // Invalid (must be > 0)
      declaredValue: -500 // Invalid (must be > 0)
    }

    const result = createBOEProductSchema.safeParse(invalidProduct)
    expect(result.success).toBe(false)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      expect(errors.quantity).toContain("Quantity must be greater than 0")
      expect(errors.declaredValue).toContain("Declared Value must be greater than 0")
    }
  })

  it("should reject empty string for product name", () => {
    const invalidProduct = {
      boeId: "123e4567-e89b-12d3-a456-426614174000",
      productName: "", // Invalid
      quantity: 10,
      declaredValue: 500
    }

    const result = createBOEProductSchema.safeParse(invalidProduct)
    expect(result.success).toBe(false)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      expect(errors.productName).toContain("Product Name is required")
    }
  })
})
