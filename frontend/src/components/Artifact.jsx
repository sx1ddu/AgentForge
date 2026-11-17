import {
  Check,
  Code2,
  Copy,
  Download,
  Eye,
  PanelRightClose,
  PanelRightOpen,
  X,
  FileCode,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { AnimatePresence, easeInOut, motion } from "motion/react";
import Editor from "@monaco-editor/react";

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

const PanelContent = ({
  artifacts,
  collapsed,
  setCollapsed,
  tab,
  setTab,
  activeFile,
  setActiveFile,
  copied,
  handleCopy,
  handleDownloadActive,
  canPreview,
  previewDoc,
  file,
  detectLanguage,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ width: 480 }}
      animate={{ width: collapsed ? 48 : 480 }}
      transition={{ duration: 0.2, ease: easeInOut }}
      className="flex h-full border-l border-white/[0.07] flex-col overflow-hidden shrink-0 w-full lg:w-[480px] bg-[#090b10] select-none"
    >
      {!collapsed ? (
        <div className="flex flex-col h-full bg-[#090b10]">
          {/* Top Panel Bar */}
          <div className="h-14 px-4 border-b border-white/[0.07] flex items-center justify-between shrink-0 bg-[#0c0e15]">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer shrink-0"
                onClick={onClose ?? (() => setCollapsed(true))}
                title="Collapse Panel"
              >
                {onClose ? <X size={15} /> : <PanelRightClose size={15} />}
              </button>

              <div className="flex items-center gap-2 min-w-0">
                <FileCode size={14} className="text-lime-400 shrink-0" />
                <span className="text-xs font-bold text-white truncate">
                  {artifacts[0]?.title || "Code Artifact"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Code vs Live Preview Mode Switcher */}
              {canPreview && (
                <div className="flex items-center bg-[#131622] border border-white/[0.08] p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setTab("code")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md transition cursor-pointer ${
                      tab === "code"
                        ? "bg-lime-400 text-[#08090D]"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Code2 size={12} /> Code
                  </button>

                  <button
                    type="button"
                    onClick={() => setTab("preview")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md transition cursor-pointer ${
                      tab === "preview"
                        ? "bg-lime-400 text-[#08090D]"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Eye size={12} /> Preview
                  </button>
                </div>
              )}

              {/* Copy & Download Actions */}
              <button
                type="button"
                onClick={handleCopy}
                title="Copy current file"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition cursor-pointer"
              >
                {copied ? <Check size={14} className="text-lime-400" /> : <Copy size={14} />}
              </button>

              <button
                type="button"
                onClick={handleDownloadActive}
                title="Download file"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition cursor-pointer"
              >
                <Download size={14} />
              </button>
            </div>
          </div>

          {/* Multi-File Tabs Bar */}
          {tab === "code" && (
            <div className="flex h-9 border-b border-white/[0.07] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0 bg-[#0e1017]">
              {artifacts[0]?.files?.map((f, index) => (
                <button
                  key={f.name || index}
                  type="button"
                  onClick={() => setActiveFile(index)}
                  className={`px-3.5 py-1.5 text-xs font-mono whitespace-nowrap transition border-r border-white/[0.07] relative cursor-pointer ${
                    activeFile === index
                      ? "text-lime-400 bg-white/[0.03] font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
                  }`}
                >
                  {f?.name}
                  {activeFile === index && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-lime-400" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Monaco Editor or Live Iframe Preview */}
          <div className="flex-1 overflow-hidden relative bg-[#090b10]">
            <div className={`w-full h-full ${tab === "preview" && canPreview ? "block" : "hidden"}`}>
              <iframe
                title="AgentForge Live Preview"
                srcDoc={previewDoc}
                sandbox="allow-scripts allow-modals"
                className="w-full h-full bg-white border-none"
              />
            </div>

            <div className={`w-full h-full ${tab === "preview" && canPreview ? "hidden" : "block"}`}>
              <Editor
                theme="vs-dark"
                language={detectLanguage(file?.name)}
                value={file?.content || ""}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 12.5,
                  wordWrap: "on",
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  padding: { top: 12 },
                  lineNumbers: "on",
                  renderLineHighlight: "none",
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex h-full border-l border-white/[0.07] bg-[#090b10] flex-col items-center py-4 gap-3 shrink-0">
          <button
            type="button"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition cursor-pointer shrink-0"
            onClick={() => setCollapsed(false)}
            title="Open Artifact Panel"
          >
            <PanelRightOpen size={16} />
          </button>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              style={{
                writingMode: "vertical-lr",
                transform: "rotate(180deg)",
              }}
              className="text-[10px] font-mono font-semibold text-slate-500 tracking-widest uppercase whitespace-nowrap"
            >
              {artifacts[0]?.title || "Artifact Preview"}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const Artifact = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState("code");
  const [activeFile, setActiveFile] = useState(0);
  const { artifacts } = useSelector((state) => state.message);
  const [copied, setCopied] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches
  );

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = (e) => setIsDesktop(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  if (!artifacts || artifacts.length === 0) return null;

  const currentArtifact = artifacts[0];
  const file = currentArtifact?.files?.[activeFile] || currentArtifact?.files?.[0];
  const htmlFile = currentArtifact?.files?.find((f) => f.name === "index.html");
  const cssFile = currentArtifact?.files?.find((f) => f.name === "style.css");
  const jsFile = currentArtifact?.files?.find((f) => f.name === "script.js");

  const canPreview = Boolean(htmlFile);

  const htmlBody = (htmlFile?.content || "")
    .replace(/<script[^>]*src=["'][^"']*["'][^>]*>\s*<\/script>/gi, "")
    .replace(/<link[^>]*href=["'][^"']*\.(css|js)["'][^>]*>/gi, "");

  const previewDoc = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
${cssFile?.content || ""}
  </style>
</head>
<body>
${htmlBody}
  <script>
${jsFile?.content || ""}
  </script>
</body>
</html>
  `;

  const detectLanguage = (filename = "") => {
    if (filename.endsWith(".html")) return "html";
    if (filename.endsWith(".css")) return "css";
    if (filename.endsWith(".js") || filename.endsWith(".jsx")) return "javascript";
    if (filename.endsWith(".ts") || filename.endsWith(".tsx")) return "typescript";
    if (filename.endsWith(".json")) return "json";
    if (filename.endsWith(".py")) return "python";
    return "plaintext";
  };

  const handleCopy = async () => {
    if (!file?.content) return;
    try {
      await navigator.clipboard.writeText(file.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy artifact content:", err);
    }
  };

  const handleDownloadActive = () => {
    if (!file?.content || !file?.name) return;
    downloadBlob(file.content, file.name);
  };

  const sharedProps = {
    artifacts,
    collapsed,
    setCollapsed,
    tab,
    setTab,
    activeFile,
    setActiveFile,
    copied,
    handleCopy,
    handleDownloadActive,
    canPreview,
    previewDoc,
    file,
    detectLanguage,
  };

  return (
    <>
      {isDesktop ? (
        <PanelContent {...sharedProps} />
      ) : (
        <>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="fixed bottom-24 right-4 z-30 flex items-center gap-1.5 px-3 py-2 bg-lime-400 text-[#08090D] font-bold text-xs rounded-xl shadow-lg cursor-pointer"
          >
            <Code2 size={15} />
            <span>Artifact</span>
          </button>

          <AnimatePresence>
            {mobileOpen && (
              <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
                <PanelContent
                  {...sharedProps}
                  collapsed={false}
                  onClose={() => setMobileOpen(false)}
                />
              </div>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
};

export default Artifact;
