import type { Database } from "@/types/database";

type ProfileRole = Database["public"]["Enums"]["profile_role"];

export function isAdminRole(role: ProfileRole | null | undefined) {
  return role === "admin" || role === "moderator";
}
