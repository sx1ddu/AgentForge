import { forwardRef } from "react";

const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon = null,
    className = "",
    mono = false,
    type = "text",
    ...props
  },
  ref
) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-[var(--forge-text-secondary)]">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-[var(--forge-text-muted)] pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`w-full bg-[var(--forge-input-bg)] border ${
            error
              ? "border-[var(--forge-red)] focus:border-[var(--forge-red)]"
              : "border-[var(--forge-border)] focus:border-[var(--forge-accent)]"
          } text-[var(--forge-text)] text-xs rounded-lg px-3 py-2.5 outline-none transition-colors duration-150 placeholder:text-[var(--forge-text-muted)] ${
            icon ? "pl-9" : ""
          } ${mono ? "font-mono" : ""} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-[11px] text-[var(--forge-red)]">{error}</span>
      )}
      {!error && helperText && (
        <span className="text-[11px] text-[var(--forge-text-muted)]">
          {helperText}
        </span>
      )}
    </div>
  );
});

export default Input;
