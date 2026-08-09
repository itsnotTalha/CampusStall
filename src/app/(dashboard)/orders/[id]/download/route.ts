import { NextResponse, type NextRequest } from "next/server";

import { getAuthContext } from "@/lib/auth/session";
import { databaseIdPattern } from "@/lib/orders/validation";
import { createClient } from "@/lib/supabase/server";

const signedUrlLifetimeSeconds = 60;

function orderErrorRedirect(request: NextRequest, orderId: string) {
  return NextResponse.redirect(
    new URL(`/orders/${orderId}?error=download`, request.url),
    303,
  );
}

function safeDownloadName(value: string) {
  const sanitized = value.replace(/[^a-zA-Z0-9._ -]/g, "-").slice(0, 140);
  return sanitized || "campusstall-project.zip";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!databaseIdPattern.test(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const auth = await getAuthContext();
  if (!auth) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("next", `/orders/${id}`);
    return NextResponse.redirect(signInUrl, 303);
  }

  const supabase = await createClient();
  const { data: files, error: entitlementError } = await supabase.rpc(
    "get_entitled_project_file",
    { target_order_id: id },
  );
  const file = files?.[0];

  if (entitlementError || !file) return orderErrorRedirect(request, id);

  const { data, error } = await supabase.storage
    .from("project-archives")
    .createSignedUrl(file.storage_path, signedUrlLifetimeSeconds, {
      download: safeDownloadName(file.original_filename),
    });

  if (error || !data.signedUrl) return orderErrorRedirect(request, id);

  const response = NextResponse.redirect(data.signedUrl, 303);
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
