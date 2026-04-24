"use client";

import { useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        500 — Something went wrong
      </p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        An unexpected error occurred.
      </h1>
      <p className="max-w-md text-base leading-7 text-muted-foreground">
        Something went wrong on our end. You can try again or head back to the
        calculator.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Try again
        </button>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Back to the calculator
        </Link>
      </div>
    </main>
  );
}
