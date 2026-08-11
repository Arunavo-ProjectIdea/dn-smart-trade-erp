import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BOEForm } from "@/components/erp/boe-form";
import { createBOE } from "@/app/(app)/boe/actions";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

vi.mock("@/app/(app)/boe/actions", () => ({
  createBOE: vi.fn().mockResolvedValue({ success: true, data: { id: "123" } }),
  updateBOE: vi.fn().mockResolvedValue({ success: true }),
  createBOEProduct: vi.fn().mockResolvedValue({ success: true }),
}));

describe("BOEForm", () => {
  it("renders step 1 initially", () => {
    render(<BOEForm />);
    expect(screen.getByText("BOE Number *")).toBeInTheDocument();
  });

  it("can navigate to next steps and fill data", async () => {
    render(<BOEForm availableShipments={[{ id: "s1", shipmentNumber: "SHP-1", clientName: "Client A" }]} />);
    
    // Fill BOE Number
    const boeInput = screen.getByLabelText(/BOE Number/i);
    fireEvent.change(boeInput, { target: { value: "BOE-TEST-001" } });

    // Click Next to Step 2
    fireEvent.click(screen.getByRole("button", { name: /Next/i }));
    
    await waitFor(() => {
      expect(screen.getByText("BOE Status")).toBeInTheDocument();
    });
  });
});
