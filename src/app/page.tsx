import { FifoCalculator } from "@/components/ui/forms/FifoCalculator";
import { PageContainer } from "@/components/ui/PageContainer";

export default function Home() {
  return (
    <PageContainer>
      <main className="w-full flex flex-col gap-8 row-start-2 items-center justify-center min-h-[60vh]">
        <FifoCalculator />
      </main>
    </PageContainer>
  );
}
