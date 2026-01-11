import type { JobResults, FifoSwing } from "@/types/fifo.types";
import {
  calculateBackpackerTax,
  calculateAustralianTax,
} from "./tax-calculator";
import { calculatehecsPerYear } from "./hecs-calculations";
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
  let hecsPerYear = 0;
  if (hecsDebt) {
    hecsPerYear = calculatehecsPerYear(annualPay);
  }
  const netAnnualPay = annualPay - annualTax - hecsPerYear;
  const netMonthlyPay = netAnnualPay / MONTHS_PER_YEAR;
  const grossMonthlyPay = annualPay / MONTHS_PER_YEAR;
  const swingTax = annualTax / cyclesPerYear;
  const hecsPerSwing = hecsPerYear / cyclesPerYear;
  const netPayPerSwingCycle = swingCyclePay - swingTax - hecsPerSwing;

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
    hecsPerYear: hecsPerYear ? currency.format(hecsPerYear) : undefined,
    hecsPerSwing: hecsPerSwing ? currency.format(hecsPerSwing) : undefined,
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
  let hecsPerYear = 0;
  if (hecsDebt) {
    hecsPerYear = calculatehecsPerYear(annualPay);
  }
  const netAnnualPay = annualPay - annualTax - hecsPerYear;
  const grossMonthlyPay = annualPay / MONTHS_PER_YEAR;
  const netMonthlyPay = netAnnualPay / MONTHS_PER_YEAR;
  const swingCyclePay = annualPay / cyclesPerYear;
  const swingTax = annualTax / cyclesPerYear;
  const hecsPerSwing = hecsPerYear / cyclesPerYear;
  const netPayPerSwingCycle = swingCyclePay - swingTax - hecsPerSwing;
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
    hecsPerYear: hecsPerYear ? currency.format(hecsPerYear) : undefined,
    hecsPerSwing: hecsPerSwing ? currency.format(hecsPerSwing) : undefined,
    cyclesPerYear: number.format(cyclesPerYear),
    cyclesPerMonth: number.format(cyclesPerMonth),
    workingDaysPerMonth: number.format(workingDaysPerMonth),
    estimatedHourly: currency.format(estimatedHourly),
    ...superData,
  });
}
