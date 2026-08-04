// app/api/counter/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  appendFillEvent,
  getAllEntries,
  summarize,
} from "@/lib/store";

export const runtime = "nodejs";

interface CounterRequest {
  device_id?: string;
  counter?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: CounterRequest = await request.json();

    const deviceId = body.device_id ?? "unknown-device";
    const counter = body.counter ?? 0;

    const saved = appendFillEvent({
      deviceId,
      counter,
    });

    return NextResponse.json({
      status: "success",
      entry: saved,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 400,
      }
    );
  }
}

export async function GET() {
  const entries = getAllEntries();
  const summary = summarize(entries);

  return NextResponse.json({
    status: "success",
    ...summary,
  });
}