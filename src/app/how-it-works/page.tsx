import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { calculateHourlyResults } from "@/lib/fifo-calculator";
import { cn } from "@/lib/utils";

const hourlyRate = 40;
const hoursPerDay = 12;
const superHoursPerDay = 8;
const superRate = 12;
const swingName = "8/6";

const currencyFormatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-AU", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

const exampleResults = calculateHourlyResults(
  hourlyRate,
  swingName,
  false,
  true,
  superRate,
  superHoursPerDay,
  false,
);

const importantNotes = [
  {
    title: "This is an estimate, not a payslip",
    description:
      "The tool gives a fast comparison using the app's tax logic. Real payroll can differ because of allowances, bonuses, salary sacrifice, site uplifts, timing of pay cycles, and employer-specific rules.",
  },
  {
    title: "Super is shown separately from take-home pay",
    description:
      "When super is turned on, it does not get added into the net pay figure. It is displayed as employer super on top of take-home pay.",
  },
  {
    title: "Hourly FIFO roles assume 12-hour work days",
    description:
      "The calculator treats each on-site day as 12 paid hours. For super, the default base is 8 hours per day, but you can change that if your employer pays super on more hours.",
  },
  {
    title: "Tax settings matter",
    description:
      "Backpacker tax, HECS-HELP repayments, and the selected roster all change the result. The example below uses standard Australian resident tax, no HECS debt, and the default 8/6 swing.",
  },
];

export default function HowItWorks() {
  if (!exampleResults) {
    return null;
  }

  const dailyPay = hourlyRate * hoursPerDay;
  const grossSwing = dailyPay * 8;
  const cyclesPerYear = exampleResults.cyclesPerYear;
  const superBasePerYear =
    hourlyRate * superHoursPerDay * 8 * exampleResults.cyclesPerYear;

  return (
    <main className="row-start-2 w-full">
      <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-gradient-to-br from-stone-100 via-background to-amber-50 px-6 py-10 shadow-sm sm:px-8 lg:px-12">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_top_right,_rgba(245,158,11,0.18),_transparent_55%)] lg:block" />
        <div className="relative flex flex-col gap-6 lg:max-w-4xl">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              How the FIFO calculator works
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              How to calculate pay after tax for FIFO jobs in Australia.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              The example below uses the default roster and tax settings most
              users will see first: {swingName} swing,{" "}
              {formatCurrency(hourlyRate)}
              /hour, super turned on, resident tax rates, and no HECS-HELP debt.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "default" }))}
            >
              Open the calculator
            </Link>
            <Link
              href="#example-breakdown"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Jump to the example
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {importantNotes.map((note) => (
          <Card key={note.title} className="border border-border/70 bg-card/90">
            <CardHeader className="gap-3">
              <CardTitle className="text-lg">{note.title}</CardTitle>
              <CardDescription className="leading-6">
                {note.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-[1.3fr_0.9fr]">
        <Card className="border border-border/70 bg-card/95">
          <CardHeader>
            <CardTitle>Example settings used below</CardTitle>
            <CardDescription>
              These assumptions match a standard calculator run for an hourly
              FIFO job with super included.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Pay type</p>
              <p className="mt-1 text-base font-medium">Hourly</p>
            </div>
            <div className="rounded-2xl bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Hourly rate</p>
              <p className="mt-1 text-base font-medium">
                {formatCurrency(hourlyRate)} per hour
              </p>
            </div>
            <div className="rounded-2xl bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Roster</p>
              <p className="mt-1 text-base font-medium">{swingName} swing</p>
            </div>
            <div className="rounded-2xl bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">
                Work day assumption
              </p>
              <p className="mt-1 text-base font-medium">
                12 paid hours per day
              </p>
            </div>
            <div className="rounded-2xl bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Super setting</p>
              <p className="mt-1 text-base font-medium">
                On at {superRate}% for {superHoursPerDay} hours/day
              </p>
            </div>
            <div className="rounded-2xl bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Tax settings</p>
              <p className="mt-1 text-base font-medium">
                Resident tax, Medicare levy on, no HECS
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-amber-200/70 bg-amber-50/70">
          <CardHeader>
            <CardTitle>Quick result snapshot</CardTitle>
            <CardDescription>
              What the calculator returns before you drill into the formula.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-background/80 p-4">
              <p className="text-sm text-muted-foreground">Gross per swing</p>
              <p className="mt-1 text-2xl font-semibold">
                {formatCurrency(exampleResults.grossSwing)}
              </p>
            </div>
            <div className="rounded-2xl bg-background/80 p-4">
              <p className="text-sm text-muted-foreground">
                Estimated net per swing
              </p>
              <p className="mt-1 text-2xl font-semibold">
                {formatCurrency(exampleResults.netSwing)}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-background/80 p-4">
                <p className="text-sm text-muted-foreground">Gross per year</p>
                <p className="mt-1 text-lg font-semibold">
                  {formatCurrency(exampleResults.grossYear)}
                </p>
              </div>
              <div className="rounded-2xl bg-background/80 p-4">
                <p className="text-sm text-muted-foreground">Net per month</p>
                <p className="mt-1 text-lg font-semibold">
                  {formatCurrency(exampleResults.netMonth)}
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-background/80 p-4">
              <p className="text-sm text-muted-foreground">Employer super</p>
              <p className="mt-1 text-lg font-semibold">
                {formatCurrency(exampleResults.superPerYear ?? 0)} / year
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="example-breakdown" className="mt-10 space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Example breakdown
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">
            What happens when you enter {formatCurrency(hourlyRate)}/hour with
            super turned on
          </h2>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            This walkthrough follows the same order as the app's calculation:
            hourly pay to swing pay, swing pay to annual pay, tax and Medicare,
            then separate superannuation.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border border-border/70 bg-card/95">
            <CardHeader>
              <CardTitle>1. Convert the hourly rate into one swing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 leading-7 text-muted-foreground">
              <p>The calculator uses 12 paid hours for each FIFO work day.</p>
              <div className="rounded-2xl bg-muted/40 p-4 text-foreground">
                <p>
                  {formatCurrency(hourlyRate)} x {hoursPerDay} hours ={" "}
                  {formatCurrency(dailyPay)} per day
                </p>
                <p>
                  {formatCurrency(dailyPay)} x 8 on-days ={" "}
                  {formatCurrency(grossSwing)} gross per 8/6 swing
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-card/95">
            <CardHeader>
              <CardTitle>2. Annualise the roster</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 leading-7 text-muted-foreground">
              <p>
                An 8/6 roster is a 14-day cycle. The app annualises that using
                an average 365.25-day year.
              </p>
              <div className="rounded-2xl bg-muted/40 p-4 text-foreground">
                <p>
                  365.25 / 14 = {formatNumber(cyclesPerYear)} swings per year
                </p>
                <p>
                  {formatCurrency(grossSwing)} x {formatNumber(cyclesPerYear)} ={" "}
                  {formatCurrency(exampleResults.grossYear)} gross per year
                </p>
                <p>
                  That also works out to{" "}
                  {formatCurrency(exampleResults.grossMonth)} gross per month on
                  average.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-card/95">
            <CardHeader>
              <CardTitle>3. Apply income tax and Medicare levy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 leading-7 text-muted-foreground">
              <p>
                For this example, the app uses standard Australian resident tax
                rates plus a 2% Medicare levy.
              </p>
              <div className="rounded-2xl bg-muted/40 p-4 text-foreground">
                <p>
                  Income tax = {formatCurrency(5092)} + (
                  {formatCurrency(exampleResults.grossYear)} -{" "}
                  {formatCurrency(45000)}) x 32.5%
                </p>
                <p>
                  Income tax ={" "}
                  {formatCurrency(
                    (exampleResults.annualTax ?? 0) -
                      (exampleResults.medicareLevy ?? 0),
                  )}
                </p>
                <p>
                  Medicare levy = 2% x{" "}
                  {formatCurrency(exampleResults.grossYear)} ={" "}
                  {formatCurrency(exampleResults.medicareLevy ?? 0)}
                </p>
                <p>
                  Total tax withheld ={" "}
                  {formatCurrency(exampleResults.annualTax)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-card/95">
            <CardHeader>
              <CardTitle>4. Estimate take-home pay</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 leading-7 text-muted-foreground">
              <p>
                With no HECS-HELP repayment selected, net pay is gross pay minus
                total tax.
              </p>
              <div className="rounded-2xl bg-muted/40 p-4 text-foreground">
                <p>
                  {formatCurrency(exampleResults.grossYear)} -{" "}
                  {formatCurrency(exampleResults.annualTax)} ={" "}
                  {formatCurrency(exampleResults.netYear)} net per year
                </p>
                <p>
                  {formatCurrency(exampleResults.netYear)} / 12 ={" "}
                  {formatCurrency(exampleResults.netMonth)} net per month
                </p>
                <p>
                  {formatCurrency(grossSwing)} -{" "}
                  {formatCurrency(exampleResults.annualTax / cyclesPerYear)} ={" "}
                  {formatCurrency(exampleResults.netSwing)} net per swing
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-card/95 lg:col-span-2">
            <CardHeader>
              <CardTitle>5. Calculate super separately</CardTitle>
              <CardDescription>
                Super is not included in the net pay figure. It is shown as an
                employer contribution on top.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-3 leading-7 text-muted-foreground">
                <p>
                  For hourly jobs, the app calculates super on the chosen super
                  hours per day. The default is 8 hours, not the full 12-hour
                  shift.
                </p>
                <div className="rounded-2xl bg-muted/40 p-4 text-foreground">
                  <p>
                    Super base = {formatCurrency(hourlyRate)} x{" "}
                    {superHoursPerDay} hours x 8 on-days x{" "}
                    {formatNumber(cyclesPerYear)} swings
                  </p>
                  <p>
                    Super base = {formatCurrency(superBasePerYear)} per year
                  </p>
                  <p>
                    Employer super = {formatCurrency(superBasePerYear)} x{" "}
                    {superRate}% ={" "}
                    {formatCurrency(exampleResults.superPerYear ?? 0)} per year
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="rounded-2xl border border-border/70 bg-background p-4">
                  <p className="text-sm text-muted-foreground">
                    Super per swing
                  </p>
                  <p className="mt-1 text-xl font-semibold text-foreground">
                    {formatCurrency(exampleResults.superPerSwing ?? 0)}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background p-4">
                  <p className="text-sm text-muted-foreground">
                    Super per month
                  </p>
                  <p className="mt-1 text-xl font-semibold text-foreground">
                    {formatCurrency(exampleResults.superPerMonth ?? 0)}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background p-4">
                  <p className="text-sm text-muted-foreground">
                    Super per year
                  </p>
                  <p className="mt-1 text-xl font-semibold text-foreground">
                    {formatCurrency(exampleResults.superPerYear ?? 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
