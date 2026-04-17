import { createClient } from "@/lib/supabase/server";
import { PortalHeader } from "@/components/portal/portal-header";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-surface-base">
      <PortalHeader />
      <main className="mx-auto max-w-4xl px-4 py-8 md:px-8">{children}</main>
    </div>
  );
}
