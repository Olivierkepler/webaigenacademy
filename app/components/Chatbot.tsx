"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "./logo";
import BlinkingRobot from "./BlinkingRobot";

type Message = {
  role: "bot" | "user";
  text: string;
};

const quickQuestions = [
  "What services do you offer?",
  "How much does a website cost?",
  "Can I book a consultation?",
  "How can AI help my business?",
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hi, I’m your WebAiGen assistant. I can help with services, pricing, consultations, and AI solutions for your business.",
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage(text?: string) {
    const messageText = text || input.trim();
    if (!messageText) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: messageText },
      {
        role: "bot",
        text: "Thanks for sharing that. A WebAiGen specialist can help you choose the right solution. Tell me a little more about your business goal, or book a consultation to get personalized guidance.",
      },
    ]);

    setInput("");
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex cursor-pointer items-center justify-center rounded-full transition duration-300 hover:scale-[1.03] active:scale-95"
          aria-label="Open WebAiGen assistant"
        >
          <span className="absolute h-24 w-24 rounded-full bg-[#0F766E]/10 blur-2xl" />
          <BlinkingRobot size={145} />
        </button>
      )}

      {open && (
        <section className="fixed bottom-6 right-6 z-50 w-[440px] max-w-[calc(100vw-1.25rem)] overflow-hidden rounded-[0.75rem] border border-zinc-200/80 bg-white text-zinc-950 shadow-[0_30px_100px_rgba(0,0,0,0.18)] backdrop-blur-2xl dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
         <header className="relative overflow-hidden  bg-[#003334] px-6 py-5 text-white">
  <div className="relative flex items-center justify-between gap-4">
    <div className="flex items-center gap-4">
       <Logo size={42} color="white" />
    

      <div className="leading-none tracking-tight" >
        <h2 className="text-xl font-bold tracking-[-0.03em] text-white">
          WebAiGen 
          <br />
        <span className="text-sm font-medium tracking-tight text-zinc-200">  Academy</span>
        </h2>

     
      </div>
    </div>

    <div className="flex items-center gap-3">
    

      <button
        type="button"
        onClick={() => setOpen(false)}
        className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
        aria-label="Close chat"
      >
        ✕
      </button>
    </div>
  </div>
</header>

          <div className="h-[500px] overflow-y-auto bg-[linear-gradient(to_bottom,#fafafa,#f4f4f5)] px-6 py-6 dark:bg-[linear-gradient(to_bottom,#09090b,#18181b)]">
            <div className="space-y-5">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-end gap-3 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "bot" && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center dark:border-zinc-800 dark:bg-zinc-900">
                      <Logo size={24} />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-3xl px-5 py-3.5 text-[15px] leading-7 shadow-sm ${
                      msg.role === "user"
                        ? "rounded-br-md bg-[#0F766E] text-white"
                        : "rounded-bl-md border border-zinc-200 bg-white text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <footer className="border-t border-zinc-200/80 bg-white px-5 py-5 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => sendMessage(question)}
                  className="shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-semibold text-zinc-600 transition hover:border-[#0F766E]/30 hover:bg-[#0F766E]/5 hover:text-[#0F766E] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:text-[#5EEAD4]"
                >
                  {question}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white p-1.5 shadow-inner transition focus-within:border-[#0F766E]/40 focus-within:ring-4 focus-within:ring-[#0F766E]/10 dark:border-zinc-800 dark:bg-zinc-900">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask WebAiGen anything..."
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm font-medium text-zinc-950 outline-none placeholder:text-zinc-400 dark:text-white dark:placeholder:text-zinc-500"
              />

              <button
                type="button"
                onClick={() => sendMessage()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 active:scale-95"
                aria-label="Send message"
              >
                →
              </button>
            </div>
          </footer>
        </section>
      )}
    </>
  );
}