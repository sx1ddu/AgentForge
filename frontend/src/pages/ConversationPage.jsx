import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import AppShell from "../components/layout/AppShell";
import MessageItem from "../components/workspace/MessageItem";
import PendingResponse from "../components/workspace/PendingResponse";
import TaskComposer from "../components/workspace/TaskComposer";
import ArtifactInspector from "../components/workspace/ArtifactInspector";
import getMessages from "../features/getMessages";
import { setMessages } from "../redux/messageSlice";
import { setSelectedConversation } from "../redux/conversationSlice";

export default function ConversationPage() {
  const { conversationId, id } = useParams();
  const activeId = conversationId || id;
  const dispatch = useDispatch();

  const conversations = useSelector(
    (state) => state.conversation?.conversations || []
  );
  const selectedConversation = useSelector(
    (state) => state.conversation?.selectedConversation
  );
  const messages = useSelector((state) => state.message?.messages || []);
  const typing = useSelector((state) => state.message?.typing);
  const artifacts = useSelector((state) => state.message?.artifacts || []);

  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isArtifactOpen, setIsArtifactOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Sync active conversation object
  useEffect(() => {
    if (!activeId) return;

    if (!selectedConversation || selectedConversation._id !== activeId) {
      const match = conversations.find((c) => c._id === activeId);
      if (match) {
        dispatch(setSelectedConversation(match));
      } else {
        dispatch(
          setSelectedConversation({ _id: activeId, title: "Task session" })
        );
      }
    }
  }, [activeId, conversations, selectedConversation, dispatch]);

  // Fetch messages for active conversation
  useEffect(() => {
    if (!activeId) return;

    let isMounted = true;
    const fetchHistory = async () => {
      try {
        setLoadingMessages(true);
        const data = await getMessages(activeId);
        if (isMounted) {
          dispatch(setMessages(data));
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        if (isMounted) setLoadingMessages(false);
      }
    };

    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, [activeId, dispatch]);

  // Scroll to bottom on new messages or typing state change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Auto-open artifact inspector if artifacts returned and inspector was closed
  useEffect(() => {
    if (artifacts?.length > 0 && artifacts[0]?.files?.length > 0) {
      const timer = setTimeout(() => setIsArtifactOpen(true), 0);
      return () => clearTimeout(timer);
    }
  }, [artifacts]);

  const hasArtifacts = artifacts?.length > 0 && artifacts[0]?.files?.length > 0;
  const conversationTitle =
    selectedConversation?.title || "Active conversation";

  return (
    <AppShell
      title={conversationTitle}
      showArtifactToggle={hasArtifacts}
      isArtifactOpen={isArtifactOpen}
      onToggleArtifact={() => setIsArtifactOpen((prev) => !prev)}
    >
      <div className="flex-1 flex min-h-0 relative overflow-hidden">
        {/* Main Conversation Feed */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          {/* Scrollable Message History Area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-4">
            <div className="max-w-3xl mx-auto">
              {loadingMessages ? (
                <div className="flex flex-col items-center justify-center py-20 text-xs text-[var(--forge-text-muted)] gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-[var(--forge-accent)]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  <span>Loading task history...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="py-20 text-center text-xs text-[var(--forge-text-muted)]">
                  No messages yet. Send a brief below to start execution.
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <MessageItem
                    key={msg._id || idx}
                    message={msg}
                    hasArtifacts={hasArtifacts}
                    onOpenArtifact={() => setIsArtifactOpen(true)}
                  />
                ))
              )}

              {/* Truthful Indeterminate Pending State Indicator */}
              {typing && <PendingResponse />}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Bottom Task Composer Input Bar */}
          <div className="px-4 sm:px-8 pb-4 pt-2 bg-gradient-to-t from-[var(--forge-canvas)] via-[var(--forge-canvas)] to-transparent flex-shrink-0">
            <TaskComposer centered={false} />
          </div>
        </div>

        {/* 420px Monaco Artifact Inspector Right Panel */}
        <ArtifactInspector
          isOpen={isArtifactOpen}
          onClose={() => setIsArtifactOpen(false)}
        />
      </div>
    </AppShell>
  );
}
