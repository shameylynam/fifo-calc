// Backpacker tax rates for 2024-2025
export function calculateBackpackerTax(annualIncome: number): number {
  let tax = 0;
  if (annualIncome <= 45000) {
    tax = annualIncome * 0.15;
  } else if (annualIncome <= 200000) {
    tax = 6750 + (annualIncome - 45000) * 0.3;
  } else {
    tax = 53250 + (annualIncome - 200000) * 0.45;
  }
  return tax;
}

// Australian tax calculation for 2024-2025 (excluding Medicare levy)
export function calculateAustralianTax(annualIncome: number): number {
  let tax = 0;
  if (annualIncome <= 18200) {
    tax = 0;
  } else if (annualIncome <= 45000) {
    tax = (annualIncome - 18200) * 0.19;
  } else if (annualIncome <= 120000) {
    tax = 5092 + (annualIncome - 45000) * 0.325;
  } else if (annualIncome <= 180000) {
    tax = 29467 + (annualIncome - 120000) * 0.37;
  } else {
    tax = 51667 + (annualIncome - 180000) * 0.45;
  }
  return tax;
}
