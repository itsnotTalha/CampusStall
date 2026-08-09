"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { FormActionState } from "@/lib/auth/action-state";
import { getSafeNextPath } from "@/lib/auth/redirect";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readPassword(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateOptionalUrl(value: string) {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function signInAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const email = readText(formData, "email").toLowerCase();
  const password = readPassword(formData, "password");

  if (!isValidEmail(email) || !password) {
    return { error: "Enter a valid email address and password." };
  }

  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured for this environment." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Unable to sign in. Check your email and password." };
  }

  revalidatePath("/", "layout");
  redirect(getSafeNextPath(formData.get("next")));
}

export async function signUpAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const name = readText(formData, "name");
  const email = readText(formData, "email").toLowerCase();
  const password = readPassword(formData, "password");
  const confirmPassword = readPassword(formData, "confirmPassword");
  const avatarUrl = readText(formData, "avatarUrl");
  const university = readText(formData, "university");
  const department = readText(formData, "department");
  const bio = readText(formData, "bio");
  const isSeller = formData.get("isSeller") === "on";

  if (name.length < 2 || name.length > 80) {
    return { error: "Name must be between 2 and 80 characters." };
  }

  if (!isValidEmail(email)) {
    return { error: "Enter a valid email address." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  if (university.length > 120 || department.length > 80 || bio.length > 500) {
    return { error: "One or more profile fields are too long." };
  }

  if (!validateOptionalUrl(avatarUrl)) {
    return { error: "Avatar must be a valid http or https URL." };
  }

  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured for this environment." };
  }

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || origin;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        avatar_url: avatarUrl,
        bio,
        department,
        full_name: name,
        is_seller: isSeller,
        university,
      },
      ...(siteUrl
        ? { emailRedirectTo: `${siteUrl}/auth/confirm?next=/dashboard` }
        : {}),
    },
  });

  if (error) {
    return { error: "Unable to create your account. Please try again." };
  }

  revalidatePath("/", "layout");

  if (data.session) {
    redirect("/dashboard");
  }

  return {
    success: "Check your email to confirm your account, then sign in.",
  };
}

export async function updateProfileAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const displayName = readText(formData, "name");
  const avatarUrl = readText(formData, "avatarUrl");
  const university = readText(formData, "university");
  const department = readText(formData, "department");
  const bio = readText(formData, "bio");
  const isSeller = formData.get("isSeller") === "on";

  if (displayName.length < 2 || displayName.length > 80) {
    return { error: "Name must be between 2 and 80 characters." };
  }

  if (university.length > 120 || department.length > 80 || bio.length > 500) {
    return { error: "One or more profile fields are too long." };
  }

  if (!validateOptionalUrl(avatarUrl)) {
    return { error: "Avatar must be a valid http or https URL." };
  }

  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured for this environment." };
  }

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (typeof userId !== "string") {
    return { error: "Your session has expired. Please sign in again." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      avatar_url: avatarUrl || null,
      bio: bio || null,
      department: department || null,
      display_name: displayName,
      is_seller: isSeller,
      university: university || null,
    })
    .eq("id", userId);

  if (error) {
    return { error: "Unable to update your profile. Please try again." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/settings");
  return { success: "Profile updated." };
}
