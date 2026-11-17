import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Menu,
  Sun,
  Moon,
  PanelRightOpen,
  PanelRightClose,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function WorkspaceHeader({
  title = "New task",
  onOpenCommandPalette,
  onToggleMobileMenu,
  showArtifactToggle = false,
  isArtifactOpen = false,
  onToggleArtifact,
}) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const userData = useSelector((state) => state.user?.userData);
  const credits = userData?.credits ?? 0;

  return (
    <header className="h-14 border-b border-[var(--forge-border)] bg-[var(--forge-canvas)] px-4 md:px-6 flex items-center justify-between flex-shrink-0 z-10 select-none">
      {/* Left: Mobile Drawer Trigger + Breadcrumb */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-1.5 text-[var(--forge-text-muted)] hover:text-[var(--forge-text)] rounded-md hover:bg-[var(--forge-surface)] transition-colors cursor-pointer"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav className="flex items-center gap-1.5 text-xs text-[var(--forge-text-secondary)] truncate">
          <span className="hidden sm:inline hover:text-[var(--forge-text)] transition-colors">
            Workspace
          </span>
          <span className="hidden sm:inline text-[var(--forge-text-muted)] font-mono">
            /
          </span>
          <strong className="text-[var(--forge-text)] font-semibold truncate">
            {title}
          </strong>
        </nav>
      </div>

      {/* Right: Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Command Palette Button */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[var(--forge-border)] text-[var(--forge-text-muted)] hover:text-[var(--forge-text)] hover:border-[var(--forge-border-strong)] bg-[var(--forge-surface)] text-xs font-mono transition-colors cursor-pointer"
        >
          <span>⌘K</span>
          <span className="text-[11px] font-sans">Commands</span>
        </button>

        {/* Credit Balance Pill */}
        <button
          onClick={() => navigate("/app/billing")}
          title="Manage credits and billing"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--forge-border)] bg-[var(--forge-surface)] text-xs hover:border-[var(--forge-accent)] transition-colors cursor-pointer"
        >
          <span className="text-[var(--forge-accent)] font-bold text-xs">◈</span>
          <span className="font-mono font-bold text-[var(--forge-text)]">
            {credits}
          </span>
          <span className="hidden sm:inline text-[var(--forge-text-muted)] text-[11px]">
            credits
          </span>
        </button>

        {/* Artifact Inspector Toggle Button (when artifacts are present or loaded) */}
        {showArtifactToggle && (
          <button
            onClick={onToggleArtifact}
            title={isArtifactOpen ? "Close Inspector" : "Open Inspector"}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isArtifactOpen
                ? "bg-[var(--forge-accent)]/15 border-[var(--forge-accent)]/40 text-[var(--forge-accent)]"
                : "border-[var(--forge-border)] text-[var(--forge-text-muted)] hover:text-[var(--forge-text)] hover:bg-[var(--forge-surface)]"
            }`}
          >
            {isArtifactOpen ? (
              <PanelRightClose className="w-4 h-4" />
            ) : (
              <PanelRightOpen className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} theme`}
          className="p-1.5 rounded-lg border border-[var(--forge-border)] text-[var(--forge-text-muted)] hover:text-[var(--forge-text)] hover:bg-[var(--forge-surface)] transition-colors cursor-pointer"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
}
