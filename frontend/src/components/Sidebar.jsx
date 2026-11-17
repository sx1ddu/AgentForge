import { useEffect, useState } from "react";
import {
  Coins,
  LogOut,
  Menu,
  MessageSquare,
  PanelLeftIcon,
  PanelRight,
  Plus,
  Trash2,
  User,
  X,
  Search,
  Settings,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getConversations } from "../features/getConversations";
import {
  setConversations,
  setSelectedConversation,
  removeConversation,
} from "../redux/conversationSlice";
import { deleteConversation } from "../features/deleteConversation";
import logout from "../features/logout";
import { setUserData } from "../redux/userSlice";

const Sidebar = ({ onOpenBilling, onOpenSettings, onOpenCommandPalette }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const dispatch = useDispatch();

  const { conversations: rawConversations, selectedConversation } = useSelector(
    (state) => state.conversation
  );
  const conversations = Array.isArray(rawConversations) ? rawConversations : [];
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations();
        dispatch(setConversations(data));
      } catch (err) {
        console.error("Failed to load conversations:", err);
      }
    };
    if (userData?._id) {
      fetchConversations();
    }
  }, [userData?._id, dispatch]);

  const handleNewChat = () => {
    dispatch(setSelectedConversation(null));
    if (mobileOpen) setMobileOpen(false);
  };

  const handleDeleteConversation = async (e, convId) => {
    e.stopPropagation();
    try {
      await deleteConversation(convId);
      dispatch(removeConversation(convId));
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      dispatch(setUserData(null));
      dispatch(setSelectedConversation(null));
      dispatch(setConversations([]));
    }
  };

  const filteredConversations = conversations.filter((c) =>
    (c.title || "New Conversation").toLowerCase().includes(filterQuery.toLowerCase())
  );

  // Collapsed Sidebar (Desktop)
  if (collapsed) {
    return (
      <div className="hidden lg:flex flex-col items-center w-16 h-screen shrink-0 bg-[#090b10] border-r border-white/[0.07] py-4 gap-3 select-none">
        <button
          type="button"
          aria-label="Expand Sidebar"
          onClick={() => setCollapsed(false)}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
        >
          <PanelRight size={17} />
        </button>

        <button
          type="button"
          aria-label="New Chat"
          onClick={handleNewChat}
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-lime-400/10 hover:bg-lime-400/20 border border-lime-400/30 text-lime-400 transition cursor-pointer"
          title="New Conversation"
        >
          <Plus size={16} />
        </button>

        <div className="flex-1 w-full overflow-y-auto py-2 space-y-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {conversations.slice(0, 15).map((conv) => {
            const isActive = selectedConversation?._id === conv._id;
            return (
              <div
                key={conv._id}
                title={conv.title || "New Chat"}
                onClick={() => dispatch(setSelectedConversation(conv))}
                className={`flex justify-center items-center w-9 h-9 mx-auto rounded-lg cursor-pointer transition ${
                  isActive
                    ? "bg-[#141722] text-lime-400 border border-lime-400/30"
                    : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-300"
                }`}
              >
                <MessageSquare size={14} />
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onOpenSettings}
          title="Settings"
          className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition"
        >
          <Settings size={16} />
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        type="button"
        aria-label="Open mobile menu"
        className="lg:hidden fixed top-3 left-4 z-40 flex items-center justify-center w-8 h-8 rounded-lg bg-[#0e1017] border border-white/[0.08] text-slate-400 hover:text-white transition cursor-pointer"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={17} />
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/75 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Expanded Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 h-screen w-[270px] shrink-0 border-r border-white/[0.07] bg-[#090b10] transition-transform duration-200 lg:static lg:flex lg:translate-x-0 select-none ${
          mobileOpen ? "flex translate-x-0" : "hidden -translate-x-full"
        }`}
      >
        <div className="flex h-full w-full flex-col">
          {/* Top Bar Header */}
          <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-[#141722] border border-lime-400/30 flex items-center justify-center text-lime-400 font-bold text-[10px] tracking-wider">
                AF
              </div>
              <span className="text-xs font-bold text-white tracking-tight">
                AgentForge
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Collapse Sidebar"
                onClick={() => setCollapsed(true)}
                className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition cursor-pointer"
                title="Collapse Sidebar"
              >
                <PanelLeftIcon size={16} />
              </button>

              <button
                type="button"
                aria-label="Close mobile sidebar"
                onClick={() => setMobileOpen(false)}
                className="lg:hidden flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* New Chat & Filter */}
          <div className="p-3 space-y-2">
            <button
              type="button"
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-lime-400 hover:bg-lime-300 text-[#08090D] font-bold text-xs transition shadow-sm cursor-pointer"
            >
              <Plus size={15} />
              <span>New Conversation</span>
            </button>

            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter chats..."
                className="w-full bg-[#121520] border border-white/[0.06] rounded-lg pl-8 pr-3 py-1.5 text-[11.5px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-lime-400/30"
              />
            </div>
          </div>

          {/* Section Header */}
          <div className="px-4 py-1.5 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500">
            <span>Conversations ({filteredConversations.length})</span>
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="hover:text-slate-300 text-[10px] font-mono"
            >
              ⌘K
            </button>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-8 text-[11px] text-slate-500">
                {filterQuery ? "No matches found" : "No conversations yet"}
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = selectedConversation?._id === conv._id;
                return (
                  <div
                    key={conv._id}
                    onClick={() => {
                      dispatch(setSelectedConversation(conv));
                      if (mobileOpen) setMobileOpen(false);
                    }}
                    className={`group relative flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs transition cursor-pointer border ${
                      isActive
                        ? "bg-[#141722] border-lime-400/25 text-white"
                        : "border-transparent text-slate-400 hover:bg-white/[0.03] hover:text-slate-200"
                    }`}
                  >
                    <MessageSquare
                      size={13}
                      className={isActive ? "text-lime-400 shrink-0" : "text-slate-500 shrink-0"}
                    />
                    <span className="truncate flex-1 font-medium">
                      {conv.title || "New Chat"}
                    </span>

                    <button
                      type="button"
                      title="Delete Conversation"
                      onClick={(e) => handleDeleteConversation(e, conv._id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 hover:bg-white/10 rounded transition shrink-0"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Compute Credit Gauge Card */}
          <div className="p-3 mx-2 mb-2 rounded-xl bg-[#121520] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Coins size={13} className="text-lime-400" />
                <span>Compute Credits</span>
              </span>
              <span className="text-[11px] font-mono text-lime-400">
                {userData?.credits ?? 50}
              </span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full bg-lime-400 rounded-full"
                style={{
                  width: `${Math.min(100, Math.max(5, ((userData?.credits ?? 50) / (userData?.totalCredits || 50)) * 100))}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-mono uppercase text-slate-400">
                {userData?.plan || "Free"} Plan
              </span>
              <button
                type="button"
                onClick={onOpenBilling}
                className="text-[11px] text-lime-400 hover:text-lime-300 font-semibold cursor-pointer"
              >
                Upgrade →
              </button>
            </div>
          </div>

          {/* User Profile Footer */}
          <div className="border-t border-white/[0.07] p-3 bg-[#0a0c12]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#141722] border border-white/[0.08] flex items-center justify-center text-xs font-bold text-white shrink-0 overflow-hidden">
                  {userData?.avatar && !imageError ? (
                    <img
                      src={userData.avatar}
                      alt="User avatar"
                      onError={() => setImageError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={14} className="text-slate-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate">
                    {userData?.name || "Developer"}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {userData?.email || "Signed in"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={onOpenSettings}
                  title="Settings"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
                >
                  <Settings size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/[0.06] transition cursor-pointer"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
