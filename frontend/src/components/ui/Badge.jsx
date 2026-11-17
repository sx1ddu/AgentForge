export default function Badge({
  children,
  variant = "muted", // lime | blue | purple | amber | muted | outline | danger
  size = "sm", // xs | sm
  mono = true,
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center font-medium rounded uppercase tracking-wider select-none";

  const variants = {
    lime: "bg-[var(--forge-accent)]/15 text-[var(--forge-accent)] border border-[var(--forge-accent)]/30",
    blue: "bg-[var(--forge-blue)]/15 text-[var(--forge-blue)] border border-[var(--forge-blue)]/30",
    purple: "bg-[var(--forge-purple)]/15 text-[var(--forge-purple)] border border-[var(--forge-purple)]/30",
    amber: "bg-[var(--forge-amber)]/15 text-[var(--forge-amber)] border border-[var(--forge-amber)]/30",
    muted: "bg-[var(--forge-surface-elevated)] text-[var(--forge-text-muted)] border border-[var(--forge-border)]",
    outline: "bg-transparent text-[var(--forge-text-secondary)] border border-[var(--forge-border)]",
    danger: "bg-[var(--forge-red)]/15 text-[var(--forge-red)] border border-[var(--forge-red)]/30",
  };

  const sizes = {
    xs: "text-[9px] px-1.5 py-0.5",
    sm: "text-[10px] px-2 py-0.5",
  };

  return (
    <span
      className={`${base} ${variants[variant] || variants.muted} ${sizes[size] || sizes.sm} ${
        mono ? "font-mono" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
