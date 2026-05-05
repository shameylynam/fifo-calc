import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const jobResultsSchema = z.object({
  swing: z.string(),
  daysOn: z.number(),
  daysOff: z.number(),
  grossSwing: z.number(),
  netSwing: z.number(),
  grossMonth: z.number(),
  netMonth: z.number(),
  grossYear: z.number(),
  netYear: z.number(),
  annualTax: z.number(),
  cyclesPerYear: z.number(),
  cyclesPerMonth: z.number(),
  workingDaysPerMonth: z.number(),
  estimatedHourly: z.number().optional(),
  superPerYear: z.number().optional(),
  superPerMonth: z.number().optional(),
  superPerSwing: z.number().optional(),
  superRate: z.number().optional(),
  hecsPerYear: z.number().optional(),
  hecsPerSwing: z.number().optional(),
  medicareLevy: z.number().optional(),
});

const requestSchema = z.object({
  job1: jobResultsSchema,
  job2: jobResultsSchema.nullable().optional(),
  payType1: z.enum(["hourly", "salary"]),
  payType2: z.enum(["hourly", "salary"]).optional(),
});

type JobResults = z.infer<typeof jobResultsSchema>;

function formatJobSummary(job: JobResults, label: string): string {
  const cycleLength = job.daysOn + job.daysOff;

  const lines = [
    `${label}:`,
    `  Roster: ${job.swing} — ${job.daysOn} days on, ${job.daysOff} days off per ${cycleLength}-day cycle (${job.cyclesPerYear.toFixed(1)} cycles/year, ${job.workingDaysPerMonth.toFixed(1)} working days/month)`,
    `  Gross: $${job.grossYear.toLocaleString("en-AU", { maximumFractionDigits: 0 })}/year  |  $${job.grossMonth.toLocaleString("en-AU", { maximumFractionDigits: 0 })}/month  |  $${job.grossSwing.toLocaleString("en-AU", { maximumFractionDigits: 0 })}/swing`,
    `  Net (take-home): $${job.netYear.toLocaleString("en-AU", { maximumFractionDigits: 0 })}/year  |  $${job.netMonth.toLocaleString("en-AU", { maximumFractionDigits: 0 })}/month  |  $${job.netSwing.toLocaleString("en-AU", { maximumFractionDigits: 0 })}/swing`,
    `  Income tax: $${job.annualTax.toLocaleString("en-AU", { maximumFractionDigits: 0 })}/year`,
  ];

  if (job.superPerYear) {
    lines.push(
      `  Super (${job.superRate ?? 12}%): $${job.superPerYear.toLocaleString("en-AU", { maximumFractionDigits: 0 })}/year`,
    );
  }
  if (job.hecsPerYear) {
    lines.push(
      `  HECS repayment: $${job.hecsPerYear.toLocaleString("en-AU", { maximumFractionDigits: 0 })}/year`,
    );
  }
  if (job.estimatedHourly) {
    lines.push(
      `  Effective hourly rate: $${job.estimatedHourly.toFixed(2)}/hr`,
    );
  }

  return lines.join("\n");
}

function buildPrompt(
  job1: JobResults,
  job2: JobResults | null | undefined,
): string {
  const summaries = [formatJobSummary(job1, "Job 1")];
  if (job2) summaries.push(formatJobSummary(job2, "Job 2"));

  const isComparison = !!job2;

  const rostersNote =
    "Roster notation is X days on / Y days off per cycle — e.g. 8/6 means 8 days on site followed by 6 days off, while 14/7 means 14 days on followed by 7 days off. When comparing rosters, always refer to them by their days-on and days-off figures rather than the slash notation alone, so the lifestyle trade-off is clear.";

  const intro = isComparison
    ? "The user is comparing two FIFO (Fly-In Fly-Out) job offers using a pay calculator. Here are the calculated results:"
    : "The user has entered a FIFO (Fly-In Fly-Out) job into a pay calculator. Here are the calculated results:";

  const task = isComparison
    ? "Give a concise financial overview comparing both jobs. When discussing the rosters, always describe them as 'X days on, Y days off' so the difference in time-on-site is obvious. Highlight the key differences in take-home pay, tax, super, and HECS. State clearly which job comes out ahead financially and by how much annually. Keep your response to 3-4 short paragraphs."
    : "Give a concise financial overview of this job. Describe the roster as 'X days on, Y days off' when referring to the swing cycle. Summarise the take-home pay, tax burden, and any super or HECS obligations. Keep your response to 2-3 short paragraphs.";

  return `${intro}\n\n${rostersNote}\n\n${summaries.join("\n\n")}\n\n${task}\n\nNote: All figures are estimates based on Australian tax rates for the current financial year. Use Australian dollar formatting and keep the tone helpful and informative.`;
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error(
      "[ai-overview] ANTHROPIC_API_KEY missing. Available env keys:",
      Object.keys(process.env).filter(
        (k) =>
          !k.includes("SECRET") && !k.includes("KEY") && !k.includes("TOKEN"),
      ),
    );
    return NextResponse.json(
      { message: "ANTHROPIC_API_KEY is not configured." },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid request body.", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { job1, job2 } = parsed.data;
  const prompt = buildPrompt(job1, job2);

  const client = new Anthropic({ apiKey });

  let stream: Awaited<ReturnType<typeof client.messages.stream>>;
  try {
    stream = await client.messages.stream({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });
  } catch (err) {
    console.error("[ai-overview] Anthropic stream error:", err);
    return NextResponse.json(
      { message: "Failed to connect to AI service." },
      { status: 502 },
    );
  }

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        console.error("[ai-overview] Anthropic stream read error:", err);
        controller.error(err);
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
