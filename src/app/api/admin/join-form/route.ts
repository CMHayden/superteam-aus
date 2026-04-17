import { NextResponse, type NextRequest } from "next/server";
import { withAuth } from "@/lib/admin-api";

export async function GET() {
  return withAuth(async (supabase) => {
    const [roles, locations, skills, experience, lookingFor] = await Promise.all([
      supabase.from("join_form_roles").select("*").order("display_order"),
      supabase.from("join_form_locations").select("*").order("display_order"),
      supabase.from("join_form_skills").select("*").order("display_order"),
      supabase.from("join_form_experience_options").select("*").order("display_order"),
      supabase.from("join_form_looking_for").select("*").order("display_order"),
    ]);
    return NextResponse.json({
      roles: roles.data ?? [],
      locations: locations.data ?? [],
      skills: skills.data ?? [],
      experienceOptions: experience.data ?? [],
      lookingForOptions: lookingFor.data ?? [],
    });
  });
}

export async function POST(request: NextRequest) {
  return withAuth(async (supabase) => {
    const body = await request.json();
    const { table, ...fields } = body;
    const allowed = [
      "join_form_roles",
      "join_form_locations",
      "join_form_skills",
      "join_form_experience_options",
      "join_form_looking_for",
    ];
    if (!allowed.includes(table)) {
      return NextResponse.json({ error: "Invalid table" }, { status: 400 });
    }
    const { data, error } = await supabase.from(table).insert(fields).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  });
}

export async function PUT(request: NextRequest) {
  return withAuth(async (supabase) => {
    const body = await request.json();
    const { table, id, ...fields } = body;
    const allowed = [
      "join_form_roles",
      "join_form_locations",
      "join_form_skills",
      "join_form_experience_options",
      "join_form_looking_for",
    ];
    if (!allowed.includes(table)) {
      return NextResponse.json({ error: "Invalid table" }, { status: 400 });
    }
    const { data, error } = await supabase.from(table).update(fields).eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  });
}

export async function DELETE(request: NextRequest) {
  return withAuth(async (supabase) => {
    const body = await request.json();
    const { table, id } = body;
    const allowed = [
      "join_form_roles",
      "join_form_locations",
      "join_form_skills",
      "join_form_experience_options",
      "join_form_looking_for",
    ];
    if (!allowed.includes(table)) {
      return NextResponse.json({ error: "Invalid table" }, { status: 400 });
    }
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  });
}
