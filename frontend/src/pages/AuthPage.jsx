import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../utils/firebase";
import api from "../../utils/axios";
import { setUserData } from "../redux/userSlice";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import WorkRail from "../components/ui/WorkRail";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isSignup = location.pathname.includes("signup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      const { data } = await api.post("/api/auth/login", { token });
      dispatch(setUserData(data));
      navigate("/app", { replace: true });
    } catch (err) {
      console.error("Google authentication error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Google sign-in was cancelled or failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--forge-canvas)] text-[var(--forge-text)] flex flex-col font-sans select-none">
      {/* Top Header */}
      <header className="h-14 border-b border-[var(--forge-border)] px-6 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xs text-[var(--forge-text-muted)] hover:text-[var(--forge-text)] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[var(--forge-accent)] text-[var(--forge-accent-text)] font-black text-[10px] flex items-center justify-center">
            AF
          </div>
          <span className="text-xs font-bold tracking-tight">AGENTFORGE</span>
        </div>
      </header>

      {/* Split Body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0">
        {/* Left Editorial Brand Panel (54%) */}
        <div className="hidden lg:flex lg:col-span-7 bg-[var(--forge-sidebar-bg)] border-r border-[var(--forge-border)] p-12 flex-col justify-between">
          <div>
            <Badge variant="lime" size="xs">
              AGENTFORGE / ACCESS
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight text-[var(--forge-text)] mt-6 mb-4 max-w-lg leading-tight">
              Make room for the work that matters.
            </h1>

            <p className="text-sm text-[var(--forge-text-secondary)] leading-relaxed max-w-md">
              One unified workspace for research, full-stack engineering, document authoring, and inspectable code artifacts.
            </p>
          </div>

          {/* Workflow Rail Card Showcase */}
          <div className="bg-[var(--forge-surface)] border border-[var(--forge-border)] rounded-2xl p-6 max-w-md shadow-xl my-8">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--forge-border)] text-[10px] font-mono text-[var(--forge-text-muted)]">
              <span>WORKFLOW EXECUTION</span>
              <span className="text-[var(--forge-accent)]">04 STAGES</span>
            </div>

            <WorkRail compact={false} />
          </div>

          <div className="text-[10px] font-mono text-[var(--forge-text-muted)]">
            SECURE TOKEN-BASED SESSION AUTHENTICATION
          </div>
        </div>

        {/* Right Authentication Form (46%) */}
        <div className="lg:col-span-5 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-sm space-y-6">
            <div>
              <Badge variant="muted" size="xs">
                {isSignup ? "CREATE YOUR ACCOUNT" : "WELCOME TO THE FORGE"}
              </Badge>
              <h2 className="text-2xl font-bold text-[var(--forge-text)] tracking-tight mt-2">
                {isSignup ? "Create your workspace." : "Sign in to continue."}
              </h2>
              <p className="text-xs text-[var(--forge-text-secondary)] mt-1.5 leading-relaxed">
                Use your Google account to access your AgentForge workspace and saved tasks.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-[var(--forge-red)]/15 border border-[var(--forge-red)]/30 text-[var(--forge-red)] text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Google OAuth Button */}
            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleGoogleAuth}
                loading={loading}
                className="w-full py-3 text-sm font-semibold shadow-md flex items-center justify-center gap-3"
              >
                {!loading && (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Continue with Google</span>
              </Button>
            </div>

            {/* Explanatory notes */}
            <div className="space-y-2 pt-2 border-t border-[var(--forge-border)] text-[11px] text-[var(--forge-text-muted)] leading-relaxed">
              <p>
                New to AgentForge? Your workspace is automatically provisioned with 100 free credits when you continue with Google.
              </p>
              <p className="text-[10px]">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
