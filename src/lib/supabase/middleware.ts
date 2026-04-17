import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminApiRoute = pathname.startsWith("/api/admin");
  const isAdminLoginPage = pathname === "/admin/login";
  const isPortalRoute = pathname.startsWith("/portal");
  const isPortalLoginPage = pathname === "/portal/login";
  const userIsAdmin = user?.app_metadata?.is_admin === true;

  if (isAdminRoute && !isAdminLoginPage && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (isAdminRoute && !isAdminLoginPage && user && !userIsAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("error", "forbidden");
    return NextResponse.redirect(url);
  }

  if (isAdminApiRoute && user && !userIsAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (isAdminLoginPage && user && userIsAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  if (isPortalRoute && !isPortalLoginPage && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/portal/login";
    return NextResponse.redirect(url);
  }

  if (isPortalLoginPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/portal";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
