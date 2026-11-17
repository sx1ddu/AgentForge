import { useState } from "react";
import {
  X,
  User,
  Cpu,
  Keyboard,
  Shield,
  CreditCard,
  CheckCircle2,
  Zap,
} from "lucide-react";

export default function SettingsModal({
  isOpen,
  onClose,
  userData,
  onOpenBilling,
}) {
  const [activeTab, setActiveTab] = useState("profile");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#0e1017] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#12141e]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400">
              <Zap size={15} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                AgentForge Settings & Architecture
              </h3>
              <p className="text-[11px] text-slate-400">
                Workspace configurations, provider status, and keyboard shortcuts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Header */}
        <div className="flex items-center gap-1 px-6 border-b border-white/[0.06] bg-[#090b10]">
          {[
            { id: "profile", label: "Account & Plan", icon: User },
            { id: "providers", label: "Model & Agent Providers", icon: Cpu },
            { id: "shortcuts", label: "Keyboard Shortcuts", icon: Keyboard },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
                activeTab === tab.id
                  ? "border-lime-400 text-lime-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <tab.icon size={14} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="space-y-5">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#131622] border border-white/[0.06]">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden shrink-0">
                  {userData?.avatar ? (
                    <img src={userData.avatar} alt="User avatar" className="w-full h-full object-cover" />
                  ) : (
                    userData?.name?.[0]?.toUpperCase() || "U"
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">{userData?.name || "Developer"}</div>
                  <div className="text-slate-400 text-[11px] truncate">{userData?.email || "Signed in"}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                    ID: {userData?._id || "local-user"}
                  </div>
                </div>
              </div>

              {/* Plan & Credits Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#131622] border border-white/[0.06] space-y-1">
                  <div className="text-[11px] text-slate-400">Current Subscription</div>
                  <div className="text-base font-bold text-white capitalize flex items-center gap-2">
                    {userData?.plan || "Free"}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400">
                      ACTIVE
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenBilling();
                    }}
                    className="text-[11px] text-lime-400 hover:text-lime-300 font-medium inline-flex items-center gap-1 mt-2 cursor-pointer"
                  >
                    <CreditCard size={12} />
                    Upgrade or Add Credits →
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#131622] border border-white/[0.06] space-y-1">
                  <div className="text-[11px] text-slate-400">Compute Credits</div>
                  <div className="text-base font-bold text-white">
                    {userData?.credits ?? 50}{" "}
                    <span className="text-slate-500 text-xs font-normal">/ {userData?.totalCredits || 50}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden mt-3">
                    <div
                      className="h-full bg-lime-400 rounded-full"
                      style={{
                        width: `${Math.min(100, Math.max(5, ((userData?.credits ?? 50) / (userData?.totalCredits || 50)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-[11px] text-slate-400 flex items-center gap-2">
                <Shield size={14} className="text-emerald-400 shrink-0" />
                <span>Sessions are signed with HTTP-only cookies and protected by Gateway token verification.</span>
              </div>
            </div>
          )}

          {/* PROVIDERS TAB */}
          {activeTab === "providers" && (
            <div className="space-y-4">
              <p className="text-slate-400 text-[11.5px] leading-relaxed">
                AgentForge routes reasoning through high-performance LLM engines with automated fallback redundancy:
              </p>

              <div className="space-y-2.5">
                {[
                  {
                    name: "Groq High-Speed Inference",
                    model: "Llama-3.3-70b-versatile",
                    status: "Operational",
                    desc: "Ultra-low latency primary engine for Planner, Coding, and Multi-Agent Orchestration.",
                  },
                  {
                    name: "Google Gemini AI",
                    model: "Gemini 2.0 Flash / Pro",
                    status: "Fallback Ready",
                    desc: "Multi-modal vision analysis and prompt expansion fallback provider.",
                  },
                  {
                    name: "Tavily Search Engine",
                    model: "Live Web Context API",
                    status: "Connected",
                    desc: "Real-time web search and grounded factual context retrieval.",
                  },
                  {
                    name: "Qdrant Vector Engine",
                    model: "Vector Embeddings & RAG",
                    status: "Active (In-Memory Fallback)",
                    desc: "Dense semantic retrieval for document question answering.",
                  },
                ].map((prov, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-[#131622] border border-white/[0.06] flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-white flex items-center gap-2">
                        {prov.name}
                        <span className="text-[10px] font-mono text-slate-400 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">
                          {prov.model}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">{prov.desc}</div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                      <CheckCircle2 size={10} />
                      {prov.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SHORTCUTS TAB */}
          {activeTab === "shortcuts" && (
            <div className="space-y-3">
              <p className="text-slate-400 text-[11.5px]">
                Accelerate your workflow with platform-wide keyboard shortcuts:
              </p>

              <div className="rounded-xl border border-white/[0.06] divide-y divide-white/[0.06] overflow-hidden bg-[#131622]">
                {[
                  { key: "Ctrl + K / ⌘ + K", desc: "Open Global Command Palette" },
                  { key: "Ctrl + N", desc: "Initialize New Conversation" },
                  { key: "Enter", desc: "Submit Message / Prompt to Active Agent" },
                  { key: "Shift + Enter", desc: "Insert Line Break into Composer" },
                  { key: "Esc", desc: "Dismiss Open Modal, Drawer, or Lightbox" },
                ].map((sc, i) => (
                  <div key={i} className="px-4 py-2.5 flex items-center justify-between">
                    <span className="text-slate-300 font-medium">{sc.desc}</span>
                    <kbd className="px-2 py-1 rounded bg-[#090b10] border border-white/[0.1] font-mono text-[11px] text-lime-400">
                      {sc.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#090b10] border-t border-white/[0.06] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-white/[0.08] hover:bg-white/[0.12] transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
