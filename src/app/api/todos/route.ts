import { NextResponse } from "next/server";
import { z } from "zod";

import { getAmplifyServerClient } from "@/lib/server/amplify-server";

export const runtime = "nodejs";

const createTodoSchema = z.object({
  content: z.string().trim().min(1).max(300),
});

export async function GET() {
  try {
    const client = getAmplifyServerClient();
    const response = await client.models.Todo.list();

    if (response.errors?.length) {
      return NextResponse.json(
        {
          message: "Failed to fetch todos from Amplify Data.",
          errors: response.errors,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ data: response.data });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Amplify backend is not ready.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = createTodoSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Invalid request body.",
        errors: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const client = getAmplifyServerClient();
    const response = await client.models.Todo.create({
      content: parsed.data.content,
    });

    if (response.errors?.length) {
      return NextResponse.json(
        {
          message: "Failed to create todo in Amplify Data.",
          errors: response.errors,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ data: response.data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Amplify backend is not ready.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
