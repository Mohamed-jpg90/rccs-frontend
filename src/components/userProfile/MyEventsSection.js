import { FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import EntityCard from "@/components/UI/EntityCard";
import { getFileUrl } from "@/lib/files";

const REG_STATUS_STYLES = {
  Registered: { bg: "var(--info-bg)", color: "var(--info)" },
  Pending: { bg: "var(--warning-bg)", color: "var(--warning)" },
  Approved: { bg: "var(--success-bg)", color: "var(--success)" },
  Rejected: { bg: "var(--danger-bg)", color: "var(--danger)" },
};

const ATTENDANCE_STYLES = {
  Present: { bg: "var(--success-bg)", color: "var(--success)" },
  Absent: { bg: "var(--danger-bg)", color: "var(--danger)" },
};

export default function MyEventsSection({ registrations = [], attendance = [] }) {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[var(--primary)] mb-3">
        Activity
      </span>
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-10">
        My Events
      </h2> 
  
      {/* Registrations as cards */}
      {registrations.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {registrations.map((reg) => {
            const event = reg.event;
            const style = REG_STATUS_STYLES[reg.status] || REG_STATUS_STYLES.Registered;
            const eventDate = event?.date ? new Date(event.date) : null;

            return (
              <EntityCard
                key={reg._id}
                image={getFileUrl(event?.coverImage)}
                imageAlt={event?.title}
                title={event?.title}
                dateBadge={
                  eventDate
                    ? {
                        day: eventDate.getDate(),
                        month: eventDate
                          .toLocaleDateString("en-US", { month: "short" })
                          .toUpperCase(),
                      }
                    : undefined
                }
                meta={[
                  { icon: FaUsers, text: event?.club?.clubName || "No club" },
                  { icon: FaMapMarkerAlt, text: event?.location },
                ]}
                footer={
                  <span
                    className="inline-block text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{ background: style.bg, color: style.color }}
                  >
                    {reg.status}
                  </span>
                }
              />
            );
          })}
        </div>
      )}

      {/* Attendance history — lightweight rows, kept intentionally simple for performance */}
      {attendance.length > 0 && (
        <div className="rounded-[var(--radius-xl-value)] bg-[var(--bg-card)] border border-[var(--border)] divide-y divide-[var(--border-light)]">
          {attendance.map((record) => {
            const style =
              ATTENDANCE_STYLES[record.attendanceStatus] || ATTENDANCE_STYLES.Present;
            return (
              <div
                key={record._id}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {record.event?.title}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {record.event?.club?.clubName} · {record.event?.location}
                  </p>
                </div>
                <span
                  className="text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap"
                  style={{ background: style.bg, color: style.color }}
                >
                  {record.attendanceStatus}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {registrations.length === 0 && attendance.length === 0 && (
        <p className="text-sm text-[var(--text-muted)]">
          No event activity yet — register for your first event to see it here.
        </p>
      )}
    </section>
  );
}