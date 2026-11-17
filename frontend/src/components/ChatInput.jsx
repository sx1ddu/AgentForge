import {
  Code2,
  FileText,
  Globe,
  ImageIcon,
  Mic,
  MicOff,
  Paperclip,
  Presentation,
  Send,
  Users,
  X,
  Sparkles,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import sendMessage from "../features/sendMessage";
import { useDispatch, useSelector } from "react-redux";
import { addMessages, setArtifacts, setTyping } from "../redux/messageSlice";
import { createConversation } from "../features/createConversation";
import {
  addConversations,
  setConvTitle,
  setSelectedConversation,
} from "../redux/conversationSlice";
import { updateConversation } from "../features/updateConversation";

const ChatInput = () => {
  const [value, setValue] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("Auto");
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { typing } = useSelector((state) => state.message);
  const [selectedFile, setSelectedFile] = useState(null);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const textareaRef = useRef(null);

  const autoResize = (el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setValue(transcript);
      if (textareaRef.current) autoResize(textareaRef.current);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch (err) {
        console.warn("Speech recognition start failed:", err);
      }
    }
  };

  const handleSendMessage = async () => {
    const promptText = value.trim();
    if (!promptText && !selectedFile) return;

    let conversation = selectedConversation;

    try {
      if (!conversation?._id) {
        const title = promptText
          ? promptText.slice(0, 30)
          : selectedFile?.name?.slice(0, 30) || "New Chat";
        const conv = await createConversation(title);

        if (conv) {
          dispatch(setSelectedConversation(conv));
          dispatch(addConversations(conv));
          conversation = conv;
        } else {
          return;
        }
      }

      if (conversation.title === "New Chat" && promptText) {
        const newTitle = promptText.slice(0, 30);
        await updateConversation(conversation._id, newTitle);
        dispatch(
          setConvTitle({
            title: newTitle,
            conversationId: conversation._id,
          })
        );
      }

      const tempUserMsg = {
        role: "user",
        content: promptText || (selectedFile ? `Uploaded ${selectedFile.name}` : ""),
        file: selectedFile
          ? {
              name: selectedFile.name,
              size: selectedFile.size,
              url: URL.createObjectURL(selectedFile),
            }
          : null,
      };

      dispatch(addMessages(tempUserMsg));
      setValue("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      dispatch(setTyping(true));

      let payload;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("prompt", promptText);
        formData.append("conversationId", conversation._id);
        formData.append("agent", selectedAgent.toLowerCase());
        formData.append("file", selectedFile);
        payload = formData;
      } else {
        payload = {
          prompt: promptText,
          conversationId: conversation._id,
          agent: selectedAgent.toLowerCase(),
        };
      }

      setSelectedFile(null);

      const data = await sendMessage(payload);

      if (data?.artifacts?.length > 0) {
        dispatch(setArtifacts(data.artifacts));
      }

      dispatch(
        addMessages({
          role: "assistant",
          content: data?.answer || "Task completed successfully.",
          images: data?.images || [],
        })
      );
    } catch (err) {
      console.error("Failed to send message:", err);
      dispatch(
        addMessages({
          role: "assistant",
          content:
            err.response?.data?.message ||
            "⚠️ Request failed. Please check your credit balance or network connection.",
        })
      );
    } finally {
      dispatch(setTyping(false));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const agentPills = [
    { id: "Auto", label: "Auto Router", icon: Sparkles, color: "text-slate-400" },
    { id: "Team", label: "Multi-Agent Loop", icon: Users, color: "text-lime-400" },
    { id: "Coding", label: "Full-Stack Coder", icon: Code2, color: "text-sky-400" },
    { id: "Search", label: "Live Web Search", icon: Globe, color: "text-emerald-400" },
    { id: "PDF", label: "PDF Document", icon: FileText, color: "text-amber-400" },
    { id: "PPT", label: "PowerPoint Deck", icon: Presentation, color: "text-rose-400" },
    { id: "Vision", label: "Vision Analysis", icon: ImageIcon, color: "text-purple-400" },
  ];

  return (
    <div className="p-4 md:px-8 border-t border-white/[0.06] bg-[#090b10] shrink-0">
      <div className="max-w-4xl mx-auto space-y-2.5">
        {/* Agent Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {agentPills.map((agent) => (
            <button
              key={agent.id}
              type="button"
              onClick={() => setSelectedAgent(agent.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap border ${
                selectedAgent === agent.id
                  ? "bg-[#141722] border-lime-400/35 text-white shadow-sm"
                  : "bg-white/[0.02] border-white/[0.05] text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]"
              }`}
            >
              <agent.icon size={13} className={agent.color} />
              <span>{agent.label}</span>
            </button>
          ))}
        </div>

        {/* Selected File Chip */}
        {selectedFile && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141722] border border-white/[0.08] text-xs text-slate-300 w-fit">
            <Paperclip size={13} className="text-lime-400" />
            <span className="truncate max-w-xs">{selectedFile.name}</span>
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="p-0.5 text-slate-500 hover:text-white transition cursor-pointer ml-1"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {/* Textarea & Controls Box */}
        <div className="rounded-2xl border border-white/[0.09] bg-[#0e1017] p-2.5 shadow-xl focus-within:border-lime-400/40 transition">
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              autoResize(e.target);
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedAgent === "Team"
                ? "Describe your full-stack project for the collaborative agent loop..."
                : `Ask ${selectedAgent} Agent anything... (Shift+Enter for new line)`
            }
            className="w-full bg-transparent px-2 pt-1 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none max-h-44 leading-relaxed"
          />

          <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] mt-1">
            <div className="flex items-center gap-1">
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
                }}
              />

              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                title="Attach Document or Image"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
              >
                <Paperclip size={16} />
              </button>

              <button
                type="button"
                onClick={toggleMic}
                title={listening ? "Stop voice input" : "Start voice input"}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  listening
                    ? "bg-rose-500/20 text-rose-400 animate-pulse"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                {listening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-[10.5px] font-mono text-slate-500">
                Mode: <span className="text-lime-400 font-semibold">{selectedAgent}</span>
              </span>

              <button
                type="button"
                disabled={(!value.trim() && !selectedFile) || typing}
                onClick={handleSendMessage}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime-400 hover:bg-lime-300 disabled:opacity-30 disabled:hover:bg-lime-400 text-[#08090D] font-bold text-xs transition cursor-pointer shadow-sm shadow-lime-400/20"
              >
                <span>Send</span>
                <Send size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
