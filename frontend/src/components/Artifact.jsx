import {
  Check,
  Code2,
  Copy,
  Download,
  Eye,
  PanelRightClose,
  PanelRightOpen,
  X,
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
      initial={{ width: 440 }}
      animate={{ width: collapsed ? 48 : 440 }}
      transition={{ duration: 0.25, ease: easeInOut }}
      className="flex h-full border-l border-white/[0.06] flex-col overflow-hidden shrink-0 w-full lg:w-[440px]"
    >
      {!collapsed ? (
        <div className="flex flex-col h-full bg-[#0d0f14]">
          {/* Top Panel Bar */}
          <div className="h-14 px-4 border-b border-white/[0.06] flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer shrink-0"
              onClick={onClose ?? (() => setCollapsed(true))}
            >
              {onClose ? <X size={15} /> : <PanelRightClose size={16} />}
            </button>

            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 shrink-0">
                <Code2 className="text-indigo-400" size={13} />
              </div>
              <div className="text-[13px] font-semibold text-slate-200 truncate">
                {artifacts[0]?.title || "Generated Artifact"}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleCopy}
                title="Copy current file content"
                className="flex items-center gap-1 px-2 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition cursor-pointer"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>

              <button
                type="button"
                onClick={handleDownloadActive}
                title="Download current file"
                className="flex items-center gap-1 px-2 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition cursor-pointer"
              >
                <Download size={14} />
              </button>
            </div>

            {canPreview && (
              <div className="flex items-center gap-0.5 bg-white/[0.04] border border-white/[0.06] p-0.5 rounded-lg shrink-0">
                <button
                  type="button"
                  onClick={() => setTab("code")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition cursor-pointer ${
                    tab === "code"
                      ? "bg-indigo-500 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Code2 size={11} /> Code
                </button>

                <button
                  type="button"
                  onClick={() => setTab("preview")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition cursor-pointer ${
                    tab === "preview"
                      ? "bg-indigo-500 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Eye size={11} /> Preview
                </button>
              </div>
            )}
          </div>

          {/* File Tabs Bar */}
          {tab === "code" && (
            <div className="flex h-9 border-b border-white/[0.06] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0 bg-[#0a0c10]">
              {artifacts[0]?.files?.map((f, index) => (
                <button
                  key={f.name || index}
                  type="button"
                  onClick={() => setActiveFile(index)}
                  className={`px-3.5 py-1.5 text-[11.5px] font-mono whitespace-nowrap transition border-r border-white/[0.06] relative cursor-pointer ${
                    activeFile === index
                      ? "text-indigo-400 bg-white/[0.03]"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
                  }`}
                >
                  {f?.name}
                  {activeFile === index && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 rounded-t-full" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Main Content: Monaco Editor or Iframe Preview */}
          <div className="flex-1 overflow-hidden relative">
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
        <div className="hidden lg:flex h-full border-l border-white/[0.06] bg-[#0d0f14] flex-col items-center py-4 gap-3 shrink-0">
          <button
            type="button"
            className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition cursor-pointer shrink-0"
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
              className="text-[10px] font-semibold text-slate-500 tracking-widest uppercase whitespace-nowrap"
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(file?.content || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy file content:", err);
    }
  };

  const handleDownloadActive = () => {
    if (file) {
      downloadBlob(file.content || "", file.name || "code.txt");
    }
  };

  const detectLanguage = (fileName = "") => {
    const name = fileName.toLowerCase();
    if (name.endsWith(".html")) return "html";
    if (name.endsWith(".css")) return "css";
    if (name.endsWith(".js") || name.endsWith(".jsx")) return "javascript";
    if (name.endsWith(".ts") || name.endsWith(".tsx")) return "typescript";
    if (name.endsWith(".json")) return "json";
    if (name.endsWith(".py")) return "python";
    if (name.endsWith(".java")) return "java";
    if (name.endsWith(".cpp") || name.endsWith(".c")) return "cpp";
    if (name.endsWith(".md")) return "markdown";
    return "plaintext";
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-24 right-4 z-40 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[12px] font-semibold shadow-lg shadow-indigo-500/25 border-none cursor-pointer transition"
      >
        <Code2 size={14} />
        View Artifact Code
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden fixed inset-y-0 right-0 z-50 w-[90vw] max-w-[420px] border-l border-white/10 overflow-hidden bg-[#0d0f14]"
            >
              <PanelContent
                artifacts={artifacts}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                tab={tab}
                setTab={setTab}
                activeFile={activeFile}
                setActiveFile={setActiveFile}
                copied={copied}
                handleCopy={handleCopy}
                handleDownloadActive={handleDownloadActive}
                canPreview={canPreview}
                previewDoc={previewDoc}
                file={file}
                detectLanguage={detectLanguage}
                onClose={() => setMobileOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {isDesktop && (
        <PanelContent
          artifacts={artifacts}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          tab={tab}
          setTab={setTab}
          activeFile={activeFile}
          setActiveFile={setActiveFile}
          copied={copied}
          handleCopy={handleCopy}
          handleDownloadActive={handleDownloadActive}
          canPreview={canPreview}
          previewDoc={previewDoc}
          file={file}
          detectLanguage={detectLanguage}
        />
      )}
    </>
  );
};

export default Artifact;
