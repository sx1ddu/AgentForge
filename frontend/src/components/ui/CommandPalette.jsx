import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Search,
  Plus,
  Compass,
  CreditCard,
  Settings,
  Sun,
  Moon,
  LogOut,
  MessageSquare,
  Code2,
} from "lucide-react";
import { setSelectedConversation } from "../../redux/conversationSlice";
import { useTheme } from "../../context/ThemeContext";
import logOut from "../../features/logout";
import { setUserData } from "../../redux/userSlice";

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();

  const conversations = useSelector(
    (state) => state.conversation?.conversations || []
  );

  const handleClose = useCallback(() => {
    setQuery("");
    setSelectedIndex(0);
    onClose();
  }, [onClose]);

  // Close on Escape or re-trigger on Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        handleClose();
      }
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  const actions = useMemo(() => {
    const list = [
      {
        id: "new-task",
        title: "New task",
        category: "Actions",
        shortcut: "⌘N",
        icon: Plus,
        run: () => {
          dispatch(setSelectedConversation(null));
          navigate("/app");
          onClose();
        },
      },
      {
        id: "nav-workspace",
        title: "Go to Workspace",
        category: "Navigation",
        shortcut: "G W",
        icon: MessageSquare,
        run: () => {
          navigate("/app");
          onClose();
        },
      },
      {
        id: "nav-agents",
        title: "Agent Library",
        category: "Navigation",
        shortcut: "G A",
        icon: Compass,
        run: () => {
          navigate("/app/agents");
          onClose();
        },
      },
      {
        id: "nav-billing",
        title: "Billing & Credits",
        category: "Navigation",
        shortcut: "G B",
        icon: CreditCard,
        run: () => {
          navigate("/app/billing");
          onClose();
        },
      },
      {
        id: "nav-settings",
        title: "Settings & Preferences",
        category: "Navigation",
        shortcut: "G S",
        icon: Settings,
        run: () => {
          navigate("/app/settings");
          onClose();
        },
      },
      {
        id: "toggle-theme",
        title: `Switch to ${theme === "dark" ? "Light (Paper)" : "Dark (Graphite)"} theme`,
        category: "Appearance",
        shortcut: "T",
        icon: theme === "dark" ? Sun : Moon,
        run: () => {
          toggleTheme();
          onClose();
        },
      },
      {
        id: "auth-logout",
        title: "Sign out of AgentForge",
        category: "Account",
        shortcut: "",
        icon: LogOut,
        run: async () => {
          try {
            await logOut();
          } finally {
            dispatch(setUserData(null));
            dispatch(setSelectedConversation(null));
            navigate("/login");
            onClose();
          }
        },
      },
    ];

    // Append matching conversations
    const matchedConvs = conversations
      .filter((c) =>
        (c.title || "Untitled task").toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5)
      .map((c) => ({
        id: `conv-${c._id}`,
        title: c.title || "Untitled task",
        category: "Recent tasks",
        icon: Code2,
        run: () => {
          dispatch(setSelectedConversation(c));
          navigate(`/app/c/${c._id}`);
          onClose();
        },
      }));

    const filteredActions = list.filter(
      (a) =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.category.toLowerCase().includes(query.toLowerCase())
    );

    return [...filteredActions, ...matchedConvs];
  }, [conversations, query, theme, toggleTheme, dispatch, navigate, onClose]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (actions.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? Math.max(actions.length - 1, 0) : prev - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (actions[selectedIndex]) {
        actions[selectedIndex].run();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Palette surface */}
      <div
        className="relative w-full max-w-xl bg-[var(--forge-surface)] border border-[var(--forge-border-strong)] rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--forge-border)] bg-[var(--forge-input-bg)]">
          <Search className="w-4 h-4 text-[var(--forge-accent)] flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            autoFocus
            placeholder="Type a command or search recent tasks..."
            className="w-full bg-transparent text-[var(--forge-text)] text-sm outline-none placeholder:text-[var(--forge-text-muted)]"
          />
          <span className="text-[10px] font-mono text-[var(--forge-text-muted)] border border-[var(--forge-border)] px-1.5 py-0.5 rounded">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-transparent">
          {actions.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--forge-text-muted)]">
              No matching commands or tasks found.
            </div>
          ) : (
            actions.map((item, index) => {
              const isSelected = index === selectedIndex;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => item.run()}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[var(--forge-surface-elevated)] border-l-2 border-[var(--forge-accent)] text-[var(--forge-text)]"
                      : "text-[var(--forge-text-secondary)] hover:bg-[var(--forge-surface-elevated)]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${
                        isSelected
                          ? "text-[var(--forge-accent)]"
                          : "text-[var(--forge-text-muted)]"
                      }`}
                    />
                    <div className="truncate text-xs">
                      <span className="font-medium text-[var(--forge-text)]">
                        {item.title}
                      </span>
                      <span className="ml-2 text-[10px] text-[var(--forge-text-muted)] font-mono">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  {item.shortcut && (
                    <span className="text-[10px] font-mono text-[var(--forge-text-muted)] border border-[var(--forge-border)] px-1.5 py-0.5 rounded flex-shrink-0">
                      {item.shortcut}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--forge-border)] bg-[var(--forge-surface)] text-[10px] text-[var(--forge-text-muted)] font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Dismiss</span>
          </div>
          <span className="text-[var(--forge-accent)]">AGENTFORGE COMMANDS</span>
        </div>
      </div>
    </div>
  );
}
