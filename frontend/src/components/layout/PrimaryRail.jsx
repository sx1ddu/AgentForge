import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MessageSquare, Compass, CreditCard, Settings, Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function PrimaryRail({ onOpenSettings }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const userData = useSelector((state) => state.user?.userData);

  const navItems = [
    {
      id: "workspace",
      label: "Workspace",
      icon: MessageSquare,
      path: "/app",
      isActive: location.pathname.startsWith("/app") && !location.pathname.startsWith("/app/agents") && !location.pathname.startsWith("/app/billing") && !location.pathname.startsWith("/app/settings"),
    },
    {
      id: "agents",
      label: "Agent Library",
      icon: Compass,
      path: "/app/agents",
      isActive: location.pathname.startsWith("/app/agents"),
    },
    {
      id: "billing",
      label: "Billing & Credits",
      icon: CreditCard,
      path: "/app/billing",
      isActive: location.pathname.startsWith("/app/billing"),
    },
  ];

  const getInitials = (name) => {
    if (!name) return "AF";
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  return (
    <aside className="w-14 bg-[var(--forge-canvas)] border-r border-[var(--forge-border)] flex flex-col items-center py-3.5 gap-3.5 flex-shrink-0 z-20 select-none">
      {/* Brand Mark */}
      <button
        onClick={() => navigate("/app")}
        title="AgentForge Workspace"
        className="w-8 h-8 rounded-lg bg-[var(--forge-accent)] text-[var(--forge-accent-text)] font-black text-xs flex items-center justify-center tracking-tight shadow-sm cursor-pointer transition-transform active:scale-95"
      >
        AF
      </button>

      {/* Navigation Icons */}
      <nav className="flex flex-col items-center gap-1.5 w-full px-2 mt-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              title={item.label}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                item.isActive
                  ? "bg-[var(--forge-surface-elevated)] text-[var(--forge-accent)] shadow-xs"
                  : "text-[var(--forge-text-muted)] hover:text-[var(--forge-text)] hover:bg-[var(--forge-surface)]"
              }`}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </nav>

      {/* Bottom Rail Actions */}
      <div className="mt-auto flex flex-col items-center gap-2 w-full px-2">
        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--forge-text-muted)] hover:text-[var(--forge-text)] hover:bg-[var(--forge-surface)] transition-colors cursor-pointer"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* Settings Button */}
        <button
          onClick={() => {
            if (onOpenSettings) onOpenSettings();
            else navigate("/app/settings");
          }}
          title="Settings"
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
            location.pathname.startsWith("/app/settings")
              ? "bg-[var(--forge-surface-elevated)] text-[var(--forge-accent)]"
              : "text-[var(--forge-text-muted)] hover:text-[var(--forge-text)] hover:bg-[var(--forge-surface)]"
          }`}
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Avatar */}
        <button
          onClick={() => navigate("/app/settings")}
          title={userData?.name || "User Profile"}
          className="w-8 h-8 rounded-full bg-[var(--forge-surface-elevated)] border border-[var(--forge-border)] text-[var(--forge-accent)] text-[10px] font-bold flex items-center justify-center overflow-hidden cursor-pointer hover:border-[var(--forge-accent)] transition-colors mt-1"
        >
          {userData?.avatar ? (
            <img
              src={userData.avatar}
              alt={userData.name}
              className="w-full h-full object-cover"
            />
          ) : (
            getInitials(userData?.name)
          )}
        </button>
      </div>
    </aside>
  );
}
