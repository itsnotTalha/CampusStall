"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAuthContext } from "@/lib/auth/session";
import { databaseIdPattern, readDatabaseId } from "@/lib/database-id";
import { searchMessagingUsers } from "@/lib/messages/queries";
import { createClient } from "@/lib/supabase/server";

export async function openOrderConversationAction(formData: FormData) {
  const orderId = readDatabaseId(formData.get("orderId"));
  if (!orderId) redirect("/messages?error=invalid-context");

  const auth = await getAuthContext();
  if (!auth) redirect(`/sign-in?next=/orders/${orderId}`);

  const supabase = await createClient();
  const { data: conversationId, error } = await supabase.rpc(
    "get_or_create_order_conversation",
    { target_order_id: orderId },
  );

  if (error || !conversationId) redirect("/messages?error=unavailable");
  revalidatePath("/messages");
  redirect(`/messages/${conversationId}`);
}

export async function openProjectConversationAction(formData: FormData) {
  const projectId = readDatabaseId(formData.get("projectId"));
  if (!projectId) redirect("/explore?error=invalid-project");

  const auth = await getAuthContext();
  if (!auth) redirect(`/sign-in?next=/explore`);

  const supabase = await createClient();
  const { data: conversationId, error } = await supabase.rpc(
    "get_or_create_project_conversation",
    { target_project_id: projectId },
  );

  if (error || !conversationId) redirect("/messages?error=unavailable");
  revalidatePath("/messages");
  redirect(`/messages/${conversationId}`);
}

export async function sendMessageAction(formData: FormData) {
  const conversationId = readDatabaseId(formData.get("conversationId"));
  const rawBody = formData.get("body");
  const body = typeof rawBody === "string" ? rawBody.trim() : "";

  if (!conversationId || body.length < 1 || body.length > 5000) {
    redirect(
      conversationId
        ? `/messages/${conversationId}?error=invalid-message`
        : "/messages?error=invalid-message",
    );
  }

  const auth = await getAuthContext();
  if (!auth) redirect(`/sign-in?next=/messages/${conversationId}`);

  const supabase = await createClient();
  const { error } = await supabase.rpc("send_conversation_message", {
    message_body: body,
    message_kind_input: "text",
    target_conversation_id: conversationId,
  });

  if (error) redirect(`/messages/${conversationId}?error=send-failed`);
  revalidatePath("/messages");
  revalidatePath(`/messages/${conversationId}`);
  redirect(`/messages/${conversationId}?sent=1`);
}

export async function markConversationReadAction(conversationId: string) {
  if (!databaseIdPattern.test(conversationId)) return { ok: false };

  const auth = await getAuthContext();
  if (!auth) return { ok: false };

  const supabase = await createClient();
  const { error } = await supabase.rpc("mark_conversation_read", {
    target_conversation_id: conversationId,
  });

  if (error) return { ok: false };
  revalidatePath("/messages");
  revalidatePath(`/messages/${conversationId}`);
  return { ok: true };
}

export async function searchMessagingUsersAction(query: string) {
  const auth = await getAuthContext();
  if (!auth) return { users: [], error: "Not authenticated" };

  if (query.length < 3) {
    return { users: [], error: "Search query must be at least 3 characters" };
  }

  const { users, error } = await searchMessagingUsers(query);

  if (error) return { users: [], error };

  return { users, error: null };
}

export async function openDirectConversationAction(formData: FormData) {
  const userId = readDatabaseId(formData.get("userId"));
  if (!userId) redirect("/messages?error=invalid-user");

  const auth = await getAuthContext();
  if (!auth) redirect(`/sign-in?next=/messages`);

  const supabase = await createClient();
  const { data: conversationId, error } = await supabase.rpc(
    "get_or_create_direct_conversation",
    { target_user_id: userId },
  );

  if (error || !conversationId) redirect("/messages?error=unavailable");
  revalidatePath("/messages");
  redirect(`/messages/${conversationId}`);
}
