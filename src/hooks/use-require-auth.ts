"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export function useRequireAuth() {
  const [checkingSession, setCheckingSession] = useState(false);
  const router = useRouter();

  async function requireAuth() {
    setCheckingSession(true);
    const nextPath = `${window.location.pathname}${window.location.search}`;

    if (!isSupabaseConfigured()) {
      router.push(`/sign-in?next=${encodeURIComponent(nextPath)}`);
      return false;
    }

    const supabase = createClient();
    const { data: claimsData } = await supabase.auth.getClaims();

    if (!claimsData?.claims?.sub) {
      router.push(`/sign-in?next=${encodeURIComponent(nextPath)}`);
      return false;
    }

    setCheckingSession(false);
    return true;
  }

  return { checkingSession, requireAuth };
}
