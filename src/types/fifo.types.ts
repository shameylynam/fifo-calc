// Type for job calculation results
export type JobResults = {
  swing: string;
  grossSwing: string;
  netSwing: string;
  grossMonth: string;
  netMonth: string;
  grossYear: string;
  netYear: string;
  annualTax: string;
  cyclesPerYear: string;
  cyclesPerMonth: string;
  workingDaysPerMonth: string;
  estimatedHourly?: string;
  superPerYear?: string;
  superPerMonth?: string;
  superPerSwing?: string;
  superRate?: string;
  hecsPerYear?: string;
  hecsPerSwing?: string;
};

export type FifoSwing = {
  name: string;
  daysOn: number;
  daysOff: number;
};

export type PayType = "hourly" | "salary";
