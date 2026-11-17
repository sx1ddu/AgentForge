import { MessageSquare, Code2, Settings, Command, Coins } from "lucide-react";
import { useSelector } from "react-redux";

const Nav = ({ onOpenCommandPalette, onOpenSettings, onOpenBilling, onToggleArtifact }) => {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages, artifacts } = useSelector((state) => state.message);
  const { userData } = useSelector((state) => state.user);

  return (
    <header className="h-14 flex items-center justify-between px-5 border-b border-white/[0.07] bg-[#0c0e15] shrink-0 select-none">
      {/* Left: Conversation Identity */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#141722] border border-white/[0.08] text-slate-300 shrink-0">
          <MessageSquare size={14} className="text-lime-400" />
        </div>

        <div className="min-w-0">
          <h2 className="text-xs font-bold text-slate-100 tracking-tight truncate max-w-xs sm:max-w-md">
            {selectedConversation?.title || "New Conversation"}
          </h2>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            <span>{messages?.length || 0} messages</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Agents Active
            </span>
          </div>
        </div>
      </div>

      {/* Right: Quick Actions */}
      <div className="flex items-center gap-2">
        {/* Command Palette Trigger */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] text-slate-400 hover:text-slate-200 text-xs font-mono transition cursor-pointer"
          title="Command Menu (Ctrl+K)"
        >
          <Command size={12} />
          <span className="text-[11px]">⌘K</span>
        </button>

        {/* Compute Credits Pill */}
        <button
          type="button"
          onClick={onOpenBilling}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#131622] hover:bg-[#181c2b] border border-lime-400/20 text-xs font-mono text-lime-400 transition cursor-pointer"
          title="Manage Credits & Plan"
        >
          <Coins size={13} />
          <span>{userData?.credits ?? 50} cr</span>
        </button>

        {/* Artifact View Toggle */}
        <button
          type="button"
          onClick={onToggleArtifact}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition cursor-pointer ${
            artifacts?.length > 0
              ? "bg-lime-400/15 border-lime-400/30 text-lime-400 hover:bg-lime-400/20"
              : "bg-white/[0.04] border-white/[0.07] text-slate-400 hover:text-white"
          }`}
          title="Toggle Code Artifact"
        >
          <Code2 size={13} />
          <span className="hidden sm:inline">Artifact</span>
          {artifacts?.length > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
          )}
        </button>

        {/* Settings Button */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
          title="Workspace Settings"
        >
          <Settings size={15} />
        </button>
      </div>
    </header>
  );
};

export default Nav;
