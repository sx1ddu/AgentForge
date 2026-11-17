export default function PendingResponse() {
  return (
    <div className="flex items-start gap-3.5 my-4 max-w-3xl select-none animate-fadeIn">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-lg bg-[var(--forge-surface-elevated)] border border-[var(--forge-accent)]/40 text-[var(--forge-accent)] font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
        AF
      </div>

      {/* Surface Card */}
      <div className="flex-1 bg-[var(--forge-surface)] border border-[var(--forge-border)] rounded-xl p-4 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[var(--forge-border)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--forge-accent)] animate-ping" />
            <span className="text-xs font-semibold text-[var(--forge-text)]">
              AgentForge Orchestrator
            </span>
          </div>
          <span className="text-[10px] font-mono text-[var(--forge-accent)] uppercase tracking-wider">
            EXECUTING RUN
          </span>
        </div>

        {/* Content */}
        <div className="flex items-center gap-3 py-2 text-xs text-[var(--forge-text-secondary)]">
          <svg
            className="animate-spin h-4 w-4 text-[var(--forge-accent)] flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <div className="space-y-1">
            <p className="font-medium text-[var(--forge-text)]">
              Synthesizing execution path...
            </p>
            <p className="text-[11px] text-[var(--forge-text-muted)] leading-relaxed">
              Coordinating agent nodes, validating dependencies and assembling output artifacts.
            </p>
          </div>
        </div>

        {/* Indeterminate linear progress bar */}
        <div className="w-full h-1 bg-[var(--forge-border)] rounded-full overflow-hidden mt-3 relative">
          <div className="absolute top-0 bottom-0 left-0 bg-[var(--forge-accent)] w-1/3 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
