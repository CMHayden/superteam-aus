import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG, WebP, and GIF images are allowed" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File must be under 5 MB" }, { status: 400 });
  }

  const ext = file.name.split(".").pop();
  const filename = `avatars/${user.id}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("cms")
    .upload(filename, file, { contentType: file.type, upsert: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from("cms").getPublicUrl(filename);

  const { data: member } = await supabase
    .from("community_members")
    .update({ avatar_url: urlData.publicUrl })
    .eq("auth_user_id", user.id)
    .select("avatar_url")
    .single();

  return NextResponse.json({ url: member?.avatar_url ?? urlData.publicUrl });
}
