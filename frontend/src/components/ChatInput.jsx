import {
  Code2,
  FileText,
  Globe,
  ImageIcon,
  MessageSquare,
  Mic,
  MicOff,
  Paperclip,
  Presentation,
  Send,
  Users,
  X,
  Zap,
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
    if (typing) return;

    try {
      let conversation = selectedConversation;

      // Create conversation if none selected
      if (!conversation?._id) {
        const conv = await createConversation(promptText.slice(0, 40) || "New Chat");
        if (conv) {
          dispatch(setSelectedConversation(conv));
          dispatch(addConversations(conv));
          conversation = conv;
        } else {
          throw new Error("Unable to create conversation session.");
        }
      } else if (conversation.title === "New Chat" && promptText) {
        // Auto-update conversation title on first prompt
        const newTitle = promptText.slice(0, 40);
        updateConversation({
          id: conversation._id,
          title: newTitle,
        }).catch(() => {});

        dispatch(
          setConvTitle({
            conversationId: conversation._id,
            title: newTitle,
          })
        );
      }

      const formData = new FormData();
      formData.append("prompt", promptText);
      formData.append("conversationId", conversation._id);
      formData.append("agent", selectedAgent.toLowerCase());

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const userImages = selectedFile?.type?.startsWith("image/")
        ? [URL.createObjectURL(selectedFile)]
        : [];

      dispatch(
        addMessages({
          role: "user",
          content: promptText,
          images: userImages,
          file:
            selectedFile?.type === "application/pdf"
              ? {
                  name: selectedFile.name,
                  size: selectedFile.size,
                  url: URL.createObjectURL(selectedFile),
                }
              : undefined,
        })
      );

      // Clear input and reset textarea height
      setValue("");
      setSelectedFile(null);
      if (fileRef.current) fileRef.current.value = "";
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      dispatch(setTyping(true));

      const data = await sendMessage(formData);

      if (data?.artifacts && data.artifacts.length > 0) {
        dispatch(setArtifacts(data.artifacts));
      }

      dispatch(
        addMessages({
          role: "assistant",
          content: data?.answer || "Task executed.",
          images: data?.images || [],
        })
      );
    } catch (error) {
      console.error("Chat request failed:", error);

      let message = "Something went wrong while communicating with the agent.";
      if (error.response?.status === 413) {
        message = "The uploaded file exceeds the 20MB size limit. Please choose a smaller file.";
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      dispatch(
        addMessages({
          role: "assistant",
          content: `⚠️ **Error:** ${message}`,
        })
      );
    } finally {
      dispatch(setTyping(false));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if ((value.trim() || selectedFile) && !typing) {
        handleSendMessage();
      }
    }
  };

  const agents = [
    { id: "auto", icon: Zap, label: "Auto" },
    { id: "team", icon: Users, label: "Team" },
    { id: "chat", icon: MessageSquare, label: "Chat" },
    { id: "coding", icon: Code2, label: "Coding" },
    { id: "pdf", icon: FileText, label: "PDF" },
    { id: "ppt", icon: Presentation, label: "PPT" },
    { id: "vision", icon: ImageIcon, label: "Vision" },
    { id: "search", icon: Globe, label: "Search" },
  ];

  const isSendDisabled = (!value.trim() && !selectedFile) || typing;

  return (
    <div className="w-full max-w-full px-3 md:px-5 py-3 border-t border-white/[0.06] bg-[#0d0f14]">
      <div className="flex w-full max-w-full min-w-0 flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3 pb-3 focus-within:border-indigo-500/40 transition">
        {/* Agent Selector Pills */}
        <div className="flex w-full max-w-full min-w-0 flex-wrap items-center gap-1.5 pr-2">
          {agents.map((agent) => {
            const isActive = selectedAgent === agent.label;
            const Icon = agent.icon;

            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => setSelectedAgent(agent.label)}
                className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap px-2.5 py-1.5 rounded-full text-[11px] font-medium border transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-[0_1px_8px_rgba(99,102,241,.35)]"
                    : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.07] hover:text-slate-200"
                }`}
              >
                <Icon size={13} className={isActive ? "text-white" : "text-slate-400"} />
                {agent.label}
              </button>
            );
          })}
        </div>

        {/* Selected File Badge */}
        {selectedFile && (
          <div className="my-1.5">
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5">
              {selectedFile.type === "application/pdf" ? (
                <FileText size={16} className="text-red-400 shrink-0" />
              ) : (
                <ImageIcon size={16} className="text-cyan-400 shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-xs text-white truncate max-w-[200px] font-medium">
                  {selectedFile.name}
                </p>
                <p className="text-[10px] text-slate-400">
                  {Math.ceil(selectedFile.size / 1024)} KB
                </p>
              </div>

              <button
                type="button"
                className="ml-2 text-slate-400 hover:text-white transition cursor-pointer"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        <textarea
          ref={textareaRef}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setValue(e.target.value);
            autoResize(e.target);
          }}
          value={value}
          placeholder={
            selectedAgent === "Team"
              ? "Describe your full project to the multi-agent team..."
              : selectedAgent === "Coding"
              ? "Ask coding questions or describe a project to build..."
              : "Ask AgentForge anything (Shift+Enter for new line)..."
          }
          className="w-full max-w-full min-w-0 resize-none bg-transparent outline-none text-[13.5px] text-slate-200 placeholder:text-slate-500 leading-relaxed disabled:opacity-50"
          rows={2}
        />

        <div className="flex w-full max-w-full min-w-0 items-center justify-between pt-1">
          <div className="flex min-w-0 items-center gap-1.5">
            <input
              type="file"
              accept=".pdf,image/*"
              hidden
              ref={fileRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedFile(file);
                }
              }}
            />

            <button
              type="button"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition cursor-pointer"
              onClick={() => fileRef.current?.click()}
              title="Attach PDF or Image"
            >
              <Paperclip size={16} />
            </button>

            <button
              type="button"
              onClick={toggleMic}
              title={listening ? "Stop voice listening" : "Start voice input"}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition cursor-pointer ${
                listening
                  ? "bg-red-500 text-white animate-pulse"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]"
              }`}
            >
              {listening ? <Mic size={16} /> : <MicOff size={16} />}
            </button>
          </div>

          <button
            type="button"
            disabled={isSendDisabled}
            onClick={handleSendMessage}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-none transition-all duration-150 ${
              !isSendDisabled
                ? "bg-gradient-to-br from-indigo-500 to-violet-600 hover:opacity-90 text-white cursor-pointer shadow-md"
                : "bg-white/10 text-slate-500 cursor-not-allowed"
            }`}
            title="Send Message"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
