import React from "react";

export default function StatusToggle({ blocked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={!blocked}
      aria-label={blocked ? "Unblock user" : "Block user"}
      onClick={() => onChange(!blocked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
        blocked ? "bg-[var(--border)]" : "bg-[var(--success)]"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-[var(--shadow-xs-value)] transition-transform duration-200 ${
          blocked ? "translate-x-0.5" : "translate-x-[22px]"
        }`}
      />
    </button>
  );
}