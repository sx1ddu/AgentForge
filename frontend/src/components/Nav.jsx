import { MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";

const Nav = () => {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);

  return (
    <div className="h-14 flex items-center justify-between px-5 border-b border-white/[0.06] bg-[#0d0f14] shrink-0">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 shrink-0">
          <MessageSquare size={14} className="text-indigo-400" />
        </div>

        <div className="text-[13.5px] font-semibold text-slate-100 tracking-tight truncate max-w-sm md:max-w-md">
          {selectedConversation?.title || "New Conversation"}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full">
          {messages?.length || 0} Messages
        </span>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10.5px] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Agents Online</span>
        </div>
      </div>
    </div>
  );
};

export default Nav;
