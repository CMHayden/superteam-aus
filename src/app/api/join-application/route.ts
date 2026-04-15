import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();

  console.log("[join-application] received submission:", payload);

  return NextResponse.json({ ok: true });
}
