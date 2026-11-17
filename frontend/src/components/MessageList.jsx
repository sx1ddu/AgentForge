import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MessageBubble from "./MessageBubble";
import LoadingAnimation from "./LoadingAnimation";
import sendMessage from "../features/sendMessage";
import { createConversation } from "../features/createConversation";
import { addConversations, setSelectedConversation } from "../redux/conversationSlice";
import { addMessages, setArtifacts, setTyping } from "../redux/messageSlice";
import { Code2, Globe, FileText, Presentation } from "lucide-react";

const MessageList = () => {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages, typing } = useSelector((state) => state.message);
  const bottomRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    requestAnimationFrame(() => {
      bottomRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });
  }, [messages?.length, typing]);

  const handleStarterPrompt = async (promptText) => {
    if (typing) return;

    try {
      let conversation = selectedConversation;

      if (!conversation?._id) {
        const conv = await createConversation(promptText.slice(0, 40));
        if (conv) {
          dispatch(setSelectedConversation(conv));
          dispatch(addConversations(conv));
          conversation = conv;
        } else {
          return;
        }
      }

      dispatch(
        addMessages({
          role: "user",
          content: promptText,
        })
      );

      dispatch(setTyping(true));

      const formData = new FormData();
      formData.append("prompt", promptText);
      formData.append("conversationId", conversation._id);
      formData.append("agent", "team");

      const data = await sendMessage(formData);

      if (data?.artifacts?.length > 0) {
        dispatch(setArtifacts(data.artifacts));
      }

      dispatch(
        addMessages({
          role: "assistant",
          content: data?.answer || "Task completed.",
          images: data?.images || [],
        })
      );
    } catch (err) {
      console.error("Starter prompt error:", err);
      dispatch(
        addMessages({
          role: "assistant",
          content: "⚠️ Failed to execute starter prompt. Please check your credit balance and try again.",
        })
      );
    } finally {
      dispatch(setTyping(false));
    }
  };

  const starterPrompts = [
    {
      title: "Full-Stack Reactive Dashboard",
      desc: "Generate React components with live Monaco editor preview",
      icon: Code2,
      color: "text-sky-400",
      prompt: "Build a real-time reactive crypto analytics dashboard with React, live price ticker, and chart components.",
    },
    {
      title: "Real-Time Web Intelligence",
      desc: "Live search with Tavily for grounded research",
      icon: Globe,
      color: "text-emerald-400",
      prompt: "Research the latest architectural advancements in LangGraph and autonomous multi-agent state machines.",
    },
    {
      title: "Executive Technical Report PDF",
      desc: "Synthesize structured PDF with headers & metrics",
      icon: FileText,
      color: "text-amber-400",
      prompt: "Generate an executive technical whitepaper on microservices zero-trust security architecture as a downloadable PDF.",
    },
    {
      title: "Investor Slide Deck Presentation",
      desc: "Create PowerPoint presentation slide deck",
      icon: Presentation,
      color: "text-rose-400",
      prompt: "Create an investor pitch deck on the future of autonomous multi-agent software engineering teams.",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {messages.length === 0 || !selectedConversation ? (
        <div className="h-full flex flex-col items-center justify-center gap-6 text-center select-none py-12 max-w-2xl mx-auto">
          {/* Brand Mark */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-[#141722] border border-lime-400/30 flex items-center justify-center shadow-lg shadow-lime-400/10 mb-1">
              <span className="text-base font-bold text-lime-400 tracking-wider font-mono">AF</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              AgentForge Workspace
            </h1>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Autonomous multi-agent orchestration runtime. Select an agent mode below or launch a starter project to begin.
            </p>
          </div>

          {/* Starter Prompts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
            {starterPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleStarterPrompt(p.prompt)}
                className="p-3.5 rounded-xl bg-[#0e1017] border border-white/[0.07] hover:border-lime-400/30 hover:bg-[#131622] transition-all cursor-pointer text-left group flex items-start gap-3 shadow-sm"
              >
                <div className="p-2 rounded-lg bg-[#141722] border border-white/[0.06] shrink-0 mt-0.5">
                  <p.icon size={16} className={p.color} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white group-hover:text-lime-300 transition truncate">
                    {p.title}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    {p.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-5 max-w-4xl mx-auto">
          {messages.map((msg, i) => (
            <div key={msg._id || i}>
              <MessageBubble
                role={msg?.role}
                content={msg?.content}
                images={msg?.images}
                file={msg?.file}
              />
            </div>
          ))}

          {typing && <LoadingAnimation />}
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
