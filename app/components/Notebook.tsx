"use client";

import { useMemo } from "react";

type NotebookProps = {
  notebook: string;
  sessionKey: string;
};

function workspaceIdForNotebook(notebook: string): string {
  return notebook
    .replace(/^lessons\//, "")
    .replace(/\.ipynb$/, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-");
}

function buildNotebookUrl(notebook: string, sessionKey: string): string {
  const params = new URLSearchParams();

  params.set("path", notebook);
  params.set("reset", "");
  params.set("mode", "single-document");
  params.set("workspace", workspaceIdForNotebook(notebook));
  params.set("_", sessionKey);

  return `/jupyterlite/lab/index.html?${params.toString()}`;
}

export default function Notebook({ notebook, sessionKey }: NotebookProps) {
  const src = useMemo(
    () => buildNotebookUrl(notebook, sessionKey),
    [notebook, sessionKey]
  );

  return (
    <iframe
      key={src}
      src={src}
      title="WebAIGenAcademy Notebook"
      className="h-[85vh] w-full rounded-xl"
    />
  );
}
