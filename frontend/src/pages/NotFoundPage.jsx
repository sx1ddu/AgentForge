import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--forge-canvas)] text-[var(--forge-text)] flex flex-col items-center justify-center p-6 text-center select-none font-sans">
      <div className="w-12 h-12 rounded-2xl bg-[var(--forge-surface-elevated)] border border-[var(--forge-border)] flex items-center justify-center text-[var(--forge-accent)] mb-4">
        <Compass className="w-6 h-6" />
      </div>

      <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--forge-accent)] mb-2">
        ERROR 404 / NOT FOUND
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-[var(--forge-text)]">
        Page does not exist.
      </h1>

      <p className="text-xs sm:text-sm text-[var(--forge-text-secondary)] mt-2 max-w-sm leading-relaxed">
        The destination you are looking for has moved, expired, or does not exist in the AgentForge workspace.
      </p>

      <div className="flex items-center gap-3 mt-6">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate("/")}
          icon={<ArrowLeft className="w-3.5 h-3.5" />}
        >
          Landing Page
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate("/app")}
        >
          Go to Workspace
        </Button>
      </div>
    </div>
  );
}
