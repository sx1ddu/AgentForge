import { Check, Copy, ExternalLink, FileText } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const MessageBubble = ({ role, content, images, file }) => {
  const isUser = role === "user";
  const [lightBox, setLightBox] = useState(null);
  const [copiedCode, setCopiedCode] = useState("");

  const copyCode = async (code) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopiedCode(code);
      setTimeout(() => {
        setCopiedCode("");
      }, 3000);
    } catch (err) {
      console.error("Failed to copy code to clipboard:", err);
    }
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} select-text`}>
      <div
        className={`w-fit max-w-[94%] md:max-w-[80%] px-4 py-3 rounded-2xl break-words overflow-hidden leading-relaxed text-xs sm:text-[13px] ${
          isUser
            ? "bg-[#131624] text-white border border-lime-400/25 rounded-tr-sm shadow-md"
            : "bg-[#0e1017] text-slate-200 border border-white/[0.08] rounded-tl-sm shadow-sm"
        }`}
      >
        {/* Assistant Header Tag */}
        {!isUser && (
          <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-white/[0.06] text-[10.5px] font-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
            <span className="font-semibold text-slate-300">AgentForge Runtime</span>
          </div>
        )}

        {/* Attached PDF / Document */}
        {file && (
          <a
            href={file.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 mb-3 hover:bg-white/[0.06] transition cursor-pointer"
          >
            <FileText size={17} className="text-amber-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-white truncate font-medium">{file.name}</p>
              <p className="text-[10px] text-slate-400 font-mono">
                {Math.ceil((file.size || 0) / 1024)} KB
              </p>
            </div>
            <ExternalLink size={13} className="text-slate-400 shrink-0 ml-auto" />
          </a>
        )}

        {/* Attached Images */}
        {images?.length > 0 && (
          <div className="flex flex-wrap gap-2.5 mb-3">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setLightBox(img)}
                alt="attachment"
                loading="lazy"
                className="w-48 h-32 rounded-xl object-cover border border-white/[0.08] cursor-zoom-in hover:opacity-90 transition shadow-sm"
              />
            ))}
          </div>
        )}

        {/* Markdown Content */}
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-base sm:text-lg font-bold mb-2.5 text-white border-b border-white/[0.08] pb-1">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-sm sm:text-base font-semibold mt-3 mb-1.5 text-slate-100">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xs sm:text-sm font-semibold mt-2.5 mb-1 text-slate-200">
                {children}
              </h3>
            ),
            p: ({ children }) => <p className="mb-2 leading-relaxed text-slate-300">{children}</p>,
            ul: ({ children }) => (
              <ul className="list-disc ml-5 mb-2.5 space-y-1 text-slate-300">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal ml-5 mb-2.5 space-y-1 text-slate-300">{children}</ol>
            ),
            li: ({ children }) => <li className="pl-0.5">{children}</li>,
            code: ({ className, children }) => {
              const value = String(children).replace(/\n$/, "");
              if (!className) {
                return (
                  <code className="bg-[#141722] text-lime-300 px-1.5 py-0.5 rounded text-[11.5px] font-mono border border-white/[0.06]">
                    {value}
                  </code>
                );
              }

              const language = className?.replace("language-", "") || "plaintext";

              return (
                <div className="my-3 overflow-hidden rounded-xl border border-white/[0.08] bg-[#090b10] shadow-lg">
                  <div className="flex items-center justify-between bg-[#11131c] border-b border-white/[0.08] px-3.5 py-1.5">
                    <span className="uppercase text-[10px] font-mono text-lime-400 tracking-wider">
                      {language}
                    </span>

                    <button
                      type="button"
                      onClick={() => copyCode(value)}
                      className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white transition cursor-pointer px-2 py-0.5 rounded hover:bg-white/[0.06]"
                      title="Copy code"
                    >
                      {copiedCode === value ? (
                        <>
                          <Check size={12} className="text-lime-400" />
                          <span className="text-lime-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <SyntaxHighlighter
                    language={language}
                    style={oneDark}
                    wrapLongLines
                    showLineNumbers
                    customStyle={{
                      margin: 0,
                      padding: "12px 14px",
                      background: "#090b10",
                      fontSize: "12px",
                      lineHeight: "1.55",
                    }}
                  >
                    {value}
                  </SyntaxHighlighter>
                </div>
              );
            },
            table: ({ children }) => (
              <div className="overflow-x-auto my-3">
                <table className="border-collapse border border-white/[0.08] w-full text-xs text-left">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 font-semibold text-slate-200">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-white/[0.08] px-3 py-1.5 text-slate-300">
                {children}
              </td>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-lime-400 hover:text-lime-300 underline inline-flex items-center gap-1 font-medium"
              >
                {children} <ExternalLink size={12} />
              </a>
            ),
            img: ({ src, alt }) => {
              if (!src) return null;
              return (
                <img
                  src={src}
                  onClick={() => setLightBox(src)}
                  alt={alt || "image"}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  className="max-w-md max-h-72 rounded-xl object-cover border border-white/[0.08] cursor-zoom-in hover:opacity-90 transition my-2 shadow-md"
                />
              );
            },
          }}
        >
          {content}
        </Markdown>
      </div>

      {/* Lightbox Modal */}
      {lightBox && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6 cursor-zoom-out"
          onClick={() => setLightBox(null)}
        >
          <button
            type="button"
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 cursor-pointer transition"
            onClick={() => setLightBox(null)}
          >
            ✕
          </button>

          <img
            src={lightBox}
            alt="expanded preview"
            className="max-w-[92vw] max-h-[88vh] rounded-2xl border border-white/[0.08] shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
