import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

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
}
