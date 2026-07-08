"use client";

import { useState } from "react";
import Image from "next/image";

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
        onClick={() => setOpen(true)}
        className="fixed bottom-6 cursor-pointer right-6 z-50 flex  items-center justify-center   hover:scale-105 transition"
        aria-label="Open chat"
      >
        <Image
          src="/images/chatbot.png"
          alt="AI Assistant"
          width={150}
          height={150}
          className="object-contain cursor-pointer"
        />
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-200">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/chatbot-head.png"
                alt="AI Assistant"
                width={40}
                height={40}
              />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  WebAigen Assistant
                </h3>
                <p className="text-xs text-gray-500">Online now</p>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="h-80 overflow-y-auto px-5 py-4 space-y-3 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 px-4 py-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => sendMessage(question)}
                  className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:bg-gray-100"
                >
                  {question}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500"
              />
              <button
                onClick={() => sendMessage()}
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
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