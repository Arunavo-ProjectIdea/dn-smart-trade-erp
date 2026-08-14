import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DutyCalculatorPage from "@/app/(app)/duty-calculator/page";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/actions/hs-codes.actions", () => ({
  getHSCodes: vi.fn().mockResolvedValue({ data: [] }),
}));

vi.mock("@/actions/hs-code-ai.actions", () => ({
  findHSCodesWithAI: vi.fn().mockResolvedValue({ candidates: [] }),
}));

describe("DutyCalculatorPage", () => {
  it("renders the duty calculator page", async () => {
    render(<DutyCalculatorPage />);
    await waitFor(() => {
      expect(screen.getByText("Customs Duty & Tariff Calculator")).toBeInTheDocument();
    });
  });
});
