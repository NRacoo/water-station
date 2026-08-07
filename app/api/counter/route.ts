// app/api/counter/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  appendFillEvent,
  getAllEntries,
  summarize,
} from "@/lib/store";
import { Prisma } from "@/generated/prisma/client";

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
    }, {status: 201});
  } catch (error) {
     if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      return NextResponse.json(
        { status: 'error', message: 'failed to find device_id' },
        { status: 404 }
      )
    }
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

  try {
      const summary = await summarize();
    
      return NextResponse.json({
        status: true,
        ...summary,
      });
  } catch (error) {
    return NextResponse.json({ status: false, message: error})
  }
}