// 2024–25 HECS-HELP Repayment Bands
export function calculatehecsPerYear(annualIncome: number): number {
  if (annualIncome < 54435) {
    return 0;
  } else if (annualIncome <= 62850) {
    return annualIncome * 0.01;
  } else if (annualIncome <= 66620) {
    return annualIncome * 0.02;
  } else if (annualIncome <= 70618) {
    return annualIncome * 0.025;
  } else if (annualIncome <= 74855) {
    return annualIncome * 0.03;
  } else if (annualIncome <= 79346) {
    return annualIncome * 0.035;
  } else if (annualIncome <= 84107) {
    return annualIncome * 0.04;
  } else if (annualIncome <= 89154) {
    return annualIncome * 0.045;
  } else if (annualIncome <= 94503) {
    return annualIncome * 0.05;
  } else if (annualIncome <= 100174) {
    return annualIncome * 0.055;
  } else if (annualIncome <= 106185) {
    return annualIncome * 0.06;
  } else if (annualIncome <= 112556) {
    return annualIncome * 0.065;
  } else if (annualIncome <= 119309) {
    return annualIncome * 0.07;
  } else if (annualIncome <= 126467) {
    return annualIncome * 0.075;
  } else if (annualIncome <= 134056) {
    return annualIncome * 0.08;
  } else if (annualIncome <= 142100) {
    return annualIncome * 0.085;
  } else if (annualIncome <= 150626) {
    return annualIncome * 0.09;
  } else if (annualIncome <= 159663) {
    return annualIncome * 0.095;
  } else {
    return annualIncome * 0.1;
  }
}
