import { NextResponse, type NextRequest } from "next/server";
import { createElement } from "react";
import { withAuth } from "@/lib/admin-api";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/send-email";
import WelcomeEmail from "@/emails/welcome";
import crypto from "crypto";

function generatePassword() {
  return crypto.randomBytes(12).toString("base64url").slice(0, 16);
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: NextRequest) {
  return withAuth(async () => {
    const { submissionId } = await request.json();
    if (!submissionId) {
      return NextResponse.json({ error: "submissionId is required" }, { status: 400 });
    }

    const serviceClient = await createServiceClient();

    const { data: sub, error: fetchErr } = await serviceClient
      .from("join_applications")
      .select("*")
      .eq("id", submissionId)
      .single();

    if (fetchErr || !sub) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    if (sub.approved) {
      return NextResponse.json({ error: "This submission has already been approved" }, { status: 409 });
    }

    if (!sub.email) {
      return NextResponse.json({ error: "Submission has no email address" }, { status: 400 });
    }

    const tempPassword = generatePassword();
    const fullName = `${sub.first_name ?? ""} ${sub.last_name ?? ""}`.trim() || "Member";

    const { data: authData, error: authErr } = await serviceClient.auth.admin.createUser({
      email: sub.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { full_name: fullName, role: "member" },
    });

    if (authErr) {
      if (authErr.message?.includes("already been registered")) {
        return NextResponse.json(
          { error: "A user with this email already exists" },
          { status: 409 },
        );
      }
      return NextResponse.json({ error: authErr.message }, { status: 500 });
    }

    const authUserId = authData.user.id;
    const profileSlug = slugify(fullName);

    const memberPayload = {
      name: fullName,
      title: sub.role ?? "",
      role: sub.role ?? "",
      location: sub.location ?? "",
      email: sub.email,
      experience: sub.experience ?? "",
      looking_for: sub.looking_for ?? [],
      skills: sub.skills ?? [],
      bio: "",
      avatar_url: "",
      contributions: [],
      twitter_url: sub.twitter ?? "",
      github: sub.github ?? "",
      portfolio: sub.portfolio ?? "",
      linkedin: sub.linkedin ?? "",
      dribbble: sub.dribbble ?? "",
      behance: sub.behance ?? "",
      figma: sub.figma ?? "",
      company_website: sub.company_website ?? "",
      pitch_deck: sub.pitch_deck ?? "",
      youtube: sub.youtube ?? "",
      tiktok: sub.tiktok ?? "",
      calendly: sub.calendly ?? "",
      notion: sub.notion ?? "",
      organisation_website: sub.organisation_website ?? "",
      profile_link: profileSlug,
      show_on_carousel: false,
      active: true,
      auth_user_id: authUserId,
      display_order: 999,
    };

    const { error: memberErr } = await serviceClient
      .from("community_members")
      .insert(memberPayload);

    if (memberErr) {
      await serviceClient.auth.admin.deleteUser(authUserId);
      return NextResponse.json({ error: `Failed to create member: ${memberErr.message}` }, { status: 500 });
    }

    await serviceClient
      .from("join_applications")
      .update({ approved: true, is_read: true })
      .eq("id", submissionId);

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://superteam-aus.vercel.app").replace(/\/+$/, "");
    const portalUrl = `${siteUrl}/portal/login`;

    try {
      await sendEmail({
        to: sub.email,
        subject: "Welcome to Superteam Australia!",
        react: createElement(WelcomeEmail, {
          firstName: sub.first_name || fullName,
          email: sub.email,
          temporaryPassword: tempPassword,
          portalUrl,
        }),
      });
    } catch (emailErr) {
      console.error("[approve] Email send failed:", emailErr);
      return NextResponse.json({
        ok: true,
        warning: "Member created but welcome email failed to send. Password: " + tempPassword,
      });
    }

    return NextResponse.json({ ok: true });
  });
}
