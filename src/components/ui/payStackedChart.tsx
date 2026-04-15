"use client";

import type { JobResults } from "@/types/fifo.types";
import { TrendingUp } from "lucide-react";
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

export const description = "A stacked bar chart with a legend";

interface FifoResultsChartProps {
  results1: JobResults | null;
  results2: JobResults | null;
}

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

export function PayStackedChart({ results1, results2 }: FifoResultsChartProps) {
  // Only show jobs that are not null
  const chartData = [] as Array<{
    job: string;
    net: number;
    tax: number;
    medicareLevy: number;
    hecs: number;
    super: number;
  }>;
  if (results1) {
    chartData.push({
      job: "Job One",
      net: results1.netYear,
      tax: results1.annualTax - (results1.medicareLevy || 0),
      medicareLevy: results1.medicareLevy || 0,
      hecs: results1.hecsPerYear || 0,
      super: results1.superPerYear || 0,
    });
  }
  if (results2) {
    chartData.push({
      job: "Job Two",
      net: results2.netYear,
      tax: results2.annualTax - (results2.medicareLevy || 0),
      medicareLevy: results2.medicareLevy || 0,
      hecs: results2.hecsPerYear || 0,
      super: results2.superPerYear || 0,
    });
  }
  if (chartData.length === 0) return null;

  // Determine if medicareLevy, hecs, or super are empty (all zero)
  const showMedicare = chartData.some((d) => d.medicareLevy > 0);
  const showHecs = chartData.some((d) => d.hecs > 0);
  const showSuper = chartData.some((d) => d.super > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Stacked + Legend</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData} layout="vertical">
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="job"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <XAxis type="number" />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
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
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
