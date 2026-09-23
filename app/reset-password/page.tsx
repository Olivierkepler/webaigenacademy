import { Suspense } from "react";
import ResetPasswordPanel from "./ResetPasswordPanel";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-[calc(100vh-var(--navbar-height))] items-center justify-center bg-zinc-50 px-6 py-12 font-[Inter,Helvetica_Neue,Arial,sans-serif] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <Suspense
        fallback={
          <div className="h-96 w-full max-w-md rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
        }
      >
        <ResetPasswordPanel />
      </Suspense>
    </main>
  );
}