import { Fragment } from "react";
import Badge from "./Badge";

const STAGES = [
  {
    num: "01",
    name: "Planner",
    desc: "Architectural decomposition and task planning",
    tag: "NODE",
    badgeVariant: "lime",
  },
  {
    num: "02",
    name: "Researcher",
    desc: "Gathers technical context and docs when needed",
    tag: "CONDITIONAL",
    badgeVariant: "blue",
  },
  {
    num: "03",
    name: "Collaborative Coder",
    desc: "Full-stack code synthesis and file artifacts",
    tag: "NODE",
    badgeVariant: "purple",
  },
  {
    num: "04",
    name: "Reviewer",
    desc: "Syntax validation, static analysis and quality audit",
    tag: "VERIFIED",
    badgeVariant: "amber",
  },
];

export default function WorkRail({
  activeStep = null, // index 0..3 or null
  compact = false,
  orientation = "vertical", // vertical | horizontal
  className = "",
}) {
  if (orientation === "horizontal") {
    return (
      <div className={`w-full flex items-center justify-between gap-2 overflow-x-auto py-2 ${className}`}>
        {STAGES.map((st, i) => {
          const isActive = activeStep === i;
          return (
            <Fragment key={st.num}>
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                  isActive
                    ? "bg-[var(--forge-surface-elevated)] border-[var(--forge-accent)]"
                    : "bg-[var(--forge-surface)] border-[var(--forge-border)]"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border ${
                    isActive
                      ? "bg-[var(--forge-accent)] text-[var(--forge-accent-text)] border-[var(--forge-accent)]"
                      : "bg-[var(--forge-surface-elevated)] text-[var(--forge-text-secondary)] border-[var(--forge-border)]"
                  }`}
                >
                  {st.num}
                </div>
                <div>
                  <div className="text-xs font-semibold text-[var(--forge-text)]">
                    {st.name}
                  </div>
                  {!compact && (
                    <div className="text-[10px] text-[var(--forge-text-muted)]">
                      {st.tag}
                    </div>
                  )}
                </div>
              </div>
              {i < STAGES.length - 1 && (
                <div className="h-[1px] w-6 bg-[var(--forge-border)] flex-shrink-0" />
              )}
            </Fragment>
          );
        })}
      </div>
    );
  }

  // Default vertical Work Rail spine
  return (
    <div className={`relative flex flex-col gap-0 ${className}`}>
      {STAGES.map((st, i) => {
        const isLast = i === STAGES.length - 1;
        const isActive = activeStep === i;

        return (
          <div key={st.num} className="relative flex items-start gap-3.5 pb-6 last:pb-1 group">
            {/* Connecting spine line */}
            {!isLast && (
              <div className="absolute left-[13px] top-[28px] bottom-0 w-[1px] bg-[var(--forge-border)] group-hover:bg-[var(--forge-border-strong)] transition-colors" />
            )}

            {/* Stage number circle */}
            <div
              className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center font-mono text-[11px] font-bold border transition-colors ${
                isActive
                  ? "bg-[var(--forge-accent)] text-[var(--forge-accent-text)] border-[var(--forge-accent)] ring-2 ring-[var(--forge-accent)]/20"
                  : "bg-[var(--forge-surface-elevated)] text-[var(--forge-text-secondary)] border-[var(--forge-border)]"
              }`}
            >
              {st.num}
            </div>

            {/* Stage details */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[var(--forge-text)]">
                  {st.name}
                </span>
                <Badge variant={st.badgeVariant} size="xs">
                  {st.tag}
                </Badge>
              </div>
              {!compact && (
                <p className="text-[11px] text-[var(--forge-text-muted)] mt-0.5 leading-relaxed">
                  {st.desc}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
