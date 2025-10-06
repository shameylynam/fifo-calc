"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Type for job calculation results
type JobResults = {
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
};

type FifoSwing = {
  name: string;
  daysOn: number;
  daysOff: number;
};

const fifoSwingOptions: readonly FifoSwing[] = [
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
const AVERAGE_DAYS_PER_MONTH = 30.44;
const AVERAGE_DAYS_PER_YEAR = 365.25;
const HOURS_PER_DAY = 12;
const MONTHS_PER_YEAR = 12;

// Backpacker tax rates for 2024-2025
function calculateBackpackerTax(annualIncome: number): number {
  let tax = 0;
  if (annualIncome <= 45000) {
    tax = annualIncome * 0.15;
  } else if (annualIncome <= 200000) {
    tax = 6750 + (annualIncome - 45000) * 0.3;
  } else {
    tax = 53250 + (annualIncome - 200000) * 0.45;
  }
  return tax;
}

// Australian tax calculation for 2024-2025 (excluding Medicare levy)
function calculateAustralianTax(annualIncome: number): number {
  let tax = 0;
  if (annualIncome <= 18200) {
    tax = 0;
  } else if (annualIncome <= 45000) {
    tax = (annualIncome - 18200) * 0.19;
  } else if (annualIncome <= 120000) {
    tax = 5092 + (annualIncome - 45000) * 0.325;
  } else if (annualIncome <= 180000) {
    tax = 29467 + (annualIncome - 120000) * 0.37;
  } else {
    tax = 51667 + (annualIncome - 180000) * 0.45;
  }
  return tax;
}

const FifoCalculator = React.forwardRef<
  HTMLFormElement,
  React.ComponentProps<"div">
>(({ className }, ref) => {
  // 1. Define your form.
  const [payTypeJob1, setPayTypeJob1] = React.useState<"hourly" | "salary">(
    "hourly"
  );
  const [payTypeJob2, setPayTypeJob2] = React.useState<"hourly" | "salary">(
    "hourly"
  );
  const [showCompare, setShowCompare] = React.useState(false);
  const defaultValues = {
    hourlypay: 0,
    salary: 0,
    swings: "8/6",
    backpacker: false,
    hourlypayTwo: 0,
    salaryTwo: 0,
    swingsTwo: "8/6",
    backpackerTwo: false,
  };
  const mergedSchema = z.object({
    hourlypay: z.coerce.number().min(0).transform(Number),
    salary: z.coerce.number().min(0).transform(Number),
    swings: z.string().min(1, { message: "Please select a swing." }),
    backpacker: z.boolean().optional(),
    hourlypayTwo: z.coerce.number().min(0).transform(Number),
    salaryTwo: z.coerce.number().min(0).transform(Number),
    swingsTwo: z.string().min(1, { message: "Please select a swing." }),
    backpackerTwo: z.boolean().optional(),
  });

  const form = useForm({
    resolver: zodResolver(mergedSchema),
    defaultValues,
  });

  // 2. Define reusable calculation functions and submit handler.
  const [results, setResults] = React.useState<null | {
    job1: JobResults | null;
    job2: JobResults | null;
  }>(null);

  function calculateHourlyResults(
    hourlypay: number,
    swingName: string,
    backpacker: boolean
  ): JobResults | null {
    const selectedFifoSwing = fifoSwingOptions.find(
      (s) => s.name === swingName
    );
    if (!selectedFifoSwing) return null;
    const swingCycleLength =
      selectedFifoSwing.daysOn + selectedFifoSwing.daysOff;
    const cyclesPerMonth = AVERAGE_DAYS_PER_MONTH / swingCycleLength;
    const cyclesPerYear = AVERAGE_DAYS_PER_YEAR / swingCycleLength;
    const workingDaysPerMonth = cyclesPerMonth * selectedFifoSwing.daysOn;
    const currency = new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    });
    const number = new Intl.NumberFormat("en-AU", { maximumFractionDigits: 2 });
    const dailyPay = hourlypay * HOURS_PER_DAY;
    const swingCyclePay = selectedFifoSwing.daysOn * dailyPay;
    const annualPay = swingCyclePay * cyclesPerYear;
    const annualTax = backpacker
      ? calculateBackpackerTax(annualPay)
      : calculateAustralianTax(annualPay);
    const netAnnualPay = annualPay - annualTax;
    const netMonthlyPay = netAnnualPay / MONTHS_PER_YEAR;
    const grossMonthlyPay = annualPay / MONTHS_PER_YEAR;
    const swingTax = backpacker
      ? calculateBackpackerTax(swingCyclePay)
      : calculateAustralianTax(swingCyclePay);
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

  function calculateSalaryResults(
    salary: number,
    swingName: string,
    backpacker: boolean
  ): JobResults | null {
    const selectedFifoSwing = fifoSwingOptions.find(
      (s) => s.name === swingName
    );
    if (!selectedFifoSwing) return null;
    const swingCycleLength =
      selectedFifoSwing.daysOn + selectedFifoSwing.daysOff;
    const cyclesPerMonth = AVERAGE_DAYS_PER_MONTH / swingCycleLength;
    const cyclesPerYear = AVERAGE_DAYS_PER_YEAR / swingCycleLength;
    const workingDaysPerMonth = cyclesPerMonth * selectedFifoSwing.daysOn;
    const currency = new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    });
    const number = new Intl.NumberFormat("en-AU", { maximumFractionDigits: 2 });
    const annualPay = salary;
    const annualTax = backpacker
      ? calculateBackpackerTax(annualPay)
      : calculateAustralianTax(annualPay);
    const netAnnualPay = annualPay - annualTax;
    const grossMonthlyPay = annualPay / MONTHS_PER_YEAR;
    const netMonthlyPay = netAnnualPay / MONTHS_PER_YEAR;
    const swingCyclePay = annualPay / cyclesPerYear;
    const swingTax = backpacker
      ? calculateBackpackerTax(swingCyclePay)
      : calculateAustralianTax(swingCyclePay);
    const netPayPerSwingCycle = swingCyclePay - swingTax;
    const hoursPerYear =
      selectedFifoSwing.daysOn * HOURS_PER_DAY * cyclesPerYear;
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

  function onSubmit(values: z.infer<typeof mergedSchema>) {
    console.log(values);
    let job1Results = null;
    let job2Results = null;
    if (payTypeJob1 === "hourly") {
      job1Results = calculateHourlyResults(
        values.hourlypay,
        values.swings,
        values.backpacker ?? false
      );
    } else {
      job1Results = calculateSalaryResults(
        values.salary,
        values.swings,
        values.backpacker ?? false
      );
    }

    if (showCompare) {
      if (payTypeJob2 === "hourly") {
        job2Results = calculateHourlyResults(
          values.hourlypayTwo,
          values.swingsTwo,
          values.backpackerTwo ?? false
        );
      } else {
        job2Results = calculateSalaryResults(
          values.salaryTwo,
          values.swingsTwo,
          values.backpackerTwo ?? false
        );
      }
    }
    setResults({ job1: job1Results, job2: job2Results });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-8", className)}
        ref={ref}
      >
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex gap-4 mb-4">
              <div className="flex flex-col">
                <span className="font-semibold mb-1">Job 1 Pay Type</span>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={payTypeJob1 === "hourly"}
                    onChange={() => setPayTypeJob1("hourly")}
                  />
                  Hourly
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={payTypeJob1 === "salary"}
                    onChange={() => setPayTypeJob1("salary")}
                  />
                  Salary
                </label>
              </div>
            </div>
            {payTypeJob1 === "hourly" ? (
              <FormField
                control={form.control}
                name="hourlypay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly Pay</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="20"
                        type="number"
                        {...field}
                        value={
                          field.value !== undefined ? Number(field.value) : ""
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      This is your hourly pay rate.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yearly Salary</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="100000"
                        type="number"
                        {...field}
                        value={
                          field.value !== undefined ? Number(field.value) : ""
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      This is your gross annual salary.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="backpacker"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Backpacker</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={field.value ?? false}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="mr-2"
                      />
                      <span>Apply backpacker tax rates</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="swings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Swings</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      value={field.value ?? ""}
                      className="border rounded px-2 py-1 w-full"
                    >
                      {fifoSwingOptions.map((swing: FifoSwing) => (
                        <option key={swing.name} value={swing.name}>
                          {swing.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {showCompare && (
            <div className="flex-1 flex flex-col gap-6">
              <div className="flex gap-4 mb-4">
                <div className="flex flex-col">
                  <span className="font-semibold mb-1">Job 2 Pay Type</span>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={payTypeJob2 === "hourly"}
                      onChange={() => setPayTypeJob2("hourly")}
                    />
                    Hourly
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={payTypeJob2 === "salary"}
                      onChange={() => setPayTypeJob2("salary")}
                    />
                    Salary
                  </label>
                </div>
              </div>
              {payTypeJob2 === "hourly" ? (
                <FormField
                  control={form.control}
                  name="hourlypayTwo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hourly Pay (Job 2)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="20"
                          type="number"
                          {...field}
                          value={
                            field.value !== undefined ? Number(field.value) : ""
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Second job hourly pay rate.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="salaryTwo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yearly Salary (Job 2)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="100000"
                          type="number"
                          {...field}
                          value={
                            field.value !== undefined ? Number(field.value) : ""
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Second job gross annual salary.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="backpackerTwo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Backpacker (Job 2)</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={field.value ?? false}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="mr-2"
                        />
                        <span>Apply backpacker tax rates</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="swingsTwo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Swings (Job 2)</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        value={field.value ?? ""}
                        className="border rounded px-2 py-1 w-full"
                      >
                        <option value="">Select swing</option>
                        {fifoSwingOptions.map((swing: FifoSwing) => (
                          <option key={swing.name} value={swing.name}>
                            {swing.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <div className="flex gap-4 items-center">
          <Button type="submit">Submit</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowCompare((v) => !v)}
          >
            {showCompare ? "Hide Comparison" : "Compare Jobs"}
          </Button>
        </div>

        {results && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {results.job1 && (
              <Table>
                <TableCaption>FIFO pay breakdown (Job 1)</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[220px]">Metric</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Swing</TableCell>
                    <TableCell>{results.job1.swing}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Gross pay per swing</TableCell>
                    <TableCell>{results.job1.grossSwing}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Net pay per swing</TableCell>
                    <TableCell>{results.job1.netSwing}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Gross pay per month (avg)</TableCell>
                    <TableCell>{results.job1.grossMonth}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Net pay per month (avg)</TableCell>
                    <TableCell>{results.job1.netMonth}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Gross pay per year</TableCell>
                    <TableCell>{results.job1.grossYear}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Net pay per year</TableCell>
                    <TableCell>{results.job1.netYear}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Estimated annual tax</TableCell>
                    <TableCell>{results.job1.annualTax}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cycles per year</TableCell>
                    <TableCell>{results.job1.cyclesPerYear}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cycles per month</TableCell>
                    <TableCell>{results.job1.cyclesPerMonth}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Working days per month (avg)</TableCell>
                    <TableCell>{results.job1.workingDaysPerMonth}</TableCell>
                  </TableRow>
                  {results.job1.estimatedHourly && (
                    <TableRow>
                      <TableCell>Estimated hourly rate</TableCell>
                      <TableCell>{results.job1.estimatedHourly}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
            {results.job2 && (
              <Table>
                <TableCaption>FIFO pay breakdown (Job 2)</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[220px]">Metric</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Swing</TableCell>
                    <TableCell>{results.job2.swing}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Gross pay per swing</TableCell>
                    <TableCell>{results.job2.grossSwing}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Net pay per swing</TableCell>
                    <TableCell>{results.job2.netSwing}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Gross pay per month (avg)</TableCell>
                    <TableCell>{results.job2.grossMonth}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Net pay per month (avg)</TableCell>
                    <TableCell>{results.job2.netMonth}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Gross pay per year</TableCell>
                    <TableCell>{results.job2.grossYear}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Net pay per year</TableCell>
                    <TableCell>{results.job2.netYear}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Estimated annual tax</TableCell>
                    <TableCell>{results.job2.annualTax}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cycles per year</TableCell>
                    <TableCell>{results.job2.cyclesPerYear}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cycles per month</TableCell>
                    <TableCell>{results.job2.cyclesPerMonth}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Working days per month (avg)</TableCell>
                    <TableCell>{results.job2.workingDaysPerMonth}</TableCell>
                  </TableRow>
                  {results.job2.estimatedHourly && (
                    <TableRow>
                      <TableCell>Estimated hourly rate</TableCell>
                      <TableCell>{results.job2.estimatedHourly}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </form>
    </Form>
  );
});
FifoCalculator.displayName = "Fifo Calculator";

export { FifoCalculator };
