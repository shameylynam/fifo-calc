import { z } from "zod";

export const fifoFormSchema = z.object({
  hourlypay: z.number().min(0),
  salary: z.number().min(0),
  swingDaysOn: z
    .number()
    .int()
    .min(1, { message: "Days on must be at least 1." }),
  swingDaysOff: z
    .number()
    .int()
    .min(1, { message: "Days off must be at least 1." }),
  backpacker: z.boolean().optional(),
  superannuation: z.boolean().optional(),
  superRate: z.number().min(0).max(100).optional(),
  superHoursPerDay: z.number().min(1).max(12).optional(),
  hourlypayTwo: z.number().min(0),
  salaryTwo: z.number().min(0),
  swingDaysOnTwo: z
    .number()
    .int()
    .min(1, { message: "Days on must be at least 1." }),
  swingDaysOffTwo: z
    .number()
    .int()
    .min(1, { message: "Days off must be at least 1." }),
  backpackerTwo: z.boolean().optional(),
  superannuationTwo: z.boolean().optional(),
  superRateTwo: z.number().min(0).max(100).optional(),
  superHoursPerDayTwo: z.number().min(1).max(12).optional(),
  hecsDebt: z.boolean().optional(),
  hecsDebtTwo: z.boolean().optional(),
  medicareLevy: z.number().min(0).optional(),
  medicareLevyTwo: z.number().min(0).optional(),
});

export const defaultValues: z.infer<typeof fifoFormSchema> = {
  hourlypay: 0,
  salary: 0,
  swingDaysOn: 8,
  swingDaysOff: 6,
  backpacker: false,
  superannuation: false,
  superRate: 12,
  superHoursPerDay: 8,
  hourlypayTwo: 0,
  salaryTwo: 0,
  swingDaysOnTwo: 8,
  swingDaysOffTwo: 6,
  backpackerTwo: false,
  superannuationTwo: false,
  superRateTwo: 12,
  superHoursPerDayTwo: 8,
  hecsDebt: false,
  hecsDebtTwo: false,
  medicareLevy: 0,
  medicareLevyTwo: 0,
};

export type FifoFormValues = z.infer<typeof fifoFormSchema>;
