"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import ProgressSync from "./ProgressSync";

export default function AuthSessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SessionProvider>
      <ProgressSync />
      {children}
    </SessionProvider>
  );
}
