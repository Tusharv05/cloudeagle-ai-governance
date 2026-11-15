export function hasCompanyCapMismatch(companyCap: number, departmentLimitTotal: number) {
  return companyCap !== departmentLimitTotal;
}

export function validateDepartmentLimit(
  monthlyLimit: number,
  ownerSelected: boolean,
  thresholds: number[],
) {
  if (!Number.isFinite(monthlyLimit) || monthlyLimit <= 0) return "Monthly limit must be greater than zero.";
  if (!ownerSelected) return "Select a department owner.";
  if (thresholds.some((value, index) => index > 0 && value <= (thresholds[index - 1] ?? value))) {
    return "Alert thresholds must be in ascending order.";
  }
  return null;
}