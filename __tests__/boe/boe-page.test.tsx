import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BOEListPage from "@/app/(app)/boe/page";

// Mocks
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

vi.mock("@/actions/auth.actions", () => ({
  getUserProfile: vi.fn().mockResolvedValue({ success: true, data: { role: "Admin" } }),
}));

vi.mock("@/app/(app)/boe/actions", () => ({
  getBOEs: vi.fn().mockResolvedValue({ data: [] }),
  deleteBOE: vi.fn().mockResolvedValue({ success: true }),
}));

describe("BOEListPage", () => {
  it("renders the BOE list page correctly", async () => {
    render(<BOEListPage />);
    await waitFor(() => {
      expect(screen.getByText("Recent BOE Documents")).toBeInTheDocument();
    });
  });
});
