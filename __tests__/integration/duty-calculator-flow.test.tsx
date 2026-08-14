import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DutyCalculatorPage from "@/app/(app)/duty-calculator/page";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/actions/hs-codes.actions", () => ({
  getHSCodes: vi.fn().mockResolvedValue({
    data: [
      { id: "1", hscode: "101010", tariff_description: "Test Item", cd: 10, sd: 0, vat: 15, ait: 5, rd: 0 }
    ],
  }),
}));

vi.mock("@/actions/hs-code-ai.actions", () => ({
  findHSCodesWithAI: vi.fn().mockResolvedValue({ candidates: [] }),
}));

describe("Duty Calculator Flow Integration", () => {
  it("calculates duties upon user input", async () => {
    render(<DutyCalculatorPage />);

    await waitFor(() => {
      expect(screen.queryByText("Loading calculator...")).not.toBeInTheDocument();
    });

    const assessableInput = await screen.findByLabelText(/Assessable Value/i);
    fireEvent.change(assessableInput, { target: { value: "1000" } });

    const qtyInput = await screen.findByLabelText(/Quantity/i);
    fireEvent.change(qtyInput, { target: { value: "2" } });

    expect(assessableInput).toHaveValue(1000);
    expect(qtyInput).toHaveValue(2);
  });
});
