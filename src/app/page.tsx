import { FifoCalculator } from "@/components/ui/forms/FifoCalculator";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen gap-8 px-4 pb-20 sm:px-8 md:px-16 lg:px-32 xl:px-64 font-[family-name:var(--font-geist-sans)]">
      <main className="w-full max-w-7xl mx-auto flex flex-col gap-8 row-start-2 items-center justify-center min-h-[60vh]">
        <FifoCalculator />
      </main>
    </div>
  );
}
