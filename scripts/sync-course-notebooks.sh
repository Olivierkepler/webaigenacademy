#!/usr/bin/env sh
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
JUPYTERLITE_LESSONS="$ROOT/jupyterlite-content/lessons"

mkdir -p "$JUPYTERLITE_LESSONS"

ROOT="$ROOT" node <<'EOF'
const fs = require("fs");
const path = require("path");

const root = process.env.ROOT;
const metadata = JSON.parse(
  fs.readFileSync(
    path.join(root, "courses/machine-learning/metadata.json"),
    "utf-8"
  )
);
const courseLessons = path.join(root, "courses/machine-learning/lessons");
const outputDir = path.join(root, "jupyterlite-content/lessons");
const publicLessonsDir = path.join(root, "public/lessons");
const legacyFilenames = { introduction: "ml-introduction" };

fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(publicLessonsDir, { recursive: true });

for (const lessonId of metadata.lessonOrder) {
  const lessonPath = path.join(courseLessons, lessonId, "lesson.json");
  const notebookPath = path.join(courseLessons, lessonId, "notebook.ipynb");
  const lesson = JSON.parse(fs.readFileSync(lessonPath, "utf-8"));
  const filename = `${legacyFilenames[lesson.slug] ?? lesson.slug}.ipynb`;
  const destination = path.join(outputDir, filename);
  const publicDestination = path.join(publicLessonsDir, filename);

  fs.copyFileSync(notebookPath, destination);
  fs.copyFileSync(notebookPath, publicDestination);
  console.log(`Synced ${lessonId} -> ${filename}`);
}
EOF

echo "Synced course notebooks into jupyterlite-content/lessons/"
