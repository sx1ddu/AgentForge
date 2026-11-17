import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Paperclip,
  Mic,
  MicOff,
  ArrowUp,
  X,
  ChevronDown,
  Layers,
  Code2,
  Search,
  FileText,
  Presentation,
  Image as ImageIcon,
} from "lucide-react";
import { addMessages, setArtifacts, setTyping } from "../../redux/messageSlice";
import { createConversation } from "../../features/createConversation";
import {
  addConversations,
  setConvTitle,
  setSelectedConversation,
} from "../../redux/conversationSlice";
import { updateConversation } from "../../features/updateConversation";
import sendMessage from "../../features/sendMessage";
import { getCurrentUser } from "../../features/getCurrentUser";
import { setUserData } from "../../redux/userSlice";

const AGENT_MODES = [
  { id: "auto", name: "Auto router", rate: "Dynamic", icon: Sparkles },
  { id: "team", name: "Team workflow", rate: "15 cr", icon: Layers },
  { id: "coding", name: "Coding", rate: "10 cr", icon: Code2 },
  { id: "search", name: "Search", rate: "5 cr", icon: Search },
  { id: "pdf", name: "PDF document", rate: "10 cr", icon: FileText },
  { id: "ppt", name: "Presentation", rate: "10 cr", icon: Presentation },
  { id: "vision", name: "Image generation", rate: "10 cr", icon: ImageIcon },
];

export default function TaskComposer({
  onRunStarted = null,
  initialMode = "auto",
  placeholder = "Describe the work you want done... (Shift+Enter for new line)",
  centered = false,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(initialMode);
  const [prevInitialMode, setPrevInitialMode] = useState(initialMode);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported] = useState(() => {
    return typeof window !== "undefined" && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  });

  if (initialMode !== prevInitialMode) {
    setPrevInitialMode(initialMode);
    setSelectedAgent(initialMode);
  }

  const selectedConversation = useSelector(
    (state) => state.conversation?.selectedConversation
  );
  const typing = useSelector((state) => state.message?.typing);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const dropdownRef = useRef(null);

  const autoResize = (el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  };

  // Click outside to close mode dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check speech recognition support
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setPrompt((prev) => (prev ? prev + " " + transcript : transcript));
        if (textareaRef.current) autoResize(textareaRef.current);
      };

      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn("Speech recognition error:", err);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
    // reset input so the same file can be selected again
    e.target.value = "";
  };

  const handleSubmit = async () => {
    const trimmed = prompt.trim();
    if ((!trimmed && !selectedFile) || typing) return;

    let conv = selectedConversation;

    try {
      if (onRunStarted) onRunStarted();

      // If no active conversation exists, create one
      if (!conv?._id) {
        const title = trimmed
          ? trimmed.slice(0, 36)
          : selectedFile?.name?.slice(0, 36) || "New task";

        const newConv = await createConversation(title);
        if (newConv && newConv._id) {
          dispatch(setSelectedConversation(newConv));
          dispatch(addConversations(newConv));
          conv = newConv;
          navigate(`/app/c/${newConv._id}`, { replace: true });
        } else {
          return;
        }
      } else if (conv.title === "New task" || conv.title === "New Chat") {
        const newTitle = trimmed.slice(0, 36);
        if (newTitle) {
          await updateConversation(conv._id, newTitle);
          dispatch(
            setConvTitle({ conversationId: conv._id, title: newTitle })
          );
        }
      }

      // Add user message to UI
      const userMsg = {
        role: "user",
        content:
          trimmed ||
          (selectedFile ? `Uploaded ${selectedFile.name}` : "Process attachment"),
        file: selectedFile
          ? {
              name: selectedFile.name,
              size: selectedFile.size,
              url: URL.createObjectURL(selectedFile),
            }
          : null,
      };

      dispatch(addMessages(userMsg));
      setPrompt("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";

      dispatch(setTyping(true));

      // Construct request payload
      let payload;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("prompt", trimmed);
        formData.append("conversationId", conv._id);
        formData.append("agent", selectedAgent.toLowerCase());
        formData.append("file", selectedFile);
        payload = formData;
      } else {
        payload = {
          prompt: trimmed,
          conversationId: conv._id,
          agent: selectedAgent.toLowerCase(),
        };
      }

      setSelectedFile(null);

      // Send to backend
      const data = await sendMessage(payload);

      if (data?.artifacts?.length > 0) {
        dispatch(setArtifacts(data.artifacts));
      }

      dispatch(
        addMessages({
          role: "assistant",
          content: data?.answer || "Task completed successfully.",
          images: data?.images || [],
          agent: selectedAgent,
        })
      );

      // Re-fetch user profile to sync updated credits immediately
      try {
        const user = await getCurrentUser();
        if (user) dispatch(setUserData(user));
      } catch (e) {
        console.warn("Failed to refresh credits:", e);
      }
    } catch (err) {
      console.error("Task submission error:", err);
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
      handleSubmit();
    }
  };

  const currentModeObj =
    AGENT_MODES.find((m) => m.id === selectedAgent) || AGENT_MODES[0];
  const CurrentIcon = currentModeObj.icon;

  return (
    <div
      className={`w-full ${
        centered ? "max-w-2xl mx-auto" : "max-w-3xl mx-auto"
      }`}
    >
      <div className="bg-[var(--forge-input-bg)] border border-[var(--forge-border-strong)] focus-within:border-[var(--forge-accent)] rounded-xl p-3 shadow-lg transition-colors flex flex-col gap-2">
        {/* Selected File Chip */}
        {selectedFile && (
          <div className="flex items-center justify-between bg-[var(--forge-surface-elevated)] border border-[var(--forge-border)] px-2.5 py-1.5 rounded-lg text-xs">
            <div className="flex items-center gap-2 truncate">
              <Paperclip className="w-3.5 h-3.5 text-[var(--forge-accent)] flex-shrink-0" />
              <span className="truncate text-[var(--forge-text)] font-medium">
                {selectedFile.name}
              </span>
              <span className="text-[10px] font-mono text-[var(--forge-text-muted)] flex-shrink-0">
                ({Math.round(selectedFile.size / 1024)} KB)
              </span>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-[var(--forge-text-muted)] hover:text-[var(--forge-red)] p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            autoResize(e.target);
          }}
          onKeyDown={handleKeyDown}
          disabled={typing}
          rows={centered ? 3 : 2}
          placeholder={placeholder}
          className="w-full bg-transparent text-xs sm:text-sm text-[var(--forge-text)] placeholder:text-[var(--forge-text-muted)] resize-none outline-none leading-relaxed"
        />

        {/* Bottom Toolbar */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--forge-border)]">
          {/* Tools on Left: File Attachment & Mode Dropdown */}
          <div className="flex items-center gap-2">
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.csv,.json,.js,.py,.md"
            />

            {/* Attach File Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={typing}
              title="Attach a file (PDF, Image, Text)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[var(--forge-border)] bg-[var(--forge-surface)] text-[var(--forge-text-secondary)] hover:text-[var(--forge-text)] hover:border-[var(--forge-border-strong)] text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Attach</span>
            </button>

            {/* Mode Picker Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                disabled={typing}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[var(--forge-border-strong)] bg-[var(--forge-surface-elevated)] text-[var(--forge-accent)] hover:brightness-110 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                <CurrentIcon className="w-3.5 h-3.5" />
                <span>{currentModeObj.name}</span>
                <ChevronDown className="w-3 h-3 text-[var(--forge-text-muted)]" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-64 bg-[var(--forge-surface)] border border-[var(--forge-border-strong)] rounded-xl shadow-2xl p-1.5 z-30 space-y-0.5">
                  <div className="px-2 py-1 text-[9px] font-mono text-[var(--forge-text-muted)] uppercase tracking-wider">
                    Select Mode
                  </div>
                  {AGENT_MODES.map((mode) => {
                    const ModeIcon = mode.icon;
                    const isSelected = mode.id === selectedAgent;

                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => {
                          setSelectedAgent(mode.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-[var(--forge-accent)]/15 text-[var(--forge-accent)] font-semibold"
                            : "text-[var(--forge-text-secondary)] hover:bg-[var(--forge-surface-elevated)] hover:text-[var(--forge-text)]"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <ModeIcon className="w-3.5 h-3.5" />
                          {mode.name}
                        </span>
                        <span className="font-mono text-[10px] text-[var(--forge-text-muted)]">
                          {mode.rate}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Speech Mic Button (if supported) */}
            {speechSupported && (
              <button
                type="button"
                onClick={toggleMic}
                disabled={typing}
                title={isListening ? "Listening... click to stop" : "Voice input"}
                className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
                  isListening
                    ? "bg-[var(--forge-red)]/20 border-[var(--forge-red)] text-[var(--forge-red)] animate-pulse"
                    : "border-[var(--forge-border)] bg-[var(--forge-surface)] text-[var(--forge-text-muted)] hover:text-[var(--forge-text)]"
                }`}
              >
                {isListening ? (
                  <MicOff className="w-3.5 h-3.5" />
                ) : (
                  <Mic className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>

          {/* Right: Submit Button */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[10px] text-[var(--forge-text-muted)] font-mono">
              Shift + Enter for new line
            </span>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={(!prompt.trim() && !selectedFile) || typing}
              className="w-8 h-8 rounded-lg bg-[var(--forge-accent)] text-[var(--forge-accent-text)] flex items-center justify-center font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-105 active:scale-95 cursor-pointer shadow-xs"
              title="Send task"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
