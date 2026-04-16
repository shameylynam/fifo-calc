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

import { InfoTooltip } from "@/components/ui/InfoTooltip";

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
    value
  );
}

export function FifoResultsTable({
  results,
  jobNumber,
}: FifoResultsTableProps) {
  return (
    <Table>
      <TableCaption>FIFO pay breakdown (Job {jobNumber})</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[220px]">
            <InfoTooltip text="The FIFO swing pattern (e.g. 8 days on, 6 days off)">
              Metric
            </InfoTooltip>
          </TableHead>
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
          <TableCell>{formatCurrency(results.grossSwing)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Net pay per swing</TableCell>
          <TableCell>{formatCurrency(results.netSwing)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Gross pay per month (avg)</TableCell>
          <TableCell>{formatCurrency(results.grossMonth)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Net pay per month (avg)</TableCell>
          <TableCell>{formatCurrency(results.netMonth)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Gross pay per year</TableCell>
          <TableCell>{formatCurrency(results.grossYear)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Net pay per year</TableCell>
          <TableCell>{formatCurrency(results.netYear)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Estimated annual tax</TableCell>
          <TableCell>{formatCurrency(results.annualTax)}</TableCell>
        </TableRow>
        {results.hecsPerYear && (
          <TableRow>
            <TableCell>HECS-HELP repayment per year</TableCell>
            <TableCell>{formatCurrency(results.hecsPerYear)}</TableCell>
          </TableRow>
        )}
        {results.hecsPerSwing && (
          <TableRow>
            <TableCell>HECS-HELP repayment per swing</TableCell>
            <TableCell>{formatCurrency(results.hecsPerSwing)}</TableCell>
          </TableRow>
        )}
        {results.superPerYear && (
          <TableRow>
            <TableCell>
              Employer superannuation per year
              {results.superRate && (
                <span className="ml-2 text-xs text-muted-foreground">
                  ({formatNumber(results.superRate)}%)
                </span>
              )}
            </TableCell>
            <TableCell>{formatCurrency(results.superPerYear)}</TableCell>
          </TableRow>
        )}
        {results.superPerMonth && (
          <TableRow>
            <TableCell>Employer superannuation per month</TableCell>
            <TableCell>{formatCurrency(results.superPerMonth)}</TableCell>
          </TableRow>
        )}
        {results.superPerSwing && (
          <TableRow>
            <TableCell>Employer superannuation per swing</TableCell>
            <TableCell>{formatCurrency(results.superPerSwing)}</TableCell>
          </TableRow>
        )}
        <TableRow>
          <TableCell>Cycles per year</TableCell>
          <TableCell>{formatNumber(results.cyclesPerYear)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Cycles per month</TableCell>
          <TableCell>{formatNumber(results.cyclesPerMonth)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Working days per month (avg)</TableCell>
          <TableCell>{formatNumber(results.workingDaysPerMonth)}</TableCell>
        </TableRow>
        {results.estimatedHourly && (
          <TableRow>
            <TableCell>Estimated hourly rate</TableCell>
            <TableCell>{formatCurrency(results.estimatedHourly)}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
