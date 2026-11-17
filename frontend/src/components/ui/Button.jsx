export default function Button({
  children,
  variant = "primary", // primary | secondary | ghost | danger | outline
  size = "md", // sm | md | lg
  className = "",
  disabled = false,
  loading = false,
  icon = null,
  onClick,
  type = "button",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-medium transition-all duration-150 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2";

  const variants = {
    primary:
      "bg-[var(--forge-accent)] text-[var(--forge-accent-text)] font-semibold hover:brightness-105 active:scale-[0.99] focus-visible:outline-[var(--forge-accent)] shadow-sm",
    secondary:
      "bg-[var(--forge-surface-elevated)] border border-[var(--forge-border-strong)] text-[var(--forge-text)] hover:bg-[var(--forge-surface)] hover:border-[var(--forge-accent)] active:scale-[0.99] focus-visible:outline-[var(--forge-accent)]",
    ghost:
      "bg-transparent text-[var(--forge-text-secondary)] hover:text-[var(--forge-text)] hover:bg-[var(--forge-surface-elevated)] focus-visible:outline-[var(--forge-border)]",
    danger:
      "bg-[#ef8178]/15 border border-[#ef8178]/30 text-[#ef8178] hover:bg-[#ef8178]/25 active:scale-[0.99] focus-visible:outline-[#ef8178]",
    outline:
      "bg-transparent border border-[var(--forge-border)] text-[var(--forge-text)] hover:border-[var(--forge-accent)] hover:text-[var(--forge-accent)] focus-visible:outline-[var(--forge-accent)]",
  };

  const sizes = {
    sm: "text-xs px-2.5 py-1.5 gap-1.5",
    md: "text-xs px-3.5 py-2 gap-2",
    lg: "text-sm px-4 py-2.5 gap-2.5",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-3.5 w-3.5 text-current"
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
      )}
      {!loading && icon}
      {children}
    </button>
  );
}
