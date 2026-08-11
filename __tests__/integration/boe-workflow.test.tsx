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

describe("BOE Workflow Integration", () => {
  it("allows user to complete the 4-step wizard and submit", async () => {
    render(<BOEForm availableShipments={[{ id: "s1", shipmentNumber: "SHP-1", clientName: "Client A" }]} />);

    // Step 1
    fireEvent.change(screen.getByLabelText(/BOE Number/i), { target: { value: "BOE-TEST" } });
    fireEvent.click(screen.getByRole("button", { name: /Next/i }));

    // Step 2
    await waitFor(() => expect(screen.getByText("BOE Status")).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /Next/i }));

    // Step 3
    await waitFor(() => expect(screen.getByLabelText(/Import Duty/i)).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText(/Import Duty/i), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: /Next/i }));

    // Step 4
    await waitFor(() => expect(screen.getByText("Review Bill of Entry Summary")).toBeInTheDocument());
    const submitBtn = screen.getByRole("button", { name: /Submit BOE/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(createBOE).toHaveBeenCalled();
    });
  });
});
