import { createClient } from "@/lib/supabase/server";

export async function getStats() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("stats")
    .select("*")
    .order("display_order");
  return data ?? [];
}

export async function getPartners() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("partners")
    .select("*")
    .order("display_order");
  return data ?? [];
}

export async function getWhatWeDoCards() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("what_we_do_cards")
    .select("*")
    .order("display_order");
  return data ?? [];
}

export async function getTestimonials() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .order("display_order");
  return data ?? [];
}

export async function getTweets() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tweets")
    .select("*")
    .order("display_order");
  return data ?? [];
}

export async function getCarouselImages() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("carousel_images")
    .select("*")
    .order("display_order");
  return data ?? [];
}

export async function getVisibleCommunityMembers() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("community_members")
    .select("*")
    .eq("show_on_carousel", true)
    .eq("active", true)
    .order("display_order");
  return data ?? [];
}

export async function getCommunityMemberBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("community_members")
    .select("*")
    .eq("profile_link", slug)
    .eq("active", true)
    .single();
  return data;
}

export async function getActiveCommunityMembers() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("community_members")
    .select("*")
    .eq("active", true)
    .order("display_order");
  return data ?? [];
}

export async function getJoinFormRoles() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("join_form_roles")
    .select("name")
    .order("display_order");
  return (data ?? []).map((r) => r.name);
}

export async function getJoinFormLocations() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("join_form_locations")
    .select("name")
    .order("display_order");
  return (data ?? []).map((l) => l.name);
}

export async function getJoinFormSkillsByRole() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("join_form_skills")
    .select("name, role_name")
    .order("display_order");
  const map: Record<string, string[]> = {};
  for (const row of data ?? []) {
    if (!map[row.role_name]) map[row.role_name] = [];
    map[row.role_name].push(row.name);
  }
  return map;
}

export async function getFaqs() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("faqs")
    .select("*")
    .order("display_order");
  return data ?? [];
}

export async function getSocialLinks() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("social_links")
    .select("*")
    .order("display_order");
  return data ?? [];
}

export async function getSiteConfig(...keys: string[]) {
  const supabase = await createClient();
  const query = supabase.from("site_config").select("*");
  if (keys.length > 0) {
    query.in("key", keys);
  }
  const { data } = await query;
  const config: Record<string, string> = {};
  for (const row of data ?? []) {
    config[row.key] = row.value;
  }
  return config;
}
