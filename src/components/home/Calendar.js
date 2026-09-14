'use client'

import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getMonthCells(year, month) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];

  for (let i = firstWeekday - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, outside: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, outside: false });
  }
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ day: nextDay, outside: true });
    nextDay++;
  }

  return cells;
}

function isSameDay(a, b) {
  return (
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function Calendar({ selectedDate, onSelectDate }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const cells = getMonthCells(year, month);
  const monthLabel = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="rounded-[var(--radius-lg-value)] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-sm-value)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{monthLabel}</h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
            aria-label="Previous month"
            className="rounded-[var(--radius-sm-value)] p-1.5 text-[var(--text-muted)] transition-colors duration-200 hover:bg-[var(--bg-hover)]"
          >
            <FiChevronLeft className="text-base" />
          </button>
          <button
            type="button"
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
            aria-label="Next month"
            className="rounded-[var(--radius-sm-value)] p-1.5 text-[var(--text-muted)] transition-colors duration-200 hover:bg-[var(--bg-hover)]"
          >
            <FiChevronRight className="text-base" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAYS.map((wd) => (
          <span key={wd} className="py-1.5 text-[11px] font-medium text-[var(--text-muted)]">
            {wd}
          </span>
        ))}

        {cells.map((cell, idx) => {
          const cellDate = new Date(year, month, cell.day);
          const isToday = !cell.outside && isSameDay(cellDate, today);
          const isSelected = !cell.outside && isSameDay(cellDate, selectedDate);

          return (
            <button
              key={idx}
              type="button"
              disabled={cell.outside}
              onClick={() => onSelectDate && onSelectDate(cellDate)}
              className={`mx-auto flex h-8 w-8 items-center justify-center rounded-[var(--radius-full-value)] text-xs font-medium transition-colors duration-200
                ${cell.outside ? "text-[var(--text-disabled)]" : "text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"}
                ${isToday && !isSelected ? "border border-[var(--primary)] text-[var(--primary)]" : ""}
                ${isSelected ? "bg-[var(--primary)] text-[var(--text-white)]" : ""}`}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}