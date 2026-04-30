import { FifoCalculator } from "@/components/blocks/forms/FifoCalculator";

export default function Home() {
  return (
    <main className="row-start-2 flex min-h-[60vh] w-full flex-col items-center justify-center gap-8">
      <div className="w-full text-center space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          FIFO Pay Calculator
        </h1>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
          Estimate your take-home pay, tax, superannuation, and HECS repayments
          for any FIFO roster. Free and easy to use.
        </p>
      </div>
      <FifoCalculator />
    </main>
  );
}
