import { useEffect, useState } from "react";
import {
  Coins,
  LogOut,
  Menu,
  MessageSquare,
  PanelLeftIcon,
  PanelRight,
  PenSquare,
  Plus,
  Trash2,
  User,
  X,
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
import BillingDrawer from "./BillingDrawer";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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

  if (collapsed) {
    return (
      <div className="hidden lg:flex flex-col items-center w-16 h-screen shrink-0 bg-[#0d0f14] border-r border-white/[0.06] py-4 gap-2">
        <button
          type="button"
          aria-label="Expand Sidebar"
          onClick={() => setCollapsed(false)}
          className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition cursor-pointer"
        >
          <PanelRight size={17} />
        </button>

        <button
          type="button"
          aria-label="New Chat"
          onClick={handleNewChat}
          className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-400 hover:text-white bg-indigo-600/20 hover:bg-indigo-600/30 transition cursor-pointer"
          title="New Chat"
        >
          <Plus size={16} />
        </button>

        <div className="flex-1 w-full overflow-y-auto pt-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {conversations.map((conv) => {
            const isActive = selectedConversation?._id === conv._id;

            return (
              <div
                key={conv._id}
                title={conv.title || "New Chat"}
                onClick={() => dispatch(setSelectedConversation(conv))}
                className={`flex justify-center items-center w-10 h-10 mx-auto mb-1 rounded-xl cursor-pointer transition ${
                  isActive
                    ? "bg-indigo-500/20 text-indigo-400"
                    : "text-slate-500 hover:bg-white/[0.05] hover:text-slate-300"
                }`}
              >
                <MessageSquare size={16} />
              </div>
            );
          })}
        </div>

        <div className="pb-2 flex justify-center">
          {userData?.avatar && !imageError ? (
            <img
              src={userData.avatar}
              alt="User"
              onError={() => setImageError(true)}
              className="w-9 h-9 rounded-xl object-cover border-2 border-indigo-500/25 cursor-pointer hover:scale-105 transition"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center cursor-pointer">
              <User size={15} className="text-slate-400" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        aria-label="Open mobile menu"
        className="lg:hidden fixed top-3 left-4 z-50 flex items-center justify-center w-8 h-8 rounded-lg bg-[#0d0f14] border border-white/[0.08] text-slate-400 hover:text-slate-200 transition cursor-pointer"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={18} />
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 h-screen w-[280px] shrink-0 border-r border-white/[0.06] bg-[#0d0f14] transition-transform duration-200 lg:static lg:flex lg:translate-x-0 ${
          mobileOpen ? "flex translate-x-0" : "hidden -translate-x-full"
        }`}
      >
        <div className="flex h-full w-full flex-col">
          {/* Header */}
          <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-4 py-3.5">
            <button
              type="button"
              aria-label="Collapse Sidebar"
              onClick={() => setCollapsed(true)}
              className="hidden h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/[0.05] hover:text-slate-200 lg:flex transition cursor-pointer"
            >
              <PanelLeftIcon size={18} />
            </button>

            <button
              type="button"
              aria-label="Close mobile sidebar"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex-1 flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-[10px] text-white">
                AF
              </div>
              <span className="text-[15px] font-bold tracking-tight text-slate-100">
                AgentForge
              </span>
            </div>

            <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-indigo-400 capitalize">
              {userData?.plan || "Free"}
            </span>

            <button
              type="button"
              aria-label="New Chat"
              onClick={handleNewChat}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/[0.05] hover:text-slate-200 transition cursor-pointer"
              title="New Chat"
            >
              <PenSquare size={15} />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="px-3.5 pt-3.5 pb-1.5">
            <button
              type="button"
              onClick={handleNewChat}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-700 py-2.5 text-xs font-semibold text-white transition hover:opacity-95 cursor-pointer shadow-sm shadow-indigo-500/20"
            >
              <Plus size={15} />
              New Conversation
            </button>
          </div>

          {/* Recents Section */}
          <div className="px-4 pt-3 pb-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">
            {conversations.length === 0 ? "No Conversations" : "Recent Conversations"}
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {conversations.map((conv) => {
              const isActive = selectedConversation?._id === conv._id;

              return (
                <div
                  key={conv._id}
                  onClick={() => {
                    dispatch(setSelectedConversation(conv));
                    if (mobileOpen) setMobileOpen(false);
                  }}
                  className={`group relative flex cursor-pointer items-center gap-2.5 rounded-xl border px-2.5 py-2 transition ${
                    isActive
                      ? "border-indigo-500/30 bg-indigo-500/15"
                      : "border-transparent hover:bg-white/[0.04]"
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                      isActive ? "bg-indigo-500/20 text-indigo-400" : "text-slate-500"
                    }`}
                  >
                    <MessageSquare size={14} />
                  </div>

                  <span
                    title={conv.title || "New Chat"}
                    className={`truncate flex-1 text-[12.5px] font-medium ${
                      isActive ? "text-slate-100" : "text-slate-300"
                    }`}
                  >
                    {conv.title || "New Chat"}
                  </span>

                  {/* Delete Conversation Button */}
                  <button
                    type="button"
                    title="Delete Conversation"
                    onClick={(e) => handleDeleteConversation(e, conv._id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 hover:bg-white/10 rounded transition cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="mx-3 h-px bg-white/[0.06]" />

          {/* User Profile & Footer */}
          <div className="p-3">
            {userData ? (
              <div className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition hover:bg-white/[0.04]">
                <div className="shrink-0">
                  {userData.avatar && !imageError ? (
                    <img
                      src={userData.avatar}
                      alt={userData.name}
                      onError={() => setImageError(true)}
                      className="h-8 w-8 rounded-lg border border-indigo-500/30 object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06]">
                      <User size={14} className="text-slate-400" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-100">
                    {userData.name || "User"}
                  </p>
                  <p className="text-[10.5px] text-slate-400 capitalize">
                    {userData.plan ? `${userData.plan} Plan` : "Free Plan"} • {userData.credits ?? 0} cr
                  </p>
                </div>

                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => setShowBilling(true)}
                    aria-label="Billing & Upgrade"
                    title="Upgrade & Credits"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-amber-400 hover:bg-white/[0.08] transition cursor-pointer"
                  >
                    <Coins size={15} />
                  </button>

                  <button
                    type="button"
                    aria-label="Logout"
                    title="Sign Out"
                    onClick={handleLogout}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-white/[0.08] hover:text-red-400 transition cursor-pointer"
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 text-center py-2">
                Not signed in
              </div>
            )}
          </div>
        </div>
      </aside>

      <BillingDrawer open={showBilling} onClose={() => setShowBilling(false)} />
    </>
  );
};

export default Sidebar;
