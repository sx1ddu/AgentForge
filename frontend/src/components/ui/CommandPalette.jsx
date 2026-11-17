import { useEffect, useState } from "react";
import {
  Search,
  MessageSquare,
  Plus,
  CreditCard,
  Settings,
  LogOut,
  Code2,
  X,
  Sparkles,
} from "lucide-react";

export default function CommandPalette({
  isOpen,
  onClose,
  conversations = [],
  onSelectConversation,
  onNewChat,
  onOpenBilling,
  onOpenSettings,
  onToggleArtifact,
  onLogout,
}) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          setQuery("");
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredConversations = conversations
    .filter((c) => (c.title || "New Chat").toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5);

  const staticActions = [
    {
      id: "new-chat",
      icon: Plus,
      title: "Start New Conversation",
      shortcut: "Ctrl+N",
      action: () => {
        onNewChat();
        onClose();
      },
    },
    {
      id: "toggle-artifact",
      icon: Code2,
      title: "Toggle Monaco Code Artifact",
      shortcut: "Alt+A",
      action: () => {
        onToggleArtifact();
        onClose();
      },
    },
    {
      id: "open-billing",
      icon: CreditCard,
      title: "Manage Plan & Compute Credits",
      shortcut: "Alt+B",
      action: () => {
        onOpenBilling();
        onClose();
      },
    },
    {
      id: "open-settings",
      icon: Settings,
      title: "Workspace Settings & Provider Info",
      shortcut: "Alt+S",
      action: () => {
        onOpenSettings();
        onClose();
      },
    },
    {
      id: "logout",
      icon: LogOut,
      title: "Sign Out of AgentForge",
      shortcut: "",
      action: () => {
        onLogout();
        onClose();
      },
    },
  ].filter((a) => a.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#0e1017] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/[0.05]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08] bg-[#121520]">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, conversations, or agents..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-4">
          {/* Quick Actions */}
          {staticActions.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </div>
              <div className="space-y-0.5">
                {staticActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/[0.05] text-slate-200 text-xs font-medium transition cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <action.icon size={15} className="text-lime-400 group-hover:scale-110 transition" />
                      <span>{action.title}</span>
                    </div>
                    {action.shortcut && (
                      <span className="text-[10px] font-mono text-slate-500 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">
                        {action.shortcut}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conversations Section */}
          {filteredConversations.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles size={11} className="text-indigo-400" />
                <span>Conversations</span>
              </div>
              <div className="space-y-0.5">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv._id}
                    onClick={() => {
                      onSelectConversation(conv);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/[0.05] text-slate-300 text-xs transition cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-2.5 truncate max-w-[85%]">
                      <MessageSquare size={14} className="text-slate-400 group-hover:text-indigo-400 transition shrink-0" />
                      <span className="truncate">{conv.title || "Untitled Conversation"}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">
                      Jump →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {staticActions.length === 0 && filteredConversations.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching commands or conversations found.
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#090b10] border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500">
          <span>Navigate with mouse or shortcuts</span>
          <span>
            Press <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-300 font-mono text-[10px]">ESC</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}
