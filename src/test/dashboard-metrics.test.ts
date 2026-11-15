import { describe, expect, it } from "vitest";

import { hasCompanyCapMismatch, validateDepartmentLimit } from "@/lib/dashboard-metrics";

describe("company cap and department limits", () => {
  it("flags a mismatch while keeping the company cap separate", () => {
    expect(hasCompanyCapMismatch(50_000, 55_000)).toBe(true);
    expect(hasCompanyCapMismatch(55_000, 55_000)).toBe(false);
  });

  it("rejects a zero monthly department limit", () => {
    expect(validateDepartmentLimit(0, true, [80, 100])).toBe("Monthly limit must be greater than zero.");
  });

  it("requires thresholds in ascending order", () => {
    expect(validateDepartmentLimit(10_000, true, [100, 80])).toBe("Alert thresholds must be in ascending order.");
    expect(validateDepartmentLimit(10_000, true, [80, 100])).toBeNull();
  });
});