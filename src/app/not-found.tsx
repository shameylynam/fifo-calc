import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        404 — Page not found
      </p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        We couldn&apos;t find that page.
      </h1>
      <p className="max-w-md text-base leading-7 text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved. Head back to the calculator and try again.
      </p>
      <Link href="/" className={cn(buttonVariants({ variant: "default" }))}>
        Back to the calculator
      </Link>
    </main>
  );
}
