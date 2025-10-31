import { z } from "zod";

export const fifoFormSchema = z.object({
  hourlypay: z.number().min(0),
  salary: z.number().min(0),
  swings: z.string().min(1, { message: "Please select a swing." }),
  backpacker: z.boolean().optional(),
  superannuation: z.boolean().optional(),
  superRate: z.number().min(0).max(100).optional(),
  superHoursPerDay: z.number().min(1).max(12).optional(),
  hourlypayTwo: z.number().min(0),
  salaryTwo: z.number().min(0),
  swingsTwo: z.string().min(1, { message: "Please select a swing." }),
  backpackerTwo: z.boolean().optional(),
  superannuationTwo: z.boolean().optional(),
  superRateTwo: z.number().min(0).max(100).optional(),
  superHoursPerDayTwo: z.number().min(1).max(12).optional(),
});

export const defaultValues: z.infer<typeof fifoFormSchema> = {
  hourlypay: 0,
  salary: 0,
  swings: "8/6",
  backpacker: false,
  superannuation: false,
  superRate: 12,
  superHoursPerDay: 8,
  hourlypayTwo: 0,
  salaryTwo: 0,
  swingsTwo: "8/6",
  backpackerTwo: false,
  superannuationTwo: false,
  superRateTwo: 12,
  superHoursPerDayTwo: 8,
};

export type FifoFormValues = z.infer<typeof fifoFormSchema>;
