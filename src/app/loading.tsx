export default function Loading() {
  return (
    <main className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-foreground" />
      <p className="text-sm text-muted-foreground">Loading…</p>
    </main>
  );
}
