import { cn } from "@/lib/utils";

interface TextPageLayoutProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function TextPageLayout({
  title,
  children,
  className,
}: TextPageLayoutProps) {
  return (
    <main className={cn("row-start-2 w-full", className)}>
      <div className="mx-auto max-w-3xl space-y-8 py-4">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        <div className="prose prose-stone max-w-none text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_p]:leading-7 [&_ul]:list-disc [&_ul]:pl-6">
          {children}
        </div>
      </div>
    </main>
  );
}
