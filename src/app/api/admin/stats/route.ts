import { NextResponse, type NextRequest } from "next/server";
import { withAuth } from "@/lib/admin-api";

export async function GET() {
  return withAuth(async (supabase) => {
    const { data, error } = await supabase
      .from("stats")
      .select("*")
      .order("display_order");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  });
}

export async function PUT(request: NextRequest) {
  return withAuth(async (supabase) => {
    const body = await request.json();
    const { id, ...fields } = body;
    const { data, error } = await supabase
      .from("stats")
      .update(fields)
      .eq("id", id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  });
}

export async function POST(request: NextRequest) {
  return withAuth(async (supabase) => {
    const body = await request.json();
    const { data, error } = await supabase
      .from("stats")
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
    const { error } = await supabase.from("stats").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  });
}
