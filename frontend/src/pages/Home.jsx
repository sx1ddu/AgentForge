import { useEffect, useState } from "react";
import { signInWithPopup } from "firebase/auth";
import api from "../../utils/axios";
import { auth, googleProvider } from "../../utils/firebase";
import { FcGoogle } from "react-icons/fc";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import Artifact from "../components/Artifact";
import LandingPage from "../components/LandingPage";
import BillingDrawer from "../components/BillingDrawer";
import CommandPalette from "../components/ui/CommandPalette";
import SettingsModal from "../components/ui/SettingsModal";
import { setUserData } from "../redux/userSlice";
import { setConversations, setSelectedConversation } from "../redux/conversationSlice";
import { verifyPayment } from "../features/verifyPayment";
import { getCurrentUser } from "../features/getCurrentUser";
import logout from "../features/logout";

const Home = () => {
  const { userData } = useSelector((state) => state.user);
  const { conversations } = useSelector((state) => state.conversation);
  const dispatch = useDispatch();

  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showArtifact, setShowArtifact] = useState(true);

  // Handle Stripe payment return
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (sessionId) {
      verifyPayment(sessionId).then(async (data) => {
        if (data?.paid) {
          const user = await getCurrentUser();
          if (user) {
            dispatch(setUserData(user));
          }
        }
        window.history.replaceState({}, "", window.location.pathname);
      });
    }
  }, [dispatch]);

  // Global platform shortcuts
  useEffect(() => {
    const handleGlobalShortcuts = (e) => {
      // Ctrl+K / Cmd+K -> Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
      // Ctrl+N -> New Conversation
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        dispatch(setSelectedConversation(null));
      }
      // Esc -> Dismiss Modals
      if (e.key === "Escape") {
        setShowLoginModal(false);
        setShowBilling(false);
        setShowSettings(false);
        setShowCommandPalette(false);
      }
    };

    window.addEventListener("keydown", handleGlobalShortcuts);
    return () => window.removeEventListener("keydown", handleGlobalShortcuts);
  }, [dispatch]);

  const handleLogin = async (token) => {
    try {
      setAuthLoading(true);
      setAuthError("");
      const { data } = await api.post("/api/auth/login", { token });
      dispatch(setUserData(data));
      setShowLoginModal(false);
    } catch (error) {
      console.error("Login API error:", error);
      setAuthError(
        error.response?.data?.message ||
          "Failed to log in to AgentForge. Please try again."
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      setAuthLoading(true);
      setAuthError("");
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      await handleLogin(token);
    } catch (err) {
      console.error("Google sign in popup error:", err);
      setAuthError(
        err.message || "Google authentication was cancelled or failed."
      );
      setAuthLoading(false);
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

  // If user is authenticated, render the full application workspace
  if (userData) {
    return (
      <div className="h-screen flex bg-[#08090D] text-white overflow-hidden font-sans">
        <Sidebar
          onOpenBilling={() => setShowBilling(true)}
          onOpenSettings={() => setShowSettings(true)}
          onOpenCommandPalette={() => setShowCommandPalette(true)}
        />
        <ChatArea
          onOpenBilling={() => setShowBilling(true)}
          onOpenSettings={() => setShowSettings(true)}
          onOpenCommandPalette={() => setShowCommandPalette(true)}
          onToggleArtifact={() => setShowArtifact((prev) => !prev)}
        />
        {showArtifact && <Artifact />}

        <BillingDrawer
          open={showBilling}
          onClose={() => setShowBilling(false)}
        />

        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          userData={userData}
          onOpenBilling={() => {
            setShowSettings(false);
            setShowBilling(true);
          }}
        />

        <CommandPalette
          isOpen={showCommandPalette}
          onClose={() => setShowCommandPalette(false)}
          conversations={conversations}
          onSelectConversation={(conv) => dispatch(setSelectedConversation(conv))}
          onNewChat={() => dispatch(setSelectedConversation(null))}
          onOpenBilling={() => setShowBilling(true)}
          onOpenSettings={() => setShowSettings(true)}
          onToggleArtifact={() => setShowArtifact((prev) => !prev)}
          onLogout={handleLogout}
        />
      </div>
    );
  }

  // If unauthenticated, render the full Marketing Landing Page with modal sign-in flow
  return (
    <>
      <LandingPage onOpenLogin={() => setShowLoginModal(true)} />

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-[370px] bg-[#0e1017] border border-white/[0.1] rounded-2xl p-7 flex flex-col gap-5 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>

            <div className="flex flex-col gap-1.5 items-center text-center">
              <div className="w-10 h-10 rounded-xl bg-[#141722] border border-lime-400/30 flex items-center justify-center text-lime-400 font-bold text-sm tracking-wider shadow-sm mb-1">
                AF
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Sign in to AgentForge
              </h2>
              <p className="text-xs text-slate-400">
                Orchestrate multi-agent teams with 50 free credits
              </p>
            </div>

            {authError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center">
                {authError}
              </div>
            )}

            <button
              type="button"
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-200 transition duration-150 cursor-pointer shadow-md disabled:opacity-50"
              onClick={googleLogin}
            >
              <FcGoogle size={18} />
              <span>{authLoading ? "Authenticating..." : "Continue with Google"}</span>
            </button>

            <p className="text-[10.5px] text-slate-500 text-center leading-relaxed">
              By continuing, you agree to AgentForge Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
