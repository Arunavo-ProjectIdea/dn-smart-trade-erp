import { z } from "zod"

export const boeStatusEnum = z.enum([
  "Draft",
  "Submitted",
  "Under Review",
  "Approved",
  "Rejected",
  "Completed"
])

export const createBOESchema = z.object({
  boeNumber: z.string().min(1, "BOE Number is required").trim(),
  shipmentId: z.string().min(1, "Shipment is required").uuid("Invalid Shipment ID"),
  status: boeStatusEnum.default("Draft"),
  notes: z.string().optional().nullable(),
  importDuty: z.coerce.number().min(0, "Import Duty must be positive").default(0),
  vat: z.coerce.number().min(0, "VAT must be positive").default(0),
  ait: z.coerce.number().min(0, "AIT must be positive").default(0),
  at: z.coerce.number().min(0, "AT must be positive").default(0),
  otherCharges: z.coerce.number().min(0, "Other charges must be positive").default(0),
  grandTotal: z.coerce.number().min(0, "Grand Total must be positive").default(0),
})

export const updateBOESchema = z.object({
  boeNumber: z.string().min(1, "BOE Number is required").trim().optional(),
  status: boeStatusEnum.optional(),
  notes: z.string().optional().nullable(),
  importDuty: z.coerce.number().min(0).optional(),
  vat: z.coerce.number().min(0).optional(),
  ait: z.coerce.number().min(0).optional(),
  at: z.coerce.number().min(0).optional(),
  otherCharges: z.coerce.number().min(0).optional(),
  grandTotal: z.coerce.number().min(0).optional(),
})

export const createBOEProductSchema = z.object({
  boeId: z.string().min(1, "BOE ID is required").uuid("Invalid BOE ID"),
  productName: z.string().min(1, "Product Name is required").trim(),
  hsCode: z.string().optional().nullable(),
  quantity: z.coerce.number().gt(0, "Quantity must be greater than 0"),
  unit: z.string().min(1, "Unit is required").trim().default("Pieces"),
  declaredValue: z.coerce.number().gt(0, "Declared Value must be greater than 0"),
  currency: z.string().min(1, "Currency is required").default("USD"),
})

export const updateBOEProductSchema = z.object({
  productName: z.string().min(1, "Product Name is required").trim().optional(),
  hsCode: z.string().optional().nullable(),
  quantity: z.coerce.number().gt(0, "Quantity must be greater than 0").optional(),
  unit: z.string().min(1, "Unit is required").trim().optional(),
  declaredValue: z.coerce.number().gt(0, "Declared Value must be greater than 0").optional(),
  currency: z.string().min(1, "Currency is required").optional(),
})

export type CreateBOEInput = z.infer<typeof createBOESchema>
export type UpdateBOEInput = z.infer<typeof updateBOESchema>
export type CreateBOEProductInput = z.infer<typeof createBOEProductSchema>
export type UpdateBOEProductInput = z.infer<typeof updateBOEProductSchema>
