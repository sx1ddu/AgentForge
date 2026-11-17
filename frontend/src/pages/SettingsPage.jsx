import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import AppShell from "../components/layout/AppShell";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useTheme } from "../context/ThemeContext";
import logOut from "../features/logout";
import { setUserData } from "../redux/userSlice";
import { setSelectedConversation } from "../redux/conversationSlice";
import {
  User,
  Sun,
  Moon,
  Keyboard,
  LogOut,
} from "lucide-react";

export default function SettingsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const userData = useSelector((state) => state.user?.userData);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logOut();
    } finally {
      dispatch(setUserData(null));
      dispatch(setSelectedConversation(null));
      setLoggingOut(false);
      navigate("/login", { replace: true });
    }
  };

  return (
    <AppShell title="Settings">
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--forge-accent)] mb-1">
              PREFERENCES / SETTINGS
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--forge-text)]">
              Make the workspace yours.
            </h1>
            <p className="text-xs sm:text-sm text-[var(--forge-text-secondary)] mt-1.5 leading-relaxed">
              Account identity, local workspace appearance, and keyboard productivity shortcuts.
            </p>
          </div>

          {/* Section: Profile */}
          <div className="bg-[var(--forge-surface)] border border-[var(--forge-border)] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--forge-border)]">
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-[var(--forge-accent)]" />
                <h2 className="text-sm font-semibold text-[var(--forge-text)]">
                  Account Profile
                </h2>
              </div>
              <Badge variant="outline" size="xs">
                READ ONLY
              </Badge>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-[var(--forge-border)]/60 gap-1">
                <span className="text-[var(--forge-text-secondary)]">
                  Display name
                </span>
                <span className="font-medium text-[var(--forge-text)]">
                  {userData?.name || "Workspace member"}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-[var(--forge-border)]/60 gap-1">
                <span className="text-[var(--forge-text-secondary)]">
                  Email address
                </span>
                <span className="font-mono text-[var(--forge-text)]">
                  {userData?.email || "No email provided"}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-[var(--forge-border)]/60 gap-1">
                <span className="text-[var(--forge-text-secondary)]">
                  Subscription tier
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant="lime" size="xs">
                    {(userData?.plan || "free").toUpperCase()}
                  </Badge>
                  <button
                    onClick={() => navigate("/app/billing")}
                    className="text-[11px] text-[var(--forge-accent)] hover:underline cursor-pointer"
                  >
                    Manage billing
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 gap-1">
                <span className="text-[var(--forge-text-secondary)]">
                  Current credit balance
                </span>
                <span className="font-mono font-bold text-[var(--forge-accent)]">
                  {userData?.credits ?? 0} credits
                </span>
              </div>
            </div>
          </div>

          {/* Section: Appearance */}
          <div className="bg-[var(--forge-surface)] border border-[var(--forge-border)] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--forge-border)]">
              <div className="flex items-center gap-2.5">
                {theme === "dark" ? (
                  <Moon className="w-4 h-4 text-[var(--forge-accent)]" />
                ) : (
                  <Sun className="w-4 h-4 text-[var(--forge-accent)]" />
                )}
                <h2 className="text-sm font-semibold text-[var(--forge-text)]">
                  Appearance
                </h2>
              </div>
              <Badge variant="muted" size="xs">
                LOCAL PREFERENCE
              </Badge>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div>
                <div className="font-medium text-[var(--forge-text)]">
                  Workspace theme
                </div>
                <div className="text-[11px] text-[var(--forge-text-muted)] mt-0.5">
                  Currently active:{" "}
                  <strong className="text-[var(--forge-text)]">
                    {theme === "dark" ? "Graphite / Signal (Dark)" : "Paper / Forest (Light)"}
                  </strong>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={toggleTheme}
                icon={theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              >
                Switch to {theme === "dark" ? "Light" : "Dark"}
              </Button>
            </div>
          </div>

          {/* Section: Keyboard Shortcuts */}
          <div className="bg-[var(--forge-surface)] border border-[var(--forge-border)] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--forge-border)]">
              <div className="flex items-center gap-2.5">
                <Keyboard className="w-4 h-4 text-[var(--forge-accent)]" />
                <h2 className="text-sm font-semibold text-[var(--forge-text)]">
                  Keyboard Shortcuts
                </h2>
              </div>
              <Badge variant="outline" size="xs">
                SYSTEM
              </Badge>
            </div>

            <div className="divide-y divide-[var(--forge-border)]/60 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[var(--forge-text-secondary)]">
                  Open Command Palette
                </span>
                <span className="font-mono text-[10px] text-[var(--forge-text)] bg-[var(--forge-surface-elevated)] border border-[var(--forge-border)] px-2 py-0.5 rounded">
                  ⌘ / Ctrl + K
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[var(--forge-text-secondary)]">
                  Start New Task
                </span>
                <span className="font-mono text-[10px] text-[var(--forge-text)] bg-[var(--forge-surface-elevated)] border border-[var(--forge-border)] px-2 py-0.5 rounded">
                  ⌘ / Ctrl + N
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[var(--forge-text-secondary)]">
                  Send Task Brief
                </span>
                <span className="font-mono text-[10px] text-[var(--forge-text)] bg-[var(--forge-surface-elevated)] border border-[var(--forge-border)] px-2 py-0.5 rounded">
                  Enter
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[var(--forge-text-secondary)]">
                  Multi-line Break in Composer
                </span>
                <span className="font-mono text-[10px] text-[var(--forge-text)] bg-[var(--forge-surface-elevated)] border border-[var(--forge-border)] px-2 py-0.5 rounded">
                  Shift + Enter
                </span>
              </div>
            </div>
          </div>

          {/* Section: Session / Logout */}
          <div className="bg-[var(--forge-surface)] border border-[var(--forge-border)] rounded-2xl p-6 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[var(--forge-text)]">
                Sign Out
              </div>
              <div className="text-xs text-[var(--forge-text-muted)] mt-0.5">
                End this browser session and clear identity credentials.
              </div>
            </div>

            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowLogoutConfirm(true)}
              icon={<LogOut className="w-3.5 h-3.5" />}
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        loading={loggingOut}
        title="Sign Out of AgentForge"
        description="Are you sure you want to end your current session? You can sign back in anytime using your Google account."
        confirmLabel="Sign out"
      />
    </AppShell>
  );
}
