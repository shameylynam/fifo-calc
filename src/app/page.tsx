import { FifoCalculator } from "@/components/ui/forms/FifoCalculator";

export default function Home() {
  return (
    <main className="row-start-2 flex min-h-[60vh] w-full flex-col items-center justify-center gap-8">
      <FifoCalculator />
    </main>
  );
}
