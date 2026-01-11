// 2024–25 HECS-HELP Repayment Bands
function calculateHecsRepayment(annualIncome: number): number {
  if (annualIncome < 54435) return 0;
  if (annualIncome <= 62850) return annualIncome * 0.01;
  if (annualIncome <= 66620) return annualIncome * 0.02;
  if (annualIncome <= 70618) return annualIncome * 0.025;
  if (annualIncome <= 74855) return annualIncome * 0.03;
  if (annualIncome <= 79346) return annualIncome * 0.035;
  if (annualIncome <= 84107) return annualIncome * 0.04;
  if (annualIncome <= 89154) return annualIncome * 0.045;
  if (annualIncome <= 94503) return annualIncome * 0.05;
  if (annualIncome <= 100174) return annualIncome * 0.055;
  if (annualIncome <= 106185) return annualIncome * 0.06;
  if (annualIncome <= 112556) return annualIncome * 0.065;
  if (annualIncome <= 119309) return annualIncome * 0.07;
  if (annualIncome <= 126467) return annualIncome * 0.075;
  if (annualIncome <= 134056) return annualIncome * 0.08;
  if (annualIncome <= 142100) return annualIncome * 0.085;
  if (annualIncome <= 150626) return annualIncome * 0.09;
  if (annualIncome <= 159663) return annualIncome * 0.095;
  return annualIncome * 0.1;
}
import type { JobResults, FifoSwing } from "@/types/fifo.types";
import {
  calculateBackpackerTax,
  calculateAustralianTax,
} from "./tax-calculator";
import {
  fifoSwingOptions,
  AVERAGE_DAYS_PER_MONTH,
  AVERAGE_DAYS_PER_YEAR,
  HOURS_PER_DAY,
  MONTHS_PER_YEAR,
} from "@/constants/fifo.constants";

// Helper function to create formatters
function createFormatters() {
  const currency = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  });
  const number = new Intl.NumberFormat("en-AU", { maximumFractionDigits: 2 });
  return { currency, number };
}

// Helper for superannuation calculations
function calculateSuperannuation(
  annualPay: number,
  cyclesPerYear: number,
  superannuation?: boolean,
  superRate?: number
) {
  let superPerYear = 0;
  let superPerMonth = 0;
  let superPerSwing = 0;
  let superRateDisplay = "";
  if (superannuation && superRate && superRate > 0) {
    superPerYear = annualPay * (superRate / 100);
    superPerMonth = superPerYear / MONTHS_PER_YEAR;
    superPerSwing = superPerYear / cyclesPerYear;
    const { number } = createFormatters();
    superRateDisplay = number.format(superRate) + "%";
  }
  return {
    superPerYear,
    superPerMonth,
    superPerSwing,
    superRateDisplay,
  };
}

// Helper for formatting JobResults
function formatJobResults(
  base: Omit<
    JobResults,
    "superPerYear" | "superPerMonth" | "superPerSwing" | "superRate"
  > & {
    superPerYear?: number;
    superPerMonth?: number;
    superPerSwing?: number;
    superRateDisplay?: string;
  }
) {
  const { currency } = createFormatters();
  return {
    ...base,
    superPerYear: base.superPerYear
      ? currency.format(base.superPerYear)
      : undefined,
    superPerMonth: base.superPerMonth
      ? currency.format(base.superPerMonth)
      : undefined,
    superPerSwing: base.superPerSwing
      ? currency.format(base.superPerSwing)
      : undefined,
    superRate: base.superRateDisplay || undefined,
  };
}

// Helper function to calculate swing cycle metrics
function calculateSwingCycleMetrics(selectedFifoSwing: FifoSwing) {
  const swingCycleLength = selectedFifoSwing.daysOn + selectedFifoSwing.daysOff;
  const cyclesPerMonth = AVERAGE_DAYS_PER_MONTH / swingCycleLength;
  const cyclesPerYear = AVERAGE_DAYS_PER_YEAR / swingCycleLength;
  const workingDaysPerMonth = cyclesPerMonth * selectedFifoSwing.daysOn;

  return {
    swingCycleLength,
    cyclesPerMonth,
    cyclesPerYear,
    workingDaysPerMonth,
  };
}

export function calculateHourlyResults(
  hourlypay: number,
  swingName: string,
  backpacker: boolean,
  superannuation?: boolean,
  superRate?: number,
  superHoursPerDay?: number,
  hecsDebt?: boolean
): JobResults | null {
  const selectedFifoSwing = fifoSwingOptions.find((s) => s.name === swingName);
  if (!selectedFifoSwing) return null;

  const { cyclesPerMonth, cyclesPerYear, workingDaysPerMonth } =
    calculateSwingCycleMetrics(selectedFifoSwing);
  const { currency, number } = createFormatters();

  const hoursPerDayForSuper =
    superHoursPerDay && superHoursPerDay > 0 ? superHoursPerDay : 8;
  const dailyPay = hourlypay * HOURS_PER_DAY;
  const swingCyclePay = selectedFifoSwing.daysOn * dailyPay;
  const annualPay = swingCyclePay * cyclesPerYear;

  // Calculate super only on specified hours per day (default 8, max 12)
  const superAnnualBase =
    hourlypay * hoursPerDayForSuper * selectedFifoSwing.daysOn * cyclesPerYear;
  const annualTax = backpacker
    ? calculateBackpackerTax(annualPay)
    : calculateAustralianTax(annualPay);
  let hecsRepayment = 0;
  if (hecsDebt) {
    hecsRepayment = calculateHecsRepayment(annualPay);
  }
  const netAnnualPay = annualPay - annualTax - hecsRepayment;
  const netMonthlyPay = netAnnualPay / MONTHS_PER_YEAR;
  const grossMonthlyPay = annualPay / MONTHS_PER_YEAR;
  const swingTax = annualTax / cyclesPerYear;
  const swingHecs = hecsRepayment / cyclesPerYear;
  const netPayPerSwingCycle = swingCyclePay - swingTax - swingHecs;

  const superData = calculateSuperannuation(
    superAnnualBase,
    cyclesPerYear,
    superannuation,
    superRate
  );

  return formatJobResults({
    swing: selectedFifoSwing.name,
    grossSwing: currency.format(swingCyclePay),
    netSwing: currency.format(netPayPerSwingCycle),
    grossMonth: currency.format(grossMonthlyPay),
    netMonth: currency.format(netMonthlyPay),
    grossYear: currency.format(annualPay),
    netYear: currency.format(netAnnualPay),
    annualTax: currency.format(annualTax),
    hecsRepayment: hecsRepayment ? currency.format(hecsRepayment) : undefined,
    cyclesPerYear: number.format(cyclesPerYear),
    cyclesPerMonth: number.format(cyclesPerMonth),
    workingDaysPerMonth: number.format(workingDaysPerMonth),
    ...superData,
  });
}

export function calculateSalaryResults(
  salary: number,
  swingName: string,
  backpacker: boolean,
  superannuation?: boolean,
  superRate?: number,
  hecsDebt?: boolean
): JobResults | null {
  const selectedFifoSwing = fifoSwingOptions.find((s) => s.name === swingName);
  if (!selectedFifoSwing) return null;

  const { cyclesPerMonth, cyclesPerYear, workingDaysPerMonth } =
    calculateSwingCycleMetrics(selectedFifoSwing);
  const { currency, number } = createFormatters();

  const annualPay = salary;
  const annualTax = backpacker
    ? calculateBackpackerTax(annualPay)
    : calculateAustralianTax(annualPay);
  let hecsRepayment = 0;
  if (hecsDebt) {
    hecsRepayment = calculateHecsRepayment(annualPay);
  }
  const netAnnualPay = annualPay - annualTax - hecsRepayment;
  const grossMonthlyPay = annualPay / MONTHS_PER_YEAR;
  const netMonthlyPay = netAnnualPay / MONTHS_PER_YEAR;
  const swingCyclePay = annualPay / cyclesPerYear;
  const swingTax = annualTax / cyclesPerYear;
  const swingHecs = hecsRepayment / cyclesPerYear;
  const netPayPerSwingCycle = swingCyclePay - swingTax - swingHecs;
  const hoursPerYear = selectedFifoSwing.daysOn * HOURS_PER_DAY * cyclesPerYear;
  const estimatedHourly = annualPay / hoursPerYear;

  const superData = calculateSuperannuation(
    annualPay,
    cyclesPerYear,
    superannuation,
    superRate
  );

  return formatJobResults({
    swing: selectedFifoSwing.name,
    grossSwing: currency.format(swingCyclePay),
    netSwing: currency.format(netPayPerSwingCycle),
    grossMonth: currency.format(grossMonthlyPay),
    netMonth: currency.format(netMonthlyPay),
    grossYear: currency.format(annualPay),
    netYear: currency.format(netAnnualPay),
    annualTax: currency.format(annualTax),
    hecsRepayment: hecsRepayment ? currency.format(hecsRepayment) : undefined,
    cyclesPerYear: number.format(cyclesPerYear),
    cyclesPerMonth: number.format(cyclesPerMonth),
    workingDaysPerMonth: number.format(workingDaysPerMonth),
    estimatedHourly: currency.format(estimatedHourly),
    ...superData,
  });
}
