"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FifoJobInput } from "@/components/ui/FifoJobInput";
import { FifoResultsTable } from "@/components/ui/FifoResultsTable";
import type { JobResults, PayType } from "@/types/fifo.types";
import {
  fifoFormSchema,
  defaultValues,
  type FifoFormValues,
} from "@/schemas/fifo.schema";
import {
  calculateHourlyResults,
  calculateSalaryResults,
} from "@/lib/fifo-calculator";

const FifoCalculator = React.forwardRef<
  HTMLFormElement,
  React.ComponentProps<"div">
>(({ className }, ref) => {
  const [payTypeJob1, setPayTypeJob1] = React.useState<PayType>("hourly");
  const [payTypeJob2, setPayTypeJob2] = React.useState<PayType>("hourly");
  const [showCompare, setShowCompare] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(fifoFormSchema),
    defaultValues,
  });

  const [results, setResults] = React.useState<null | {
    job1: JobResults | null;
    job2: JobResults | null;
  }>(null);

  function onSubmit(values: FifoFormValues) {
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
          <FifoJobInput
            jobNumber={1}
            payType={payTypeJob1}
            setPayType={setPayTypeJob1}
            control={form.control}
          />
          {showCompare && (
            <FifoJobInput
              jobNumber={2}
              payType={payTypeJob2}
              setPayType={setPayTypeJob2}
              control={form.control}
            />
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
              <FifoResultsTable results={results.job1} jobNumber={1} />
            )}
            {results.job2 && (
              <FifoResultsTable results={results.job2} jobNumber={2} />
            )}
          </div>
        )}
      </form>
    </Form>
  );
});
FifoCalculator.displayName = "Fifo Calculator";

export { FifoCalculator };
