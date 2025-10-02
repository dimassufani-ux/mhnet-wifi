import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/lib/auth-context";

vi.mock("@/lib/queryClient", () => ({
  apiRequest: vi.fn(),
}));

describe("Auth Context", () => {
  it("should provide auth context", () => {
    function TestComponent() {
      const { user, isLoading } = useAuth();
      return <div>{isLoading ? "Loading" : user ? user.name : "Not logged in"}</div>;
    }

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText(/Loading|Not logged in/)).toBeInTheDocument();
  });
});
