import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
} from "lucide-react";
import {
  setSelectedConversation,
  removeConversation,
  setConvTitle,
} from "../../redux/conversationSlice";
import { deleteConversation } from "../../features/deleteConversation";
import { updateConversation } from "../../features/updateConversation";
import ConfirmDialog from "../ui/ConfirmDialog";

export default function ConversationSidebar({
  onOpenCommandPalette,
  onCloseMobile = null,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { conversationId } = useParams();

  const conversations = useSelector(
    (state) => state.conversation?.conversations || []
  );
  const selectedConversation = useSelector(
    (state) => state.conversation?.selectedConversation
  );
  const userData = useSelector((state) => state.user?.userData);

  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // New task action
  const handleNewTask = () => {
    dispatch(setSelectedConversation(null));
    navigate("/app");
    if (onCloseMobile) onCloseMobile();
  };

  // Select conversation
  const handleSelectConv = (conv) => {
    dispatch(setSelectedConversation(conv));
    navigate(`/app/c/${conv._id}`);
    if (onCloseMobile) onCloseMobile();
  };

  // Start inline rename
  const handleStartRename = (conv, e) => {
    e.stopPropagation();
    setEditingId(conv._id);
    setEditTitle(conv.title || "Untitled task");
  };

  // Submit rename
  const handleSaveRename = async (convId, e) => {
    e.stopPropagation();
    if (!editTitle.trim()) {
      setEditingId(null);
      return;
    }
    const newTitle = editTitle.trim();
    dispatch(setConvTitle({ conversationId: convId, title: newTitle }));
    setEditingId(null);
    try {
      await updateConversation(convId, newTitle);
    } catch (err) {
      console.error("Rename failed:", err);
    }
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await deleteConversation(deleteTargetId);
      dispatch(removeConversation(deleteTargetId));
      if (
        selectedConversation?._id === deleteTargetId ||
        conversationId === deleteTargetId
      ) {
        dispatch(setSelectedConversation(null));
        navigate("/app");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
    }
  };

  // Group conversations by date
  const filteredAndGrouped = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const filtered = conversations.filter((c) =>
      (c.title || "Untitled task").toLowerCase().includes(q)
    );

    const now = new Date();
    const today = [];
    const pastWeek = [];
    const older = [];

    filtered.forEach((conv) => {
      const date = conv.updatedAt ? new Date(conv.updatedAt) : new Date(conv.createdAt || 0);
      const diffDays = (now - date) / (1000 * 60 * 60 * 24);

      if (diffDays <= 1) {
        today.push(conv);
      } else if (diffDays <= 7) {
        pastWeek.push(conv);
      } else {
        older.push(conv);
      }
    });

    const groups = [];
    if (today.length > 0) groups.push({ label: "Today", items: today });
    if (pastWeek.length > 0)
      groups.push({ label: "Previous 7 days", items: pastWeek });
    if (older.length > 0) groups.push({ label: "Older", items: older });

    return groups;
  }, [conversations, searchQuery]);

  // Credit calculation
  const credits = userData?.credits ?? 0;
  const planMax =
    userData?.plan === "pro"
      ? 1500
      : userData?.plan === "starter"
      ? 500
      : 100;
  const creditPercent = Math.min(Math.round((credits / planMax) * 100), 100);

  return (
    <aside className="w-[248px] bg-[var(--forge-sidebar-bg)] border-r border-[var(--forge-border)] flex flex-col h-full flex-shrink-0 select-none z-10">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-3.5 py-4 border-b border-[var(--forge-border)]">
        <div>
          <div className="text-xs font-bold tracking-tight text-[var(--forge-text)]">
            AGENTFORGE
          </div>
          <div className="text-[9px] uppercase tracking-wider text-[var(--forge-text-muted)] font-mono mt-0.5">
            THE WORKSPACE
          </div>
        </div>
        <button
          onClick={onOpenCommandPalette}
          title="Open Command Palette (⌘K)"
          className="text-[10px] font-mono text-[var(--forge-text-muted)] border border-[var(--forge-border)] px-1.5 py-0.5 rounded hover:text-[var(--forge-text)] hover:border-[var(--forge-border-strong)] transition-colors cursor-pointer"
        >
          ⌘K
        </button>
      </div>

      {/* New Task Button */}
      <div className="p-3">
        <button
          onClick={handleNewTask}
          className="w-full flex items-center justify-between px-3 py-2 bg-[var(--forge-surface-elevated)] border border-[var(--forge-border-strong)] hover:border-[var(--forge-accent)] hover:text-[var(--forge-accent)] text-[var(--forge-text)] rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-[0.99]"
        >
          <span className="flex items-center gap-2">
            <Plus className="w-3.5 h-3.5 text-[var(--forge-accent)]" />
            New task
          </span>
          <span className="text-[10px] font-mono text-[var(--forge-text-muted)]">
            ⌘N
          </span>
        </button>

        {/* Search Input */}
        <div className="relative mt-2.5">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[var(--forge-text-muted)] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full bg-[var(--forge-input-bg)] border border-[var(--forge-border)] text-[var(--forge-text)] placeholder:text-[var(--forge-text-muted)] text-[11px] rounded-md pl-8 pr-2.5 py-1.5 outline-none focus:border-[var(--forge-accent)] transition-colors"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-4">
        {filteredAndGrouped.length === 0 ? (
          <div className="px-3 py-8 text-center text-xs text-[var(--forge-text-muted)] leading-relaxed">
            {searchQuery ? "No tasks match your search." : "No tasks yet. Start a new one above."}
          </div>
        ) : (
          filteredAndGrouped.map((group) => (
            <div key={group.label}>
              <div className="text-[9px] font-mono uppercase tracking-widest text-[var(--forge-text-muted)] px-2 mb-1.5">
                {group.label}
              </div>
              <div className="space-y-0.5">
                {group.items.map((conv) => {
                  const isCurrent =
                    conversationId === conv._id ||
                    selectedConversation?._id === conv._id;
                  const isEditing = editingId === conv._id;

                  return (
                    <div
                      key={conv._id}
                      onClick={() => !isEditing && handleSelectConv(conv)}
                      className={`group relative flex items-center justify-between px-2.5 py-2 rounded-md text-xs cursor-pointer transition-colors ${
                        isCurrent
                          ? "bg-[var(--forge-surface-elevated)] text-[var(--forge-text)] border-l-2 border-[var(--forge-accent)] font-medium"
                          : "text-[var(--forge-text-secondary)] hover:bg-[var(--forge-surface)] hover:text-[var(--forge-text)]"
                      }`}
                    >
                      {/* Title or Inline Edit Input */}
                      {isEditing ? (
                        <div
                          className="flex items-center gap-1 w-full"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveRename(conv._id, e);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            autoFocus
                            className="flex-1 bg-[var(--forge-input-bg)] border border-[var(--forge-accent)] text-[var(--forge-text)] text-xs px-1.5 py-0.5 rounded outline-none"
                          />
                          <button
                            onClick={(e) => handleSaveRename(conv._id, e)}
                            className="p-1 text-[var(--forge-accent)] hover:text-white"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingId(null);
                            }}
                            className="p-1 text-[var(--forge-text-muted)] hover:text-[var(--forge-red)]"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="truncate pr-2 select-none">
                            {conv.title || "Untitled task"}
                          </span>

                          {/* Hover action menu button */}
                          <div
                            className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity flex-shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={(e) => handleStartRename(conv, e)}
                              title="Rename"
                              className="p-1 text-[var(--forge-text-muted)] hover:text-[var(--forge-text)] rounded hover:bg-[var(--forge-surface-elevated)]"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteTargetId(conv._id);
                              }}
                              title="Delete"
                              className="p-1 text-[var(--forge-text-muted)] hover:text-[var(--forge-red)] rounded hover:bg-[var(--forge-surface-elevated)]"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sidebar Footer: Credit Meter & Profile */}
      <div className="p-3 border-t border-[var(--forge-border)] bg-[var(--forge-canvas)]/50">
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span className="text-[var(--forge-text-secondary)] font-medium">
            Credit balance
          </span>
          <span className="font-mono font-bold text-[var(--forge-accent)]">
            {credits} / {planMax}
          </span>
        </div>

        {/* Meter Bar */}
        <div className="w-full h-1 bg-[var(--forge-border)] rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-[var(--forge-accent)] transition-all duration-300 rounded-full"
            style={{ width: `${creditPercent}%` }}
          />
        </div>

        {/* User Info Bar */}
        <div
          onClick={() => navigate("/app/settings")}
          className="flex items-center justify-between pt-1 text-xs cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-full bg-[var(--forge-surface-elevated)] border border-[var(--forge-border)] text-[var(--forge-accent)] font-bold text-[10px] flex items-center justify-center flex-shrink-0">
              {userData?.name ? userData.name[0].toUpperCase() : "U"}
            </div>
            <div className="truncate">
              <div className="font-medium text-[var(--forge-text)] text-[11px] truncate">
                {userData?.name || "Workspace member"}
              </div>
              <div className="text-[9px] font-mono uppercase text-[var(--forge-text-muted)]">
                {userData?.plan || "free"} plan
              </div>
            </div>
          </div>
          <span className="text-[9px] font-mono text-[var(--forge-accent)] border border-[var(--forge-accent)]/30 px-1 py-0.5 rounded">
            AF
          </span>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title="Delete Task Conversation"
        description="Are you sure you want to delete this task? All messages and generated artifacts will be permanently removed."
        confirmLabel="Delete task"
      />
    </aside>
  );
}
