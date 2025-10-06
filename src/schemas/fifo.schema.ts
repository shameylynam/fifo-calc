import { z } from "zod";

export const fifoFormSchema = z.object({
  hourlypay: z.number().min(0),
  salary: z.number().min(0),
  swings: z.string().min(1, { message: "Please select a swing." }),
  backpacker: z.boolean().optional(),
  hourlypayTwo: z.number().min(0),
  salaryTwo: z.number().min(0),
  swingsTwo: z.string().min(1, { message: "Please select a swing." }),
  backpackerTwo: z.boolean().optional(),
});

export const defaultValues: z.infer<typeof fifoFormSchema> = {
  hourlypay: 0,
  salary: 0,
  swings: "8/6",
  backpacker: false,
  hourlypayTwo: 0,
  salaryTwo: 0,
  swingsTwo: "8/6",
  backpackerTwo: false,
};

export type FifoFormValues = z.infer<typeof fifoFormSchema>;
