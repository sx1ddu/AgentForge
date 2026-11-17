import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  FileText,
  Copy,
  Check,
  Code2,
  ZoomIn,
  X,
} from "lucide-react";
import WorkflowSummary from "./WorkflowSummary";
import Badge from "../ui/Badge";

export default function MessageItem({
  message,
  onOpenArtifact,
  hasArtifacts = false,
}) {
  const isUser = message.role === "user";
  const [copiedCode, setCopiedCode] = useState("");
  const [activeImageZoom, setActiveImageZoom] = useState(null);

  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(""), 2500);
    } catch (e) {
      console.warn("Failed to copy code:", e);
    }
  };

  if (isUser) {
    return (
      <div className="flex justify-end my-4 select-text animate-fadeIn">
        <div className="max-w-[85%] sm:max-w-[75%] bg-[var(--forge-surface-elevated)] border border-[var(--forge-border-strong)] rounded-2xl rounded-tr-sm px-4 py-3 shadow-xs">
          {/* Attached File Chip */}
          {message.file && (
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[var(--forge-border)] text-xs text-[var(--forge-accent)]">
              <FileText className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="font-medium truncate">{message.file.name}</span>
              {message.file.size && (
                <span className="text-[10px] font-mono text-[var(--forge-text-muted)]">
                  ({Math.round(message.file.size / 1024)} KB)
                </span>
              )}
            </div>
          )}

          <div className="text-xs sm:text-sm text-[var(--forge-text)] leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  // Assistant message
  const isTeam =
    message.agent?.toLowerCase() === "team" ||
    (message.content && message.content.includes("Planner") && message.content.includes("Reviewer"));

  return (
    <div className="flex items-start gap-3.5 my-5 max-w-3xl select-text animate-fadeIn">
      {/* Assistant Avatar */}
      <div className="w-8 h-8 rounded-lg bg-[var(--forge-surface-elevated)] border border-[var(--forge-accent)]/30 text-[var(--forge-accent)] font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5">
        AF
      </div>

      <div className="flex-1 min-w-0">
        {/* Header Metadata */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-[var(--forge-text)]">
            AgentForge
          </span>
          {message.agent && (
            <Badge variant="lime" size="xs">
              {message.agent.toUpperCase()}
            </Badge>
          )}
        </div>

        {/* Multi-Agent Workflow Summary if Team mode */}
        {isTeam && <WorkflowSummary />}

        {/* Attached Generated Images */}
        {message.images && message.images.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {message.images.map((imgUrl, i) => (
              <div
                key={i}
                className="relative group rounded-xl overflow-hidden border border-[var(--forge-border)] cursor-zoom-in"
                onClick={() => setActiveImageZoom(imgUrl)}
              >
                <img
                  src={imgUrl}
                  alt={`Generated artifact ${i + 1}`}
                  className="w-56 h-36 object-cover hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                  <ZoomIn className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Markdown Content Surface */}
        <div className="prose prose-sm max-w-none text-[var(--forge-text)] text-xs sm:text-[13px] leading-relaxed break-words space-y-3">
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-base font-bold text-[var(--forge-text)] mt-4 mb-2 pb-1 border-b border-[var(--forge-border)]">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-sm font-semibold text-[var(--forge-text)] mt-3 mb-1.5">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xs font-semibold text-[var(--forge-text)] mt-2 mb-1">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-[var(--forge-text-secondary)] leading-relaxed mb-2.5">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-5 space-y-1 mb-2.5 text-[var(--forge-text-secondary)]">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-5 space-y-1 mb-2.5 text-[var(--forge-text-secondary)]">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-[var(--forge-accent)] pl-3 my-2 text-[var(--forge-text-muted)] italic">
                  {children}
                </blockquote>
              ),
              code: ({ inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || "");
                const codeString = String(children).replace(/\n$/, "");

                if (!inline && match) {
                  const isCopied = copiedCode === codeString;
                  return (
                    <div className="rounded-xl border border-[var(--forge-border-strong)] overflow-hidden my-3 shadow-md bg-[#0a0e0b]">
                      {/* Code Block Header */}
                      <div className="flex items-center justify-between px-3.5 py-2 bg-[#111612] border-b border-[var(--forge-border)] text-[10px] font-mono text-[var(--forge-text-muted)]">
                        <span className="uppercase tracking-wider text-[var(--forge-accent)] font-semibold">
                          {match[1]}
                        </span>
                        <button
                          onClick={() => copyToClipboard(codeString)}
                          className="flex items-center gap-1.5 text-[var(--forge-text-secondary)] hover:text-white transition-colors cursor-pointer"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-[var(--forge-accent)]" />
                              <span className="text-[var(--forge-accent)]">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy code</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Code Syntax Highlight */}
                      <SyntaxHighlighter
                        language={match[1]}
                        style={vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          padding: "1rem",
                          background: "transparent",
                          fontSize: "11px",
                          lineHeight: "1.7",
                          fontFamily: 'var(--font-mono, "IBM Plex Mono", monospace)',
                        }}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  );
                }

                return (
                  <code
                    className="font-mono text-[11px] bg-[var(--forge-surface-elevated)] text-[var(--forge-accent)] px-1.5 py-0.5 rounded border border-[var(--forge-border)]"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </Markdown>
        </div>

        {/* View Code Artifact Trigger Button if Artifacts Exist */}
        {hasArtifacts && onOpenArtifact && (
          <div className="mt-3.5 pt-2.5 border-t border-[var(--forge-border)]">
            <button
              onClick={onOpenArtifact}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--forge-border-strong)] bg-[var(--forge-surface-elevated)] hover:border-[var(--forge-accent)] hover:text-[var(--forge-accent)] text-xs font-medium text-[var(--forge-text)] transition-colors cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5 text-[var(--forge-accent)]" />
              <span>Inspect generated file artifacts</span>
              <span className="text-[10px] font-mono text-[var(--forge-text-muted)]">
                →
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Image Lightbox Modal */}
      {activeImageZoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => setActiveImageZoom(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setActiveImageZoom(null)}
              className="absolute -top-10 right-0 text-white hover:text-[var(--forge-accent)] cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={activeImageZoom}
              alt="Zoomed preview"
              className="max-w-full max-h-[85vh] rounded-lg border border-[var(--forge-border)] shadow-2xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
