import React from "react";
import { formatDateTime } from "@/lib/Format";

const STATUS_STYLES = {
  Present: "bg-[var(--success)]/10 text-[var(--success)]",
  Absent: "bg-[var(--danger)]/10 text-[var(--danger)]",
};

/**
 * AttendanceTable — a log of every attendance record for the event,
 * showing who was checked in/out, by whom, and how (QR or manual).
 */
export default function AttendanceTable({ attendance = [] }) {
  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Attendance Log</h3>
        <span className="text-sm text-muted-foreground">{attendance.length} record{attendance.length === 1 ? "" : "s"}</span>
      </div>

      {attendance.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 py-10 text-center text-sm text-muted-foreground">
          <p className="font-medium text-[var(--text-primary)]">No check-ins yet</p>
          <p>Attendance records will appear here as people are checked in.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4 font-medium">User</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium">Checked At</th>
                <th className="py-2 pr-4 font-medium">Checked By</th>
                <th className="py-2 font-medium">Via</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr
                  key={record._id}
                  className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)]"
                >
                  <td className="py-3 pr-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-[var(--text-primary)]">
                        {record.user?.fullName ?? "Unknown"}
                      </span>
                      {record.user?.email && (
                        <span className="text-xs text-muted-foreground">{record.user.email}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        STATUS_STYLES[record.attendanceStatus] ?? "bg-[var(--bg-hover)] text-[var(--text-secondary)]"
                      }`}
                    >
                      {record.attendanceStatus}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-[var(--text-secondary)]">
                    {formatDateTime(record.checkedAt)}
                  </td>
                  <td className="py-3 pr-4 text-[var(--text-secondary)]">
                    {record.checkedBy?.fullName ?? "—"}
                  </td>
                  <td className="py-3 text-[var(--text-secondary)]">
                    {record.checkedInViaQr ? "QR" : "Manual"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}