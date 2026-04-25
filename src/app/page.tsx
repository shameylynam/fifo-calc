import { FifoCalculator } from "@/components/ui/forms/FifoCalculator";

export default function Home() {
  return (
    <main className="row-start-2 flex min-h-[60vh] w-full flex-col items-center justify-center gap-8">
      <div className="mx-auto w-full max-w-3xl space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          FIFO Pay Calculator
        </h1>
        <p className="text-muted-foreground">
          Calculate your take-home pay, tax, super, and HECS on a fly-in
          fly-out roster.
        </p>
      </div>
      <FifoCalculator />
    </main>
  );
}
