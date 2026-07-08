"use client";

import { useState } from "react";
import Image from "next/image";
import { accent } from "@/app/lib/typography";
import Logo from "./logo";

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
        <Image
          src="/images/chatbot.png"
          alt="AI Assistant"
          width={150}
          height={150}
          className="cursor-pointer object-contain"
        />
      </button>

      {open && (
        <div className="fixed bottom-12 right-8 z-50 w-[430px] max-w-[calc(100vw-1rem)] overflow-hidden rounded-3xl border border-zinc-200 bg-white text-zinc-900 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
          <div className="flex items-center justify-between border-b border-zinc-200 px-7 py-6 dark:border-zinc-800">
            <div className="flex items-center gap-4">
              {/* <Image
                src="/images/chatbot-head.png"
                alt="AI Assistant"
                width={54}
                height={54}
              /> */}
              <Logo size={44} />
              <div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                  WebAigen Assistant
                </h3>
                <p className={`text-sm ${accent.text}`}>Online now</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xl text-zinc-400 transition hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="h-[410px] space-y-4 overflow-y-auto bg-zinc-50 px-7 py-5 dark:bg-zinc-950">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-3xl px-5 py-3 text-base leading-relaxed ${
                    msg.role === "user"
                      ? `${accent.bg} text-white`
                      : "border border-zinc-200 bg-white text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex flex-wrap gap-3">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => sendMessage(question)}
                  className="rounded-full border border-zinc-200 px-4 py-2 text-sm text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  {question}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                className={`flex-1 rounded-full border border-zinc-300 bg-white px-5 py-3 text-base text-zinc-900 outline-none transition dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 ${accent.focusBorder}`}
              />
              <button
                type="button"
                onClick={() => sendMessage()}
                className={`rounded-full px-5 py-3 text-base font-medium text-white transition ${accent.bg} ${accent.hoverBg}`}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
