import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import crtHead from "@/assets/crt-head.png.asset.json";
import { projects } from "@/data/portfolio";
import {
  clearAssistantHistory,
  getAssistantHistory,
} from "@/lib/assistant.functions";
import { feedback } from "@/lib/ui-sound";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

export const ASSISTANT_EVENT = "jp-assistant-open";

/** Open the assistant, optionally focused on a case study. */
export function openAssistant(projectSlug?: string) {
  window.dispatchEvent(
    new CustomEvent(ASSISTANT_EVENT, { detail: { projectSlug: projectSlug ?? null } }),
  );
}

const GENERAL_PROMPTS = [
  "What does Jaikar actually do?",
  "Show me his strongest shipped game UI work",
  "I'm hiring for product / UX — what should I look at?",
  "How does he take Figma into Unreal?",
];

function sessionKey() {
  const existing = localStorage.getItem("jp-assist-session");
  if (existing) return existing;
  const next = `s_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
  localStorage.setItem("jp-assist-session", next);
  return next;
}

function toUiMessages(
  rows: { id: string; role: "user" | "assistant"; content: string }[],
): UIMessage[] {
  return rows.map((row) => ({
    id: row.id,
    role: row.role,
    parts: [{ type: "text", text: row.content }],
  })) as UIMessage[];
}

export function Assistant() {
  const [open, setOpen] = useState(false);
  const [focusSlug, setFocusSlug] = useState<string | null>(null);
  const [session, setSession] = useState<string>("");
  const [history, setHistory] = useState<UIMessage[] | null>(null);
  const [input, setInput] = useState("");
  const slugRef = useRef<string | null>(null);
  const sessionRef = useRef("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const loadHistory = useServerFn(getAssistantHistory);
  const wipeHistory = useServerFn(clearAssistantHistory);

  slugRef.current = focusSlug;
  sessionRef.current = session;

  const focusProject = focusSlug
    ? projects.find((p) => p.id === focusSlug)
    : undefined;

  const suggestions = useMemo(() => {
    if (!focusProject) return GENERAL_PROMPTS;
    return [
      `What problem did ${focusProject.title} solve?`,
      "Walk me through the key design decisions",
      "What was the measurable outcome?",
      "What exactly did Jaikar build here?",
    ];
  }, [focusProject]);

  const transport = useMemo(
    () =>
      new DefaultChatTransport<UIMessage>({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ messages, body }) => ({
          body: {
            ...body,
            messages,
            sessionId: sessionRef.current,
            projectSlug: slugRef.current,
          },
        }),
      }),
    [],
  );

  const { messages, sendMessage, setMessages, status, stop } = useChat({
    id: "jp-assistant",
    transport,
    onError: (error) =>
      toast.error("ASSISTANT OFFLINE", {
        description: error.message.slice(0, 180) || "The link dropped. Try again.",
      }),
  });

  /* session + persisted history */
  useEffect(() => {
    setSession(sessionKey());
  }, []);

  useEffect(() => {
    if (!session || history) return;
    let cancelled = false;
    void loadHistory({ data: { sessionId: session } })
      .then((rows) => {
        if (cancelled) return;
        const restored = toUiMessages(rows);
        setHistory(restored);
        if (restored.length) setMessages(restored);
      })
      .catch(() => setHistory([]));
    return () => {
      cancelled = true;
    };
  }, [session, history, loadHistory, setMessages]);

  /* open from anywhere */
  useEffect(() => {
    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ projectSlug: string | null }>).detail;
      setFocusSlug(detail?.projectSlug ?? null);
      setOpen(true);
    };
    window.addEventListener(ASSISTANT_EVENT, onOpen);
    return () => window.removeEventListener(ASSISTANT_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        feedback("close");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) textareaRef.current?.focus();
  }, [open, focusSlug]);

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (!busy) textareaRef.current?.focus();
  }, [busy]);

  const submit = useCallback(
    (text: string) => {
      const value = text.trim();
      if (!value || busy) return;
      setInput("");
      feedback("click");
        void sendMessage({ text: value });
    },
    [busy, focusSlug, sendMessage],
  );

  const reset = useCallback(() => {
    setMessages([]);
    setHistory([]);
    if (sessionRef.current) void wipeHistory({ data: { sessionId: sessionRef.current } });
    feedback("close");
  }, [setMessages, wipeHistory]);

  return (
    <>
      {/* launcher */}
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          feedback("open");
        }}
        aria-expanded={open}
        aria-label={open ? "Close the JP-01 assistant" : "Ask JP-01, the portfolio assistant"}
        data-cursor="ask"
        className="fixed bottom-4 right-4 z-[80] flex items-center gap-2 border border-foreground/25 bg-background/95 px-2 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/80 transition-colors hover:border-foreground/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/70 sm:bottom-6 sm:right-6 sm:px-3"
      >
        <span className="relative block size-9 overflow-hidden border border-foreground/20 sm:size-10">
          <img
            src={crtHead.url}
            alt="JP-01 assistant: a figure with a CRT monitor for a head"
            className="size-full object-cover object-top contrast-125 saturate-0"
            loading="lazy"
          />
          <span className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(180deg,transparent_0_2px,rgba(0,0,0,0.35)_2px_3px)]" />
        </span>
        <span className="hidden sm:inline">{open ? "CLOSE JP-01" : "ASK JP-01"}</span>
      </button>

      {/* panel */}
      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="JP-01 portfolio assistant"
          className="fixed inset-x-0 bottom-0 z-[79] flex h-[82svh] flex-col border-t border-foreground/20 bg-background/98 sm:inset-x-auto sm:bottom-24 sm:right-6 sm:h-[560px] sm:w-[420px] sm:border sm:border-foreground/20"
        >
          <header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-foreground/15 px-4 py-3">
            <span className="relative block size-8 shrink-0 overflow-hidden border border-foreground/20">
              <img
                src={crtHead.url}
                alt=""
                aria-hidden="true"
                className="size-full object-cover object-top saturate-0"
              />
              <span className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(180deg,transparent_0_2px,rgba(0,0,0,0.4)_2px_3px)]" />
            </span>
            <div className="min-w-0 flex-1 basis-40">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">
                JP-01 · PORTFOLIO TERMINAL
              </p>
              <p className="mt-0.5 truncate font-mono text-[11px] uppercase tracking-[0.16em] text-foreground/85">
                {focusProject ? `FOCUS · ${focusProject.title}` : "ASK ABOUT THE WORK"}
              </p>
            </div>
            {focusProject && (
              <button
                type="button"
                onClick={() => setFocusSlug(null)}
                className="font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/45 underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/70"
              >
                CLEAR FOCUS
              </button>
            )}
            <button
              type="button"
              onClick={reset}
              aria-label="Clear this conversation"
              className="font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/45 underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/70"
            >
              RESET
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close the assistant"
              className="font-mono text-xs text-foreground/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/70"
            >
              ✕
            </button>
          </header>

          <Conversation className="flex-1">
            <ConversationContent className="gap-4 px-4 py-4">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="max-w-[34ch] font-mono text-[11px] leading-relaxed uppercase tracking-[0.14em] text-foreground/60">
                    {focusProject
                      ? `Deep-dive mode on ${focusProject.title}. Ask about the problem, the decisions, the build, or the results.`
                      : "I answer from Jaikar's real case files — projects, decisions, outcomes, tools, and experience. Tell me what you're hiring for and I'll point you at the right work."}
                  </p>
                </div>
              )}

              {messages.map((message) => {
                const text = message.parts
                  .map((part) => (part.type === "text" ? part.text : ""))
                  .join("");
                if (!text) return null;
                return (
                  <Message from={message.role} key={message.id}>
                    {message.role === "assistant" ? (
                      <MessageResponse className="text-sm leading-relaxed text-foreground/90">
                        {text}
                      </MessageResponse>
                    ) : (
                      <MessageContent className="bg-primary font-mono text-[11px] uppercase tracking-[0.1em] text-primary-foreground">
                        {text}
                      </MessageContent>
                    )}
                  </Message>
                );
              })}

              {status === "submitted" && (
                <Shimmer className="font-mono text-[10px] uppercase tracking-[0.28em]">
                  READING CASE FILES...
                </Shimmer>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2 border-t border-foreground/10 px-4 py-3">
              {suggestions.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => submit(prompt)}
                  className="border border-dashed border-foreground/25 px-2 py-1 text-left font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/65 transition-colors hover:border-foreground/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/70"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <div className="border-t border-foreground/15 p-3">
            <PromptInput
              onSubmit={(_message, event) => {
                event.preventDefault();
                submit(input);
              }}
            >
              <PromptInputTextarea
                ref={textareaRef}
                value={input}
                onChange={(event) => setInput(event.currentTarget.value)}
                placeholder={
                  focusProject ? `Ask about ${focusProject.title}...` : "Ask about the work..."
                }
                className="font-mono text-[12px]"
              />
              <PromptInputFooter className="justify-end">
                <PromptInputSubmit
                  status={status}
                  disabled={!busy && input.trim().length === 0}
                  onStop={() => void stop()}
                />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      )}
    </>
  );
}