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

type Swing = {
  name: string;
  daysOn: number;
  daysOff: number;
};

const swings: Swing[] = [
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
];

const hourlySchema = z.object({
  hourlypay: z.coerce.number().positive({
    message: "Hourly pay must be a positive number.",
  }),
  swings: z.string().min(1, {
    message: "Please select a swing.",
  }),
  backpacker: z.boolean().optional(),
});

const salarySchema = z.object({
  salary: z.coerce.number().positive({
    message: "Salary must be a positive number.",
  }),
  swings: z.string().min(1, {
    message: "Please select a swing.",
  }),
  backpacker: z.boolean().optional(),
});
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
  const [payType, setPayType] = React.useState<"hourly" | "salary">("hourly");
  const [showCompare, setShowCompare] = React.useState(false);
  const form = useForm<any>({
    resolver: zodResolver(payType === "hourly" ? hourlySchema : salarySchema),
    defaultValues:
      payType === "hourly"
        ? { hourlypay: 0, swings: "8/6", backpacker: false }
        : { salary: 0, swings: "8/6", backpacker: false },
  });

  // 2. Define a submit handler.
  const [results, setResults] = React.useState<null | {
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
  }>(null);

  function onSubmit(values: any) {
    const selectedSwing = swings.find((s) => s.name === values.swings);
    if (!selectedSwing) return;
    const swingCycleLength = selectedSwing.daysOn + selectedSwing.daysOff;
    const cyclesPerMonth = 30.44 / swingCycleLength;
    const cyclesPerYear = 365.25 / swingCycleLength;
    const workingDaysPerMonth = cyclesPerMonth * selectedSwing.daysOn;

    const currency = new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    });
    const number = new Intl.NumberFormat("en-AU", { maximumFractionDigits: 2 });

    if (payType === "hourly") {
      const hoursPerDay = 12;
      const dailyPay = values.hourlypay * hoursPerDay;
      const swingCyclePay = selectedSwing.daysOn * dailyPay;
      const annualPay = swingCyclePay * cyclesPerYear;
      const annualTax = values.backpacker
        ? calculateBackpackerTax(annualPay)
        : calculateAustralianTax(annualPay);
      const netAnnualPay = annualPay - annualTax;
      const netMonthlyPay = netAnnualPay / 12;
      const grossMonthlyPay = annualPay / 12;
      const swingTax = values.backpacker
        ? calculateBackpackerTax(swingCyclePay)
        : calculateAustralianTax(swingCyclePay);
      const netPayPerSwingCycle = swingCyclePay - swingTax;
      setResults({
        swing: selectedSwing.name,
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
      });
    } else {
      // Salary calculation
      const annualPay = values.salary;
      const annualTax = values.backpacker
        ? calculateBackpackerTax(annualPay)
        : calculateAustralianTax(annualPay);
      const netAnnualPay = annualPay - annualTax;
      const grossMonthlyPay = annualPay / 12;
      const netMonthlyPay = netAnnualPay / 12;
      // Per swing
      const swingCyclePay = annualPay / cyclesPerYear;
      const swingTax = values.backpacker
        ? calculateBackpackerTax(swingCyclePay)
        : calculateAustralianTax(swingCyclePay);
      const netPayPerSwingCycle = swingCyclePay - swingTax;
      // Estimated hourly rate
      const hoursPerYear = selectedSwing.daysOn * 12 * cyclesPerYear;
      const estimatedHourly = annualPay / hoursPerYear;
      setResults({
        swing: selectedSwing.name,
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
      });
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-8", className)}
        ref={ref}
      >
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={payType === "hourly"}
              onChange={() => setPayType("hourly")}
            />
            Hourly
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={payType === "salary"}
              onChange={() => setPayType("salary")}
            />
            Salary
          </label>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            {payType === "hourly" ? (
              <>
                <FormField
                  control={form.control}
                  name="hourlypay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hourly Pay</FormLabel>
                      <FormControl>
                        <Input placeholder="20" type="number" {...field} />
                      </FormControl>
                      <FormDescription>This is your hourly pay rate.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                          className="border rounded px-2 py-1 w-full"
                        >
                          {swings.map((swing) => (
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
              </>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yearly Salary</FormLabel>
                      <FormControl>
                        <Input placeholder="100000" type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your gross annual salary.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                          className="border rounded px-2 py-1 w-full"
                        >
                          {swings.map((swing) => (
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
              </>
            )}
          </div>
          {showCompare && (
            <div className="flex-1">
              {payType === "hourly" ? (
                <>
                  <FormField
                    control={form.control}
                    name="hourlypayTwo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hourly Pay (Job 2)</FormLabel>
                        <FormControl>
                          <Input placeholder="20" type="number" {...field} />
                        </FormControl>
                        <FormDescription>Second job hourly pay rate.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                            className="border rounded px-2 py-1 w-full"
                          >
                            <option value="">Select swing</option>
                            {swings.map((swing) => (
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
                </>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="salaryTwo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Yearly Salary (Job 2)</FormLabel>
                        <FormControl>
                          <Input placeholder="100000" type="number" {...field} />
                        </FormControl>
                        <FormDescription>Second job gross annual salary.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                            className="border rounded px-2 py-1 w-full"
                          >
                            <option value="">Select swing</option>
                            {swings.map((swing) => (
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
                </>
              )}
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
          <div className="mt-8">
            <Table>
              <TableCaption>FIFO pay breakdown</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[220px]">Metric</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Swing</TableCell>
                  <TableCell>{results.swing}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Gross pay per swing</TableCell>
                  <TableCell>{results.grossSwing}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Net pay per swing</TableCell>
                  <TableCell>{results.netSwing}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Gross pay per month (avg)</TableCell>
                  <TableCell>{results.grossMonth}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Net pay per month (avg)</TableCell>
                  <TableCell>{results.netMonth}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Gross pay per year</TableCell>
                  <TableCell>{results.grossYear}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Net pay per year</TableCell>
                  <TableCell>{results.netYear}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Estimated annual tax</TableCell>
                  <TableCell>{results.annualTax}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Cycles per year</TableCell>
                  <TableCell>{results.cyclesPerYear}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Cycles per month</TableCell>
                  <TableCell>{results.cyclesPerMonth}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Working days per month (avg)</TableCell>
                  <TableCell>{results.workingDaysPerMonth}</TableCell>
                </TableRow>
                {results.estimatedHourly && (
                  <TableRow>
                    <TableCell>Estimated hourly rate</TableCell>
                    <TableCell>{results.estimatedHourly}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </form>
    </Form>
  );
});
FifoCalculator.displayName = "Fifo Calculator";

export { FifoCalculator };
