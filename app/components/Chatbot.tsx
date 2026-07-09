"use client";

import { useState } from "react";
import Image from "next/image";
import Logo from "./logo";
import BlinkingRobot from "./BlinkingRobot";

type Message = {
  role: "bot" | "user";
  text: string;
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hi, I’m your WebAigen assistant. How can I help you today?",
    },
  ]);

  const quickQuestions = [
    "What services do you offer?",
    "How much does a website cost?",
    "Can I book a consultation?",
    "How can AI help my business?",
  ];

  function sendMessage(text?: string) {
    const messageText = text || input.trim();
    if (!messageText) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: messageText },
      {
        role: "bot",
        text: "Thanks for reaching out. A WebAigen team member can help you with this. You can book a consultation or tell me more about what your business needs.",
      },
    ]);

    setInput("");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex cursor-pointer items-center justify-center transition hover:scale-105"
        aria-label="Open chat"
      >
        {/* <Image
          src="/images/chatbot.png"
          alt="AI Assistant"
          width={150}
          height={150}
          className="cursor-pointer object-contain"
        /> */}
        <BlinkingRobot size={150} />
      </button>

      {open && (
        <div className="fixed bottom-12 right-8 z-50 w-[440px] max-w-[calc(100vw-1rem)] overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white/95 text-zinc-900 shadow-[0_24px_80px_rgba(0,0,0,0.16)] backdrop-blur-xl transition-all duration-300 dark:border-zinc-800/80 dark:bg-zinc-950/95 dark:text-zinc-100">
          <div className="relative overflow-hidden border-b border-zinc-200/80 bg-gradient-to-br from-white via-zinc-50 to-[#FFF8F1] px-7 py-6 dark:border-zinc-800/80 dark:from-zinc-950 dark:via-zinc-900 dark:to-[#2A1A0E]">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#F8C89B]/20 blur-[80px]" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center">
                  <Logo size={42} />
                </div>

                {/* <div>
                  <h3 className="text-base font-bold tracking-tight text-zinc-950 dark:text-white">
                    WebAigen Assistant
                  </h3>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.16)]" />
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      Online now
                    </p>
                  </div>
                </div> */}
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="h-[550px] space-y-5 overflow-y-auto bg-[radial-gradient(circle_at_top_left,rgba(255,190,120,0.04),transparent_35%),linear-gradient(to_bottom,#fafafa,#f4f4f5)] px-7 py-6 dark:bg-[radial-gradient(circle_at_top_left,rgba(255,190,120,0.06),transparent_35%),linear-gradient(to_bottom,#09090b,#18181b)]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-end gap-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role !== "user" && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center">
                    <img
                      src="/images/webaigen_cropped.png"
                      alt="AI Assistant"
                      width={26}
                      height={26}
                      className="block dark:hidden"
                    />
                    <img
                      src="/images/weiagenlogo1.png"
                      alt="AI Assistant"
                      width={26}
                      height={26}
                      className="hidden dark:block"
                    />
                  </div>
                )}

                <div
                  className={`relative max-w-[82%] px-5 py-3.5 text-[15px] leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-[1.4rem] rounded-br-md border border-[#F6D4B3] bg-[#FFF3E8] text-[#A44A00] shadow-sm dark:border-[#7A4B22] dark:bg-[#5A3312] dark:text-[#FFE8D2]"
                      : "rounded-[1.4rem] rounded-bl-md border border-white/80 bg-white/90 text-zinc-800 shadow-sm backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/90 dark:text-zinc-100"
                  }`}
                >
                  <span>{msg.text}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-200/80 bg-white/95 px-6 py-5 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/95">
            <div className="mb-4 flex flex-nowrap gap-2.5 overflow-x-auto pb-1">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => sendMessage(question)}
                  className="whitespace-nowrap rounded-full border border-[#F3DEC8] bg-[#FFF8F1] px-4 py-2 text-sm font-medium text-[#9A5A20] transition hover:bg-[#FDEDDC] dark:border-[#5C3A1E] dark:bg-[#2A1A0E] dark:text-[#F6C28B] dark:hover:bg-[#3A2514]"
                >
                  {question}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 rounded-[1.6rem] border border-zinc-200 bg-white p-2 shadow-inner transition focus-within:border-orange-300 focus-within:ring-4 focus-within:ring-orange-100 dark:border-zinc-800 dark:bg-zinc-900 dark:focus-within:ring-orange-950/40">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask WebAigen anything..."
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-base text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
              />

              <button
                type="button"
                onClick={() => sendMessage()}
                className="group flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F59E42] text-white shadow-lg shadow-orange-500/20 transition hover:scale-105 hover:bg-[#EA8B27] active:scale-95"
                aria-label="Send message"
              >
                <span className="transition group-hover:translate-x-0.5">
                  ➤
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}