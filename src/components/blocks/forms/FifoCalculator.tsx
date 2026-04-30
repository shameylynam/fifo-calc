"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Form } from "@/components/ui/form";
import { PayStackedChart } from "@/components/blocks/PayStackedChart";
import { Button } from "@/components/ui/button";
import { FifoJobInput } from "@/components/blocks/FifoJobInput";
import { FifoComparisonTable } from "@/components/blocks/FifoComparisonTable";
import { FifoResultsTable } from "@/components/blocks/FifoResultsTable";
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
  const [activeMobileJob, setActiveMobileJob] = React.useState<1 | 2>(1);

  const form = useForm({
    resolver: zodResolver(fifoFormSchema),
    defaultValues,
  });

  const [results, setResults] = React.useState<null | {
    job1: JobResults | null;
    job2: JobResults | null;
  }>(null);

  function handleCompareToggle() {
    setShowCompare((currentValue) => {
      const nextValue = !currentValue;
      setActiveMobileJob(nextValue ? 2 : 1);
      return nextValue;
    });
  }

  function onSubmit(values: FifoFormValues) {
    console.log(values);
    let job1Results = null;
    let job2Results = null;

    if (payTypeJob1 === "hourly") {
      job1Results = calculateHourlyResults(
        values.hourlypay,
        values.swings,
        values.backpacker ?? false,
        values.superannuation ?? false,
        values.superRate ?? 12,
        values.superHoursPerDay ?? 8,
        values.hecsDebt ?? false,
      );
    } else {
      job1Results = calculateSalaryResults(
        values.salary,
        values.swings,
        values.backpacker ?? false,
        values.superannuation ?? false,
        values.superRate ?? 12,
        values.hecsDebt ?? false,
      );
    }

    if (showCompare) {
      if (payTypeJob2 === "hourly") {
        job2Results = calculateHourlyResults(
          values.hourlypayTwo,
          values.swingsTwo,
          values.backpackerTwo ?? false,
          values.superannuationTwo ?? false,
          values.superRateTwo ?? 12,
          values.superHoursPerDayTwo ?? 8,
          values.hecsDebtTwo ?? false,
        );
      } else {
        job2Results = calculateSalaryResults(
          values.salaryTwo,
          values.swingsTwo,
          values.backpackerTwo ?? false,
          values.superannuationTwo ?? false,
          values.superRateTwo ?? 12,
          values.hecsDebtTwo ?? false,
        );
      }
    }
    setResults({ job1: job1Results, job2: job2Results });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "mx-auto w-full space-y-8",
          showCompare ? "max-w-6xl" : "max-w-3xl",
          className,
        )}
        ref={ref}
      >
        {showCompare && (
          <div className="space-y-3 md:hidden">
            <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-muted/40 p-1">
              <Button
                type="button"
                variant={activeMobileJob === 1 ? "default" : "ghost"}
                className="w-full"
                onClick={() => setActiveMobileJob(1)}
              >
                Job 1
              </Button>
              <Button
                type="button"
                variant={activeMobileJob === 2 ? "default" : "ghost"}
                className="w-full"
                onClick={() => setActiveMobileJob(2)}
              >
                Job 2
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Edit one job at a time on mobile and switch tabs to compare.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-8 md:flex-row">
          <div
            className={cn(
              "md:flex-1",
              showCompare && activeMobileJob !== 1
                ? "hidden md:block"
                : "block",
            )}
          >
            <FifoJobInput
              jobNumber={1}
              payType={payTypeJob1}
              setPayType={setPayTypeJob1}
              control={form.control}
            />
          </div>
          {showCompare && (
            <div
              className={cn(
                "md:flex-1",
                activeMobileJob !== 2 ? "hidden md:block" : "block",
              )}
            >
              <FifoJobInput
                jobNumber={2}
                payType={payTypeJob2}
                setPayType={setPayTypeJob2}
                control={form.control}
              />
            </div>
          )}
        </div>

        <div className="flex gap-4 items-center">
          <Button type="submit">Submit</Button>
          <Button type="button" variant="outline" onClick={handleCompareToggle}>
            {showCompare ? "Hide Comparison" : "Compare Jobs"}
          </Button>
        </div>

        {results && (
          <div
            className={cn(
              "mt-8 grid grid-cols-1 gap-8",
              showCompare ? "md:grid-cols-2" : "mx-auto max-w-4xl",
            )}
          >
            {/* Top row: 100% width chart */}
            <div className={cn("col-span-1", showCompare && "md:col-span-2")}>
              <PayStackedChart
                results1={results.job1}
                results2={results.job2}
              />
            </div>

            {showCompare && results.job1 && results.job2 ? (
              <div className="col-span-1 md:col-span-2">
                <FifoComparisonTable job1={results.job1} job2={results.job2} />
              </div>
            ) : (
              <div className="col-span-1 mx-auto w-full max-w-3xl">
                {results.job1 && (
                  <FifoResultsTable results={results.job1} jobNumber={1} />
                )}
              </div>
            )}
          </div>
        )}
      </form>
    </Form>
  );
});
FifoCalculator.displayName = "Fifo Calculator";

export { FifoCalculator };
