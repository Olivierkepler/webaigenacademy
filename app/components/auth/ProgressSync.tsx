"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { setProgressSyncEnabled, syncProgress } from "@/app/lib/progress";

export default function ProgressSync() {
  const { status } = useSession();

  useEffect(() => {
    const signedIn = status === "authenticated";
    setProgressSyncEnabled(signedIn);

    if (signedIn) {
      void syncProgress();
    }
  }, [status]);

  return null;
}
