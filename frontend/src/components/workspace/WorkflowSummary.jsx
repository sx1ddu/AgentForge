import { useState } from "react";
import { ChevronDown, ChevronUp, Layers, CheckCircle2 } from "lucide-react";
import WorkRail from "../ui/WorkRail";
import Badge from "../ui/Badge";

export default function WorkflowSummary() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="my-3 border border-[var(--forge-border)] bg-[var(--forge-surface)] rounded-xl overflow-hidden text-xs">
      {/* Header Banner */}
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[var(--forge-surface-elevated)] hover:bg-[var(--forge-surface)] transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <Layers className="w-3.5 h-3.5 text-[var(--forge-accent)]" />
          <span className="font-semibold text-[var(--forge-text)]">
            Multi-Agent Workflow Structure
          </span>
          <Badge variant="lime" size="xs">
            COMPLETED RUN
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-[var(--forge-text-muted)] text-[11px]">
          <span>{isExpanded ? "Hide structure" : "Show 4 stages"}</span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </div>
      </button>

      {/* Expanded Spine View */}
      {isExpanded && (
        <div className="p-4 border-t border-[var(--forge-border)] space-y-3">
          <p className="text-[11px] text-[var(--forge-text-muted)] leading-relaxed">
            The multi-agent graph routes tasks through specialized LangGraph nodes. Below is the confirmed sequence executed for this request:
          </p>

          <div className="pt-2">
            <WorkRail compact={false} />
          </div>

          <div className="pt-2 border-t border-[var(--forge-border)] flex items-center gap-2 text-[10px] font-mono text-[var(--forge-text-muted)]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--forge-accent)]" />
            <span>RESULT SYNTHESIZED AND SIGNED OFF</span>
          </div>
        </div>
      )}
    </div>
  );
}
