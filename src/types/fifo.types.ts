// Type for job calculation results
export type JobResults = {
  swing: string;
  grossSwing: number;
  netSwing: number;
  grossMonth: number;
  netMonth: number;
  grossYear: number;
  netYear: number;
  annualTax: number;
  cyclesPerYear: number;
  cyclesPerMonth: number;
  workingDaysPerMonth: number;
  estimatedHourly?: number;
  superPerYear?: number;
  superPerMonth?: number;
  superPerSwing?: number;
  superRate?: number;
  hecsPerYear?: number;
  hecsPerSwing?: number;
};

export type FifoSwing = {
  name: string;
  daysOn: number;
  daysOff: number;
};

export type PayType = "hourly" | "salary";
