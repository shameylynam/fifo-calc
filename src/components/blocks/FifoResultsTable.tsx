import type { JobResults } from "@/types/fifo.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { InfoTooltip } from "@/components/blocks/InfoTooltip";

interface FifoResultsTableProps {
  results: JobResults;
  jobNumber: 1 | 2;
}

// Helper function to format currency
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(value);
}

// Helper function to format numbers
function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-AU", { maximumFractionDigits: 2 }).format(
    value,
  );
}

function hasValue(value: number | undefined): value is number {
  return value !== undefined;
}

export function FifoResultsTable({
  results,
  jobNumber,
}: FifoResultsTableProps) {
  return (
    <Card className="overflow-hidden border-border/70 shadow-sm">
      <CardHeader className="gap-4 border-b bg-muted/30">
        <div>
          <CardTitle>FIFO pay breakdown</CardTitle>
          <CardDescription>
            Job {jobNumber} summary across swing, month, and year.
          </CardDescription>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border bg-background px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Net pay per month
            </p>
            <p className="mt-1 text-lg font-semibold">
              {formatCurrency(results.netMonth)}
            </p>
          </div>
          <div className="rounded-lg border bg-background px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Net pay per year
            </p>
            <p className="mt-1 text-lg font-semibold">
              {formatCurrency(results.netYear)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[62%] whitespace-normal px-6">
                <InfoTooltip text="The FIFO swing pattern (e.g. 8 days on, 6 days off)">
                  Metric
                </InfoTooltip>
              </TableHead>
              <TableHead className="px-6 text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="px-6 py-3 whitespace-normal">
                Swing
              </TableCell>
              <TableCell className="px-6 py-3 text-right font-medium">
                {results.swing}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-6 py-3 whitespace-normal">
                Gross pay per swing
              </TableCell>
              <TableCell className="px-6 py-3 text-right font-medium">
                {formatCurrency(results.grossSwing)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-6 py-3 whitespace-normal">
                Net pay per swing
              </TableCell>
              <TableCell className="px-6 py-3 text-right font-medium">
                {formatCurrency(results.netSwing)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-6 py-3 whitespace-normal">
                Gross pay per month (avg)
              </TableCell>
              <TableCell className="px-6 py-3 text-right font-medium">
                {formatCurrency(results.grossMonth)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-6 py-3 whitespace-normal">
                Net pay per month (avg)
              </TableCell>
              <TableCell className="px-6 py-3 text-right font-medium">
                {formatCurrency(results.netMonth)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-6 py-3 whitespace-normal">
                Gross pay per year
              </TableCell>
              <TableCell className="px-6 py-3 text-right font-medium">
                {formatCurrency(results.grossYear)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-6 py-3 whitespace-normal">
                Net pay per year
              </TableCell>
              <TableCell className="px-6 py-3 text-right font-medium">
                {formatCurrency(results.netYear)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-6 py-3 whitespace-normal">
                Estimated annual tax
              </TableCell>
              <TableCell className="px-6 py-3 text-right font-medium">
                {formatCurrency(results.annualTax)}
              </TableCell>
            </TableRow>
            {hasValue(results.hecsPerYear) && (
              <TableRow>
                <TableCell className="px-6 py-3 whitespace-normal">
                  HECS-HELP repayment per year
                </TableCell>
                <TableCell className="px-6 py-3 text-right font-medium">
                  {formatCurrency(results.hecsPerYear)}
                </TableCell>
              </TableRow>
            )}
            {hasValue(results.hecsPerSwing) && (
              <TableRow>
                <TableCell className="px-6 py-3 whitespace-normal">
                  HECS-HELP repayment per swing
                </TableCell>
                <TableCell className="px-6 py-3 text-right font-medium">
                  {formatCurrency(results.hecsPerSwing)}
                </TableCell>
              </TableRow>
            )}
            {hasValue(results.superPerYear) && (
              <TableRow>
                <TableCell className="px-6 py-3 whitespace-normal">
                  Employer superannuation per year
                  {hasValue(results.superRate) && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({formatNumber(results.superRate)}%)
                    </span>
                  )}
                </TableCell>
                <TableCell className="px-6 py-3 text-right font-medium">
                  {formatCurrency(results.superPerYear)}
                </TableCell>
              </TableRow>
            )}
            {hasValue(results.superPerMonth) && (
              <TableRow>
                <TableCell className="px-6 py-3 whitespace-normal">
                  Employer superannuation per month
                </TableCell>
                <TableCell className="px-6 py-3 text-right font-medium">
                  {formatCurrency(results.superPerMonth)}
                </TableCell>
              </TableRow>
            )}
            {hasValue(results.superPerSwing) && (
              <TableRow>
                <TableCell className="px-6 py-3 whitespace-normal">
                  Employer superannuation per swing
                </TableCell>
                <TableCell className="px-6 py-3 text-right font-medium">
                  {formatCurrency(results.superPerSwing)}
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell className="px-6 py-3 whitespace-normal">
                Cycles per year
              </TableCell>
              <TableCell className="px-6 py-3 text-right font-medium">
                {formatNumber(results.cyclesPerYear)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-6 py-3 whitespace-normal">
                Cycles per month
              </TableCell>
              <TableCell className="px-6 py-3 text-right font-medium">
                {formatNumber(results.cyclesPerMonth)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-6 py-3 whitespace-normal">
                Working days per month (avg)
              </TableCell>
              <TableCell className="px-6 py-3 text-right font-medium">
                {formatNumber(results.workingDaysPerMonth)}
              </TableCell>
            </TableRow>
            {hasValue(results.estimatedHourly) && (
              <TableRow>
                <TableCell className="px-6 py-3 whitespace-normal">
                  Estimated hourly rate
                </TableCell>
                <TableCell className="px-6 py-3 text-right font-medium">
                  {formatCurrency(results.estimatedHourly)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
