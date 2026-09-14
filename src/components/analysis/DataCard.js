import React from "react";
import { FaUsers } from "react-icons/fa";
import { HiArrowUp, HiArrowDown } from "react-icons/hi";

export default function DataCard({
  icon: Icon = FaUsers,
  label = "Total users",
  value = "11,550",
  trend,
  trendLabel = "vs last month",
  gradient,
}) {
  const isPositive = typeof trend === "number" && trend >= 0;

  return (
    <div
      className="flex min-w-[220px] flex-1 items-center gap-4 rounded-[var(--radius-xl-value)] px-6 py-6 text-white shadow-[var(--shadow-primary-value)]"
      style={{
        background:
          gradient ||
          "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary-hover) 85%, black) 100%)",
      }}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
        <Icon className="text-xl text-white" />
      </div>

      <div className="flex min-w-0 flex-col gap-1">
        <p className="truncate text-sm font-medium text-white/70">{label}</p>

        <div className="flex items-baseline gap-2">
          <h2 className="font-display text-2xl font-semibold leading-none tracking-tight">
            {value}
          </h2>

          {typeof trend === "number" && (
            <span
              className={`flex items-center gap-0.5 text-xs font-semibold ${
                isPositive ? "text-[var(--success)]" : "text-[var(--danger)]"
              }`}
            >
              {isPositive ? <HiArrowUp className="text-sm" /> : <HiArrowDown className="text-sm" />}
              {Math.abs(trend)}%
            </span>
          )}
        </div>

        {typeof trend === "number" && (
          <p className="truncate text-xs text-white/50">{trendLabel}</p>
        )}
      </div>
    </div>
  );
}