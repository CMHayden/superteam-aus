import { NextResponse, type NextRequest } from "next/server";
import { withAuth } from "@/lib/admin-api";

export async function GET() {
  return withAuth(async (supabase) => {
    const keys = ["join_title", "join_body", "join_perks", "twitter_url", "telegram_url"];
    const { data, error } = await supabase
      .from("site_config")
      .select("*")
      .in("key", keys);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const config: Record<string, string> = {};
    for (const row of data ?? []) {
      config[row.key] = row.value;
    }
    return NextResponse.json(config);
  });
}

export async function PUT(request: NextRequest) {
  return withAuth(async (supabase) => {
    const body: Record<string, string> = await request.json();
    const updates = Object.entries(body).map(([key, value]) =>
      supabase.from("site_config").upsert({ key, value }, { onConflict: "key" }),
    );
    await Promise.all(updates);
    return NextResponse.json({ ok: true });
  });
}
