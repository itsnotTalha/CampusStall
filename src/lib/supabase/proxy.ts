import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import {
  getSupabasePublicEnv,
  isSupabaseConfigured,
} from "@/lib/supabase/env";
import type { Database } from "@/types/database";

const protectedPrefixes = [
  "/dashboard",
  "/checkout",
  "/customization-requests",
  "/messages",
  "/orders",
  "/purchases",
  "/saved",
  "/sell",
  "/settings",
] as const;

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function redirectToSignIn(request: NextRequest) {
  const signInUrl = request.nextUrl.clone();
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  signInUrl.pathname = "/sign-in";
  signInUrl.search = "";
  signInUrl.searchParams.set("next", nextPath);

  return NextResponse.redirect(signInUrl);
}

export async function updateSession(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return isProtectedPath(request.nextUrl.pathname)
      ? redirectToSignIn(request)
      : NextResponse.next({ request });
  }

  const { url, publishableKey } = getSupabasePublicEnv();
  let response = NextResponse.next({ request });
  const supabase = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data: claimsData } = await supabase.auth.getClaims();

  if (
    isProtectedPath(request.nextUrl.pathname) &&
    !claimsData?.claims?.sub
  ) {
    return redirectToSignIn(request);
  }

  return response;
}
