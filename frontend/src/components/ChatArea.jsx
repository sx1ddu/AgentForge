import { useEffect } from "react";
import Nav from "./Nav";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useDispatch, useSelector } from "react-redux";
import getMessages from "../features/getMessages";
import { setArtifacts, setMessages } from "../redux/messageSlice";
import { Cpu } from "lucide-react";

const ChatArea = ({ onOpenCommandPalette, onOpenSettings, onOpenBilling, onToggleArtifact }) => {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { typing } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  useEffect(() => {
    const getMsg = async () => {
      if (selectedConversation?._id) {
        try {
          const data = await getMessages(selectedConversation._id);
          const messagesArray = Array.isArray(data) ? data : [];
          dispatch(setMessages(messagesArray));

          // Load latest generated artifacts for preview
          const latestArtifactMessage = [...messagesArray]
            .reverse()
            .find((msg) => msg.artifacts && msg.artifacts.length > 0);

          dispatch(setArtifacts(latestArtifactMessage?.artifacts || []));
        } catch (err) {
          console.error("Failed to load conversation messages:", err);
        }
      } else {
        dispatch(setMessages([]));
        dispatch(setArtifacts([]));
      }
    };

    getMsg();
  }, [selectedConversation?._id, dispatch]);

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#08090D] relative">
      <Nav
        onOpenCommandPalette={onOpenCommandPalette}
        onOpenSettings={onOpenSettings}
        onOpenBilling={onOpenBilling}
        onToggleArtifact={onToggleArtifact}
      />

      {/* Multi-Agent Orchestration Status Indicator (during active execution) */}
      {typing && (
        <div className="px-5 py-2 bg-[#0e1017] border-b border-white/[0.06] flex items-center justify-between text-xs font-mono animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-lime-400">
            <Cpu size={14} className="animate-spin" />
            <span className="font-semibold">LangGraph Multi-Agent Loop Executing</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-400">
            <span className="text-lime-400 font-semibold">Planner</span>
            <span>→</span>
            <span className="text-sky-400 font-semibold">Researcher</span>
            <span>→</span>
            <span className="text-indigo-400 font-semibold">Coder</span>
            <span>→</span>
            <span className="text-emerald-400 font-semibold">Reviewer</span>
          </div>
        </div>
      )}

      <MessageList />
      <ChatInput />
    </div>
  );
};

export default ChatArea;
