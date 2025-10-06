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
  );
}
