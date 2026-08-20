import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SessionInput = z.object({ sessionId: z.string().min(1).max(64) });

export type StoredAssistantMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export const getAssistantHistory = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SessionInput.parse(input))
  .handler(async ({ data }): Promise<StoredAssistantMessage[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("assistant_messages")
      .select("id, role, content")
      .eq("session_id", data.sessionId)
      .order("created_at", { ascending: true })
      .limit(80);
    if (error) {
      console.error("assistant history failed", error.message);
      return [];
    }
    return (rows ?? []).map((row) => ({
      id: row.id as string,
      role: row.role as "user" | "assistant",
      content: row.content as string,
    }));
  });

export const clearAssistantHistory = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SessionInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("assistant_messages")
      .delete()
      .eq("session_id", data.sessionId);
    if (error) console.error("assistant clear failed", error.message);
    return { ok: !error };
  });