import { readFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const envPath = resolve(import.meta.dirname ?? __dirname, "..", ".env");
  const content = readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const match = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2];
    }
  }
}

async function main() {
  loadEnv();

  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error("Usage: npx tsx scripts/create-admin.ts <email> <password>");
    process.exit(1);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { is_admin: true },
    user_metadata: { role: "admin" },
  });

  if (error) {
    console.error("Failed to create admin user:", error.message);
    process.exit(1);
  }

  console.log("Admin user created successfully:");
  console.log("  ID:   ", data.user.id);
  console.log("  Email:", data.user.email);
}

main();
