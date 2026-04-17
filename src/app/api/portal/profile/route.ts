import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const EDITABLE_FIELDS = new Set([
  "title",
  "bio",
  "skills",
  "contributions",
  "avatar_url",
  "twitter_url",
  "github",
  "portfolio",
  "linkedin",
  "dribbble",
  "behance",
  "figma",
  "company_website",
  "pitch_deck",
  "youtube",
  "tiktok",
  "calendly",
  "notion",
  "organisation_website",
  "location",
  "experience",
  "looking_for",
]);

async function getAuthenticatedMember() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null, member: null };

  const { data: member } = await supabase
    .from("community_members")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  return { supabase, user, member };
}

export async function GET() {
  const { member } = await getAuthenticatedMember();
  if (!member) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(member);
}

export async function PUT(request: NextRequest) {
  const { supabase, user, member } = await getAuthenticatedMember();
  if (!user || !member) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const fields: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body)) {
    if (EDITABLE_FIELDS.has(key)) {
      fields[key] = value;
    }
  }

  if (Object.keys(fields).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("community_members")
    .update(fields)
    .eq("id", member.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
