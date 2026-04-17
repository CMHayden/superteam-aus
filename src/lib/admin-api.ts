import type { User } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export function isAdmin(user: User): boolean {
  return user.app_metadata?.is_admin === true;
}

export async function withAdminAuth<T>(
  handler: (supabase: Awaited<ReturnType<typeof createClient>>) => Promise<T>,
): Promise<T | NextResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdmin(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return handler(supabase);
}

/** @deprecated Use {@link withAdminAuth} for admin routes. */
export const withAuth = withAdminAuth;
