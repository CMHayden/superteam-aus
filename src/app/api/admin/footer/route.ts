import { NextResponse, type NextRequest } from "next/server";
import { withAuth } from "@/lib/admin-api";

export async function GET() {
  return withAuth(async (supabase) => {
    const [configRes, linksRes] = await Promise.all([
      supabase
        .from("site_config")
        .select("*")
        .in("key", ["footer_description"]),
      supabase
        .from("social_links")
        .select("*")
        .order("display_order"),
    ]);
    if (configRes.error) return NextResponse.json({ error: configRes.error.message }, { status: 500 });
    if (linksRes.error) return NextResponse.json({ error: linksRes.error.message }, { status: 500 });

    const config: Record<string, string> = {};
    for (const row of configRes.data ?? []) {
      config[row.key] = row.value;
    }

    return NextResponse.json({ config, socialLinks: linksRes.data });
  });
}

export async function PUT(request: NextRequest) {
  return withAuth(async (supabase) => {
    const body = await request.json();

    if (body.footer_description !== undefined) {
      await supabase
        .from("site_config")
        .upsert({ key: "footer_description", value: body.footer_description }, { onConflict: "key" });
    }

    if (body.socialLink) {
      const { id, ...fields } = body.socialLink;
      if (id) {
        await supabase.from("social_links").update(fields).eq("id", id);
      } else {
        await supabase.from("social_links").insert(fields);
      }
    }

    return NextResponse.json({ ok: true });
  });
}

export async function POST(request: NextRequest) {
  return withAuth(async (supabase) => {
    const body = await request.json();
    const { data, error } = await supabase
      .from("social_links")
      .insert(body)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  });
}

export async function DELETE(request: NextRequest) {
  return withAuth(async (supabase) => {
    const { id } = await request.json();
    const { error } = await supabase.from("social_links").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  });
}
