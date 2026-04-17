import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const payload = await request.json();
  const supabase = await createClient();

  const { error } = await supabase.from("join_applications").insert({
    first_name: payload.firstName ?? "",
    last_name: payload.lastName ?? "",
    email: payload.email ?? "",
    location: payload.location ?? "",
    role: payload.role ?? "",
    experience: payload.experience ?? "",
    looking_for: payload.lookingFor ?? [],
    looking_other: payload.lookingOther ?? "",
    skills: payload.skills ?? [],
    twitter: payload.twitter ?? "",
    github: payload.github ?? "",
    portfolio: payload.portfolio ?? "",
    linkedin: payload.linkedin ?? "",
    dribbble: payload.dribbble ?? "",
    behance: payload.behance ?? "",
    figma: payload.figma ?? "",
    company_website: payload.companyWebsite ?? "",
    pitch_deck: payload.pitchDeck ?? "",
    youtube: payload.youtube ?? "",
    tiktok: payload.tiktok ?? "",
    calendly: payload.calendly ?? "",
    notion: payload.notion ?? "",
    organisation_website: payload.organisationWebsite ?? "",
  });

  if (error) {
    console.error("[join-application] insert error:", error);
    return NextResponse.json({ error: "Failed to save application" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
