import { NextResponse } from "next/server";
import { getTweet } from "react-tweet/api";

export const revalidate = 900;

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const tweet = await getTweet(id).catch(() => undefined);
  return NextResponse.json({ data: tweet ?? null });
}
