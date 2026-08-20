import { createOpenAI } from "@ai-sdk/openai";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { buildSystemPrompt } from "@/lib/assistant-knowledge";
import { createRunIdFetch, getRunIdFromRequest } from "@/lib/ai-run-id.server";

type ChatBody = {
  messages?: unknown;
  sessionId?: unknown;
  projectSlug?: unknown;
};

function textOf(message: UIMessage | undefined): string {
  if (!message) return "";
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
    .trim();
}

async function persist(
  sessionId: string,
  role: "user" | "assistant",
  content: string,
  projectSlug: string | null,
) {
  if (!sessionId || !content) return;
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("assistant_messages")
      .insert({ session_id: sessionId, role, content, project_slug: projectSlug });
    if (error) console.error("assistant persist failed", error.message);
  } catch (err) {
    console.error("assistant persist threw", err);
  }
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as ChatBody;
        const messages = body.messages;
        if (!Array.isArray(messages) || messages.length === 0) {
          return new Response("Messages are required", { status: 400 });
        }
        const uiMessages = messages as UIMessage[];
        const sessionId =
          typeof body.sessionId === "string" ? body.sessionId.slice(0, 64) : "";
        const projectSlug =
          typeof body.projectSlug === "string" ? body.projectSlug.slice(0, 80) : null;

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const runIdFetch = createRunIdFetch(getRunIdFromRequest(request));
        const lovable = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey,
          headers: {
            "Lovable-API-Key": apiKey,
            "X-Lovable-AIG-SDK": "vercel-ai-sdk",
          },
          fetch: runIdFetch.fetch,
        });

        await persist(
          sessionId,
          "user",
          textOf(uiMessages[uiMessages.length - 1]),
          projectSlug,
        );

        try {
          const result = streamText({
            model: lovable.responses("openai/gpt-5.6-sol"),
            system: buildSystemPrompt(projectSlug),
            messages: await convertToModelMessages(uiMessages),
            abortSignal: request.signal,
            providerOptions: {
              openai: {
                store: false,
                forceReasoning: true,
                reasoningEffort: "low",
                reasoningSummary: "auto",
                include: ["reasoning.encrypted_content"],
              },
            },
          });

          return result.toUIMessageStreamResponse({
            originalMessages: uiMessages,
            sendReasoning: true,
            onFinish: async ({ responseMessage }) => {
              await persist(
                sessionId,
                "assistant",
                textOf(responseMessage as UIMessage),
                projectSlug,
              );
            },
          });
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") {
            return new Response("Cancelled", { status: 499 });
          }
          const message = err instanceof Error ? err.message : "Assistant failed";
          console.error("assistant stream failed", message);
          return new Response(message, { status: 500 });
        }
      },
    },
  },
});