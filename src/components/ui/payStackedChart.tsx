"use client";

import type { JobResults } from "@/types/fifo.types";
import { cn } from "@/lib/utils";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface FifoResultsChartProps {
  results1: JobResults | null;
  results2: JobResults | null;
}

type ChartDatum = {
  job: string;
  net: number;
  tax: number;
  medicareLevy: number;
  hecs: number;
  super: number;
  netMonth: number;
  annualTax: number;
};

const chartConfig = {
  net: {
    label: "Net",
    color: "var(--chart-1)",
  },
  tax: {
    label: "Tax",
    color: "var(--chart-2)",
  },
  medicareLevy: {
    label: "Medicare Levy",
    color: "var(--chart-3)",
  },
  hecs: {
    label: "HECS",
    color: "var(--chart-4)",
  },
  super: {
    label: "Super",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function getWinnerClass(
  jobValue: number,
  otherValue: number,
  higherIsBetter: boolean,
) {
  if (jobValue === otherValue) {
    return "";
  }

  const isWinner = higherIsBetter
    ? jobValue > otherValue
    : jobValue < otherValue;
  return isWinner
    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
    : "";
}

function buildComparisonCopy(
  results1: JobResults | null,
  results2: JobResults | null,
): string {
  if (!results1 && !results2) {
    return "";
  }

  if (results1 && results2) {
    const difference = results2.netYear - results1.netYear;
    if (difference === 0) {
      return "Both jobs land on the same net annual pay.";
    }

    const leadingJob = difference > 0 ? "Job 2" : "Job 1";
    return `${leadingJob} leads by ${formatCurrency(Math.abs(difference))} in net annual pay.`;
  }

  const result = results1 ?? results2;
  if (!result) {
    return "";
  }

  return `Estimated take-home pay is ${formatCurrency(result.netYear)} per year on a ${result.swing} swing.`;
}

export function PayStackedChart({ results1, results2 }: FifoResultsChartProps) {
  const chartData: ChartDatum[] = [];
  if (results1) {
    chartData.push({
      job: "Job 1",
      net: results1.netYear,
      tax: results1.annualTax - (results1.medicareLevy || 0),
      medicareLevy: results1.medicareLevy || 0,
      hecs: results1.hecsPerYear || 0,
      super: results1.superPerYear || 0,
      netMonth: results1.netMonth,
      annualTax: results1.annualTax,
    });
  }
  if (results2) {
    chartData.push({
      job: "Job 2",
      net: results2.netYear,
      tax: results2.annualTax - (results2.medicareLevy || 0),
      medicareLevy: results2.medicareLevy || 0,
      hecs: results2.hecsPerYear || 0,
      super: results2.superPerYear || 0,
      netMonth: results2.netMonth,
      annualTax: results2.annualTax,
    });
  }
  if (chartData.length === 0) return null;

  const showMedicare = chartData.some((d) => d.medicareLevy > 0);
  const showHecs = chartData.some((d) => d.hecs > 0);
  const showSuper = chartData.some((d) => d.super > 0);
  const insightCopy = buildComparisonCopy(results1, results2);
  const primaryJob = chartData[0];
  const comparisonJob = chartData[1];

  return (
    <Card className="overflow-hidden border-border/70 shadow-sm">
      <CardHeader className="border-b bg-muted/20">
        <CardTitle>Annual pay breakdown</CardTitle>
        <CardDescription>
          Compare take-home pay, tax, HECS, Medicare levy, and super across the
          selected FIFO swing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 p-4 sm:p-6">
        <div className="md:hidden">
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border bg-background px-4 py-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Net per year
                </p>
                <div className="mt-3 space-y-2">
                  <div
                    className={cn(
                      "rounded-lg px-2 py-2",
                      comparisonJob
                        ? getWinnerClass(
                            primaryJob.net,
                            comparisonJob.net,
                            true,
                          )
                        : "",
                    )}
                  >
                    <p className="text-[11px] text-muted-foreground">
                      {primaryJob.job}
                    </p>
                    <p className="text-sm font-semibold">
                      {formatCompactCurrency(primaryJob.net)}
                    </p>
                  </div>
                  {comparisonJob && (
                    <div
                      className={cn(
                        "rounded-lg px-2 py-2",
                        getWinnerClass(comparisonJob.net, primaryJob.net, true),
                      )}
                    >
                      <p className="text-[11px] text-muted-foreground">
                        {comparisonJob.job}
                      </p>
                      <p className="text-sm font-semibold">
                        {formatCompactCurrency(comparisonJob.net)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-xl border bg-background px-4 py-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Net per month
                </p>
                <div className="mt-3 space-y-2">
                  <div
                    className={cn(
                      "rounded-lg px-2 py-2",
                      comparisonJob
                        ? getWinnerClass(
                            primaryJob.netMonth,
                            comparisonJob.netMonth,
                            true,
                          )
                        : "",
                    )}
                  >
                    <p className="text-[11px] text-muted-foreground">
                      {primaryJob.job}
                    </p>
                    <p className="text-sm font-semibold">
                      {formatCompactCurrency(primaryJob.netMonth)}
                    </p>
                  </div>
                  {comparisonJob && (
                    <div
                      className={cn(
                        "rounded-lg px-2 py-2",
                        getWinnerClass(
                          comparisonJob.netMonth,
                          primaryJob.netMonth,
                          true,
                        ),
                      )}
                    >
                      <p className="text-[11px] text-muted-foreground">
                        {comparisonJob.job}
                      </p>
                      <p className="text-sm font-semibold">
                        {formatCompactCurrency(comparisonJob.netMonth)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border bg-background px-4 py-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Annual tax
                </p>
                <div className="mt-3 space-y-2">
                  <div
                    className={cn(
                      "rounded-lg px-2 py-2",
                      comparisonJob
                        ? getWinnerClass(
                            primaryJob.annualTax,
                            comparisonJob.annualTax,
                            false,
                          )
                        : "",
                    )}
                  >
                    <p className="text-[11px] text-muted-foreground">
                      {primaryJob.job}
                    </p>
                    <p className="text-sm font-semibold">
                      {formatCompactCurrency(primaryJob.annualTax)}
                    </p>
                  </div>
                  {comparisonJob && (
                    <div
                      className={cn(
                        "rounded-lg px-2 py-2",
                        getWinnerClass(
                          comparisonJob.annualTax,
                          primaryJob.annualTax,
                          false,
                        ),
                      )}
                    >
                      <p className="text-[11px] text-muted-foreground">
                        {comparisonJob.job}
                      </p>
                      <p className="text-sm font-semibold">
                        {formatCompactCurrency(comparisonJob.annualTax)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-xl border bg-background px-4 py-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Employer super
                </p>
                <div className="mt-3 space-y-2">
                  <div
                    className={cn(
                      "rounded-lg px-2 py-2",
                      comparisonJob
                        ? getWinnerClass(
                            primaryJob.super,
                            comparisonJob.super,
                            true,
                          )
                        : "",
                    )}
                  >
                    <p className="text-[11px] text-muted-foreground">
                      {primaryJob.job}
                    </p>
                    <p className="text-sm font-semibold">
                      {formatCompactCurrency(primaryJob.super)}
                    </p>
                  </div>
                  {comparisonJob && (
                    <div
                      className={cn(
                        "rounded-lg px-2 py-2",
                        getWinnerClass(
                          comparisonJob.super,
                          primaryJob.super,
                          true,
                        ),
                      )}
                    >
                      <p className="text-[11px] text-muted-foreground">
                        {comparisonJob.job}
                      </p>
                      <p className="text-sm font-semibold">
                        {formatCompactCurrency(comparisonJob.super)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
              {insightCopy}
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <ChartContainer
            config={chartConfig}
            className="h-[320px] w-full aspect-auto"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{ left: 16, right: 12 }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="job"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCompactCurrency(Number(value))}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name) => (
                      <div className="flex w-full items-center justify-between gap-4">
                        <span className="text-muted-foreground">
                          {String(name)}
                        </span>
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {formatCurrency(Number(value))}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <ChartLegend
                content={
                  <ChartLegendContent className="flex-wrap justify-start gap-x-6 gap-y-2" />
                }
              />
              <Bar
                dataKey="net"
                stackId="a"
                fill="var(--color-net)"
                radius={[0, 0, 0, 0]}
              />
              {showSuper && (
                <Bar
                  dataKey="super"
                  stackId="a"
                  fill="var(--color-super)"
                  radius={[0, 0, 0, 0]}
                />
              )}
              {showMedicare && (
                <Bar
                  dataKey="medicareLevy"
                  stackId="a"
                  fill="var(--color-medicareLevy)"
                  radius={[0, 0, 0, 0]}
                />
              )}
              {showHecs && (
                <Bar
                  dataKey="hecs"
                  stackId="a"
                  fill="var(--color-hecs)"
                  radius={[0, 0, 0, 0]}
                />
              )}
              <Bar
                dataKey="tax"
                stackId="a"
                fill="var(--color-tax)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/10 text-sm text-muted-foreground">
        {insightCopy}
      </CardFooter>
    </Card>
  );
}
