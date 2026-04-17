import type { JobResults } from "@/types/fifo.types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type ComparisonValue = number | string;
type ComparisonIntent = "higher" | "lower" | "neutral";

interface FifoComparisonTableProps {
  job1: JobResults;
  job2: JobResults;
}

interface ComparisonRow {
  label: string;
  job1: ComparisonValue;
  job2: ComparisonValue;
  type: "currency" | "number" | "text";
  intent: ComparisonIntent;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-AU", { maximumFractionDigits: 2 }).format(
    value,
  );
}

function hasValue(value: number | undefined): value is number {
  return value !== undefined;
}

function formatCellValue(
  value: ComparisonValue,
  type: ComparisonRow["type"],
): string {
  if (type === "text") {
    return String(value);
  }

  const numericValue = Number(value);
  return type === "currency"
    ? formatCurrency(numericValue)
    : formatNumber(numericValue);
}

function formatDifference(row: ComparisonRow): string {
  if (row.type === "text") {
    return row.job1 === row.job2 ? "Same" : "Different";
  }

  const difference = Number(row.job2) - Number(row.job1);
  if (difference === 0) {
    return "No change";
  }

  const prefix = difference > 0 ? "+" : "-";
  const absoluteDifference = Math.abs(difference);
  const formattedDifference =
    row.type === "currency"
      ? formatCurrency(absoluteDifference)
      : formatNumber(absoluteDifference);

  return `${prefix}${formattedDifference}`;
}

function getWinningJob(row: ComparisonRow): 1 | 2 | null {
  if (row.type === "text" || row.intent === "neutral") {
    return null;
  }

  const job1Value = Number(row.job1);
  const job2Value = Number(row.job2);

  if (job1Value === job2Value) {
    return null;
  }

  if (row.intent === "higher") {
    return job1Value > job2Value ? 1 : 2;
  }

  return job1Value < job2Value ? 1 : 2;
}

function getWinnerCellClass(row: ComparisonRow, jobNumber: 1 | 2): string {
  const winner = getWinningJob(row);

  if (winner !== jobNumber) {
    return "";
  }

  return "bg-emerald-50 font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300";
}

function getDifferenceClass(row: ComparisonRow): string {
  const winner = getWinningJob(row);

  if (!winner) {
    return "text-muted-foreground";
  }

  return winner === 2
    ? "font-semibold text-emerald-700 dark:text-emerald-300"
    : "font-semibold text-rose-700 dark:text-rose-300";
}

function buildComparisonRows(
  job1: JobResults,
  job2: JobResults,
): ComparisonRow[] {
  const rows: ComparisonRow[] = [
    {
      label: "Swing",
      job1: job1.swing,
      job2: job2.swing,
      type: "text",
      intent: "neutral",
    },
    {
      label: "Gross pay per swing",
      job1: job1.grossSwing,
      job2: job2.grossSwing,
      type: "currency",
      intent: "higher",
    },
    {
      label: "Net pay per swing",
      job1: job1.netSwing,
      job2: job2.netSwing,
      type: "currency",
      intent: "higher",
    },
    {
      label: "Gross pay per month (avg)",
      job1: job1.grossMonth,
      job2: job2.grossMonth,
      type: "currency",
      intent: "higher",
    },
    {
      label: "Net pay per month (avg)",
      job1: job1.netMonth,
      job2: job2.netMonth,
      type: "currency",
      intent: "higher",
    },
    {
      label: "Gross pay per year",
      job1: job1.grossYear,
      job2: job2.grossYear,
      type: "currency",
      intent: "higher",
    },
    {
      label: "Net pay per year",
      job1: job1.netYear,
      job2: job2.netYear,
      type: "currency",
      intent: "higher",
    },
    {
      label: "Estimated annual tax",
      job1: job1.annualTax,
      job2: job2.annualTax,
      type: "currency",
      intent: "lower",
    },
  ];

  if (hasValue(job1.hecsPerYear) || hasValue(job2.hecsPerYear)) {
    rows.push({
      label: "HECS-HELP repayment per year",
      job1: job1.hecsPerYear ?? 0,
      job2: job2.hecsPerYear ?? 0,
      type: "currency",
      intent: "lower",
    });
  }

  if (hasValue(job1.hecsPerSwing) || hasValue(job2.hecsPerSwing)) {
    rows.push({
      label: "HECS-HELP repayment per swing",
      job1: job1.hecsPerSwing ?? 0,
      job2: job2.hecsPerSwing ?? 0,
      type: "currency",
      intent: "lower",
    });
  }

  if (hasValue(job1.superPerYear) || hasValue(job2.superPerYear)) {
    const job1Rate = hasValue(job1.superRate)
      ? ` (${formatNumber(job1.superRate)}%)`
      : "";
    const job2Rate = hasValue(job2.superRate)
      ? ` (${formatNumber(job2.superRate)}%)`
      : "";

    rows.push({
      label: `Employer superannuation per year${job1Rate || job2Rate ? ` [J1${job1Rate || " n/a"} | J2${job2Rate || " n/a"}]` : ""}`,
      job1: job1.superPerYear ?? 0,
      job2: job2.superPerYear ?? 0,
      type: "currency",
      intent: "higher",
    });
  }

  if (hasValue(job1.superPerMonth) || hasValue(job2.superPerMonth)) {
    rows.push({
      label: "Employer superannuation per month",
      job1: job1.superPerMonth ?? 0,
      job2: job2.superPerMonth ?? 0,
      type: "currency",
      intent: "higher",
    });
  }

  if (hasValue(job1.superPerSwing) || hasValue(job2.superPerSwing)) {
    rows.push({
      label: "Employer superannuation per swing",
      job1: job1.superPerSwing ?? 0,
      job2: job2.superPerSwing ?? 0,
      type: "currency",
      intent: "higher",
    });
  }

  rows.push(
    {
      label: "Cycles per year",
      job1: job1.cyclesPerYear,
      job2: job2.cyclesPerYear,
      type: "number",
      intent: "neutral",
    },
    {
      label: "Cycles per month",
      job1: job1.cyclesPerMonth,
      job2: job2.cyclesPerMonth,
      type: "number",
      intent: "neutral",
    },
    {
      label: "Working days per month (avg)",
      job1: job1.workingDaysPerMonth,
      job2: job2.workingDaysPerMonth,
      type: "number",
      intent: "neutral",
    },
  );

  if (hasValue(job1.estimatedHourly) || hasValue(job2.estimatedHourly)) {
    rows.push({
      label: "Estimated hourly rate",
      job1: job1.estimatedHourly ?? 0,
      job2: job2.estimatedHourly ?? 0,
      type: "currency",
      intent: "higher",
    });
  }

  return rows;
}

export function FifoComparisonTable({ job1, job2 }: FifoComparisonTableProps) {
  const rows = buildComparisonRows(job1, job2);

  return (
    <Table className="table-fixed md:table-auto">
      <TableCaption>FIFO comparison breakdown</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[42%] whitespace-normal px-1.5 text-xs leading-4 sm:px-2 sm:text-sm md:min-w-[240px] md:w-auto">
            Metric
          </TableHead>
          <TableHead className="w-[29%] px-1.5 text-xs sm:px-2 sm:text-sm md:w-auto">
            Job 1
          </TableHead>
          <TableHead className="w-[29%] px-1.5 text-xs sm:px-2 sm:text-sm md:w-auto">
            Job 2
          </TableHead>
          <TableHead className="hidden px-1.5 text-xs sm:px-2 sm:text-sm md:table-cell md:w-auto">
            Difference
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.label}>
            <TableCell className="whitespace-normal break-words px-1.5 text-xs font-medium leading-4 sm:px-2 sm:text-sm md:break-normal">
              {row.label}
            </TableCell>
            <TableCell
              className={cn(
                "px-1.5 text-xs sm:px-2 sm:text-sm",
                getWinnerCellClass(row, 1),
              )}
            >
              {formatCellValue(row.job1, row.type)}
            </TableCell>
            <TableCell
              className={cn(
                "px-1.5 text-xs sm:px-2 sm:text-sm",
                getWinnerCellClass(row, 2),
              )}
            >
              {formatCellValue(row.job2, row.type)}
            </TableCell>
            <TableCell
              className={cn(
                "hidden px-1.5 text-xs sm:px-2 sm:text-sm md:table-cell",
                getDifferenceClass(row),
              )}
            >
              {formatDifference(row)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
