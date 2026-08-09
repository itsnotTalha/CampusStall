import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: claimsData } = await supabase.auth.getClaims();

    if (claimsData?.claims?.sub) {
      await supabase.auth.signOut();
    }
  }

  revalidatePath("/", "layout");
  return NextResponse.redirect(new URL("/", request.url), { status: 302 });
}
