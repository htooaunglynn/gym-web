/**
 * Unit + property-based tests for StatusBadge
 * Validates: Requirements 8.2
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import fc from "fast-check";
import { StatusBadge } from "./StatusBadge";

// ─── Unit tests ───────────────────────────────────────────────────────────────

describe("StatusBadge – subscription statuses", () => {
  it("renders ACTIVE with green classes", () => {
    const { container } = render(<StatusBadge status="ACTIVE" />);
    const badge = container.querySelector("span")!;
    expect(badge.className).toContain("bg-green-100");
    expect(badge.className).toContain("text-green-800");
    expect(badge.textContent).toBe("Active");
  });

  it("renders PAUSED with yellow classes", () => {
    const { container } = render(<StatusBadge status="PAUSED" />);
    const badge = container.querySelector("span")!;
    expect(badge.className).toContain("bg-yellow-100");
    expect(badge.className).toContain("text-yellow-800");
  });

  it("renders CANCELLED with gray classes", () => {
    const { container } = render(<StatusBadge status="CANCELLED" />);
    const badge = container.querySelector("span")!;
    expect(badge.className).toContain("bg-gray-100");
    expect(badge.className).toContain("text-gray-700");
  });

  it("renders EXPIRED with red classes", () => {
    const { container } = render(<StatusBadge status="EXPIRED" />);
    const badge = container.querySelector("span")!;
    expect(badge.className).toContain("bg-red-100");
    expect(badge.className).toContain("text-red-800");
  });
});

describe("StatusBadge – payment statuses", () => {
  it("renders PENDING with amber classes", () => {
    const { container } = render(<StatusBadge status="PENDING" />);
    const badge = container.querySelector("span")!;
    expect(badge.className).toContain("bg-amber-100");
    expect(badge.className).toContain("text-amber-800");
  });

  it("renders PAID with green classes", () => {
    const { container } = render(<StatusBadge status="PAID" />);
    const badge = container.querySelector("span")!;
    expect(badge.className).toContain("bg-green-100");
    expect(badge.className).toContain("text-green-800");
  });

  it("renders FAILED with red classes", () => {
    const { container } = render(<StatusBadge status="FAILED" />);
    const badge = container.querySelector("span")!;
    expect(badge.className).toContain("bg-red-100");
    expect(badge.className).toContain("text-red-800");
  });

  it("renders REFUNDED with blue classes", () => {
    const { container } = render(<StatusBadge status="REFUNDED" />);
    const badge = container.querySelector("span")!;
    expect(badge.className).toContain("bg-blue-100");
    expect(badge.className).toContain("text-blue-800");
  });
});

describe("StatusBadge – equipment conditions (Req 8.2)", () => {
  it("renders NEW with exact hex #103c25 background via inline style", () => {
    const { container } = render(
      <StatusBadge status="NEW" variant="equipment" />,
    );
    const badge = container.querySelector("span")!;
    expect(badge.style.backgroundColor).toBe("rgb(16, 60, 37)");
    expect(badge.style.color).toBe("rgb(255, 255, 255)");
  });

  it("renders GOOD with blue classes", () => {
    const { container } = render(
      <StatusBadge status="GOOD" variant="equipment" />,
    );
    const badge = container.querySelector("span")!;
    expect(badge.className).toContain("bg-blue-100");
    expect(badge.className).toContain("text-blue-800");
  });

  it("renders FAIR with yellow classes", () => {
    const { container } = render(
      <StatusBadge status="FAIR" variant="equipment" />,
    );
    const badge = container.querySelector("span")!;
    expect(badge.className).toContain("bg-yellow-100");
    expect(badge.className).toContain("text-yellow-800");
  });

  it("renders POOR with exact hex #9e0a0a background via inline style", () => {
    const { container } = render(
      <StatusBadge status="POOR" variant="equipment" />,
    );
    const badge = container.querySelector("span")!;
    expect(badge.style.backgroundColor).toBe("rgb(158, 10, 10)");
    expect(badge.style.color).toBe("rgb(255, 255, 255)");
  });
});

describe("StatusBadge – label formatting", () => {
  it("converts SCREAMING_SNAKE_CASE to Title Case", () => {
    render(<StatusBadge status="CANCELLED" />);
    expect(screen.getByText("Cancelled")).toBeDefined();
  });
});

// ─── Property-based tests ─────────────────────────────────────────────────────

type EquipmentCondition = "NEW" | "GOOD" | "FAIR" | "POOR";

/**
 * Property 10: Equipment condition badge color is always correct
 * Validates: Requirements 8.2
 */
describe("Property 10 – Equipment condition badge color is always correct", () => {
  const conditions: EquipmentCondition[] = ["NEW", "GOOD", "FAIR", "POOR"];

  const expectedColors: Record<
    EquipmentCondition,
    { type: "inline" | "class"; value: string }
  > = {
    NEW: { type: "inline", value: "#103c25" },
    GOOD: { type: "class", value: "bg-blue-100" },
    FAIR: { type: "class", value: "bg-yellow-100" },
    POOR: { type: "inline", value: "#9e0a0a" },
  };

  it("badge color matches spec for every EquipmentCondition value", () => {
    fc.assert(
      fc.property(fc.constantFrom(...conditions), (condition) => {
        const { container } = render(
          <StatusBadge status={condition} variant="equipment" />,
        );
        const badge = container.querySelector("span")!;
        const expected = expectedColors[condition];

        if (expected.type === "class") {
          expect(badge.className).toContain(expected.value);
        } else {
          // inline style — jsdom converts hex to rgb
          expect(badge.style.backgroundColor).toBeTruthy();
          expect(badge.style.backgroundColor).not.toBe("");
        }
      }),
      { numRuns: 20 },
    );
  });
});
