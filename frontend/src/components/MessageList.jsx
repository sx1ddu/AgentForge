import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MessageBubble from "./MessageBubble";
import LoadingAnimation from "./LoadingAnimation";
import sendMessage from "../features/sendMessage";
import { createConversation } from "../features/createConversation";
import { addConversations, setSelectedConversation } from "../redux/conversationSlice";
import { addMessages, setArtifacts, setTyping } from "../redux/messageSlice";

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
      formData.append("agent", "auto");

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
          content: "⚠️ Failed to execute starter prompt. Please try again.",
        })
      );
    } finally {
      dispatch(setTyping(false));
    }
  };

  const starterPrompts = [
    { title: "Write a Netflix clone", desc: "HTML/CSS/JS frontend artifact with Monaco preview" },
    { title: "Explain Redis architecture", desc: "In-memory caching, pub/sub, and session management" },
    { title: "Build a modern analytics dashboard", desc: "Interactive UI layout with chart components" },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {messages.length === 0 || !selectedConversation ? (
        <div className="h-full flex flex-col items-center justify-center gap-4 text-center select-none py-12">
          <div className="flex flex-col gap-1.5 items-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-2">
              <span className="text-xl font-bold text-white tracking-wider">AF</span>
            </div>
            <h1 className="text-[22px] font-bold text-slate-100 tracking-tight">
              AgentForge
            </h1>
            <p className="text-[14px] font-medium text-slate-400">
              Autonomous Multi-Agent AI Engineering Platform
            </p>
            <p className="text-[12.5px] text-slate-500 max-w-sm leading-relaxed mt-1">
              Code generation with live browser preview, document generation, real-time search, visual analysis, and collaborative agent workflows.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5 mt-4 max-w-xl">
            {starterPrompts.map((p) => (
              <button
                key={p.title}
                type="button"
                onClick={() => handleStarterPrompt(p.title)}
                className="flex flex-col items-start text-left text-[12px] text-slate-300 bg-white/[0.04] border border-white/[0.08] hover:border-indigo-500/40 hover:bg-white/[0.07] px-3.5 py-2.5 rounded-xl transition cursor-pointer shadow-sm group"
              >
                <span className="font-semibold text-slate-200 group-hover:text-indigo-300 transition">
                  {p.title}
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  {p.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-5 max-w-5xl mx-auto">
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
