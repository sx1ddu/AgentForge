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
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`w-fit max-w-[92%] md:max-w-[76%] px-4 py-3 rounded-2xl break-words overflow-hidden leading-relaxed ${
          isUser
            ? "bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-tr-sm shadow-md"
            : "bg-[#13151c] text-slate-200 border border-white/[0.06] rounded-tl-sm shadow-sm"
        }`}
      >
        {/* Attached PDF */}
        {file && (
          <a
            href={file.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 mb-3 hover:bg-white/10 transition cursor-pointer"
          >
            <FileText size={18} className="text-red-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-white truncate font-medium">{file.name}</p>
              <p className="text-[10px] text-slate-400">
                {Math.ceil((file.size || 0) / 1024)} KB
              </p>
            </div>
            <ExternalLink size={14} className="text-slate-400 shrink-0 ml-auto" />
          </a>
        )}

        {/* Attached Images */}
        {images?.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-3">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setLightBox(img)}
                alt="attachment"
                loading="lazy"
                className="w-44 h-32 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition shadow-sm"
              />
            ))}
          </div>
        )}

        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-xl font-bold mb-3 text-slate-100 border-b border-white/10 pb-1.5">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-lg font-semibold mt-4 mb-2 text-slate-200">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-base font-semibold mt-3 mb-1.5 text-slate-200">{children}</h3>
            ),
            p: ({ children }) => <p className="mb-2.5 leading-relaxed">{children}</p>,
            ul: ({ children }) => (
              <ul className="list-disc ml-5 mb-3 space-y-1 text-slate-300">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal ml-5 mb-3 space-y-1 text-slate-300">{children}</ol>
            ),
            li: ({ children }) => <li className="pl-0.5">{children}</li>,
            code: ({ className, children }) => {
              const value = String(children).replace(/\n$/, "");
              if (!className) {
                return (
                  <code className="bg-white/10 text-indigo-300 px-1.5 py-0.5 rounded text-[13px] font-mono">
                    {value}
                  </code>
                );
              }

              const language = className?.replace("language-", "") || "plaintext";

              return (
                <div className="my-3 overflow-hidden rounded-xl border border-white/10 bg-[#0d1117] shadow-lg">
                  <div className="flex items-center justify-between bg-[#161b22] border-b border-white/10 px-4 py-2">
                    <span className="uppercase text-[11px] font-mono text-slate-400 tracking-wider">
                      {language}
                    </span>

                    <button
                      type="button"
                      onClick={() => copyCode(value)}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition cursor-pointer px-2 py-1 rounded hover:bg-white/5"
                      title="Copy code to clipboard"
                    >
                      {copiedCode === value ? (
                        <>
                          <Check size={14} className="text-emerald-400" />
                          <span className="text-emerald-400 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
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
                      padding: "14px 16px",
                      background: "#0d1117",
                      fontSize: "12.5px",
                      lineHeight: "1.6",
                    }}
                  >
                    {value}
                  </SyntaxHighlighter>
                </div>
              );
            },
            table: ({ children }) => (
              <div className="overflow-x-auto my-3">
                <table className="border-collapse border border-white/10 w-full text-xs text-left">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border border-white/10 bg-white/5 px-3 py-2 font-semibold text-slate-200">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-white/10 px-3 py-2 text-slate-300">
                {children}
              </td>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:text-indigo-300 underline inline-flex items-center gap-1 font-medium"
              >
                {children} <ExternalLink size={13} />
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
                  className="max-w-md max-h-72 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition my-2 shadow-md"
                />
              );
            },
          }}
        >
          {content}
        </Markdown>
      </div>

      {lightBox && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6 cursor-zoom-out"
          onClick={() => setLightBox(null)}
        >
          <button
            type="button"
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 cursor-pointer transition"
            onClick={() => setLightBox(null)}
          >
            ✕
          </button>

          <img
            src={lightBox}
            alt="expanded preview"
            className="max-w-[92vw] max-h-[88vh] rounded-2xl border border-white/10 shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
