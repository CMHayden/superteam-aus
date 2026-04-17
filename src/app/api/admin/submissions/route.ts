import { NextResponse, type NextRequest } from "next/server";
import { withAuth } from "@/lib/admin-api";

export async function GET(request: NextRequest) {
  return withAuth(async (supabase) => {
    const countOnly = request.nextUrl.searchParams.get("count_unread");
    if (countOnly === "1") {
      const { count, error } = await supabase
        .from("join_applications")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ unread: count ?? 0 });
    }

    const { data, error } = await supabase
      .from("join_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  });
}

export async function PUT(request: NextRequest) {
  return withAuth(async (supabase) => {
    const body = await request.json();
    const { id, ...fields } = body;
    const { data, error } = await supabase
      .from("join_applications")
      .update(fields)
      .eq("id", id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  });
}

export async function DELETE(request: NextRequest) {
  return withAuth(async (supabase) => {
    const { id } = await request.json();
    const { error } = await supabase.from("join_applications").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  });
}
