import type { FifoSwing } from "@/types/fifo.types";

export const fifoSwingOptions: readonly FifoSwing[] = [
  {
    name: "8/6",
    daysOn: 8,
    daysOff: 6,
  },
  {
    name: "2/1",
    daysOn: 14,
    daysOff: 7,
  },
  {
    name: "2/2",
    daysOn: 14,
    daysOff: 14,
  },
] as const;

// Constants for calculations
export const AVERAGE_DAYS_PER_MONTH = 30.44;
export const AVERAGE_DAYS_PER_YEAR = 365.25;
export const HOURS_PER_DAY = 12;
export const MONTHS_PER_YEAR = 12;
