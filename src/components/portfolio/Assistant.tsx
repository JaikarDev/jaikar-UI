import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { UIMessage } from "ai";
import crtHead from "@/assets/crt-head.png.asset.json";
import {
  articles,
  capabilities,
  contact,
  dailyToolkit,
  experience,
  projects,
  resumes,
} from "@/data/portfolio";
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

export const ASSISTANT_EVENT = "jp-assistant-open";

type LocalMessage = UIMessage & {
  role: "user" | "assistant";
  parts: [{ type: "text"; text: string }];
};

export function openAssistant(projectSlug?: string) {
  window.dispatchEvent(
    new CustomEvent(ASSISTANT_EVENT, { detail: { projectSlug: projectSlug ?? null } }),
  );
}

const GENERAL_PROMPTS = [
  "What does Jaikar actually do?",
  "Show me his strongest shipped game UI work",
  "I'm hiring for product / UX - what should I look at?",
  "How does he take Figma into Unreal?",
];

function message(role: "user" | "assistant", text: string): LocalMessage {
  return {
    id: `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`,
    role,
    parts: [{ type: "text", text }],
  } as LocalMessage;
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function projectByQuestion(question: string, focusSlug: string | null) {
  const q = normalize(question);
  const aliases: Record<string, string[]> = {
    "the-dark-arrival": ["dark arrival", "steam", "journal", "investigator", "diegetic"],
    "suite-13": ["suite 13", "suite", "thriller", "hud", "tension"],
    "customized-angel": ["customized angel", "angel", "timeline", "deduction", "itch"],
    "find-the-octopus": ["octopus", "play store", "live ops", "vip", "power up"],
    "tale-of-ronin": ["ronin", "sumi", "ink"],
    "find-the-dog": ["dog", "mobile progression"],
    "coffee-bean": ["coffee", "ordering", "product ui"],
    "smart-guardian": ["smart guardian", "elder", "fall", "health", "emergency"],
  };
  const direct = projects.find((project) =>
    [project.title, project.id, ...(aliases[project.id] ?? [])].some((term) =>
      q.includes(normalize(term)),
    ),
  );
  return direct ?? projects.find((project) => project.id === focusSlug);
}

function projectAnswer(project: (typeof projects)[number]) {
  return [
    `${project.title} - ${project.kind} / ${project.status}`,
    "",
    project.description,
    "",
    `Problem: ${project.study.problem}`,
    `Decision: ${project.study.decision}`,
    `Outcome: ${project.study.outcome}`,
    "",
    `Role: ${project.details.role}`,
    `Built with: ${project.details.engine}`,
    "",
    ...project.impact.map((impact) => `- ${impact.label}: ${impact.value} - ${impact.detail}`),
    "",
    ...project.links.map((link) => `${link.label}: ${link.href}`),
  ].join("\n");
}

function answer(question: string, focusSlug: string | null) {
  const q = normalize(question);
  const focused = projectByQuestion(question, focusSlug);
  if (focused) return projectAnswer(focused);

  if (q.includes("product") || q.includes("ux")) {
    const picks = projects.filter((project) => project.category === "product");
    return [
      "For product / UX roles, start with these:",
      "",
      ...picks.map(
        (project) =>
          `- ${project.title}: ${project.description} Proof: ${project.study.proof.join("; ")}`,
      ),
      "",
      `Product resume: ${resumes.find((resume) => resume.title.includes("PRODUCT"))?.href}`,
    ].join("\n");
  }

  if (q.includes("game") || q.includes("ui") || q.includes("shipped") || q.includes("strong")) {
    const picks = projects.filter((project) => project.category === "game").slice(0, 4);
    return [
      "Strongest game UI work:",
      "",
      ...picks.map(
        (project) =>
          `- ${project.title}: ${project.kind}, ${project.status}. ${project.study.outcome}`,
      ),
      "",
      `Game UI resume: ${resumes.find((resume) => resume.title.includes("GAME"))?.href}`,
    ].join("\n");
  }

  if (q.includes("figma") || q.includes("unreal") || q.includes("engine") || q.includes("umg")) {
    return [
      "Jaikar works from Figma into engine by designing the flow and states first, then building modular UI systems in UE5 UMG / Blueprint or Unity uGUI.",
      "The clearest proof is The Dark Arrival: a diegetic 3D Investigator Journal where menus, HUD, and journal share one UMG component system.",
      "Suite 13 also shows HUD logic and motion specs captured in Figma for UE5 implementation.",
    ].join("\n\n");
  }

  if (q.includes("experience") || q.includes("work history")) {
    return experience
      .map((item) =>
        [
          `${item.company} - ${item.role}`,
          `${item.period} / ${item.meta}`,
          item.summary,
          ...item.bullets.slice(0, 3).map((bullet) => `- ${bullet}`),
        ]
          .filter(Boolean)
          .join("\n"),
      )
      .join("\n\n");
  }

  if (q.includes("resume") || q.includes("contact") || q.includes("email") || q.includes("hire")) {
    return [
      `Email: ${contact.email}`,
      `LinkedIn: ${contact.linkedin}`,
      "",
      ...resumes.map((resume) => `${resume.title}: ${resume.href}`),
    ].join("\n");
  }

  if (q.includes("tool") || q.includes("software") || q.includes("skill")) {
    return [
      `Daily toolkit: ${dailyToolkit.join(", ")}`,
      "",
      ...capabilities.map((capability) => `- ${capability.title}: ${capability.chips.join(", ")}`),
    ].join("\n");
  }

  if (q.includes("writing") || q.includes("article")) {
    return articles
      .map((article) => `${article.title} - ${article.body}\n${article.href}`)
      .join("\n\n");
  }

  return [
    "JP-01 reads from Jaikar's portfolio case files only.",
    "Ask about The Dark Arrival, Suite 13, Customized Angel, Find the Octopus, Smart Guardian, product UX work, tools, resumes, or contact.",
    `For direct contact: ${contact.email}`,
  ].join("\n");
}

export function Assistant() {
  const [open, setOpen] = useState(false);
  const [focusSlug, setFocusSlug] = useState<string | null>(null);
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const focusProject = focusSlug
    ? projects.find((project) => project.id === focusSlug)
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

  const submit = useCallback(
    (text: string) => {
      const value = text.trim();
      if (!value) return;
      setInput("");
      feedback("click");
      setMessages((current) => [
        ...current,
        message("user", value),
        message("assistant", answer(value, focusSlug)),
      ]);
    },
    [focusSlug],
  );

  const reset = useCallback(() => {
    setMessages([]);
    feedback("close");
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen((value) => !value);
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
                {focusProject ? `FOCUS · ${focusProject.title}` : "STATIC MODE · CASE FILES"}
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
              x
            </button>
          </header>

          <Conversation className="flex-1">
            <ConversationContent className="gap-4 px-4 py-4">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="max-w-[34ch] font-mono text-[11px] leading-relaxed uppercase tracking-[0.14em] text-foreground/60">
                    {focusProject
                      ? `Deep-dive mode on ${focusProject.title}. Ask about the problem, decisions, build, or results.`
                      : "I answer inside GitHub Pages from Jaikar's embedded case files. No server route."}
                  </p>
                </div>
              )}

              {messages.map((item) => {
                const text = item.parts
                  .map((part) => (part.type === "text" ? part.text : ""))
                  .join("");
                if (!text) return null;
                return (
                  <Message from={item.role} key={item.id}>
                    {item.role === "assistant" ? (
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
                <PromptInputSubmit disabled={input.trim().length === 0} />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      )}
    </>
  );
}
