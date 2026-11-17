import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import Editor from "@monaco-editor/react";
import {
  X,
  Code2,
  Eye,
  Copy,
  Download,
  Check,
  FileCode,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const downloadBlob = (content, filename, mimeType = "text/plain") => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export default function ArtifactInspector({ isOpen, onClose }) {
  const { theme } = useTheme();
  const artifacts = useSelector((state) => state.message?.artifacts || []);

  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("code"); // "code" | "preview"
  const [copied, setCopied] = useState(false);

  // Normalize files array from first artifact
  const firstArtifact = artifacts?.[0];
  const files = useMemo(() => {
    if (!firstArtifact?.files || !Array.isArray(firstArtifact.files)) {
      return [];
    }
    return firstArtifact.files;
  }, [firstArtifact]);

  const activeFile = files[activeFileIndex] || files[0] || null;

  // Determine if HTML preview is possible (needs index.html)
  const hasHtml = useMemo(() => {
    return files.some((f) => f.name?.toLowerCase().endsWith(".html"));
  }, [files]);

  // Construct iframe preview document
  const previewDoc = useMemo(() => {
    if (!hasHtml) return "";
    const htmlFile = files.find((f) => f.name?.toLowerCase().endsWith(".html"));
    const cssFile = files.find((f) => f.name?.toLowerCase().endsWith(".css"));
    const jsFile = files.find((f) => f.name?.toLowerCase().endsWith(".js"));

    let html = htmlFile?.content || "";
    if (cssFile?.content) {
      html = html.replace(
        "</head>",
        `<style>${cssFile.content}</style></head>`
      );
    }
    if (jsFile?.content) {
      html = html.replace(
        "</body>",
        `<script>${jsFile.content}</script></body>`
      );
    }
    return html;
  }, [files, hasHtml]);

  // Detect language for Monaco
  const detectLanguage = (filename) => {
    if (!filename) return "plaintext";
    const ext = filename.split(".").pop().toLowerCase();
    const map = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      html: "html",
      css: "css",
      json: "json",
      md: "markdown",
      py: "python",
      sql: "sql",
      sh: "shell",
    };
    return map[ext] || "plaintext";
  };

  const handleCopy = async () => {
    if (!activeFile?.content) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(activeFile.content);
      } else {
        const ta = document.createElement("textarea");
        ta.value = activeFile.content;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn("Failed to copy file:", e);
    }
  };

  const handleDownload = () => {
    if (!activeFile) return;
    downloadBlob(activeFile.content, activeFile.name || "artifact.txt");
  };

  if (!isOpen) return null;

  return (
    <aside className="w-full sm:w-[420px] lg:w-[460px] h-full bg-[var(--forge-surface)] border-l border-[var(--forge-border)] flex flex-col flex-shrink-0 z-20 shadow-xl select-none">
      {/* Inspector Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--forge-border)] bg-[var(--forge-canvas)]">
        <div className="flex items-center gap-2 min-w-0">
          <Code2 className="w-4 h-4 text-[var(--forge-accent)] flex-shrink-0" />
          <div className="truncate">
            <h3 className="text-xs font-semibold text-[var(--forge-text)] truncate">
              {firstArtifact?.title || "Generated Artifact"}
            </h3>
            <span className="text-[10px] font-mono text-[var(--forge-text-muted)]">
              {files.length} {files.length === 1 ? "FILE" : "FILES"} · READ ONLY
            </span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            title="Copy active file content"
            className="p-1.5 rounded-md border border-[var(--forge-border)] hover:border-[var(--forge-accent)] text-[var(--forge-text-muted)] hover:text-[var(--forge-text)] transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[var(--forge-accent)]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={handleDownload}
            title="Download active file"
            className="p-1.5 rounded-md border border-[var(--forge-border)] hover:border-[var(--forge-accent)] text-[var(--forge-text-muted)] hover:text-[var(--forge-text)] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            title="Close inspector"
            className="p-1.5 rounded-md text-[var(--forge-text-muted)] hover:text-[var(--forge-text)] hover:bg-[var(--forge-surface-elevated)] transition-colors cursor-pointer ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* View Switcher (Code / Preview) */}
      <div className="flex items-center justify-between px-3 border-b border-[var(--forge-border)] bg-[var(--forge-surface-elevated)]">
        {/* File Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-1.5 flex-1 min-w-0 no-scrollbar">
          {files.map((file, idx) => {
            const isActive = idx === activeFileIndex;
            return (
              <button
                key={file.name || idx}
                onClick={() => {
                  setActiveFileIndex(idx);
                  if (activeTab === "preview" && !file.name.endsWith(".html")) {
                    setActiveTab("code");
                  }
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-[var(--forge-surface)] text-[var(--forge-accent)] border border-[var(--forge-border)] font-semibold shadow-xs"
                    : "text-[var(--forge-text-muted)] hover:text-[var(--forge-text)]"
                }`}
              >
                <FileCode className="w-3 h-3" />
                <span>{file.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tab switcher: Code / Preview */}
        {hasHtml && (
          <div className="flex items-center gap-1 pl-2 border-l border-[var(--forge-border)]">
            <button
              onClick={() => setActiveTab("code")}
              className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                activeTab === "code"
                  ? "text-[var(--forge-accent)] font-semibold"
                  : "text-[var(--forge-text-muted)] hover:text-[var(--forge-text)]"
              }`}
              title="View source"
            >
              <Code2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                activeTab === "preview"
                  ? "text-[var(--forge-accent)] font-semibold"
                  : "text-[var(--forge-text-muted)] hover:text-[var(--forge-text)]"
              }`}
              title="Interactive HTML preview"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Editor or Preview Pane */}
      <div className="flex-1 min-h-0 relative bg-[#0b0d0c]">
        {files.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center text-xs text-[var(--forge-text-muted)]">
            <Code2 className="w-8 h-8 mb-2 opacity-40 text-[var(--forge-accent)]" />
            <p>No inspectable source files returned in this run.</p>
          </div>
        ) : activeTab === "preview" && hasHtml ? (
          <iframe
            srcDoc={previewDoc}
            title="Artifact Preview"
            sandbox="allow-scripts allow-modals"
            className="w-full h-full border-0 bg-white"
          />
        ) : (
          <Editor
            height="100%"
            language={detectLanguage(activeFile?.name)}
            value={activeFile?.content || ""}
            theme={theme === "light" ? "light" : "vs-dark"}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 12,
              fontFamily: 'var(--font-mono, "IBM Plex Mono", monospace)',
              scrollBeyondLastLine: false,
              wordWrap: "on",
              lineNumbersMinChars: 3,
              padding: { top: 12, bottom: 12 },
              renderLineHighlight: "none",
            }}
          />
        )}
      </div>
    </aside>
  );
}
