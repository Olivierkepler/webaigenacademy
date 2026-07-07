#!/usr/bin/env node
/**
 * Generate per-file Jupyter Contents API JSON under public/jupyterlite/api/contents/.
 *
 * JupyterLite only builds directory listings (all.json) during `jupyter lite build`.
 * JupyterLab still requests /api/contents/{path} for individual notebooks. Without
 * these files, the request 404s and JupyterLite falls back to stale IndexedDB copies.
 */

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const filesDir = path.join(root, "public/jupyterlite/files");
const apiDir = path.join(root, "public/jupyterlite/api/contents");

function toIsoTimestamp(date) {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

function buildContentsModel(filePath) {
  const relativePath = path.relative(filesDir, filePath).split(path.sep).join("/");
  const name = path.basename(filePath);
  const stats = fs.statSync(filePath);
  const timestamp = toIsoTimestamp(stats.mtime);
  const ext = path.extname(name).toLowerCase();

  if (ext === ".ipynb") {
    return {
      name,
      path: relativePath,
      type: "notebook",
      format: "json",
      content: JSON.parse(fs.readFileSync(filePath, "utf-8")),
      mimetype: "application/x-ipynb+json",
      writable: true,
      created: timestamp,
      last_modified: timestamp,
      size: stats.size,
    };
  }

  const format = ext === ".json" ? "json" : "text";

  return {
    name,
    path: relativePath,
    type: "file",
    format,
    content:
      format === "json"
        ? JSON.parse(fs.readFileSync(filePath, "utf-8"))
        : fs.readFileSync(filePath, "utf-8"),
    mimetype: null,
    writable: true,
    created: timestamp,
    last_modified: timestamp,
    size: stats.size,
  };
}

function walkFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
      continue;
    }

    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

if (!fs.existsSync(filesDir)) {
  console.error(`Missing JupyterLite files directory: ${filesDir}`);
  process.exit(1);
}

const files = walkFiles(filesDir);

for (const filePath of files) {
  const relativePath = path.relative(filesDir, filePath).split(path.sep).join("/");
  const destination = path.join(apiDir, relativePath);
  const model = buildContentsModel(filePath);

  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, `${JSON.stringify(model, null, 2)}\n`, "utf-8");
  console.log(`Indexed api/contents/${relativePath}`);
}

console.log(`Generated ${files.length} Contents API file(s).`);

const liteConfigPath = path.join(root, "public/jupyterlite/jupyter-lite.json");

if (fs.existsSync(liteConfigPath)) {
  const liteConfig = JSON.parse(fs.readFileSync(liteConfigPath, "utf-8"));
  const configData = liteConfig["jupyter-config-data"] ?? {};

  configData.contentsStorageName = "WebAIGen Academy Practice Labs";
  configData.workspacesStorageName = "WebAIGen Academy Workspaces";

  liteConfig["jupyter-config-data"] = configData;
  fs.writeFileSync(liteConfigPath, `${JSON.stringify(liteConfig, null, 2)}\n`, "utf-8");
  console.log("Updated jupyter-lite.json storage namespaces.");
}
