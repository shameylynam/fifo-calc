import type { JobResults } from "@/types/fifo.types";
import {
  calculateBackpackerTax,
  calculateAustralianTax,
} from "./tax-calculator";
import { calculatehecsPerYear } from "./hecs-calculations";
import {
  AVERAGE_DAYS_PER_MONTH,
  AVERAGE_DAYS_PER_YEAR,
  HOURS_PER_DAY,
  MONTHS_PER_YEAR,
} from "@/constants/fifo.constants";

// Helper for superannuation calculations
function calculateSuperannuation(
  annualPay: number,
  cyclesPerYear: number,
  superannuation?: boolean,
  superRate?: number,
) {
  let superPerYear = 0;
  let superPerMonth = 0;
  let superPerSwing = 0;
  let superRateValue = 0;
  if (superannuation && superRate && superRate > 0) {
    superPerYear = annualPay * (superRate / 100);
    superPerMonth = superPerYear / MONTHS_PER_YEAR;
    superPerSwing = superPerYear / cyclesPerYear;
    superRateValue = superRate;
  }
  return {
    superPerYear,
    superPerMonth,
    superPerSwing,
    superRateValue,
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
    superRateValue?: number;
  },
) {
  return {
    ...base,
    superPerYear: base.superPerYear || undefined,
    superPerMonth: base.superPerMonth || undefined,
    superPerSwing: base.superPerSwing || undefined,
    superRate: base.superRateValue || undefined,
  };
}

// Helper function to calculate swing cycle metrics
function calculateSwingCycleMetrics(daysOn: number, daysOff: number) {
  const swingCycleLength = daysOn + daysOff;
  const cyclesPerMonth = AVERAGE_DAYS_PER_MONTH / swingCycleLength;
  const cyclesPerYear = AVERAGE_DAYS_PER_YEAR / swingCycleLength;
  const workingDaysPerMonth = cyclesPerMonth * daysOn;

  return {
    swingCycleLength,
    cyclesPerMonth,
    cyclesPerYear,
    workingDaysPerMonth,
  };
}

export function calculateHourlyResults(
  hourlypay: number,
  daysOn: number,
  daysOff: number,
  backpacker: boolean,
  superannuation?: boolean,
  superRate?: number,
  superHoursPerDay?: number,
  hecsDebt?: boolean,
): JobResults | null {
  if (daysOn < 1 || daysOff < 1) return null;

  const { cyclesPerMonth, cyclesPerYear, workingDaysPerMonth } =
    calculateSwingCycleMetrics(daysOn, daysOff);

  const hoursPerDayForSuper =
    superHoursPerDay && superHoursPerDay > 0 ? superHoursPerDay : 8;
  const dailyPay = hourlypay * HOURS_PER_DAY;
  const swingCyclePay = daysOn * dailyPay;
  const annualPay = swingCyclePay * cyclesPerYear;

  // Calculate super only on specified hours per day (default 8, max 12)
  const superAnnualBase =
    hourlypay * hoursPerDayForSuper * daysOn * cyclesPerYear;
  const annualTax = backpacker
    ? calculateBackpackerTax(annualPay)
    : calculateAustralianTax(annualPay);
  let totalAnnualTax = 0;
  let medicareLevy = 0;
  if (backpacker) {
    totalAnnualTax = annualTax;
  } else {
    medicareLevy = annualPay * 0.02;
    totalAnnualTax = annualTax + medicareLevy;
  }
  let hecsPerYear = 0;
  if (hecsDebt) {
    hecsPerYear = calculatehecsPerYear(annualPay);
  }
  const netAnnualPay = annualPay - totalAnnualTax - hecsPerYear;
  const netMonthlyPay = netAnnualPay / MONTHS_PER_YEAR;
  const grossMonthlyPay = annualPay / MONTHS_PER_YEAR;
  const swingTax = totalAnnualTax / cyclesPerYear;
  const hecsPerSwing = hecsPerYear / cyclesPerYear;
  const netPayPerSwingCycle = swingCyclePay - swingTax - hecsPerSwing;

  const superData = calculateSuperannuation(
    superAnnualBase,
    cyclesPerYear,
    superannuation,
    superRate,
  );

  return formatJobResults({
    swing: `${daysOn}/${daysOff}`,
    grossSwing: swingCyclePay,
    netSwing: netPayPerSwingCycle,
    grossMonth: grossMonthlyPay,
    netMonth: netMonthlyPay,
    grossYear: annualPay,
    netYear: netAnnualPay,
    annualTax: totalAnnualTax,
    medicareLevy: medicareLevy,
    hecsPerYear: hecsPerYear || undefined,
    hecsPerSwing: hecsPerSwing || undefined,
    cyclesPerYear: cyclesPerYear,
    cyclesPerMonth: cyclesPerMonth,
    workingDaysPerMonth: workingDaysPerMonth,
    ...superData,
  });
}

export function calculateSalaryResults(
  salary: number,
  daysOn: number,
  daysOff: number,
  backpacker: boolean,
  superannuation?: boolean,
  superRate?: number,
  hecsDebt?: boolean,
): JobResults | null {
  if (daysOn < 1 || daysOff < 1) return null;

  const { cyclesPerMonth, cyclesPerYear, workingDaysPerMonth } =
    calculateSwingCycleMetrics(daysOn, daysOff);

  const annualPay = salary;
  const annualTax = backpacker
    ? calculateBackpackerTax(annualPay)
    : calculateAustralianTax(annualPay);
  let totalAnnualTax = 0;
  let medicareLevy = 0;
  if (backpacker) {
    totalAnnualTax = annualTax;
  } else {
    medicareLevy = annualPay * 0.02;
    totalAnnualTax = annualTax + medicareLevy;
  }

  let hecsPerYear = 0;
  if (hecsDebt) {
    hecsPerYear = calculatehecsPerYear(annualPay);
  }
  const netAnnualPay = annualPay - totalAnnualTax - hecsPerYear;
  const grossMonthlyPay = annualPay / MONTHS_PER_YEAR;
  const netMonthlyPay = netAnnualPay / MONTHS_PER_YEAR;
  const swingCyclePay = annualPay / cyclesPerYear;
  const swingTax = totalAnnualTax / cyclesPerYear;
  const hecsPerSwing = hecsPerYear / cyclesPerYear;
  const netPayPerSwingCycle = swingCyclePay - swingTax - hecsPerSwing;
  const hoursPerYear = daysOn * HOURS_PER_DAY * cyclesPerYear;
  const estimatedHourly = annualPay / hoursPerYear;

  const superData = calculateSuperannuation(
    annualPay,
    cyclesPerYear,
    superannuation,
    superRate,
  );

  return formatJobResults({
    swing: `${daysOn}/${daysOff}`,
    grossSwing: swingCyclePay,
    netSwing: netPayPerSwingCycle,
    grossMonth: grossMonthlyPay,
    netMonth: netMonthlyPay,
    grossYear: annualPay,
    netYear: netAnnualPay,
    annualTax: totalAnnualTax,
    medicareLevy: medicareLevy,
    hecsPerYear: hecsPerYear || undefined,
    hecsPerSwing: hecsPerSwing || undefined,
    cyclesPerYear: cyclesPerYear,
    cyclesPerMonth: cyclesPerMonth,
    workingDaysPerMonth: workingDaysPerMonth,
    estimatedHourly: estimatedHourly,
    ...superData,
  });
}
