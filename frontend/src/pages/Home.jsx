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
import { setUserData } from "../redux/userSlice";
import { verifyPayment } from "../features/verifyPayment";
import { getCurrentUser } from "../features/getCurrentUser";

const Home = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

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

  // If user is authenticated, render the full workspace
  if (userData) {
    return (
      <div className="h-screen flex bg-[#0d0f14] text-white overflow-hidden">
        <Sidebar />
        <ChatArea />
        <Artifact />
      </div>
    );
  }

  // If user is unauthenticated, render the full Marketing Landing Page with optional sign-in modal
  return (
    <>
      <LandingPage onOpenLogin={() => setShowLoginModal(true)} />

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-[370px] bg-[#12141c] border border-white/[0.1] rounded-2xl p-7 flex flex-col gap-5 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col gap-1.5 items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-1">
                <span className="text-xl font-bold text-white tracking-wider">AF</span>
              </div>
              <h2 className="text-[19px] font-bold text-slate-100 tracking-tight">
                Welcome to AgentForge
              </h2>
              <p className="text-[13px] text-slate-400">
                Sign in to collaborate with autonomous AI agents and build projects.
              </p>
            </div>

            {authError && (
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                {authError}
              </div>
            )}

            <button
              type="button"
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold text-black bg-white hover:bg-slate-200 transition duration-150 cursor-pointer shadow-md disabled:opacity-50"
              onClick={googleLogin}
            >
              <FcGoogle size={18} />
              {authLoading ? "Authenticating..." : "Continue with Google"}
            </button>

            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              By continuing, you agree to AgentForge Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
