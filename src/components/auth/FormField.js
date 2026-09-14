import { forwardRef } from "react";

const FormField = forwardRef(function FormField(
  { label, error, type = "text", icon: Icon, rightSlot, ...rest },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--text-secondary)]">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm" />
        )}
        <input
          ref={ref}
          type={type}
          className={`w-full ${Icon ? "pl-10" : "pl-4"} ${
            rightSlot ? "pr-11" : "pr-4"
          } py-3 rounded-xl border bg-[var(--bg-card)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] transition-colors focus:outline-none ${
            error
              ? "border-[var(--danger)] focus:border-[var(--danger)]"
              : "border-[var(--border)] focus:border-[var(--border-focus)]"
          }`}
          {...rest}
        />
        {rightSlot && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightSlot}
          </div>
        )}
      </div>
      {error && (
        <span className="text-xs text-[var(--danger)]">{error.message}</span>
      )}
    </div>
  );
});

export default FormField;