import { NextResponse } from "next/server";
import { withAuth } from "@/lib/admin-api";

export async function GET() {
  return withAuth(async (supabase) => {
    const [submissionsRes, membersRes] = await Promise.all([
      supabase.from("join_applications").select("location, role, experience, looking_for, skills, created_at"),
      supabase.from("community_members").select("location, role, skills"),
    ]);

    if (submissionsRes.error) return NextResponse.json({ error: submissionsRes.error.message }, { status: 500 });
    if (membersRes.error) return NextResponse.json({ error: membersRes.error.message }, { status: 500 });

    return NextResponse.json({
      submissions: submissionsRes.data ?? [],
      members: membersRes.data ?? [],
    });
  });
}
