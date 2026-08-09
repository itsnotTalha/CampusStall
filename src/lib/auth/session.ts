import "server-only";

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export type SessionProfile = Pick<
  ProfileRow,
  | "id"
  | "display_name"
  | "avatar_url"
  | "university"
  | "department"
  | "bio"
  | "is_seller"
  | "role"
  | "is_verified"
>;

export type AuthContext = {
  email: string | null;
  profile: SessionProfile | null;
  userId: string;
};

export async function getAuthContext(): Promise<AuthContext | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const subject = claimsData?.claims?.sub;

  if (claimsError || typeof subject !== "string") {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id, display_name, avatar_url, university, department, bio, is_seller, role, is_verified",
    )
    .eq("id", subject)
    .maybeSingle();
  const claimEmail = claimsData?.claims?.email;

  return {
    email: typeof claimEmail === "string" ? claimEmail : null,
    profile,
    userId: subject,
  };
}
