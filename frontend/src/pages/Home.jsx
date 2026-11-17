import { useEffect, useState } from "react";
import { signInWithPopup } from "firebase/auth";
import api from "../../utils/axios";
import { auth, googleProvider } from "../../utils/firebase";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";

import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import Artifact from "../components/Artifact";
import { setUserData } from "../redux/userSlice";
import { verifyPayment } from "../features/verifyPayment";
import { getCurrentUser } from "../features/getCurrentUser";

const Home = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

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
    } catch (error) {
      console.error("Login API error:", error);
      setAuthError(error.response?.data?.message || "Failed to log in to AgentForge. Please try again.");
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
      setAuthError(err.message || "Google authentication was cancelled or failed.");
      setAuthLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-[#0d0f14] text-white overflow-hidden">
      <Sidebar />
      <ChatArea />
      <Artifact />

      {!userData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-[360px] bg-[#13151c] border border-white/[0.08] rounded-2xl p-7 flex flex-col gap-5 shadow-2xl">
            <div className="flex flex-col gap-1.5 items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-1">
                <span className="text-xl font-bold text-white tracking-wider">AF</span>
              </div>
              <h2 className="text-[18px] font-bold text-slate-100 tracking-tight">
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
    </div>
  );
};

export default Home;
