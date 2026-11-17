import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PrimaryRail from "./PrimaryRail";
import ConversationSidebar from "./ConversationSidebar";
import WorkspaceHeader from "./WorkspaceHeader";
import CommandPalette from "../ui/CommandPalette";
import { setSelectedConversation } from "../../redux/conversationSlice";

export default function AppShell({
  children,
  title = "New task",
  showArtifactToggle = false,
  isArtifactOpen = false,
  onToggleArtifact,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl+K -> Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      // Cmd/Ctrl+N -> New Task
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        dispatch(setSelectedConversation(null));
        navigate("/app");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, navigate]);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[var(--forge-canvas)] text-[var(--forge-text)] font-sans antialiased">
      {/* 56px Primary Navigation Rail */}
      <div className="hidden md:flex">
        <PrimaryRail onOpenSettings={() => navigate("/app/settings")} />
      </div>

      {/* 248px Desktop Sidebar */}
      <div className="hidden md:flex">
        <ConversationSidebar
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />
      </div>

      {/* Mobile Drawer (Responsive) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex h-full z-50">
            <PrimaryRail onOpenSettings={() => navigate("/app/settings")} />
            <ConversationSidebar
              onOpenCommandPalette={() => {
                setIsMobileMenuOpen(false);
                setIsCommandPaletteOpen(true);
              }}
              onCloseMobile={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Execution Surface */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[var(--forge-canvas)]">
        <WorkspaceHeader
          title={title}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
          showArtifactToggle={showArtifactToggle}
          isArtifactOpen={isArtifactOpen}
          onToggleArtifact={onToggleArtifact}
        />

        {/* Content Area */}
        <main className="flex-1 flex min-h-0 overflow-hidden relative">
          {children}
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}
