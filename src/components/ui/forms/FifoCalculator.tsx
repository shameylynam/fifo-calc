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

const formSchema = z.object({
  hourlypay: z.coerce.number().positive({
    message: "Hourly pay must be a positive number.",
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hourlypay: 0,
      swings: "8/6",
      backpacker: false,
    },
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
  }>(null);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const selectedSwing = swings.find((s) => s.name === values.swings);
    if (selectedSwing) {
      const hoursPerDay = 12; // assuming 12 hour shifts
      const dailyPay = values.hourlypay * hoursPerDay;

      // Calculate swing cycle pay (one complete cycle)
      const swingCyclePay = selectedSwing.daysOn * dailyPay;

      // Calculate monthly pay
      const swingCycleLength = selectedSwing.daysOn + selectedSwing.daysOff;
      const averageDaysInMonth = 30.44; // Average days per month
      const cyclesPerMonth = averageDaysInMonth / swingCycleLength;
      const workingDaysPerMonth = cyclesPerMonth * selectedSwing.daysOn;
      const monthlyPay = workingDaysPerMonth * dailyPay;

      // Calculate annual pay and tax based on actual cycles per year
      const cyclesPerYear = 365.25 / swingCycleLength;
      const annualPay = swingCyclePay * cyclesPerYear;
      const annualTax = values.backpacker
        ? calculateBackpackerTax(annualPay)
        : calculateAustralianTax(annualPay);
      const netAnnualPay = annualPay - annualTax;
      const netMonthlyPay = netAnnualPay / 12;
      const grossMonthlyPay = annualPay / 12;

      // Calculate net and gross pay per swing
      // For per swing, apply tax to swing gross, not annualized
      const swingTax = values.backpacker
        ? calculateBackpackerTax(swingCyclePay)
        : calculateAustralianTax(swingCyclePay);
      const netPayPerSwingCycle = swingCyclePay - swingTax;

      setResults({
        swing: selectedSwing.name,
        grossSwing: `$${swingCyclePay.toFixed(2)}`,
        netSwing: `$${netPayPerSwingCycle.toFixed(2)}`,
        grossMonth: `$${grossMonthlyPay.toFixed(2)}`,
        netMonth: `$${netMonthlyPay.toFixed(2)}`,
        grossYear: `$${annualPay.toFixed(2)}`,
        netYear: `$${netAnnualPay.toFixed(2)}`,
        annualTax: `$${annualTax.toFixed(2)}`,
        cyclesPerYear: cyclesPerYear.toFixed(2),
        cyclesPerMonth: cyclesPerMonth.toFixed(2),
        workingDaysPerMonth: workingDaysPerMonth.toFixed(1),
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
                    checked={field.value}
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

        {/* Example: Dropdown generated from an object */}
        <FormField
          control={form.control}
          name="swings"
          render={({ field }) => {
            // Object to loop through

            return (
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
            );
          }}
        />

        <Button type="submit">Submit</Button>

        {results && (
          <div className="mt-8">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">Metric</th>
                  <th className="border px-2 py-1">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-2 py-1">Swing</td>
                  <td className="border px-2 py-1">{results.swing}</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Gross pay per swing</td>
                  <td className="border px-2 py-1">{results.grossSwing}</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Net pay per swing</td>
                  <td className="border px-2 py-1">{results.netSwing}</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">
                    Gross pay per month (avg)
                  </td>
                  <td className="border px-2 py-1">{results.grossMonth}</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Net pay per month (avg)</td>
                  <td className="border px-2 py-1">{results.netMonth}</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Gross pay per year</td>
                  <td className="border px-2 py-1">{results.grossYear}</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Net pay per year</td>
                  <td className="border px-2 py-1">{results.netYear}</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Estimated annual tax</td>
                  <td className="border px-2 py-1">{results.annualTax}</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Cycles per year</td>
                  <td className="border px-2 py-1">{results.cyclesPerYear}</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Cycles per month</td>
                  <td className="border px-2 py-1">{results.cyclesPerMonth}</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">
                    Working days per month (avg)
                  </td>
                  <td className="border px-2 py-1">
                    {results.workingDaysPerMonth}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </form>
    </Form>
  );
});
FifoCalculator.displayName = "Fifo Calculator";

export { FifoCalculator };
