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
  backpacker: boolean
): JobResults | null {
  const selectedFifoSwing = fifoSwingOptions.find((s) => s.name === swingName);
  if (!selectedFifoSwing) return null;

  const { cyclesPerMonth, cyclesPerYear, workingDaysPerMonth } =
    calculateSwingCycleMetrics(selectedFifoSwing);
  const { currency, number } = createFormatters();

  const dailyPay = hourlypay * HOURS_PER_DAY;
  const swingCyclePay = selectedFifoSwing.daysOn * dailyPay;
  const annualPay = swingCyclePay * cyclesPerYear;
  const annualTax = backpacker
    ? calculateBackpackerTax(annualPay)
    : calculateAustralianTax(annualPay);
  const netAnnualPay = annualPay - annualTax;
  const netMonthlyPay = netAnnualPay / MONTHS_PER_YEAR;
  const grossMonthlyPay = annualPay / MONTHS_PER_YEAR;
  const swingTax = annualTax / cyclesPerYear;
  const netPayPerSwingCycle = swingCyclePay - swingTax;

  return {
    swing: selectedFifoSwing.name,
    grossSwing: currency.format(swingCyclePay),
    netSwing: currency.format(netPayPerSwingCycle),
    grossMonth: currency.format(grossMonthlyPay),
    netMonth: currency.format(netMonthlyPay),
    grossYear: currency.format(annualPay),
    netYear: currency.format(netAnnualPay),
    annualTax: currency.format(annualTax),
    cyclesPerYear: number.format(cyclesPerYear),
    cyclesPerMonth: number.format(cyclesPerMonth),
    workingDaysPerMonth: number.format(workingDaysPerMonth),
  };
}

export function calculateSalaryResults(
  salary: number,
  swingName: string,
  backpacker: boolean
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
  const netAnnualPay = annualPay - annualTax;
  const grossMonthlyPay = annualPay / MONTHS_PER_YEAR;
  const netMonthlyPay = netAnnualPay / MONTHS_PER_YEAR;
  const swingCyclePay = annualPay / cyclesPerYear;
  const swingTax = annualTax / cyclesPerYear;
  const netPayPerSwingCycle = swingCyclePay - swingTax;
  const hoursPerYear = selectedFifoSwing.daysOn * HOURS_PER_DAY * cyclesPerYear;
  const estimatedHourly = annualPay / hoursPerYear;

  return {
    swing: selectedFifoSwing.name,
    grossSwing: currency.format(swingCyclePay),
    netSwing: currency.format(netPayPerSwingCycle),
    grossMonth: currency.format(grossMonthlyPay),
    netMonth: currency.format(netMonthlyPay),
    grossYear: currency.format(annualPay),
    netYear: currency.format(netAnnualPay),
    annualTax: currency.format(annualTax),
    cyclesPerYear: number.format(cyclesPerYear),
    cyclesPerMonth: number.format(cyclesPerMonth),
    workingDaysPerMonth: number.format(workingDaysPerMonth),
    estimatedHourly: currency.format(estimatedHourly),
  };
}
