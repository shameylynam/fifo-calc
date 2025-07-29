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
  hourlypay: z.number().positive({
    message: "Hourly pay must be a positive number.",
  }),
  swings: z.string().min(1, {
    message: "Please select a swing.",
  }),
});

const FifoCalculator = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"div">
>(({ className }, ref) => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      hourlypay: "",
      swings: "8/6", // Default value for the dropdown as a string
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const selectedSwing = swings.find((s) => s.name === values.swings);
    if (selectedSwing) {
      const hoursWorked = selectedSwing.daysOn * 12; // assuming 12 hour shifts
      const totalPay = values.hourlypay * hoursWorked;
      console.log(`Total pay for swing ${selectedSwing.name}: $${totalPay}`);
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
      </form>
    </Form>
  );
});
FifoCalculator.displayName = "Fifo Calculator";

export { FifoCalculator };
